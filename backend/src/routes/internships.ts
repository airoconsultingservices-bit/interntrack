import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/internships
 * Returns all active internships with company info.
 * Query params: ?category=SAP&search=engineer&page=1&limit=50
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { isActive: true };

    if (category && category !== "All") {
      where.company = { industry: category as string };
    }

    if (search) {
      const searchStr = search as string;
      where.OR = [
        { title: { contains: searchStr, mode: "insensitive" } },
        { description: { contains: searchStr, mode: "insensitive" } },
        { location: { contains: searchStr, mode: "insensitive" } },
        { skills: { has: searchStr } },
        { company: { name: { contains: searchStr, mode: "insensitive" } } },
      ];
    }

    const [internships, total] = await Promise.all([
      prisma.internship.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              industry: true,
              website: true,
              careersUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.internship.count({ where }),
    ]);

    // Get distinct categories for filter
    const categories = await prisma.company.findMany({
      where: {
        internships: { some: { isActive: true } },
      },
      select: { industry: true },
      distinct: ["industry"],
    });

    return res.json({
      internships: internships.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        location: i.location,
        isRemote: i.isRemote,
        skills: i.skills,
        requirements: i.requirements,
        applicationUrl: i.applicationUrl,
        compensation: i.compensation,
        deadline: i.deadline,
        source: i.source,
        company: {
          id: i.company.id,
          name: i.company.name,
          logo: i.company.logo,
          industry: i.company.industry,
          website: i.company.website,
          careersUrl: i.company.careersUrl,
        },
      })),
      categories: categories.map((c) => c.industry),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err: any) {
    logger.error("Internships list error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
