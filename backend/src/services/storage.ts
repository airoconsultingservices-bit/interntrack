import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config/env";
import { logger } from "../config/logger";

let supabase: SupabaseClient | null = null;

function initSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = config.supabase.url;
  const key = config.supabase.serviceKey;
  if (!url || !key || !url.startsWith("https://") || !url.includes(".supabase.")) {
    logger.warn("Supabase Storage not configured – uploads will be skipped");
    return null;
  }
  supabase = createClient(url, key);
  return supabase;
}

export class StorageService {
  static async uploadResume(userId: string, file: Express.Multer.File) {
    const client = initSupabase();
    if (!client) throw new Error("Supabase Storage is not configured");
    const path = `${userId}/${Date.now()}-${file.originalname}`;
    const { data, error } = await client.storage
      .from(config.supabase.storageBucket)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return { path: data.path, fullPath: data.path };
  }

  static async getSignedUrl(path: string, expiresIn = 3600) {
    const client = initSupabase();
    if (!client) throw new Error("Supabase Storage is not configured");
    const { data, error } = await client.storage
      .from(config.supabase.storageBucket)
      .createSignedUrl(path, expiresIn);
    if (error) throw new Error(`Signed URL failed: ${error.message}`);
    return data.signedUrl;
  }

  static async deleteFile(path: string) {
    const client = initSupabase();
    if (!client) throw new Error("Supabase Storage is not configured");
    const { error } = await client.storage
      .from(config.supabase.storageBucket)
      .remove([path]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
  }
}
