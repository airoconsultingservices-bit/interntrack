import { Router, Request, Response } from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { StorageService } from "../services/storage";
import { parseResume } from "../services/resumeParser";
import { logger } from "../config/logger";

const router = Router();
const prisma = new PrismaClient();

// Multer: store file in memory (buffer) for Supabase upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

/**
 * POST /api/resumes/upload
 * Accepts a multipart file upload, stores it in Supabase Storage,
 * creates a Resume record in Postgres, and returns extracted info.
 */
router.post("/upload", upload.single("resume"), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    // 1. Upload to Supabase Storage
    let storagePath: string;
    try {
      const result = await StorageService.uploadResume(userId, file);
      storagePath = result.path;
    } catch (err: any) {
      logger.error("Supabase Storage upload failed:", err.message);
      return res.status(500).json({ error: "File storage failed: " + err.message });
    }

    // 2. Parse resume content and extract skills
    const parsed = await parseResume(file.buffer, file.mimetype, file.originalname);
    const extractedSkills = parsed.skills;
    const extractedIndustries = parsed.industries;
    logger.info(`Parsed ${file.originalname}: ${extractedSkills.length} skills, ${parsed.textLength} chars`);

    // 3. Save Resume record in database
    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        storagePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        isActive: true,
        extractedSkills,
        extractedIndustries,
        parseStatus: "COMPLETED",
        parsedAt: new Date(),
      },
    });

    // 4. Update StudentProfile skills if empty
    try {
      const profile = await prisma.studentProfile.findUnique({ where: { userId } });
      if (profile && (!profile.skills || profile.skills.length === 0)) {
        await prisma.studentProfile.update({
          where: { userId },
          data: {
            skills: extractedSkills,
            targetIndustries: extractedIndustries,
          },
        });
      }
    } catch (profileErr) {
      logger.warn("Could not update student profile skills:", profileErr);
    }

    logger.info(`Resume uploaded: ${file.originalname} (${file.size} bytes) for user ${userId}`);

    return res.status(201).json({
      id: resume.id,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      extractedSkills: resume.extractedSkills,
      extractedIndustries: resume.extractedIndustries,
      parseStatus: resume.parseStatus,
      createdAt: resume.createdAt,
    });
  } catch (err: any) {
    logger.error("Resume upload error:", err);
    return res.status(500).json({ error: err.message || "Resume upload failed" });
  }
});

/**
 * GET /api/resumes
 * List all resumes for the authenticated user.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        isActive: true,
        extractedSkills: true,
        extractedIndustries: true,
        parseStatus: true,
        parsedAt: true,
        createdAt: true,
      },
    });

    return res.json(resumes);
  } catch (err: any) {
    logger.error("Resume list error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/resumes/:id
 * Delete a resume (storage + database record).
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    // Delete from Supabase Storage
    try {
      await StorageService.deleteFile(resume.storagePath);
    } catch (storageErr) {
      logger.warn("Could not delete from storage:", storageErr);
    }

    // Delete database record
    await prisma.resume.delete({ where: { id: resume.id } });

    return res.json({ message: "Resume deleted" });
  } catch (err: any) {
    logger.error("Resume delete error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
