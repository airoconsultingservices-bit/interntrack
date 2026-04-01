import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

export class StorageService {
  static async uploadResume(userId: string, file: Express.Multer.File) {
    const path = `${userId}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from(config.supabase.storageBucket)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return { path: data.path, fullPath: data.path };
  }

  static async getSignedUrl(path: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(config.supabase.storageBucket)
      .createSignedUrl(path, expiresIn);
    if (error) throw new Error(`Signed URL failed: ${error.message}`);
    return data.signedUrl;
  }

  static async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from(config.supabase.storageBucket)
      .remove([path]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
  }
}
