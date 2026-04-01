import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding InternTrack database...");

  const tenant = await prisma.tenant.upsert({
    where: { slug: "interntrack-default" },
    update: {},
    create: { name: "InternTrack", slug: "interntrack-default", plan: "ENTERPRISE", maxUsers: 999, maxAppsPerMonth: 99999 },
  });

  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@interntrack.com" },
    update: {},
    create: { email: "admin@interntrack.com", passwordHash: adminHash, name: "System Admin", role: "SUPER_ADMIN", emailVerified: true, tenantId: tenant.id },
  });

  const studentHash = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "jordan@stanford.edu" },
    update: {},
    create: {
      email: "jordan@stanford.edu", passwordHash: studentHash, name: "Jordan Rivera", role: "STUDENT", emailVerified: true, tenantId: tenant.id,
      profile: { create: { phone: "+1 555-123-4567", state: "California", university: "Stanford University", major: "Computer Science", gpa: 3.85, graduationYear: 2027, skills: ["Python", "JavaScript", "React", "SQL", "ML"], targetIndustries: ["Technology", "Finance"], targetRoles: ["SWE Intern", "Data Science Intern"] } },
    },
  });

  const companies = [];
  for (const c of [
    { name: "Google", logo: "G", industry: "Technology", field: "Software Engineering", website: "https://careers.google.com", headquarters: "Mountain View, CA", size: "ENTERPRISE" as const },
    { name: "Goldman Sachs", logo: "GS", industry: "Finance", field: "Investment Banking", website: "https://goldmansachs.com/careers", headquarters: "New York, NY", size: "ENTERPRISE" as const },
    { name: "Tesla", logo: "T", industry: "Automotive", field: "Engineering", website: "https://tesla.com/careers", headquarters: "Austin, TX", size: "LARGE" as const },
    { name: "Meta", logo: "Mt", industry: "Technology", field: "Product Engineering", website: "https://metacareers.com", headquarters: "Menlo Park, CA", size: "ENTERPRISE" as const },
    { name: "Amazon", logo: "Am", industry: "Technology", field: "Cloud / Logistics", website: "https://amazon.jobs", headquarters: "Seattle, WA", size: "ENTERPRISE" as const },
    { name: "Apple", logo: "Ap", industry: "Technology", field: "Hardware / Software", website: "https://apple.com/careers", headquarters: "Cupertino, CA", size: "ENTERPRISE" as const },
  ]) {
    const company = await prisma.company.create({ data: { ...c } });
    companies.push(company);
  }

  const internships = [];
  for (const i of [
    { idx: 0, title: "SWE Intern", skills: ["Python", "Java", "DSA"], deadline: "2026-04-15" },
    { idx: 0, title: "ML Intern", skills: ["Python", "TensorFlow", "ML"], deadline: "2026-04-15" },
    { idx: 1, title: "Technology Analyst", skills: ["Java", "SQL"], deadline: "2026-03-30" },
    { idx: 2, title: "Software Intern", skills: ["C++", "Python"], deadline: "2026-05-01" },
    { idx: 3, title: "Product Design Intern", skills: ["Figma", "React"], deadline: "2026-04-10" },
    { idx: 4, title: "SDE Intern", skills: ["Java", "AWS"], deadline: "2026-12-31" },
    { idx: 5, title: "iOS Engineer Intern", skills: ["Swift", "UIKit"], deadline: "2026-05-05" },
  ]) {
    const internship = await prisma.internship.create({
      data: { companyId: companies[i.idx].id, title: i.title, location: companies[i.idx].headquarters!, skills: i.skills, requirements: i.skills, deadline: new Date(i.deadline), portalType: "DIRECT", applicationUrl: companies[i.idx].website },
    });
    internships.push(internship);
  }

  for (const a of [
    { intIdx: 0, status: "INTERVIEW_SCHEDULED" as const, portal: "DIRECT" as const },
    { intIdx: 4, status: "UNDER_REVIEW" as const, portal: "LINKEDIN" as const },
    { intIdx: 5, status: "APPLIED" as const, portal: "DIRECT" as const },
    { intIdx: 3, status: "REJECTED" as const, portal: "HANDSHAKE" as const },
    { intIdx: 2, status: "OFFER_RECEIVED" as const, portal: "DIRECT" as const },
  ]) {
    await prisma.application.create({ data: { userId: student.id, internshipId: internships[a.intIdx].id, status: a.status, portal: a.portal } });
  }

  console.log("Seed complete: 1 tenant, 2 users, " + companies.length + " companies, " + internships.length + " internships");
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
