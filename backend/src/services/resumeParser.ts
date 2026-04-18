import { logger } from "../config/logger";

// ─── SKILL DICTIONARY ──────────────────────────────────
// Organized by category for better industry inference

const SKILL_CATEGORIES: Record<string, string[]> = {
  // Programming Languages
  "Programming Languages": [
    "python", "javascript", "typescript", "java", "c\\+\\+", "c#", "csharp",
    "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala",
    "r\\b", "matlab", "perl", "lua", "dart", "objective-c", "groovy",
    "shell", "bash", "powershell", "vba", "visual basic",
  ],
  // Frontend
  "Frontend Development": [
    "react", "reactjs", "react\\.js", "angular", "angularjs", "vue", "vuejs",
    "vue\\.js", "svelte", "next\\.js", "nextjs", "nuxt", "gatsby",
    "html", "css", "sass", "scss", "less", "tailwind", "bootstrap",
    "material ui", "mui", "chakra ui", "redux", "webpack", "vite",
    "jquery", "ember", "backbone",
  ],
  // Backend
  "Backend Development": [
    "node\\.js", "nodejs", "express", "express\\.js", "fastify", "nestjs",
    "django", "flask", "fastapi", "spring boot", "spring framework",
    "rails", "ruby on rails", "laravel", "asp\\.net", "\\.net", "dotnet",
    "graphql", "rest api", "restful", "microservices", "grpc",
  ],
  // Databases
  "Databases": [
    "sql", "mysql", "postgresql", "postgres", "oracle", "sql server",
    "mssql", "sqlite", "mongodb", "dynamodb", "cassandra", "redis",
    "elasticsearch", "neo4j", "couchdb", "firestore", "supabase",
    "prisma", "sequelize", "hibernate", "nosql",
  ],
  // Cloud & DevOps
  "Cloud & DevOps": [
    "aws", "amazon web services", "azure", "gcp", "google cloud",
    "docker", "kubernetes", "k8s", "terraform", "ansible", "jenkins",
    "ci/cd", "ci cd", "github actions", "gitlab ci", "circleci",
    "linux", "unix", "nginx", "apache", "serverless", "lambda",
    "cloudformation", "helm", "prometheus", "grafana", "datadog",
    "vercel", "heroku", "netlify",
  ],
  // Data & Analytics
  "Data & Analytics": [
    "data analysis", "data analytics", "data science", "data engineering",
    "machine learning", "deep learning", "artificial intelligence",
    "neural network", "nlp", "natural language processing",
    "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "scipy", "matplotlib", "seaborn",
    "tableau", "power bi", "powerbi", "looker", "qlik",
    "etl", "data warehouse", "data lake", "snowflake", "databricks",
    "apache spark", "hadoop", "kafka", "airflow",
    "statistics", "statistical", "regression", "classification",
    "big data", "data mining", "data visualization",
  ],
  // SAP
  "SAP": [
    "sap", "abap", "fiori", "sapui5", "hana", "s/4hana", "s4hana",
    "sap bw", "sap btp", "sap erp", "sap mm", "sap sd", "sap fi",
    "sap co", "sap pp", "sap hr", "sap hcm", "sap successfactors",
    "sap ariba", "sap commerce", "sap integration suite",
    "sap basis", "sap security", "sap analytics cloud",
  ],
  // Project Management & Tools
  "Project Management": [
    "agile", "scrum", "kanban", "waterfall", "jira", "confluence",
    "trello", "asana", "monday\\.com", "project management",
    "product management", "stakeholder management",
    "pmp", "prince2", "six sigma", "lean",
  ],
  // Business & Finance
  "Business & Finance": [
    "excel", "microsoft excel", "financial modeling", "financial analysis",
    "accounting", "bookkeeping", "gaap", "ifrs",
    "salesforce", "crm", "erp", "sap",
    "business intelligence", "bi", "kpi", "roi",
    "budgeting", "forecasting", "valuation",
    "investment banking", "private equity", "venture capital",
    "risk management", "compliance", "audit",
  ],
  // Design
  "Design": [
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "indesign", "after effects", "premiere pro", "canva",
    "ui design", "ux design", "ui/ux", "user experience",
    "user interface", "wireframe", "prototype", "design thinking",
    "responsive design", "accessibility", "wcag",
  ],
  // Mobile
  "Mobile Development": [
    "react native", "flutter", "ios", "android", "swift",
    "kotlin", "xamarin", "ionic", "cordova", "mobile app",
  ],
  // Security
  "Cybersecurity": [
    "cybersecurity", "information security", "network security",
    "penetration testing", "pen test", "ethical hacking",
    "soc", "siem", "firewall", "encryption", "oauth",
    "ssl", "tls", "vulnerability", "owasp",
  ],
};

// Map skill categories to industries
const CATEGORY_TO_INDUSTRY: Record<string, string[]> = {
  "Programming Languages": ["Technology"],
  "Frontend Development": ["Technology", "Software Development"],
  "Backend Development": ["Technology", "Software Development"],
  "Databases": ["Technology"],
  "Cloud & DevOps": ["Technology", "Cloud Computing"],
  "Data & Analytics": ["Technology", "Data Science", "Finance"],
  "SAP": ["Enterprise Software", "Consulting", "Manufacturing"],
  "Project Management": ["Consulting", "Management"],
  "Business & Finance": ["Finance", "Banking", "Consulting"],
  "Design": ["Design", "Technology"],
  "Mobile Development": ["Technology", "Software Development"],
  "Cybersecurity": ["Cybersecurity", "Technology"],
};

/**
 * Extract text content from a file buffer based on MIME type.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      return await extractPdfText(buffer);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return await extractDocxText(buffer);
    }
  } catch (err: any) {
    logger.warn(`Text extraction failed for ${fileName}: ${err.message}`);
  }
  return "";
}

/**
 * Extract text from PDF buffer.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err: any) {
    logger.warn("PDF parse error:", err.message);
    return "";
  }
}

/**
 * Extract text from DOCX buffer.
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (err: any) {
    logger.warn("DOCX parse error:", err.message);
    return "";
  }
}

/**
 * Extract skills from resume text content by matching against the skill dictionary.
 * Returns deduplicated, properly-cased skill names.
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text || text.trim().length < 10) return [];

  const normalizedText = text.toLowerCase();
  const foundSkills: Set<string> = new Set();

  for (const [_category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    for (const keyword of keywords) {
      try {
        // Use word boundary matching for precision
        const regex = new RegExp(`\\b${keyword}\\b`, "i");
        if (regex.test(normalizedText)) {
          // Store the properly cased version
          foundSkills.add(formatSkillName(keyword));
        }
      } catch {
        // If regex fails (e.g., special chars), do simple includes
        if (normalizedText.includes(keyword.replace(/\\/g, ""))) {
          foundSkills.add(formatSkillName(keyword));
        }
      }
    }
  }

  return Array.from(foundSkills);
}

/**
 * Infer industries from the skills found in the resume.
 */
export function inferIndustriesFromSkills(skills: string[]): string[] {
  const industries: Set<string> = new Set();
  const skillsLower = skills.map((s) => s.toLowerCase());

  for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    const categoryIndustries = CATEGORY_TO_INDUSTRY[category] || [];
    const hasMatch = keywords.some((kw) => {
      const clean = kw.replace(/\\/g, "").replace(/\\b/g, "");
      return skillsLower.some((s) => s.includes(clean) || clean.includes(s));
    });
    if (hasMatch) {
      categoryIndustries.forEach((ind) => industries.add(ind));
    }
  }

  return industries.size > 0 ? Array.from(industries) : ["General"];
}

/**
 * Format a regex-escaped skill keyword into a display name.
 */
function formatSkillName(keyword: string): string {
  // Remove regex escapes
  let name = keyword.replace(/\\/g, "");

  // Special casing for well-known terms
  const specialCases: Record<string, string> = {
    "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript",
    "java": "Java", "c++": "C++", "c#": "C#", "csharp": "C#",
    "go": "Go", "golang": "Go", "rust": "Rust", "ruby": "Ruby",
    "php": "PHP", "swift": "Swift", "kotlin": "Kotlin", "scala": "Scala",
    "r": "R", "matlab": "MATLAB", "perl": "Perl", "lua": "Lua", "dart": "Dart",
    "react": "React", "reactjs": "React", "react.js": "React",
    "angular": "Angular", "angularjs": "Angular", "vue": "Vue.js",
    "vuejs": "Vue.js", "vue.js": "Vue.js", "svelte": "Svelte",
    "next.js": "Next.js", "nextjs": "Next.js", "nuxt": "Nuxt",
    "html": "HTML", "css": "CSS", "sass": "Sass", "scss": "SCSS",
    "tailwind": "Tailwind CSS", "bootstrap": "Bootstrap",
    "redux": "Redux", "webpack": "Webpack", "vite": "Vite",
    "jquery": "jQuery", "gatsby": "Gatsby",
    "node.js": "Node.js", "nodejs": "Node.js", "express": "Express.js",
    "express.js": "Express.js", "nestjs": "NestJS", "fastify": "Fastify",
    "django": "Django", "flask": "Flask", "fastapi": "FastAPI",
    "spring boot": "Spring Boot", "rails": "Rails", "ruby on rails": "Ruby on Rails",
    "laravel": "Laravel", "asp.net": "ASP.NET", ".net": ".NET", "dotnet": ".NET",
    "graphql": "GraphQL", "rest api": "REST API", "restful": "RESTful",
    "microservices": "Microservices", "grpc": "gRPC",
    "sql": "SQL", "mysql": "MySQL", "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL", "oracle": "Oracle", "sql server": "SQL Server",
    "sqlite": "SQLite", "mongodb": "MongoDB", "dynamodb": "DynamoDB",
    "redis": "Redis", "elasticsearch": "Elasticsearch", "neo4j": "Neo4j",
    "nosql": "NoSQL", "prisma": "Prisma", "supabase": "Supabase",
    "aws": "AWS", "amazon web services": "AWS",
    "azure": "Azure", "gcp": "GCP", "google cloud": "Google Cloud",
    "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "terraform": "Terraform", "ansible": "Ansible", "jenkins": "Jenkins",
    "ci/cd": "CI/CD", "ci cd": "CI/CD",
    "github actions": "GitHub Actions", "gitlab ci": "GitLab CI",
    "linux": "Linux", "nginx": "Nginx", "serverless": "Serverless",
    "vercel": "Vercel", "heroku": "Heroku",
    "machine learning": "Machine Learning", "deep learning": "Deep Learning",
    "artificial intelligence": "AI", "neural network": "Neural Networks",
    "nlp": "NLP", "natural language processing": "NLP",
    "computer vision": "Computer Vision",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch", "keras": "Keras",
    "scikit-learn": "Scikit-learn",
    "pandas": "Pandas", "numpy": "NumPy", "matplotlib": "Matplotlib",
    "tableau": "Tableau", "power bi": "Power BI", "powerbi": "Power BI",
    "snowflake": "Snowflake", "databricks": "Databricks",
    "apache spark": "Apache Spark", "hadoop": "Hadoop", "kafka": "Kafka",
    "airflow": "Airflow", "big data": "Big Data",
    "data analysis": "Data Analysis", "data science": "Data Science",
    "data engineering": "Data Engineering", "data visualization": "Data Visualization",
    "etl": "ETL", "data warehouse": "Data Warehouse",
    "sap": "SAP", "abap": "ABAP", "fiori": "SAP Fiori", "sapui5": "SAPUI5",
    "hana": "SAP HANA", "s/4hana": "S/4HANA", "s4hana": "S/4HANA",
    "sap bw": "SAP BW", "sap btp": "SAP BTP", "sap erp": "SAP ERP",
    "sap mm": "SAP MM", "sap sd": "SAP SD", "sap fi": "SAP FI",
    "sap co": "SAP CO", "sap pp": "SAP PP",
    "sap successfactors": "SAP SuccessFactors", "sap ariba": "SAP Ariba",
    "sap analytics cloud": "SAP Analytics Cloud",
    "agile": "Agile", "scrum": "Scrum", "kanban": "Kanban",
    "jira": "Jira", "confluence": "Confluence",
    "project management": "Project Management", "product management": "Product Management",
    "pmp": "PMP", "six sigma": "Six Sigma", "lean": "Lean",
    "excel": "Excel", "microsoft excel": "Excel",
    "financial modeling": "Financial Modeling", "financial analysis": "Financial Analysis",
    "salesforce": "Salesforce", "crm": "CRM", "erp": "ERP",
    "business intelligence": "Business Intelligence",
    "risk management": "Risk Management", "compliance": "Compliance",
    "figma": "Figma", "sketch": "Sketch", "photoshop": "Photoshop",
    "illustrator": "Illustrator", "canva": "Canva",
    "ui design": "UI Design", "ux design": "UX Design", "ui/ux": "UI/UX",
    "wireframe": "Wireframing", "design thinking": "Design Thinking",
    "react native": "React Native", "flutter": "Flutter",
    "ios": "iOS", "android": "Android",
    "cybersecurity": "Cybersecurity", "penetration testing": "Penetration Testing",
    "oauth": "OAuth", "owasp": "OWASP",
    "git": "Git", "bash": "Bash", "shell": "Shell Scripting",
    "powershell": "PowerShell", "vba": "VBA",
  };

  return specialCases[name] || name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Full resume parsing pipeline: extract text → extract skills → infer industries.
 */
export async function parseResume(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ skills: string[]; industries: string[]; textLength: number }> {
  const text = await extractTextFromFile(buffer, mimeType, fileName);

  if (!text || text.trim().length < 10) {
    logger.warn(`No text extracted from ${fileName}, falling back to filename analysis`);
    // Fallback to filename-based extraction
    const name = fileName.toLowerCase().replace(/[_\-\.]/g, " ");
    const basicSkills = ["General"];
    return { skills: basicSkills, industries: ["General"], textLength: 0 };
  }

  logger.info(`Extracted ${text.length} chars from ${fileName}`);
  const skills = extractSkillsFromText(text);
  const industries = inferIndustriesFromSkills(skills);

  return { skills, industries, textLength: text.length };
}
