/**
 * AI Job List Generator
 * Generates realistic STEM internship opportunities for college graduates
 * across multiple categories.
 */

import { logger } from "../config/logger";

export interface GeneratedJob {
  companyName: string;
  companyIndustry: string;
  companyLogo: string;
  companyColor: string;
  companyWebsite: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  skills: string[];
  requirements: string[];
  applicationUrl: string;
  category: string;
  compensation: string;
  deadline: string;
}

// ─── COMPANY DATA BY CATEGORY ─────────────────────────

const COMPANIES_BY_CATEGORY: Record<string, Array<{ name: string; logo: string; color: string; website: string; locations: string[] }>> = {
  SAP: [
    { name: "SAP", logo: "SAP", color: "#0070F2", website: "https://www.sap.com/careers", locations: ["Newtown Square, PA", "Palo Alto, CA", "Dallas, TX", "New York, NY"] },
    { name: "Deloitte", logo: "De", color: "#86BC25", website: "https://www2.deloitte.com/careers", locations: ["Chicago, IL", "New York, NY", "Atlanta, GA", "Dallas, TX"] },
    { name: "Accenture", logo: "Ac", color: "#A100FF", website: "https://www.accenture.com/careers", locations: ["Chicago, IL", "San Francisco, CA", "Arlington, VA", "Atlanta, GA"] },
    { name: "IBM", logo: "IBM", color: "#0530AD", website: "https://www.ibm.com/careers", locations: ["Armonk, NY", "Austin, TX", "Raleigh, NC", "San Jose, CA"] },
    { name: "Capgemini", logo: "CG", color: "#0070AD", website: "https://www.capgemini.com/careers", locations: ["New York, NY", "Chicago, IL", "Dallas, TX", "Atlanta, GA"] },
    { name: "Cognizant", logo: "CT", color: "#0033A1", website: "https://careers.cognizant.com", locations: ["Teaneck, NJ", "Dallas, TX", "Atlanta, GA", "Phoenix, AZ"] },
    { name: "Infosys", logo: "IN", color: "#007CC3", website: "https://www.infosys.com/careers", locations: ["Indianapolis, IN", "Hartford, CT", "Dallas, TX", "Raleigh, NC"] },
    { name: "Wipro", logo: "WP", color: "#431D7F", website: "https://careers.wipro.com", locations: ["East Brunswick, NJ", "Mountain View, CA", "Dallas, TX", "Atlanta, GA"] },
    { name: "EY", logo: "EY", color: "#FFE600", website: "https://www.ey.com/careers", locations: ["New York, NY", "Chicago, IL", "McLean, VA", "San Francisco, CA"] },
    { name: "PwC", logo: "PwC", color: "#D04A02", website: "https://www.pwc.com/careers", locations: ["New York, NY", "Chicago, IL", "Dallas, TX", "San Francisco, CA"] },
  ],
  IT: [
    { name: "Google", logo: "G", color: "#4285F4", website: "https://careers.google.com", locations: ["Mountain View, CA", "New York, NY", "Austin, TX", "Seattle, WA"] },
    { name: "Microsoft", logo: "MS", color: "#00A4EF", website: "https://careers.microsoft.com", locations: ["Redmond, WA", "New York, NY", "Atlanta, GA", "Austin, TX"] },
    { name: "Amazon", logo: "Am", color: "#FF9900", website: "https://www.amazon.jobs", locations: ["Seattle, WA", "Arlington, VA", "Austin, TX", "Nashville, TN"] },
    { name: "Meta", logo: "Mt", color: "#0668E1", website: "https://www.metacareers.com", locations: ["Menlo Park, CA", "New York, NY", "Seattle, WA", "Austin, TX"] },
    { name: "Apple", logo: "Ap", color: "#555555", website: "https://jobs.apple.com", locations: ["Cupertino, CA", "Austin, TX", "New York, NY", "Seattle, WA"] },
    { name: "Netflix", logo: "NF", color: "#E50914", website: "https://jobs.netflix.com", locations: ["Los Gatos, CA", "Los Angeles, CA", "New York, NY"] },
    { name: "Salesforce", logo: "SF", color: "#00A1E0", website: "https://www.salesforce.com/careers", locations: ["San Francisco, CA", "Indianapolis, IN", "Dallas, TX", "Atlanta, GA"] },
    { name: "Oracle", logo: "Or", color: "#F80000", website: "https://www.oracle.com/careers", locations: ["Austin, TX", "Redwood City, CA", "Nashville, TN", "Denver, CO"] },
    { name: "Cisco", logo: "Cs", color: "#1BA0D7", website: "https://jobs.cisco.com", locations: ["San Jose, CA", "Raleigh, NC", "Richardson, TX", "Boxborough, MA"] },
    { name: "VMware", logo: "VM", color: "#717074", website: "https://careers.vmware.com", locations: ["Palo Alto, CA", "Austin, TX", "Atlanta, GA", "Boston, MA"] },
  ],
  STEM: [
    { name: "Tesla", logo: "T", color: "#CC0000", website: "https://www.tesla.com/careers", locations: ["Austin, TX", "Fremont, CA", "Palo Alto, CA", "Buffalo, NY"] },
    { name: "SpaceX", logo: "SX", color: "#005288", website: "https://www.spacex.com/careers", locations: ["Hawthorne, CA", "Cape Canaveral, FL", "Starbase, TX", "Redmond, WA"] },
    { name: "NASA JPL", logo: "JPL", color: "#0B3D91", website: "https://www.jpl.nasa.gov/careers", locations: ["Pasadena, CA", "Houston, TX", "Greenbelt, MD"] },
    { name: "Lockheed Martin", logo: "LM", color: "#003366", website: "https://www.lockheedmartinjobs.com", locations: ["Bethesda, MD", "Fort Worth, TX", "Denver, CO", "Orlando, FL"] },
    { name: "Boeing", logo: "BA", color: "#0033A0", website: "https://jobs.boeing.com", locations: ["Arlington, VA", "Seattle, WA", "St. Louis, MO", "Charleston, SC"] },
    { name: "Intel", logo: "Intl", color: "#0071C5", website: "https://jobs.intel.com", locations: ["Santa Clara, CA", "Hillsboro, OR", "Phoenix, AZ", "Austin, TX"] },
    { name: "NVIDIA", logo: "NV", color: "#76B900", website: "https://www.nvidia.com/careers", locations: ["Santa Clara, CA", "Austin, TX", "Redmond, WA", "Durham, NC"] },
    { name: "Qualcomm", logo: "QC", color: "#3253DC", website: "https://www.qualcomm.com/careers", locations: ["San Diego, CA", "Santa Clara, CA", "Austin, TX", "Raleigh, NC"] },
    { name: "Raytheon", logo: "RT", color: "#003087", website: "https://www.rtx.com/careers", locations: ["Arlington, VA", "Tucson, AZ", "El Segundo, CA", "Dallas, TX"] },
    { name: "Northrop Grumman", logo: "NG", color: "#003B5C", website: "https://www.northropgrumman.com/careers", locations: ["Falls Church, VA", "San Diego, CA", "Baltimore, MD", "Melbourne, FL"] },
  ],
  Sales: [
    { name: "Salesforce", logo: "SF", color: "#00A1E0", website: "https://www.salesforce.com/careers", locations: ["San Francisco, CA", "Indianapolis, IN", "Chicago, IL", "New York, NY"] },
    { name: "HubSpot", logo: "HS", color: "#FF7A59", website: "https://www.hubspot.com/careers", locations: ["Cambridge, MA", "New York, NY", "Remote"] },
    { name: "Oracle", logo: "Or", color: "#F80000", website: "https://www.oracle.com/careers", locations: ["Austin, TX", "Redwood City, CA", "Chicago, IL"] },
    { name: "SAP", logo: "SAP", color: "#0070F2", website: "https://www.sap.com/careers", locations: ["Newtown Square, PA", "New York, NY", "Dallas, TX"] },
    { name: "Zoom", logo: "Zm", color: "#2D8CFF", website: "https://careers.zoom.us", locations: ["San Jose, CA", "Denver, CO", "Remote"] },
    { name: "Shopify", logo: "Sh", color: "#96BF48", website: "https://www.shopify.com/careers", locations: ["Remote", "Toronto, ON", "New York, NY"] },
    { name: "Gartner", logo: "Gr", color: "#003C7F", website: "https://jobs.gartner.com", locations: ["Stamford, CT", "Fort Myers, FL", "Arlington, VA"] },
    { name: "ADP", logo: "ADP", color: "#D0271D", website: "https://jobs.adp.com", locations: ["Roseland, NJ", "Alpharetta, GA", "Tempe, AZ"] },
  ],
  Marketing: [
    { name: "Google", logo: "G", color: "#4285F4", website: "https://careers.google.com", locations: ["Mountain View, CA", "New York, NY", "Chicago, IL"] },
    { name: "Meta", logo: "Mt", color: "#0668E1", website: "https://www.metacareers.com", locations: ["Menlo Park, CA", "New York, NY", "Austin, TX"] },
    { name: "Procter & Gamble", logo: "PG", color: "#003DA5", website: "https://www.pgcareers.com", locations: ["Cincinnati, OH", "Boston, MA", "New York, NY"] },
    { name: "Nike", logo: "NK", color: "#111111", website: "https://jobs.nike.com", locations: ["Beaverton, OR", "New York, NY", "Los Angeles, CA"] },
    { name: "Coca-Cola", logo: "CC", color: "#F40009", website: "https://www.coca-colacompany.com/careers", locations: ["Atlanta, GA", "New York, NY", "Chicago, IL"] },
    { name: "Unilever", logo: "UL", color: "#1F36C7", website: "https://careers.unilever.com", locations: ["Englewood Cliffs, NJ", "Chicago, IL", "Remote"] },
    { name: "Adobe", logo: "Ad", color: "#FF0000", website: "https://www.adobe.com/careers", locations: ["San Jose, CA", "San Francisco, CA", "New York, NY", "Lehi, UT"] },
    { name: "Spotify", logo: "Sp", color: "#1DB954", website: "https://www.lifeatspotify.com", locations: ["New York, NY", "Los Angeles, CA", "Remote"] },
  ],
  "Supply Chain": [
    { name: "Amazon", logo: "Am", color: "#FF9900", website: "https://www.amazon.jobs", locations: ["Seattle, WA", "Nashville, TN", "Arlington, VA"] },
    { name: "Walmart", logo: "WM", color: "#0071CE", website: "https://careers.walmart.com", locations: ["Bentonville, AR", "San Bruno, CA", "Hoboken, NJ"] },
    { name: "FedEx", logo: "FX", color: "#4D148C", website: "https://careers.fedex.com", locations: ["Memphis, TN", "Pittsburgh, PA", "Indianapolis, IN"] },
    { name: "UPS", logo: "UPS", color: "#351C15", website: "https://www.jobs-ups.com", locations: ["Atlanta, GA", "Louisville, KY", "Mahwah, NJ"] },
    { name: "Johnson & Johnson", logo: "JJ", color: "#D51900", website: "https://www.careers.jnj.com", locations: ["New Brunswick, NJ", "Raritan, NJ", "Jacksonville, FL"] },
    { name: "Target", logo: "Tg", color: "#CC0000", website: "https://corporate.target.com/careers", locations: ["Minneapolis, MN", "Brooklyn Park, MN", "Remote"] },
    { name: "Caterpillar", logo: "Cat", color: "#FFCD11", website: "https://www.caterpillar.com/careers", locations: ["Irving, TX", "Peoria, IL", "Chicago, IL"] },
    { name: "3M", logo: "3M", color: "#FF0000", website: "https://www.3m.com/careers", locations: ["St. Paul, MN", "Austin, TX", "Maplewood, MN"] },
  ],
  "Project Management": [
    { name: "Deloitte", logo: "De", color: "#86BC25", website: "https://www2.deloitte.com/careers", locations: ["Chicago, IL", "New York, NY", "Atlanta, GA", "McLean, VA"] },
    { name: "KPMG", logo: "KP", color: "#00338D", website: "https://www.kpmgcareers.com", locations: ["New York, NY", "Chicago, IL", "Los Angeles, CA", "Dallas, TX"] },
    { name: "McKinsey", logo: "Mc", color: "#003D6B", website: "https://www.mckinsey.com/careers", locations: ["New York, NY", "Chicago, IL", "San Francisco, CA", "Boston, MA"] },
    { name: "BCG", logo: "BCG", color: "#009A44", website: "https://careers.bcg.com", locations: ["Boston, MA", "New York, NY", "Chicago, IL", "San Francisco, CA"] },
    { name: "Booz Allen", logo: "BAH", color: "#E31937", website: "https://careers.boozallen.com", locations: ["McLean, VA", "Washington, DC", "San Antonio, TX"] },
    { name: "Bain", logo: "Bn", color: "#CC0000", website: "https://www.bain.com/careers", locations: ["Boston, MA", "Chicago, IL", "San Francisco, CA", "New York, NY"] },
    { name: "Capgemini", logo: "CG", color: "#0070AD", website: "https://www.capgemini.com/careers", locations: ["New York, NY", "Chicago, IL", "Dallas, TX"] },
  ],
  "Program Management": [
    { name: "Amazon", logo: "Am", color: "#FF9900", website: "https://www.amazon.jobs", locations: ["Seattle, WA", "Arlington, VA", "Nashville, TN", "Austin, TX"] },
    { name: "Microsoft", logo: "MS", color: "#00A4EF", website: "https://careers.microsoft.com", locations: ["Redmond, WA", "New York, NY", "Austin, TX"] },
    { name: "Google", logo: "G", color: "#4285F4", website: "https://careers.google.com", locations: ["Mountain View, CA", "New York, NY", "Austin, TX", "Chicago, IL"] },
    { name: "Boeing", logo: "BA", color: "#0033A0", website: "https://jobs.boeing.com", locations: ["Arlington, VA", "Seattle, WA", "St. Louis, MO"] },
    { name: "Lockheed Martin", logo: "LM", color: "#003366", website: "https://www.lockheedmartinjobs.com", locations: ["Bethesda, MD", "Fort Worth, TX", "Orlando, FL"] },
    { name: "Raytheon", logo: "RT", color: "#003087", website: "https://www.rtx.com/careers", locations: ["Arlington, VA", "Tucson, AZ", "Dallas, TX"] },
  ],
  "Product Management": [
    { name: "Google", logo: "G", color: "#4285F4", website: "https://careers.google.com", locations: ["Mountain View, CA", "New York, NY", "San Francisco, CA"] },
    { name: "Meta", logo: "Mt", color: "#0668E1", website: "https://www.metacareers.com", locations: ["Menlo Park, CA", "New York, NY", "Seattle, WA"] },
    { name: "Amazon", logo: "Am", color: "#FF9900", website: "https://www.amazon.jobs", locations: ["Seattle, WA", "New York, NY", "Arlington, VA"] },
    { name: "Apple", logo: "Ap", color: "#555555", website: "https://jobs.apple.com", locations: ["Cupertino, CA", "Austin, TX", "New York, NY"] },
    { name: "Stripe", logo: "St", color: "#635BFF", website: "https://stripe.com/jobs", locations: ["San Francisco, CA", "Seattle, WA", "New York, NY", "Remote"] },
    { name: "Airbnb", logo: "Ab", color: "#FF5A5F", website: "https://careers.airbnb.com", locations: ["San Francisco, CA", "Remote"] },
    { name: "Uber", logo: "Ub", color: "#000000", website: "https://www.uber.com/careers", locations: ["San Francisco, CA", "New York, NY", "Chicago, IL", "Seattle, WA"] },
    { name: "Lyft", logo: "Ly", color: "#FF00BF", website: "https://www.lyft.com/careers", locations: ["San Francisco, CA", "New York, NY", "Seattle, WA"] },
  ],
  "Data Analytics": [
    { name: "Google", logo: "G", color: "#4285F4", website: "https://careers.google.com", locations: ["Mountain View, CA", "New York, NY", "Chicago, IL"] },
    { name: "Meta", logo: "Mt", color: "#0668E1", website: "https://www.metacareers.com", locations: ["Menlo Park, CA", "New York, NY", "Seattle, WA"] },
    { name: "Amazon", logo: "Am", color: "#FF9900", website: "https://www.amazon.jobs", locations: ["Seattle, WA", "Arlington, VA", "Austin, TX"] },
    { name: "Netflix", logo: "NF", color: "#E50914", website: "https://jobs.netflix.com", locations: ["Los Gatos, CA", "Los Angeles, CA"] },
    { name: "Spotify", logo: "Sp", color: "#1DB954", website: "https://www.lifeatspotify.com", locations: ["New York, NY", "Remote"] },
    { name: "Tableau (Salesforce)", logo: "Tb", color: "#E97627", website: "https://www.salesforce.com/careers", locations: ["Seattle, WA", "San Francisco, CA", "Austin, TX"] },
    { name: "Palantir", logo: "Pl", color: "#101113", website: "https://www.palantir.com/careers", locations: ["Denver, CO", "Palo Alto, CA", "New York, NY", "Washington, DC"] },
    { name: "Snowflake", logo: "Sn", color: "#29B5E8", website: "https://careers.snowflake.com", locations: ["San Mateo, CA", "Bellevue, WA", "Remote"] },
    { name: "Databricks", logo: "DB", color: "#FF3621", website: "https://www.databricks.com/careers", locations: ["San Francisco, CA", "Seattle, WA", "Remote"] },
  ],
  "Business Analysis": [
    { name: "JPMorgan Chase", logo: "JPM", color: "#003087", website: "https://careers.jpmorgan.com", locations: ["New York, NY", "Columbus, OH", "Jersey City, NJ", "Wilmington, DE"] },
    { name: "Goldman Sachs", logo: "GS", color: "#6B8DB5", website: "https://www.goldmansachs.com/careers", locations: ["New York, NY", "Dallas, TX", "Salt Lake City, UT", "Chicago, IL"] },
    { name: "Morgan Stanley", logo: "MgS", color: "#002D62", website: "https://www.morganstanley.com/careers", locations: ["New York, NY", "Baltimore, MD", "Alpharetta, GA"] },
    { name: "Citi", logo: "Ci", color: "#003B70", website: "https://jobs.citi.com", locations: ["New York, NY", "Jacksonville, FL", "Tampa, FL", "Irving, TX"] },
    { name: "Bank of America", logo: "BoA", color: "#012169", website: "https://campus.bankofamerica.com", locations: ["Charlotte, NC", "New York, NY", "Chicago, IL", "Dallas, TX"] },
    { name: "Visa", logo: "V", color: "#1A1F71", website: "https://usa.visa.com/careers", locations: ["San Francisco, CA", "Austin, TX", "Miami, FL", "Foster City, CA"] },
    { name: "Mastercard", logo: "MC", color: "#EB001B", website: "https://careers.mastercard.com", locations: ["Purchase, NY", "O'Fallon, MO", "Arlington, VA", "New York, NY"] },
    { name: "American Express", logo: "AX", color: "#006FCF", website: "https://www.americanexpress.com/careers", locations: ["New York, NY", "Phoenix, AZ", "Fort Lauderdale, FL"] },
  ],
};

// ─── ROLE TEMPLATES BY CATEGORY ───────────────────────

const ROLES_BY_CATEGORY: Record<string, Array<{ title: string; skills: string[]; requirements: string[]; descTemplate: string }>> = {
  SAP: [
    { title: "SAP ABAP Developer Intern", skills: ["ABAP", "SAP ERP", "SQL", "Debugging"], requirements: ["CS or IS major", "Basic programming knowledge"], descTemplate: "Assist in developing and maintaining ABAP programs for {company}'s SAP landscape. Work on custom reports, enhancements, and interfaces." },
    { title: "SAP Functional Consultant Intern (MM/SD)", skills: ["SAP MM", "SAP SD", "Business Process", "Configuration"], requirements: ["Business or IT major", "Interest in ERP systems"], descTemplate: "Support {company}'s SAP implementation projects by configuring MM/SD modules and documenting business processes." },
    { title: "SAP S/4HANA Migration Intern", skills: ["S/4HANA", "SAP ERP", "Data Migration", "Testing"], requirements: ["IT or Engineering major", "Analytical skills"], descTemplate: "Join {company}'s S/4HANA migration team to support data migration, testing, and cutover planning." },
    { title: "SAP Fiori/UI5 Developer Intern", skills: ["SAPUI5", "SAP Fiori", "JavaScript", "HTML5", "CSS"], requirements: ["CS major", "Web development basics"], descTemplate: "Design and develop SAP Fiori applications and custom UI5 apps to modernize {company}'s user experience." },
    { title: "SAP BTP Integration Intern", skills: ["SAP BTP", "API Integration", "Cloud Foundry", "Node.js"], requirements: ["CS or IT major", "Cloud computing interest"], descTemplate: "Work on integrating SAP BTP services with third-party applications at {company}. Build APIs and cloud-native extensions." },
    { title: "SAP Analytics Cloud Intern", skills: ["SAP Analytics Cloud", "Data Visualization", "SQL", "Business Intelligence"], requirements: ["Analytics or Business major", "Data visualization skills"], descTemplate: "Create dashboards, stories, and planning models in SAP Analytics Cloud to support {company}'s data-driven decision making." },
    { title: "SAP Basis Administrator Intern", skills: ["SAP Basis", "System Administration", "Linux", "Database"], requirements: ["IT or CS major", "System admin interest"], descTemplate: "Assist with SAP system administration, monitoring, performance tuning, and transport management at {company}." },
  ],
  IT: [
    { title: "Software Engineering Intern", skills: ["Python", "Java", "Git", "Data Structures"], requirements: ["CS major", "GPA 3.0+"], descTemplate: "Build and ship production features at {company}. Work alongside senior engineers on scalable backend services." },
    { title: "Full Stack Developer Intern", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], requirements: ["CS major", "Web development experience"], descTemplate: "Develop end-to-end features for {company}'s web platform using modern frontend and backend technologies." },
    { title: "Cloud Engineering Intern", skills: ["AWS", "Docker", "Kubernetes", "Terraform"], requirements: ["CS or IT major", "Linux fundamentals"], descTemplate: "Help build and maintain {company}'s cloud infrastructure. Deploy and monitor containerized applications." },
    { title: "DevOps Engineering Intern", skills: ["CI/CD", "Jenkins", "Docker", "Python", "Bash"], requirements: ["CS or IT major", "Scripting experience"], descTemplate: "Automate build, test, and deployment pipelines at {company}. Improve developer productivity and system reliability." },
    { title: "Cybersecurity Intern", skills: ["Network Security", "SIEM", "Python", "Vulnerability Assessment"], requirements: ["CS or Cybersecurity major", "Security fundamentals"], descTemplate: "Support {company}'s security operations center. Conduct vulnerability assessments and incident analysis." },
    { title: "QA Automation Intern", skills: ["Selenium", "Python", "REST API Testing", "CI/CD"], requirements: ["CS major", "Testing fundamentals"], descTemplate: "Design and implement automated test suites for {company}'s products. Improve test coverage and quality." },
    { title: "Mobile App Developer Intern", skills: ["React Native", "Swift", "Kotlin", "REST APIs"], requirements: ["CS major", "Mobile development interest"], descTemplate: "Develop and enhance mobile applications for {company}'s iOS and Android platforms." },
  ],
  STEM: [
    { title: "Mechanical Engineering Intern", skills: ["CAD", "SolidWorks", "MATLAB", "FEA"], requirements: ["Mechanical Engineering major", "CAD proficiency"], descTemplate: "Design, prototype, and test mechanical components at {company}. Collaborate with cross-functional engineering teams." },
    { title: "Electrical Engineering Intern", skills: ["Circuit Design", "VHDL", "PCB Layout", "Oscilloscopes"], requirements: ["EE major", "Circuit analysis knowledge"], descTemplate: "Assist in designing and testing electrical systems and embedded hardware at {company}." },
    { title: "Aerospace Engineering Intern", skills: ["MATLAB", "CFD", "Structural Analysis", "GD&T"], requirements: ["Aerospace or ME major", "Strong math background"], descTemplate: "Support aerodynamic analysis, structural design, and systems integration at {company}." },
    { title: "Research Scientist Intern", skills: ["Python", "Machine Learning", "Statistics", "Research Methods"], requirements: ["STEM PhD or MS student", "Publication experience preferred"], descTemplate: "Conduct cutting-edge research at {company}'s R&D lab. Design experiments, analyze data, and publish findings." },
    { title: "Robotics Engineering Intern", skills: ["ROS", "Python", "C++", "Computer Vision", "Sensors"], requirements: ["CS, EE, or ME major", "Robotics coursework"], descTemplate: "Develop and test robotic systems at {company}. Work on perception, planning, and control algorithms." },
    { title: "Biomedical Engineering Intern", skills: ["MATLAB", "Signal Processing", "Medical Devices", "FDA Regulations"], requirements: ["BME major", "Lab experience"], descTemplate: "Support medical device development and testing at {company}. Assist with regulatory documentation." },
  ],
  Sales: [
    { title: "Sales Development Representative Intern", skills: ["CRM", "Cold Outreach", "Salesforce", "Communication"], requirements: ["Business major", "Strong communication skills"], descTemplate: "Generate qualified leads and set meetings for {company}'s sales team. Learn enterprise B2B sales methodologies." },
    { title: "Account Executive Intern", skills: ["Negotiation", "Presentation", "CRM", "Pipeline Management"], requirements: ["Business or Communications major"], descTemplate: "Shadow and support account executives at {company}. Participate in client meetings and proposal development." },
    { title: "Sales Operations Intern", skills: ["Salesforce", "Excel", "Data Analysis", "Process Improvement"], requirements: ["Business or Analytics major", "Excel proficiency"], descTemplate: "Analyze sales data, optimize processes, and support CRM administration at {company}." },
    { title: "Customer Success Intern", skills: ["CRM", "Data Analysis", "Communication", "Problem Solving"], requirements: ["Business major", "Customer-facing experience preferred"], descTemplate: "Help {company}'s customers achieve their goals. Monitor account health, conduct check-ins, and identify upsell opportunities." },
    { title: "Technical Sales Intern", skills: ["Technical Knowledge", "Demo Skills", "CRM", "Solution Selling"], requirements: ["CS or Business major", "Technical aptitude"], descTemplate: "Support technical sales cycles at {company}. Prepare demos, respond to RFPs, and assist with proof-of-concepts." },
  ],
  Marketing: [
    { title: "Digital Marketing Intern", skills: ["Google Analytics", "SEO", "Social Media", "Content Creation"], requirements: ["Marketing or Communications major"], descTemplate: "Plan and execute digital marketing campaigns at {company}. Analyze performance metrics and optimize channel strategy." },
    { title: "Content Marketing Intern", skills: ["Copywriting", "SEO", "WordPress", "Social Media"], requirements: ["Marketing, English, or Communications major"], descTemplate: "Create compelling content for {company}'s blog, social media, and email campaigns. Drive brand awareness and engagement." },
    { title: "Product Marketing Intern", skills: ["Market Research", "Competitive Analysis", "Messaging", "Go-to-Market"], requirements: ["Marketing or Business major", "Analytical mindset"], descTemplate: "Support product launches and positioning at {company}. Conduct market research and competitive analysis." },
    { title: "Brand Marketing Intern", skills: ["Brand Strategy", "Creative Direction", "Adobe Creative Suite", "Campaign Management"], requirements: ["Marketing or Design major"], descTemplate: "Help shape and maintain {company}'s brand identity across all channels. Support creative campaign development." },
    { title: "Marketing Analytics Intern", skills: ["Google Analytics", "Tableau", "SQL", "A/B Testing", "Excel"], requirements: ["Marketing or Analytics major", "Data-driven mindset"], descTemplate: "Analyze marketing campaign performance at {company}. Build dashboards, run A/B tests, and derive insights." },
    { title: "Growth Marketing Intern", skills: ["Growth Hacking", "A/B Testing", "SQL", "Funnel Optimization"], requirements: ["Marketing or CS major", "Data analysis skills"], descTemplate: "Drive user acquisition and retention experiments at {company}. Optimize conversion funnels across channels." },
  ],
  "Supply Chain": [
    { title: "Supply Chain Analyst Intern", skills: ["Excel", "SAP", "Data Analysis", "Forecasting"], requirements: ["Supply Chain or Business major"], descTemplate: "Analyze supply chain data to improve forecasting accuracy and reduce costs at {company}." },
    { title: "Logistics Coordinator Intern", skills: ["Logistics", "ERP Systems", "Excel", "Problem Solving"], requirements: ["Supply Chain or Operations major"], descTemplate: "Coordinate inbound and outbound logistics operations at {company}. Optimize routing and carrier performance." },
    { title: "Procurement Intern", skills: ["Negotiation", "SAP MM", "Vendor Management", "Excel"], requirements: ["Business or Supply Chain major"], descTemplate: "Support procurement operations at {company}. Assist with vendor evaluation, PO management, and cost reduction initiatives." },
    { title: "Operations Research Intern", skills: ["Python", "Optimization", "Statistics", "Linear Programming"], requirements: ["Math, OR, or IE major", "Strong quantitative skills"], descTemplate: "Apply optimization models to improve {company}'s supply chain efficiency. Build simulation tools and decision support systems." },
    { title: "Demand Planning Intern", skills: ["Forecasting", "SAP APO", "Excel", "Statistical Analysis"], requirements: ["Supply Chain or Analytics major"], descTemplate: "Support demand planning and forecasting at {company}. Analyze historical data and market trends to improve forecast accuracy." },
    { title: "Warehouse Operations Intern", skills: ["WMS", "Lean", "Process Improvement", "Data Analysis"], requirements: ["Supply Chain, IE, or Operations major"], descTemplate: "Optimize warehouse operations at {company}. Implement lean principles and process improvements to increase throughput." },
  ],
  "Project Management": [
    { title: "Project Coordinator Intern", skills: ["MS Project", "Jira", "Agile", "Communication"], requirements: ["Business or IT major", "Organizational skills"], descTemplate: "Support project managers at {company} with scheduling, tracking, and stakeholder communication." },
    { title: "IT Project Management Intern", skills: ["Agile", "Scrum", "Jira", "Requirements Gathering"], requirements: ["IT or Business major", "PM fundamentals"], descTemplate: "Assist in managing IT projects at {company}. Facilitate sprint ceremonies, track deliverables, and manage risks." },
    { title: "Construction Project Management Intern", skills: ["MS Project", "AutoCAD", "Budgeting", "Scheduling"], requirements: ["Construction Management or CE major"], descTemplate: "Support construction project planning and execution at {company}. Track budgets, schedules, and quality metrics." },
    { title: "Consulting Project Intern", skills: ["PowerPoint", "Excel", "Problem Solving", "Client Communication"], requirements: ["Business or Engineering major", "GPA 3.5+"], descTemplate: "Join {company}'s consulting team to deliver client engagements. Conduct analysis, develop recommendations, and present findings." },
    { title: "PMO Analyst Intern", skills: ["Project Portfolio Management", "Excel", "Power BI", "Reporting"], requirements: ["Business or IT major", "Analytical skills"], descTemplate: "Support {company}'s Project Management Office with reporting, portfolio analysis, and process standardization." },
  ],
  "Program Management": [
    { title: "Technical Program Manager Intern", skills: ["Program Management", "Agile", "Technical Communication", "Risk Management"], requirements: ["CS or Engineering major", "Leadership experience"], descTemplate: "Drive cross-functional programs at {company}. Coordinate engineering teams, track milestones, and manage dependencies." },
    { title: "Program Coordinator Intern", skills: ["Program Planning", "Stakeholder Management", "Excel", "Communication"], requirements: ["Business or Engineering major"], descTemplate: "Support program execution at {company}. Track deliverables across multiple workstreams and facilitate reviews." },
    { title: "Defense Program Management Intern", skills: ["Program Management", "DoD Processes", "Earned Value", "Risk Management"], requirements: ["Engineering or Business major", "US Citizenship required"], descTemplate: "Support defense program planning and execution at {company}. Track milestones, budgets, and contract deliverables." },
    { title: "Transformation Program Intern", skills: ["Change Management", "Process Improvement", "Stakeholder Management", "PowerPoint"], requirements: ["Business major", "Strong communication"], descTemplate: "Support enterprise transformation initiatives at {company}. Drive change management and track program KPIs." },
  ],
  "Product Management": [
    { title: "Product Management Intern", skills: ["Product Strategy", "User Research", "SQL", "Wireframing"], requirements: ["CS or Business major", "Analytical mindset"], descTemplate: "Define product requirements and work with engineering to ship new features at {company}." },
    { title: "Associate Product Manager Intern", skills: ["Product Roadmap", "A/B Testing", "SQL", "Figma"], requirements: ["CS, Business, or Design major", "GPA 3.3+"], descTemplate: "Own a product area at {company}. Define OKRs, prioritize the backlog, and launch experiments." },
    { title: "Technical Product Manager Intern", skills: ["API Design", "SQL", "Product Analytics", "Agile"], requirements: ["CS major", "Technical background required"], descTemplate: "Bridge engineering and business at {company}. Define technical requirements, write specs, and drive API strategy." },
    { title: "Product Design Intern", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], requirements: ["Design or HCI major", "Portfolio required"], descTemplate: "Design intuitive user experiences at {company}. Conduct research, create prototypes, and iterate with data." },
    { title: "Product Analytics Intern", skills: ["SQL", "Python", "Amplitude", "A/B Testing", "Tableau"], requirements: ["Analytics, CS, or Stats major"], descTemplate: "Analyze product usage data at {company}. Define metrics, build dashboards, and surface insights to guide product decisions." },
  ],
  "Data Analytics": [
    { title: "Data Analyst Intern", skills: ["SQL", "Python", "Tableau", "Statistics"], requirements: ["Stats, Math, or CS major", "SQL proficiency"], descTemplate: "Analyze large datasets at {company} to uncover insights that drive business decisions. Build dashboards and reports." },
    { title: "Business Intelligence Intern", skills: ["Power BI", "SQL", "ETL", "Data Modeling"], requirements: ["Analytics or IS major", "BI tools experience"], descTemplate: "Build and maintain BI dashboards at {company}. Design data models and automate reporting pipelines." },
    { title: "Data Engineering Intern", skills: ["Python", "SQL", "Spark", "Airflow", "AWS"], requirements: ["CS or DE major", "ETL experience"], descTemplate: "Build data pipelines and infrastructure at {company}. Ingest, transform, and serve data at scale." },
    { title: "Machine Learning Intern", skills: ["Python", "TensorFlow", "Scikit-learn", "Statistics", "NLP"], requirements: ["CS or Math major", "ML coursework"], descTemplate: "Develop and deploy machine learning models at {company}. Work on classification, NLP, and recommendation systems." },
    { title: "Data Science Intern", skills: ["Python", "R", "SQL", "Machine Learning", "Statistics"], requirements: ["Stats, Math, or CS major", "Strong quantitative skills"], descTemplate: "Apply statistical methods and machine learning at {company} to solve complex business problems." },
    { title: "Quantitative Research Intern", skills: ["Python", "Statistics", "Time Series", "Financial Modeling"], requirements: ["Math, Stats, or Physics major", "Strong math background"], descTemplate: "Conduct quantitative research at {company}. Develop models, backtest strategies, and analyze financial data." },
  ],
  "Business Analysis": [
    { title: "Business Analyst Intern", skills: ["Excel", "SQL", "Requirements Gathering", "Process Mapping"], requirements: ["Business, IS, or Engineering major"], descTemplate: "Gather and document business requirements at {company}. Analyze processes and recommend improvements." },
    { title: "Financial Analyst Intern", skills: ["Financial Modeling", "Excel", "Valuation", "PowerPoint"], requirements: ["Finance or Accounting major", "GPA 3.5+"], descTemplate: "Support financial analysis and modeling at {company}. Prepare forecasts, variance reports, and investment memos." },
    { title: "Strategy Analyst Intern", skills: ["Market Research", "Data Analysis", "PowerPoint", "Financial Modeling"], requirements: ["Business or Economics major", "Strong analytical skills"], descTemplate: "Conduct market research and competitive analysis to support strategic decision-making at {company}." },
    { title: "Systems Analyst Intern", skills: ["SQL", "UML", "Requirements Documentation", "Testing"], requirements: ["IS, CS, or Business major"], descTemplate: "Analyze IT systems and business processes at {company}. Document requirements and support system implementations." },
    { title: "Risk Analyst Intern", skills: ["Risk Modeling", "Excel", "SQL", "Statistics", "Compliance"], requirements: ["Finance, Math, or Economics major"], descTemplate: "Support risk assessment and management at {company}. Analyze credit, market, and operational risk factors." },
    { title: "Management Consulting Intern", skills: ["Problem Solving", "Data Analysis", "PowerPoint", "Client Communication"], requirements: ["Top-tier university", "GPA 3.6+", "Leadership experience"], descTemplate: "Work on client engagements at {company}. Analyze data, develop hypotheses, and present recommendations to C-level executives." },
  ],
};

const COMPENSATION_RANGES = [
  "$20-25/hr", "$25-30/hr", "$28-35/hr", "$30-40/hr", "$35-45/hr",
  "$40-50/hr", "$45-55/hr", "$50-60/hr", "$55-65/hr",
  "$4,000-5,000/month", "$5,000-6,000/month", "$6,000-7,500/month",
  "$7,000-8,500/month", "$8,000-10,000/month",
];

const DEADLINES_2026 = [
  "2026-05-15", "2026-05-30", "2026-06-15", "2026-06-30",
  "2026-07-15", "2026-07-31", "2026-08-15", "2026-08-31",
  "2026-09-15", "2026-09-30", "Rolling",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a list of realistic internship job listings.
 */
export function generateJobs(count: number = 500): GeneratedJob[] {
  const categories = Object.keys(ROLES_BY_CATEGORY);
  const jobsPerCategory = Math.ceil(count / categories.length);
  const allJobs: GeneratedJob[] = [];

  for (const category of categories) {
    const companies = COMPANIES_BY_CATEGORY[category] || COMPANIES_BY_CATEGORY["IT"];
    const roles = ROLES_BY_CATEGORY[category];
    let generated = 0;

    while (generated < jobsPerCategory && allJobs.length < count) {
      const company = pick(companies);
      const role = pick(roles);
      const location = pick(company.locations);
      const isRemote = location === "Remote" || Math.random() < 0.15;
      const deadline = pick(DEADLINES_2026);
      const compensation = pick(COMPENSATION_RANGES);

      allJobs.push({
        companyName: company.name,
        companyIndustry: category,
        companyLogo: company.logo,
        companyColor: company.color,
        companyWebsite: company.website,
        title: role.title,
        description: role.descTemplate.replace("{company}", company.name),
        location: isRemote && location !== "Remote" ? `${location} (Hybrid/Remote)` : location,
        isRemote,
        skills: role.skills,
        requirements: role.requirements,
        applicationUrl: company.website,
        category,
        compensation,
        deadline: deadline === "Rolling" ? deadline : new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
      generated++;
    }
  }

  logger.info(`Generated ${allJobs.length} internship listings across ${categories.length} categories`);
  return shuffle(allJobs).slice(0, count);
}
