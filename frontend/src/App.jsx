import { useState, useRef, useEffect } from "react";

/* ═══ DATA ═══ */
const COMPANIES = [
  { id: 1, name: "Google", logo: "G", industry: "Technology", roles: ["SWE Intern", "ML Intern"], location: "Mountain View, CA", deadline: "Apr 15", color: "#4285F4", match: 96 },
  { id: 2, name: "Goldman Sachs", logo: "GS", industry: "Finance", roles: ["Summer Analyst", "Tech Intern"], location: "New York, NY", deadline: "Mar 30", color: "#6B8DB5", match: 88 },
  { id: 3, name: "Tesla", logo: "T", industry: "Automotive", roles: ["Mech Eng Intern", "SWE Intern"], location: "Austin, TX", deadline: "May 1", color: "#CC0000", match: 91 },
  { id: 4, name: "McKinsey", logo: "Mc", industry: "Consulting", roles: ["BA Intern", "Digital Intern"], location: "Chicago, IL", deadline: "Apr 20", color: "#003D6B", match: 84 },
  { id: 5, name: "Meta", logo: "Mt", industry: "Technology", roles: ["Product Design Intern", "SWE Intern"], location: "Menlo Park, CA", deadline: "Apr 10", color: "#0668E1", match: 93 },
  { id: 6, name: "Amazon", logo: "Am", industry: "Technology", roles: ["SDE Intern", "PM Intern"], location: "Seattle, WA", deadline: "Rolling", color: "#FF9900", match: 94 },
  { id: 7, name: "Apple", logo: "Ap", industry: "Technology", roles: ["iOS Intern", "UX Research Intern"], location: "Cupertino, CA", deadline: "May 5", color: "#555", match: 90 },
  { id: 8, name: "Deloitte", logo: "De", industry: "Consulting", roles: ["Audit Intern", "Consulting Intern"], location: "Multiple", deadline: "Apr 18", color: "#86BC25", match: 79 },
];

const INIT_APPS = [
  { id: 1, company: "Google", role: "SWE Intern", date: "Mar 10", status: "Interview", portal: "Direct", color: "#4285F4", logo: "G", user: "Jordan Rivera" },
  { id: 2, company: "Meta", role: "Design Intern", date: "Mar 8", status: "Review", portal: "LinkedIn", color: "#0668E1", logo: "Mt", user: "Jordan Rivera" },
  { id: 3, company: "Amazon", role: "SDE Intern", date: "Mar 5", status: "Applied", portal: "Direct", color: "#FF9900", logo: "Am", user: "Alex Chen" },
  { id: 4, company: "Tesla", role: "SWE Intern", date: "Feb 28", status: "Rejected", portal: "Handshake", color: "#CC0000", logo: "T", user: "Sam Patel" },
  { id: 5, company: "Goldman Sachs", role: "Tech Intern", date: "Feb 20", status: "Offer", portal: "Direct", color: "#6B8DB5", logo: "GS", user: "Jordan Rivera" },
  { id: 6, company: "Apple", role: "iOS Intern", date: "Mar 12", status: "Applied", portal: "LinkedIn", color: "#555", logo: "Ap", user: "Maria Santos" },
  { id: 7, company: "McKinsey", role: "BA Intern", date: "Mar 1", status: "Interview", portal: "Direct", color: "#003D6B", logo: "Mc", user: "Alex Chen" },
  { id: 8, company: "Deloitte", role: "Audit Intern", date: "Feb 15", status: "Offer", portal: "Direct", color: "#86BC25", logo: "De", user: "Priya Sharma" },
];

const MOCK_EMAILS = [
  { id: 1, company: "Google", from: "recruiting@google.com", subject: "Interview Invite - SWE Intern", date: "Mar 25", snippet: "We invite you for a virtual technical interview for SWE Intern.", type: "positive" },
  { id: 2, company: "Meta", from: "noreply@meta.com", subject: "Application Update", date: "Mar 22", snippet: "Your application is under review by our hiring team.", type: "neutral" },
  { id: 3, company: "Tesla", from: "campus@tesla.com", subject: "Application Status", date: "Mar 15", snippet: "We decided to move forward with other candidates.", type: "negative" },
  { id: 4, company: "Goldman Sachs", from: "recruiting@gs.com", subject: "Offer Letter", date: "Mar 12", snippet: "Congratulations! We extend an offer for Technology Summer Analyst.", type: "positive" },
  { id: 5, company: "Amazon", from: "careers@amazon.jobs", subject: "Application Received", date: "Mar 5", snippet: "We received your SDE Intern application and will review shortly.", type: "neutral" },
];

const ADMIN_USERS = [
  { id: 1, name: "Jordan Rivera", email: "jordan@stanford.edu", uni: "Stanford", plan: "Pro", status: "Active", apps: 3, joined: "Jan 5" },
  { id: 2, name: "Alex Chen", email: "alex@mit.edu", uni: "MIT", plan: "Free", status: "Active", apps: 2, joined: "Jan 12" },
  { id: 3, name: "Sam Patel", email: "sam@berkeley.edu", uni: "UC Berkeley", plan: "Pro", status: "Active", apps: 1, joined: "Feb 1" },
  { id: 4, name: "Maria Santos", email: "maria@columbia.edu", uni: "Columbia", plan: "Enterprise", status: "Active", apps: 1, joined: "Feb 8" },
  { id: 5, name: "Priya Sharma", email: "priya@gatech.edu", uni: "Georgia Tech", plan: "Pro", status: "Active", apps: 1, joined: "Feb 14" },
  { id: 6, name: "Liam O Brien", email: "liam@nyu.edu", uni: "NYU", plan: "Free", status: "Inactive", apps: 0, joined: "Mar 1" },
  { id: 7, name: "Emily Zhang", email: "emily@umich.edu", uni: "U Michigan", plan: "Free", status: "Active", apps: 0, joined: "Mar 10" },
  { id: 8, name: "David Kim", email: "david@cmu.edu", uni: "CMU", plan: "Pro", status: "Suspended", apps: 4, joined: "Dec 20" },
];

const STATE_UNIVERSITIES = {
  "Alabama": ["University of Alabama", "Auburn University", "UAB", "Alabama A&M University", "Troy University", "Samford University"],
  "Alaska": ["University of Alaska Anchorage", "University of Alaska Fairbanks", "Alaska Pacific University"],
  "Arizona": ["Arizona State University", "University of Arizona", "Northern Arizona University", "Grand Canyon University", "Embry-Riddle Aeronautical University"],
  "Arkansas": ["University of Arkansas", "Arkansas State University", "University of Central Arkansas", "Hendrix College"],
  "California": ["Stanford University", "UC Berkeley", "UCLA", "USC", "Caltech", "UC San Diego", "UC Davis", "UC Irvine", "UC Santa Barbara", "UC Santa Cruz", "UC Riverside", "San Jose State University", "Cal Poly SLO", "Cal Poly Pomona", "San Diego State University", "CSU Fullerton", "CSU Long Beach", "Santa Clara University", "Loyola Marymount University", "Pepperdine University", "University of San Francisco", "Chapman University", "Claremont McKenna College", "Harvey Mudd College", "Pomona College"],
  "Colorado": ["University of Colorado Boulder", "Colorado State University", "Colorado School of Mines", "University of Denver", "Colorado College"],
  "Connecticut": ["Yale University", "University of Connecticut", "Wesleyan University", "Trinity College", "Fairfield University", "Quinnipiac University"],
  "Delaware": ["University of Delaware", "Delaware State University", "Wilmington University"],
  "Florida": ["University of Florida", "Florida State University", "University of Miami", "UCF", "USF", "Florida International University", "Florida Atlantic University", "Stetson University", "Rollins College"],
  "Georgia": ["Georgia Tech", "Emory University", "University of Georgia", "Georgia State University", "Morehouse College", "Spelman College", "Mercer University", "Kennesaw State University"],
  "Hawaii": ["University of Hawaii at Manoa", "Hawaii Pacific University", "Brigham Young University-Hawaii"],
  "Idaho": ["Boise State University", "University of Idaho", "Idaho State University", "College of Idaho"],
  "Illinois": ["University of Chicago", "Northwestern University", "UIUC", "University of Illinois Chicago", "DePaul University", "Loyola University Chicago", "Illinois Institute of Technology", "Illinois State University", "Southern Illinois University"],
  "Indiana": ["Purdue University", "Indiana University Bloomington", "University of Notre Dame", "Rose-Hulman Institute", "Butler University", "Ball State University", "Indiana State University", "Valparaiso University"],
  "Iowa": ["University of Iowa", "Iowa State University", "Drake University", "Grinnell College", "University of Northern Iowa"],
  "Kansas": ["University of Kansas", "Kansas State University", "Wichita State University", "Washburn University"],
  "Kentucky": ["University of Kentucky", "University of Louisville", "Western Kentucky University", "Centre College", "Berea College"],
  "Louisiana": ["LSU", "Tulane University", "Loyola University New Orleans", "Louisiana Tech University", "University of Louisiana at Lafayette"],
  "Maine": ["University of Maine", "Bowdoin College", "Bates College", "Colby College"],
  "Maryland": ["Johns Hopkins University", "University of Maryland", "UMBC", "Towson University", "Loyola University Maryland", "US Naval Academy"],
  "Massachusetts": ["MIT", "Harvard University", "Boston University", "Boston College", "Northeastern University", "Tufts University", "Brandeis University", "UMass Amherst", "Worcester Polytechnic Institute", "Williams College", "Amherst College", "Wellesley College", "Babson College", "Bentley University", "Clark University"],
  "Michigan": ["University of Michigan", "Michigan State University", "Michigan Technological University", "Wayne State University", "Western Michigan University", "Calvin University", "Kalamazoo College"],
  "Minnesota": ["University of Minnesota", "Carleton College", "Macalester College", "St. Olaf College", "University of St. Thomas"],
  "Mississippi": ["University of Mississippi", "Mississippi State University", "Jackson State University", "Millsaps College"],
  "Missouri": ["Washington University in St. Louis", "University of Missouri", "Saint Louis University", "Missouri S&T", "Truman State University"],
  "Montana": ["University of Montana", "Montana State University", "Carroll College"],
  "Nebraska": ["University of Nebraska-Lincoln", "Creighton University", "University of Nebraska Omaha"],
  "Nevada": ["University of Nevada Las Vegas", "University of Nevada Reno", "Nevada State University"],
  "New Hampshire": ["Dartmouth College", "University of New Hampshire", "Saint Anselm College"],
  "New Jersey": ["Princeton University", "Rutgers University", "Stevens Institute of Technology", "NJIT", "Seton Hall University", "Rowan University", "Montclair State University"],
  "New Mexico": ["University of New Mexico", "New Mexico State University", "New Mexico Institute of Mining and Technology"],
  "New York": ["Columbia University", "NYU", "Cornell University", "University of Rochester", "RPI", "Syracuse University", "Stony Brook University", "University at Buffalo", "Binghamton University", "CUNY - City College", "Fordham University", "Colgate University", "Vassar College", "Marist College", "Pace University", "RIT"],
  "North Carolina": ["Duke University", "UNC Chapel Hill", "NC State University", "Wake Forest University", "Davidson College", "Appalachian State University", "UNC Charlotte", "Elon University", "East Carolina University"],
  "North Dakota": ["University of North Dakota", "North Dakota State University"],
  "Ohio": ["Ohio State University", "Case Western Reserve University", "University of Cincinnati", "Miami University", "Ohio University", "Kent State University", "University of Dayton", "Xavier University", "Oberlin College", "Kenyon College"],
  "Oklahoma": ["University of Oklahoma", "Oklahoma State University", "University of Tulsa", "Oral Roberts University"],
  "Oregon": ["University of Oregon", "Oregon State University", "Portland State University", "Reed College", "Lewis & Clark College", "Willamette University"],
  "Pennsylvania": ["University of Pennsylvania", "Carnegie Mellon University", "Penn State University", "University of Pittsburgh", "Drexel University", "Temple University", "Lehigh University", "Villanova University", "Swarthmore College", "Haverford College", "Bucknell University", "Lafayette College"],
  "Rhode Island": ["Brown University", "University of Rhode Island", "Providence College", "Bryant University"],
  "South Carolina": ["Clemson University", "University of South Carolina", "College of Charleston", "Furman University", "Wofford College"],
  "South Dakota": ["University of South Dakota", "South Dakota State University", "South Dakota School of Mines"],
  "Tennessee": ["Vanderbilt University", "University of Tennessee", "Rhodes College", "University of Memphis", "Middle Tennessee State University", "Belmont University"],
  "Texas": ["UT Austin", "Texas A&M University", "Rice University", "SMU", "Baylor University", "University of Houston", "UT Dallas", "Texas Tech University", "TCU", "UT San Antonio", "University of North Texas", "Texas State University", "Trinity University"],
  "Utah": ["University of Utah", "BYU", "Utah State University", "Westminster University"],
  "Vermont": ["University of Vermont", "Middlebury College", "Norwich University"],
  "Virginia": ["University of Virginia", "Virginia Tech", "William & Mary", "George Mason University", "James Madison University", "Virginia Commonwealth University", "University of Richmond", "Washington and Lee University", "Hampton University", "Liberty University"],
  "Washington": ["University of Washington", "Washington State University", "Gonzaga University", "Seattle University", "Whitman College", "Pacific Lutheran University"],
  "West Virginia": ["West Virginia University", "Marshall University", "Shepherd University"],
  "Wisconsin": ["University of Wisconsin-Madison", "Marquette University", "UW-Milwaukee", "Lawrence University", "Beloit College"],
  "Wyoming": ["University of Wyoming"],
  "District of Columbia": ["Georgetown University", "George Washington University", "Howard University", "American University", "Catholic University of America"],
};

const CHART = [
  { day: "Mon", val: 12 }, { day: "Tue", val: 18 }, { day: "Wed", val: 24 },
  { day: "Thu", val: 15 }, { day: "Fri", val: 30 }, { day: "Sat", val: 8 }, { day: "Sun", val: 5 },
];

const PLANS = [
  {
    id: "free", name: "Free", price: 0, period: "",
    color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB",
    features: ["5 applications/month", "Basic company matching", "Email notifications", "Community support"],
    notIncluded: ["AI resume parsing", "Priority matching", "Analytics dashboard", "API access"],
  },
  {
    id: "pro", name: "Pro", price: 12, period: "/mo",
    color: "#E8C547", bg: "#FFFDF5", border: "#FDE68A", popular: true,
    features: ["Unlimited applications", "AI resume parsing", "Priority matching algorithm", "Analytics dashboard", "1-click apply to all portals", "Email + chat support"],
    notIncluded: ["University SSO", "API access"],
  },
  {
    id: "enterprise", name: "Enterprise", price: 49, period: "/mo",
    color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD",
    features: ["Everything in Pro", "University SSO integration", "Bulk data import/export", "Dedicated account manager", "Custom API access", "SLA guarantee", "White-label option"],
    notIncluded: [],
  },
];

const PAY_METHODS = [
  { id: "card", name: "Credit / Debit Card", icon: "card", desc: "Visa, Mastercard, Amex, Discover" },
  { id: "paypal", name: "PayPal", icon: "paypal", desc: "Pay with your PayPal account" },
  { id: "applepay", name: "Apple Pay", icon: "apple", desc: "Quick checkout with Apple Pay" },
  { id: "googlepay", name: "Google Pay", icon: "google", desc: "Fast payment with Google Pay" },
  { id: "bank", name: "Bank Transfer", icon: "bank", desc: "Direct ACH / wire transfer" },
];

const STATUS_STYLE = {
  Applied: { bg: "#EEF2FF", fg: "#4F46E5" },
  Review: { bg: "#FFF7ED", fg: "#C2410C" },
  Interview: { bg: "#F0FDF4", fg: "#15803D" },
  Offer: { bg: "#ECFDF5", fg: "#047857" },
  Rejected: { bg: "#FEF2F2", fg: "#B91C1C" },
};

/* ═══ SMALL COMPONENTS ═══ */
function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Applied;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 16, background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.fg }} />
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  const c = { Free: { bg: "#F3F4F6", fg: "#6B7280" }, Pro: { bg: "#FEF9C3", fg: "#A16207" }, Enterprise: { bg: "#EDE9FE", fg: "#7C3AED" } };
  const x = c[plan] || c.Free;
  return <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: x.bg, color: x.fg }}>{plan}</span>;
}

function UserStatusBadge({ status }) {
  const c = { Active: { bg: "#DCFCE7", fg: "#15803D" }, Inactive: { bg: "#F3F4F6", fg: "#6B7280" }, Suspended: { bg: "#FEF2F2", fg: "#B91C1C" } };
  const x = c[status] || c.Active;
  return <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: x.bg, color: x.fg }}>{status}</span>;
}

function PayIcon({ type }) {
  const icons = {
    card: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    paypal: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.654h6.451c2.166 0 3.865.6 4.893 1.737.96 1.064 1.313 2.544.99 4.275-.022.12-.048.24-.077.36-.726 3.467-3.192 5.298-7.027 5.298H9.134a.77.77 0 0 0-.758.654l-1.3 5.947z"/></svg>,
    apple: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>,
    google: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    bank: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>,
  };
  return <span style={{ display: "flex", alignItems: "center" }}>{icons[type]}</span>;
}

const CSS = `
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
  @keyframes checkmark { 0% { transform:scale(0); } 50% { transform:scale(1.2); } 100% { transform:scale(1); } }
  .fi { animation: fadeIn 0.3s ease both; }
  .card { background:#fff; border:1px solid #e5e3dc; border-radius:14px; padding:20px; transition:box-shadow 0.2s; }
  .card:hover { box-shadow:0 6px 20px rgba(0,0,0,0.06); }
  .btn { border:none; cursor:pointer; font-family:inherit; font-weight:600; border-radius:10px; font-size:13px; transition:all 0.15s; }
  .btn:hover { opacity:0.88; transform:translateY(-1px); }
  .btn:active { transform:translateY(0); }
  .btn:disabled { opacity:0.5; cursor:default; transform:none; }
  input.inp, textarea.inp, select.inp { font-family:inherit; border:2px solid #e5e3dc; border-radius:10px; padding:11px 14px; font-size:14px; outline:none; width:100%; box-sizing:border-box; background:#fff; transition:border-color 0.2s; appearance:none; }
  input.inp:focus, textarea.inp:focus, select.inp:focus { border-color:#d4a84b; }
  select.inp { background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; cursor:pointer; }
  select.inp option { font-size:14px; padding:8px; }
  textarea.inp { resize:vertical; }
  .chip { display:inline-block; padding:4px 10px; border-radius:7px; font-size:11px; font-weight:500; background:#f5f3ef; border:1px solid #e5e3dc; color:#1a1a2e; }
  table.tbl { width:100%; border-collapse:collapse; }
  table.tbl th { text-align:left; padding:10px 14px; font-size:11px; font-weight:600; color:#999; text-transform:uppercase; border-bottom:2px solid #e5e3dc; background:#fafaf7; }
  table.tbl td { padding:12px 14px; font-size:13px; border-bottom:1px solid #f0eeea; }
  table.tbl tr:hover td { background:#fafaf7; }
  .plan-card { border:2px solid #e5e3dc; border-radius:16px; padding:28px 22px; text-align:center; cursor:pointer; transition:all 0.25s; position:relative; }
  .plan-card:hover { transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,0,0,0.08); }
  .plan-card.selected { border-width:3px; transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,0,0,0.1); }
  .pay-option { border:2px solid #e5e3dc; border-radius:12px; padding:16px 20px; cursor:pointer; display:flex; align-items:center; gap:14px; transition:all 0.2s; }
  .pay-option:hover { border-color:#ccc; background:#fafaf7; }
  .pay-option.selected { border-color:#1a1a2e; background:#fafaf7; }
`;

/* ═══ MAIN APP ═══ */
export default function App() {
  /* Registration state */
  const [registered, setRegistered] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [regForm, setRegForm] = useState({ firstName: "", middleName: "", lastName: "", email: "", password: "", confirmPass: "", state: "", university: "", phone: "" });
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailVerifSent, setEmailVerifSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [payMethod, setPayMethod] = useState("card");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  /* App state */
  const [view, setView] = useState("student");
  const [tab, setTab] = useState("profile");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", university: "", major: "", gpa: "", gradYear: "2027", skills: "", industries: "", linkedin: "", bio: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [parsed, setParsed] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [apps, setApps] = useState(INIT_APPS);
  const [applied, setApplied] = useState(new Set([1, 5, 6]));
  const [applyingId, setApplyingId] = useState(null);
  const [emails, setEmails] = useState([]);
  const [gmailOk, setGmailOk] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [ingLog, setIngLog] = useState([]);
  const [ingesting, setIngesting] = useState(false);
  const fileRef = useRef(null);

  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  /* Registration helpers – always use relative /api in production */
  const API_BASE = (typeof window !== "undefined" && window.location.hostname !== "localhost")
    ? "/api"
    : (import.meta.env.VITE_API_URL || "/api");

  const validateStep1 = () => {
    const err = {};
    if (!regForm.firstName.trim()) err.firstName = "First name is required";
    if (!regForm.lastName.trim()) err.lastName = "Last name is required";
    if (!regForm.email.trim() || !regForm.email.includes("@")) err.email = "Valid email required";
    if (regForm.password.length < 6) err.password = "Min 6 characters";
    if (regForm.password !== regForm.confirmPass) err.confirmPass = "Passwords must match";
    if (!regForm.university.trim()) err.university = "University required";
    if (!regForm.state.trim()) err.state = "State required";
    if (regForm.phone && !/^\+?[\d\s\-()]{7,}$/.test(regForm.phone.trim())) err.phone = "Valid phone number required";
    setRegErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSendOtp = async () => {
    if (!regForm.phone.trim()) { setRegErrors((p) => ({ ...p, phone: "Phone number required for verification" })); return; }
    setOtpLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: regForm.phone, email: regForm.email }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setPhoneOtpSent(true);
        // In dev mode, auto-fill the OTP for convenience
        if (data._devOtp) setPhoneOtp(data._devOtp);
        notify("OTP sent to " + regForm.phone);
      } else {
        setRegErrors((p) => ({ ...p, phone: data.error || "Failed to send OTP" }));
      }
    } catch {
      setRegErrors((p) => ({ ...p, phone: "Network error. Is the backend running?" }));
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!phoneOtp.trim()) return;
    setOtpLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regForm.email, otp: phoneOtp }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setPhoneVerified(true);
        notify("Phone verified!");
      } else {
        setRegErrors((p) => ({ ...p, otp: data.error || "Invalid OTP" }));
      }
    } catch {
      setRegErrors((p) => ({ ...p, otp: "Network error" }));
    }
    setOtpLoading(false);
  };

  const handleRegister = async () => {
    if (!validateStep1()) return;
    setProcessing(true);
    setApiError("");
    try {
      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: regForm.firstName,
          middleName: regForm.middleName || null,
          lastName: regForm.lastName,
          email: regForm.email,
          password: regForm.password,
          phone: regForm.phone || null,
          state: regForm.state,
          university: regForm.university,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        // Store token for authenticated requests
        if (data.token) localStorage.setItem("interntrack_token", data.token);
        setEmailVerifSent(true);
        setRegStep(2); // Proceed to plan selection
        notify("Account created! Check your email for verification.");
      } else {
        setApiError(data.error || "Registration failed");
        if (data.details) setRegErrors(data.details);
      }
    } catch {
      // If backend is not running, allow proceeding in demo mode
      setRegStep(2);
      notify("Account created (demo mode)");
    }
    setProcessing(false);
  };

  const formatCardNumber = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setRegStep(4);
    }, 2500);
  };

  const finishRegistration = () => {
    const fullName = [regForm.firstName, regForm.middleName, regForm.lastName].filter(Boolean).join(" ");
    setProfile((p) => ({ ...p, name: fullName, email: regForm.email, university: regForm.university, phone: regForm.phone }));
    setRegistered(true);
    notify("Welcome to InternTrack, " + regForm.firstName + "!");
  };

  const ADMIN_CREDS = { email: "admin@interntrack.com", password: "admin123" };
  const DEMO_STUDENT = { email: "jordan@stanford.edu", password: "student123", name: "Jordan Rivera", uni: "Stanford" };

  const handleLogin = async () => {
    setLoginError("");
    setLoginLoading(true);
    try {
      // Try backend API first
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await resp.json();
      if (resp.ok) {
        if (data.token) localStorage.setItem("interntrack_token", data.token);
        const fullName = data.user.fullName || [data.user.firstName, data.user.middleName, data.user.lastName].filter(Boolean).join(" ");
        setProfile((p) => ({
          ...p,
          name: fullName,
          email: data.user.email,
          phone: data.user.phone || "",
          university: data.user.profile?.university || "",
        }));
        setRegForm((p) => ({ ...p, firstName: data.user.firstName, lastName: data.user.lastName }));
        if (data.user.role === "SUPER_ADMIN" || data.user.role === "ADMIN") {
          setSelectedPlan(data.user.plan?.toLowerCase() || "enterprise");
          setView("admin");
        } else {
          setSelectedPlan(data.user.plan?.toLowerCase() || "free");
          setView("student");
        }
        setRegistered(true);
        setLoginLoading(false);
        notify("Welcome back, " + data.user.firstName + "!");
        return;
      }
      // API returned an error (suspended, wrong password, etc.)
      if (resp.status === 403) {
        setLoginError(data.error || "Your account has been suspended. Please contact support.");
        setLoginLoading(false);
        return;
      }
      if (resp.status === 401) {
        setLoginError(data.error || "Invalid email or password");
        setLoginLoading(false);
        return;
      }
    } catch {
      // Backend not available, fall back to demo credentials
    }

    // Fallback: demo credentials (when backend is not running)
    if (loginEmail === ADMIN_CREDS.email && loginPass === ADMIN_CREDS.password) {
      setProfile((p) => ({ ...p, name: "System Admin", email: ADMIN_CREDS.email, university: "InternTrack HQ" }));
      setRegForm((p) => ({ ...p, firstName: "System", lastName: "Admin" }));
      setSelectedPlan("enterprise");
      setView("admin");
      setRegistered(true);
      notify("Welcome back, Admin!");
    } else if (loginEmail === DEMO_STUDENT.email && loginPass === DEMO_STUDENT.password) {
      setProfile((p) => ({ ...p, name: DEMO_STUDENT.name, email: DEMO_STUDENT.email, university: DEMO_STUDENT.uni }));
      setRegForm((p) => ({ ...p, firstName: "Jordan", lastName: "Rivera" }));
      setSelectedPlan("pro");
      setView("student");
      setRegistered(true);
      notify("Welcome back, Jordan!");
    } else {
      setLoginError("Invalid email or password. Try the admin or demo credentials below.");
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("interntrack_token");
    setRegistered(false);
    setShowLogin(true);
    setRegStep(1);
    setRegForm({ firstName: "", middleName: "", lastName: "", email: "", password: "", confirmPass: "", state: "", university: "", phone: "" });
    setLoginEmail("");
    setLoginPass("");
    setLoginError("");
    setView("student");
    setTab("profile");
    setAdminTab("dashboard");
    setSaved(false);
    setGmailOk(false);
    setEmails([]);
    setPhoneOtpSent(false);
    setPhoneOtp("");
    setPhoneVerified(false);
    setEmailVerifSent(false);
    setApiError("");
    notify("Logged out successfully");
  };

  /* App helpers */
  const doApply = (c, portal) => {
    setApplyingId(c.id);
    setTimeout(() => {
      setApplied((p) => new Set([...p, c.id]));
      setApps((p) => [{ id: Date.now(), company: c.name, role: c.roles[0], date: "Mar 30", status: "Applied", portal, color: c.color, logo: c.logo, user: [regForm.firstName, regForm.lastName].filter(Boolean).join(" ") || "Student" }, ...p]);
      setApplyingId(null);
      notify("Applied to " + c.name + " via " + portal);
    }, 1100);
  };

  const connectGmail = () => {
    setGmailLoading(true);
    setTimeout(() => { setEmails(MOCK_EMAILS); setGmailOk(true); setGmailLoading(false); notify("Gmail connected via MCP!"); }, 1800);
  };

  const onResume = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setResumeFile(f);
    setParsed(false);

    // Try uploading to backend API
    const token = localStorage.getItem("interntrack_token");
    if (token) {
      try {
        const formData = new FormData();
        formData.append("resume", f);
        const resp = await fetch(`${API_BASE}/resumes/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (resp.ok) {
          const data = await resp.json();
          setParsed(true);
          setProfile((p) => ({
            ...p,
            skills: p.skills || (data.extractedSkills || []).join(", "),
            industries: p.industries || (data.extractedIndustries || []).join(", "),
          }));
          notify("Resume uploaded & parsed!");
          fetchResumes();
          return;
        }
        const errData = await resp.json().catch(() => ({}));
        console.warn("Resume upload API error:", errData.error || resp.status);
      } catch (err) {
        console.warn("Resume upload network error, falling back to demo:", err.message);
      }
    }

    // Fallback: demo mode (no backend or not logged in)
    setTimeout(() => {
      setParsed(true);
      setProfile((p) => ({ ...p, skills: p.skills || "Python, JavaScript, React, SQL, ML, Data Analysis", industries: p.industries || "Technology, Finance, Consulting" }));
      notify("Resume parsed! (demo mode)");
    }, 1400);
  };

  /* Fetch previously uploaded resumes from backend */
  const fetchResumes = async () => {
    const token = localStorage.getItem("interntrack_token");
    if (!token) return;
    setResumeLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setSavedResumes(data);
        // If user has resumes, show the latest one's extracted info
        if (data.length > 0) {
          const latest = data[0];
          setParsed(true);
          setProfile((p) => ({
            ...p,
            skills: p.skills || (latest.extractedSkills || []).join(", "),
            industries: p.industries || (latest.extractedIndustries || []).join(", "),
          }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch resumes:", err.message);
    } finally {
      setResumeLoading(false);
    }
  };

  /* Delete a resume */
  const deleteResume = async (resumeId) => {
    const token = localStorage.getItem("interntrack_token");
    if (!token) return;
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    setDeletingId(resumeId);
    try {
      const resp = await fetch(`${API_BASE}/resumes/${resumeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setSavedResumes((prev) => prev.filter((r) => r.id !== resumeId));
        // If no resumes left, reset upload UI
        const remaining = savedResumes.filter((r) => r.id !== resumeId);
        if (remaining.length === 0) {
          setResumeFile(null);
          setParsed(false);
        }
        notify("Resume deleted");
      } else {
        const errData = await resp.json().catch(() => ({}));
        notify("Delete failed: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      notify("Delete failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  /* Load resumes when Resume tab is selected */
  useEffect(() => {
    if (tab === "resume" && view === "student") {
      fetchResumes();
    }
  }, [tab, view]);

  /* ─── Admin: Fetch users from database ─── */
  const fetchAdminUsers = async () => {
    const token = localStorage.getItem("interntrack_token");
    if (!token) return;
    setUsersLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data);
      } else {
        console.warn("Failed to fetch users:", resp.status);
      }
    } catch (err) {
      console.warn("Could not fetch admin users:", err.message);
      // Fallback to demo data if API unavailable
      setUsers(ADMIN_USERS);
    } finally {
      setUsersLoading(false);
    }
  };

  /* Admin: Suspend or activate a user */
  const toggleUserStatus = async (userId, currentStatus) => {
    const token = localStorage.getItem("interntrack_token");
    if (!token) return;
    const newActive = currentStatus === "Suspended";
    try {
      const resp = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newActive ? "Active" : "Suspended", isActive: newActive } : u));
        notify(data.message);
      } else {
        const errData = await resp.json().catch(() => ({}));
        notify("Error: " + (errData.error || "Failed to update user"));
      }
    } catch (err) {
      notify("Network error: " + err.message);
    }
  };

  /* Admin: Remove a user permanently */
  const removeUser = async (userId, userName) => {
    const token = localStorage.getItem("interntrack_token");
    if (!token) return;
    if (!window.confirm(`Permanently remove ${userName}? This cannot be undone.`)) return;
    try {
      const resp = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        const data = await resp.json().catch(() => ({}));
        notify(data.message || `${userName} removed`);
      } else {
        const errData = await resp.json().catch(() => ({}));
        notify("Error: " + (errData.error || "Failed to remove user"));
      }
    } catch (err) {
      notify("Network error: " + err.message);
    }
  };

  /* Load admin users when Users tab is selected */
  useEffect(() => {
    if (adminTab === "users" && view === "admin") {
      fetchAdminUsers();
    }
  }, [adminTab, view]);

  const runIngestion = (src) => {
    setIngesting(true); setIngLog([]);
    const count = Math.floor(Math.random() * 80 + 40);
    const steps = [
      { msg: "Connecting to " + src + "...", delay: 500 },
      { msg: "Fetching listings...", delay: 1200 },
      { msg: "Parsing " + count + " positions...", delay: 2000 },
      { msg: "Deduplicating...", delay: 2700 },
      { msg: "Done! " + count + " internships added.", delay: 3200 },
    ];
    steps.forEach((s, i) => {
      setTimeout(() => {
        setIngLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg: s.msg, ok: i === steps.length - 1 }]);
        if (i === steps.length - 1) setIngesting(false);
      }, s.delay);
    });
  };

  const filtered = COMPANIES.filter((c) => {
    const q = search.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.roles.some((r) => r.toLowerCase().includes(q))) && (filter === "All" || c.industry === filter);
  }).sort((a, b) => b.match - a.match);

  const industries = ["All", ...Array.from(new Set(COMPANIES.map((c) => c.industry)))];
  const filteredUsers = users.filter((u) => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const currentTab = view === "student" ? tab : adminTab;
  const setCurrentTab = view === "student" ? setTab : setAdminTab;
  const accent = view === "admin" ? "#7C3AED" : "#e8c547";
  const chosenPlan = PLANS.find((p) => p.id === selectedPlan);

  const navTabs = view === "student"
    ? [{ id: "profile", l: "Profile", i: "P" }, { id: "resume", l: "Resume", i: "R" }, { id: "discover", l: "Discover", i: "D" }, { id: "tracker", l: "Tracker", i: "T" }, { id: "inbox", l: "Inbox", i: "I" }]
    : [{ id: "dashboard", l: "Analytics", i: "A" }, { id: "users", l: "Users", i: "U" }, { id: "applications", l: "Applications", i: "M" }, { id: "ingestion", l: "Ingestion", i: "D" }, { id: "subscriptions", l: "Subs", i: "S" }];

  const Lbl = ({ children }) => (
    <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{children}</label>
  );

  const ErrMsg = ({ field }) => regErrors[field] ? <div style={{ color: "#DC2626", fontSize: 11, marginTop: 3 }}>{regErrors[field]}</div> : null;

  /* ═══════════════════════════════════════════════════════════
     REGISTRATION FLOW
     ═══════════════════════════════════════════════════════════ */
  if (!registered) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <style>{CSS}</style>

        {toast && (
          <div className="fi" style={{ position: "fixed", top: 16, right: 16, zIndex: 999, padding: "12px 20px", borderRadius: 11, background: "#059669", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.3)" }}>{toast}</div>
        )}

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#e8c547,#d4a437)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#1a1a2e", fontSize: 16 }}>IN</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>InternTrack</div>
            <div style={{ color: "#e8c547", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>Launch Your Career</div>
          </div>
        </div>

        {/* Progress Steps */}
        {!showLogin && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 30 }}>
          {["Account", "Plan", "Payment", "Done"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                background: regStep > i + 1 ? "#059669" : regStep === i + 1 ? "#e8c547" : "rgba(255,255,255,0.1)",
                color: regStep > i + 1 ? "#fff" : regStep === i + 1 ? "#1a1a2e" : "#666",
                transition: "all 0.3s",
              }}>
                {regStep > i + 1 ? "\u2713" : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: regStep >= i + 1 ? "#e8c547" : "#555", marginLeft: 6, marginRight: i < 3 ? 8 : 0 }}>{s}</div>
              {i < 3 && <div style={{ width: 30, height: 2, background: regStep > i + 1 ? "#059669" : "rgba(255,255,255,0.1)", marginLeft: 8, borderRadius: 1, transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>
        )}

        {/* Step Cards */}
        <div className="fi" key={showLogin ? "login" : regStep} style={{ background: "#fff", borderRadius: 20, padding: regStep === 2 && !showLogin ? "32px 20px" : 32, width: "100%", maxWidth: regStep === 2 && !showLogin ? 780 : 520, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          {/* LOGIN FORM */}
          {showLogin && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Sign In</h2>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Welcome back! Enter your credentials.</p>

              {loginError && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
                  {loginError}
                </div>
              )}

              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <Lbl>Email Address</Lbl>
                  <input className="inp" type="email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }} placeholder="admin@interntrack.com" />
                </div>
                <div>
                  <Lbl>Password</Lbl>
                  <input className="inp" type="password" value={loginPass} onChange={(e) => { setLoginPass(e.target.value); setLoginError(""); }} placeholder="Enter password"
                    onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                  />
                </div>
              </div>

              <button className="btn" disabled={loginLoading} onClick={handleLogin} style={{ width: "100%", marginTop: 20, padding: "14px", background: loginLoading ? "#ccc" : "#1a1a2e", color: "#e8c547", fontSize: 15 }}>
                {loginLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(232,197,71,0.3)", borderTopColor: "#e8c547", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>

              {/* Default Credentials */}
              <div style={{ marginTop: 20, padding: 16, background: "#fafaf7", borderRadius: 12, border: "1px solid #e5e3dc" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Default Accounts</div>

                <div
                  onClick={() => { setLoginEmail("admin@interntrack.com"); setLoginPass("admin123"); setLoginError(""); }}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e5e3dc", marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C3AED"; e.currentTarget.style.background = "#F5F3FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e3dc"; e.currentTarget.style.background = "#fff"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 10 }}>A</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>Admin Account</div>
                        <div style={{ fontSize: 11, color: "#999" }}>Full admin panel access</div>
                      </div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "#EDE9FE", color: "#7C3AED" }}>Enterprise</span>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 11, color: "#888" }}>
                    <span>admin@interntrack.com</span>
                    <span>admin123</span>
                  </div>
                </div>

                <div
                  onClick={() => { setLoginEmail("jordan@stanford.edu"); setLoginPass("student123"); setLoginError(""); }}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e5e3dc", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.background = "#FFFDF5"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e3dc"; e.currentTarget.style.background = "#fff"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#e8c547", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a1a2e", fontWeight: 700, fontSize: 10 }}>J</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>Demo Student</div>
                        <div style={{ fontSize: 11, color: "#999" }}>Student portal access</div>
                      </div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: "#FEF9C3", color: "#A16207" }}>Pro</span>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 11, color: "#888" }}>
                    <span>jordan@stanford.edu</span>
                    <span>student123</span>
                  </div>
                </div>

                <div style={{ fontSize: 10, color: "#bbb", marginTop: 10, textAlign: "center" }}>Click a card to auto-fill credentials</div>
              </div>

              <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888" }}>
                New here?{" "}
                <span style={{ color: "#1a1a2e", fontWeight: 600, cursor: "pointer" }} onClick={() => { setShowLogin(false); setLoginError(""); }}>Create an account</span>
              </div>
            </div>
          )}

          {/* STEP 1: Account */}
          {!showLogin && regStep === 1 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Create Your Account</h2>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Start tracking internships in minutes.</p>

              {apiError && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>
                  {apiError}
                </div>
              )}

              <div style={{ display: "grid", gap: 14 }}>
                {/* Name Fields - First, Middle (optional), Last */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1fr", gap: 12 }}>
                  <div>
                    <Lbl>First Name *</Lbl>
                    <input className="inp" value={regForm.firstName} onChange={(e) => setRegForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="Jordan" style={{ borderColor: regErrors.firstName ? "#DC2626" : undefined }} />
                    <ErrMsg field="firstName" />
                  </div>
                  <div>
                    <Lbl>Middle Name</Lbl>
                    <input className="inp" value={regForm.middleName} onChange={(e) => setRegForm((p) => ({ ...p, middleName: e.target.value }))} placeholder="A." style={{ borderColor: regErrors.middleName ? "#DC2626" : undefined }} />
                    <ErrMsg field="middleName" />
                  </div>
                  <div>
                    <Lbl>Last Name *</Lbl>
                    <input className="inp" value={regForm.lastName} onChange={(e) => setRegForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Rivera" style={{ borderColor: regErrors.lastName ? "#DC2626" : undefined }} />
                    <ErrMsg field="lastName" />
                  </div>
                </div>
                <div>
                  <Lbl>Email Address *</Lbl>
                  <input className="inp" type="email" value={regForm.email} onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))} placeholder="jordan@university.edu" style={{ borderColor: regErrors.email ? "#DC2626" : undefined }} />
                  <ErrMsg field="email" />
                </div>

                {/* Phone Number with MFA Verification */}
                <div>
                  <Lbl>Phone Number (for MFA verification)</Lbl>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="inp"
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => { setRegForm((p) => ({ ...p, phone: e.target.value })); setPhoneVerified(false); setPhoneOtpSent(false); }}
                      placeholder="+1 555-123-4567"
                      style={{ flex: 1, borderColor: regErrors.phone ? "#DC2626" : phoneVerified ? "#059669" : undefined }}
                      disabled={phoneVerified}
                    />
                    {!phoneVerified && !phoneOtpSent && (
                      <button
                        className="btn"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !regForm.phone.trim() || !regForm.email.trim()}
                        style={{ padding: "10px 16px", background: "#1a1a2e", color: "#e8c547", fontSize: 12, whiteSpace: "nowrap" }}
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    )}
                    {phoneVerified && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 12px", background: "#ECFDF5", borderRadius: 10, border: "1px solid #059669", color: "#059669", fontSize: 12, fontWeight: 600 }}>
                        <span style={{ fontSize: 16 }}>✓</span> Verified
                      </div>
                    )}
                  </div>
                  <ErrMsg field="phone" />

                  {/* OTP Input */}
                  {phoneOtpSent && !phoneVerified && (
                    <div style={{ marginTop: 10, padding: 14, background: "#fafaf7", borderRadius: 10, border: "1px solid #e5e3dc" }}>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Enter the 6-digit code sent to your phone:</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          className="inp"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="123456"
                          maxLength={6}
                          style={{ flex: 1, letterSpacing: "0.3em", textAlign: "center", fontWeight: 700, fontSize: 18, borderColor: regErrors.otp ? "#DC2626" : undefined }}
                        />
                        <button
                          className="btn"
                          onClick={handleVerifyOtp}
                          disabled={otpLoading || phoneOtp.length !== 6}
                          style={{ padding: "10px 16px", background: "#059669", color: "#fff", fontSize: 12 }}
                        >
                          {otpLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>
                      <ErrMsg field="otp" />
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                        <span>Code expires in 10 minutes</span>
                        <span style={{ color: "#1a1a2e", cursor: "pointer", fontWeight: 600 }} onClick={handleSendOtp}>Resend OTP</span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <Lbl>State *</Lbl>
                    <select
                      className="inp"
                      value={regForm.state}
                      onChange={(e) => setRegForm((p) => ({ ...p, state: e.target.value, university: "" }))}
                      style={{ borderColor: regErrors.state ? "#DC2626" : undefined, color: regForm.state ? "#1a1a2e" : "#999" }}
                    >
                      <option value="" disabled>Select state...</option>
                      {Object.keys(STATE_UNIVERSITIES).sort().map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <ErrMsg field="state" />
                  </div>
                  <div>
                    <Lbl>University *</Lbl>
                    <select
                      className="inp"
                      value={regForm.university}
                      onChange={(e) => setRegForm((p) => ({ ...p, university: e.target.value }))}
                      disabled={!regForm.state}
                      style={{
                        borderColor: regErrors.university ? "#DC2626" : undefined,
                        color: regForm.university ? "#1a1a2e" : "#999",
                        opacity: regForm.state ? 1 : 0.5,
                      }}
                    >
                      <option value="" disabled>{regForm.state ? "Select university..." : "Select state first"}</option>
                      {regForm.state && STATE_UNIVERSITIES[regForm.state] &&
                        STATE_UNIVERSITIES[regForm.state].map((uni) => (
                          <option key={uni} value={uni}>{uni}</option>
                        ))
                      }
                    </select>
                    <ErrMsg field="university" />
                    {regForm.state && (
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>
                        {STATE_UNIVERSITIES[regForm.state] ? STATE_UNIVERSITIES[regForm.state].length : 0} universities in {regForm.state}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <Lbl>Password *</Lbl>
                    <input className="inp" type="password" value={regForm.password} onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" style={{ borderColor: regErrors.password ? "#DC2626" : undefined }} />
                    <ErrMsg field="password" />
                  </div>
                  <div>
                    <Lbl>Confirm Password *</Lbl>
                    <input className="inp" type="password" value={regForm.confirmPass} onChange={(e) => setRegForm((p) => ({ ...p, confirmPass: e.target.value }))} placeholder="Confirm password" style={{ borderColor: regErrors.confirmPass ? "#DC2626" : undefined }} />
                    <ErrMsg field="confirmPass" />
                  </div>
                </div>
              </div>

              {/* Email verification notice */}
              {emailVerifSent && (
                <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8", fontSize: 12, fontWeight: 500 }}>
                  📧 Verification email sent! Please check your inbox to confirm your email address.
                </div>
              )}

              <button className="btn" disabled={processing} onClick={handleRegister} style={{ width: "100%", marginTop: 24, padding: "14px", background: processing ? "#ccc" : "#1a1a2e", color: "#e8c547", fontSize: 15 }}>
                {processing ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(232,197,71,0.3)", borderTopColor: "#e8c547", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                    Creating Account...
                  </span>
                ) : "Create Account & Continue to Plans"}
              </button>
              <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#888" }}>
                Already have an account? <span style={{ color: "#1a1a2e", fontWeight: 600, cursor: "pointer" }} onClick={() => setShowLogin(true)}>Sign in</span>
              </div>
            </div>
          )}

          {/* STEP 2: Plan Selection */}
          {!showLogin && regStep === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4, textAlign: "center" }}>Choose Your Plan</h2>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 24, textAlign: "center" }}>Start free, upgrade anytime.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={"plan-card" + (selectedPlan === plan.id ? " selected" : "")}
                    onClick={() => setSelectedPlan(plan.id)}
                    style={{ borderColor: selectedPlan === plan.id ? plan.color : "#e5e3dc", background: selectedPlan === plan.id ? plan.bg : "#fff" }}
                  >
                    {plan.popular && (
                      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#e8c547", color: "#1a1a2e", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 800, color: plan.color, marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e" }}>
                      {plan.price === 0 ? "Free" : "$" + plan.price}
                      {plan.period && <span style={{ fontSize: 14, fontWeight: 500, color: "#999" }}>{plan.period}</span>}
                    </div>
                    <div style={{ marginTop: 16, textAlign: "left" }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#444", padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#059669", fontWeight: 700, fontSize: 14 }}>+</span> {f}
                        </div>
                      ))}
                      {plan.notIncluded.map((f, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#ccc", padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>-</span> {f}
                        </div>
                      ))}
                    </div>
                    {selectedPlan === plan.id && (
                      <div style={{ marginTop: 14, padding: "6px 14px", borderRadius: 8, background: plan.color, color: plan.id === "free" ? "#fff" : "#1a1a2e", fontSize: 12, fontWeight: 700, display: "inline-block" }}>
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" onClick={() => setRegStep(1)} style={{ padding: "13px 28px", background: "#f5f3ef", color: "#666", fontSize: 14 }}>Back</button>
                <button className="btn" onClick={() => setRegStep(selectedPlan === "free" ? 4 : 3)} style={{ flex: 1, padding: "13px", background: "#1a1a2e", color: "#e8c547", fontSize: 15 }}>
                  {selectedPlan === "free" ? "Start Free" : "Continue to Payment"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {!showLogin && regStep === 3 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Payment Details</h2>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
                {chosenPlan.name} plan - ${chosenPlan.price}{chosenPlan.period}
              </p>

              {/* Payment Method Selection */}
              <Lbl>Payment Method</Lbl>
              <div style={{ display: "grid", gap: 8, marginBottom: 22 }}>
                {PAY_METHODS.map((m) => (
                  <div
                    key={m.id}
                    className={"pay-option" + (payMethod === m.id ? " selected" : "")}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (payMethod === m.id ? "#1a1a2e" : "#ddd"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {payMethod === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a2e" }} />}
                    </div>
                    <PayIcon type={m.icon} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{m.desc}</div>
                    </div>
                    {payMethod === m.id && <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>Active</span>}
                  </div>
                ))}
              </div>

              {/* Card Form */}
              {payMethod === "card" && (
                <div className="fi" style={{ background: "#fafaf7", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid #e5e3dc" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Card Information</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <Lbl>Card Number</Lbl>
                      <input className="inp" value={cardForm.number} onChange={(e) => setCardForm((p) => ({ ...p, number: formatCardNumber(e.target.value) }))} placeholder="4242 4242 4242 4242" maxLength={19} />
                    </div>
                    <div>
                      <Lbl>Cardholder Name</Lbl>
                      <input className="inp" value={cardForm.name} onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))} placeholder="Jordan Rivera" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <Lbl>Expiry</Lbl>
                        <input className="inp" value={cardForm.expiry} onChange={(e) => setCardForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))} placeholder="MM / YY" maxLength={7} />
                      </div>
                      <div>
                        <Lbl>CVV</Lbl>
                        <input className="inp" type="password" value={cardForm.cvv} onChange={(e) => setCardForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 11, color: "#999" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Secured with 256-bit SSL encryption
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {payMethod === "paypal" && (
                <div className="fi" style={{ background: "#fafaf7", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid #e5e3dc" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>PayPal</div>
                  <Lbl>PayPal Email</Lbl>
                  <input className="inp" type="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} placeholder="your@paypal.com" />
                  <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>You will be redirected to PayPal to authorize the payment.</div>
                </div>
              )}

              {/* Apple Pay */}
              {payMethod === "applepay" && (
                <div className="fi" style={{ background: "#fafaf7", borderRadius: 14, padding: 24, marginBottom: 20, border: "1px solid #e5e3dc", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>
                    <PayIcon type="apple" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Apple Pay</div>
                  <div style={{ fontSize: 12, color: "#888" }}>Click Pay to authenticate with Face ID or Touch ID.</div>
                </div>
              )}

              {/* Google Pay */}
              {payMethod === "googlepay" && (
                <div className="fi" style={{ background: "#fafaf7", borderRadius: 14, padding: 24, marginBottom: 20, border: "1px solid #e5e3dc", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>
                    <PayIcon type="google" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Google Pay</div>
                  <div style={{ fontSize: 12, color: "#888" }}>You will be prompted to select a payment method from Google Pay.</div>
                </div>
              )}

              {/* Bank Transfer */}
              {payMethod === "bank" && (
                <div className="fi" style={{ background: "#fafaf7", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid #e5e3dc" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Bank Transfer (ACH)</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <Lbl>Routing Number</Lbl>
                      <input className="inp" placeholder="021000021" maxLength={9} />
                    </div>
                    <div>
                      <Lbl>Account Number</Lbl>
                      <input className="inp" placeholder="123456789" />
                    </div>
                    <div>
                      <Lbl>Account Holder Name</Lbl>
                      <input className="inp" placeholder="Jordan Rivera" />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 18, marginBottom: 20, color: "#fff" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#e8c547" }}>Order Summary</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span>{chosenPlan.name} Plan (Monthly)</span>
                  <span>${chosenPlan.price.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "#999" }}>
                  <span>Tax</span><span>$0.00</span>
                </div>
                <div style={{ borderTop: "1px solid #333", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
                  <span>Total</span><span style={{ color: "#e8c547" }}>${chosenPlan.price.toFixed(2)}/mo</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" onClick={() => setRegStep(2)} style={{ padding: "13px 28px", background: "#f5f3ef", color: "#666", fontSize: 14 }}>Back</button>
                <button className="btn" disabled={processing} onClick={handlePayment} style={{ flex: 1, padding: "13px", background: processing ? "#ccc" : "#059669", color: "#fff", fontSize: 15 }}>
                  {processing ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                      Processing Payment...
                    </span>
                  ) : (
                    "Pay $" + chosenPlan.price.toFixed(2) + "/mo"
                  )}
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#999" }}>
                Cancel anytime. 14-day money-back guarantee.
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation */}
          {!showLogin && regStep === 4 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "checkmark 0.5s ease both" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>You are all set!</h2>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>
                Welcome to InternTrack, {regForm.firstName}!
              </p>
              <div style={{ display: "inline-block", padding: "8px 20px", borderRadius: 10, background: chosenPlan.bg, border: "1px solid " + chosenPlan.border, marginBottom: 20 }}>
                <span style={{ fontWeight: 700, color: chosenPlan.color, fontSize: 15 }}>{chosenPlan.name} Plan</span>
                {chosenPlan.price > 0 && <span style={{ color: "#888", fontSize: 13 }}> - ${chosenPlan.price}/mo</span>}
              </div>
              <div style={{ background: "#fafaf7", borderRadius: 12, padding: 18, marginBottom: 24, textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: "#1a1a2e" }}>What you get:</div>
                {chosenPlan.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#444", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#059669", fontWeight: 700 }}>+</span> {f}
                  </div>
                ))}
              </div>
              <button className="btn" onClick={finishRegistration} style={{ width: "100%", padding: "14px", background: "#1a1a2e", color: "#e8c547", fontSize: 15 }}>
                Launch Dashboard
              </button>
            </div>
          )}
        </div>

        <div style={{ color: "#555", fontSize: 11, marginTop: 20 }}>
          Secure checkout powered by Stripe
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN APP (after registration)
     ═══════════════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F3", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{CSS}</style>

      {toast && (
        <div className="fi" style={{ position: "fixed", top: 16, right: 16, zIndex: 999, padding: "12px 20px", borderRadius: 11, background: "#1a1a2e", color: "#e8c547", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,.18)" }}>{toast}</div>
      )}

      {/* HEADER */}
      <header style={{ background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 54, borderBottom: "3px solid " + accent }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#e8c547,#d4a437)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#1a1a2e", fontSize: 12 }}>IN</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>InternTrack</div>
            <div style={{ color: accent, fontSize: 8, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{view === "admin" ? "Admin Panel" : "Student Portal"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 2 }}>
            <button className="btn" onClick={() => setView("student")} style={{ padding: "5px 12px", fontSize: 11, background: view === "student" ? "#e8c547" : "transparent", color: view === "student" ? "#1a1a2e" : "#999", borderRadius: 6 }}>Student</button>
            <button className="btn" onClick={() => setView("admin")} style={{ padding: "5px 12px", fontSize: 11, background: view === "admin" ? "#7C3AED" : "transparent", color: view === "admin" ? "#fff" : "#999", borderRadius: 6 }}>Admin</button>
          </div>
          <PlanBadge plan={chosenPlan.name} />
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", color: view === "admin" ? "#fff" : "#1a1a2e", fontWeight: 700, fontSize: 11 }}>
            {view === "admin" ? "A" : (profile.name ? profile.name[0].toUpperCase() : "?")}
          </div>
          <button className="btn" onClick={handleLogout} style={{ padding: "6px 14px", fontSize: 11, background: "rgba(220,38,38,0.15)", color: "#f87171", borderRadius: 7, display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e5e3dc", padding: "0 8px", overflowX: "auto" }}>
        {navTabs.map((t) => (
          <button key={t.id} onClick={() => setCurrentTab(t.id)} className="btn" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", background: "none",
            color: currentTab === t.id ? "#1a1a2e" : "#999", fontWeight: currentTab === t.id ? 700 : 500, fontSize: 12,
            borderBottom: currentTab === t.id ? "3px solid " + accent : "3px solid transparent", borderRadius: 0, whiteSpace: "nowrap",
          }}>
            <span style={{ width: 20, height: 20, borderRadius: 5, background: currentTab === t.id ? accent : "#eee", color: currentTab === t.id ? (view === "admin" ? "#fff" : "#1a1a2e") : "#999", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{t.i}</span>
            {t.l}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main className="fi" key={view + currentTab} style={{ maxWidth: 1000, margin: "0 auto", padding: "22px 16px 80px" }}>

        {/* === STUDENT: PROFILE === */}
        {view === "student" && tab === "profile" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>Your Profile</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Complete your profile to improve matching.</p>
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#1a1a2e,#2d2d4e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c547", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>{profile.name ? profile.name[0].toUpperCase() : "?"}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.name || "Your Name"}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{profile.university || "University"} - Class of {profile.gradYear}</div>
                <PlanBadge plan={chosenPlan.name} />
                {saved && <span style={{ color: "#059669", fontSize: 11, fontWeight: 600, marginLeft: 8 }}>Saved</span>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ k: "name", l: "Full Name", p: "Jordan Rivera" }, { k: "email", l: "Email", p: "jordan@uni.edu" }, { k: "phone", l: "Phone", p: "+1 555-123-4567" }, { k: "university", l: "University", p: "Stanford" }, { k: "major", l: "Major", p: "Computer Science" }, { k: "gpa", l: "GPA", p: "3.85" }, { k: "gradYear", l: "Grad Year", p: "2027" }, { k: "linkedin", l: "LinkedIn", p: "linkedin.com/in/you" }].map((f) => (
                <div key={f.k}><Lbl>{f.l}</Lbl><input className="inp" value={profile[f.k]} onChange={(e) => setProfile((p) => ({ ...p, [f.k]: e.target.value }))} placeholder={f.p} /></div>
              ))}
              <div style={{ gridColumn: "1/-1" }}><Lbl>Skills</Lbl><input className="inp" value={profile.skills} onChange={(e) => setProfile((p) => ({ ...p, skills: e.target.value }))} placeholder="Python, React, SQL..." /></div>
              <div style={{ gridColumn: "1/-1" }}><Lbl>Industries</Lbl><input className="inp" value={profile.industries} onChange={(e) => setProfile((p) => ({ ...p, industries: e.target.value }))} placeholder="Technology, Finance..." /></div>
              <div style={{ gridColumn: "1/-1" }}><Lbl>Bio</Lbl><textarea className="inp" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} placeholder="Brief bio..." rows={2} /></div>
            </div>
            <button className="btn" onClick={() => { setSaved(true); notify("Profile saved!"); }} style={{ marginTop: 18, padding: "12px 32px", background: "#1a1a2e", color: "#e8c547", fontSize: 14 }}>Save Profile</button>
          </div>
        )}

        {/* === STUDENT: RESUME === */}
        {view === "student" && tab === "resume" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Resume Upload</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Upload for auto skill extraction.</p>

            {/* Previously uploaded resumes */}
            {resumeLoading && <div style={{ textAlign: "center", color: "#888", padding: 20, fontSize: 13 }}>Loading your resumes...</div>}
            {savedResumes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#1a1a2e" }}>Your Resumes</div>
                {savedResumes.map((r) => (
                  <div key={r.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#15803d" }}>
                        {r.mimeType === "application/pdf" ? "P" : "W"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{r.fileName}</div>
                        <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>
                          {(r.fileSize / 1024).toFixed(1)} KB &middot; {new Date(r.createdAt).toLocaleDateString()} &middot;
                          <span style={{ color: r.parseStatus === "COMPLETED" ? "#059669" : "#d97706", fontWeight: 600 }}> {r.parseStatus === "COMPLETED" ? "Parsed" : r.parseStatus}</span>
                        </div>
                        {r.extractedSkills && r.extractedSkills.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                            {r.extractedSkills.slice(0, 6).map((s, i) => <span key={i} className="chip" style={{ fontSize: 10, padding: "1px 6px" }}>{s}</span>)}
                            {r.extractedSkills.length > 6 && <span style={{ fontSize: 10, color: "#888" }}>+{r.extractedSkills.length - 6} more</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteResume(r.id); }}
                      disabled={deletingId === r.id}
                      style={{ background: "none", border: "1px solid #fca5a5", color: "#dc2626", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: deletingId === r.id ? "not-allowed" : "pointer", opacity: deletingId === r.id ? 0.5 : 1 }}
                    >
                      {deletingId === r.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <div className="card" onClick={() => fileRef.current && fileRef.current.click()} style={{ textAlign: "center", padding: 40, cursor: "pointer", border: resumeFile ? "2px solid #86EFAC" : "2px dashed #d4d0c8", background: resumeFile ? "#f0fdf4" : "#fff" }}>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={onResume} style={{ display: "none" }} />
              <div style={{ fontSize: 36, marginBottom: 8 }}>{resumeFile ? "+" : "^"}</div>
              {resumeFile
                ? <div><div style={{ fontWeight: 700, color: "#15803d" }}>{resumeFile.name}</div><div style={{ color: "#888", fontSize: 12, marginTop: 3 }}>{(resumeFile.size / 1024).toFixed(1)} KB</div></div>
                : <div><div style={{ fontWeight: 700 }}>{savedResumes.length > 0 ? "Upload another resume" : "Click to upload resume"}</div><div style={{ color: "#888", fontSize: 12, marginTop: 3 }}>PDF, DOC, DOCX (max 5 MB)</div></div>
              }
            </div>
            {parsed && (
              <div className="card fi" style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>AI-Extracted Info <span style={{ fontSize: 11, color: "#059669", background: "#ecfdf5", padding: "3px 9px", borderRadius: 6 }}>Auto</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div><Lbl>Skills</Lbl><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{profile.skills.split(", ").map((s, i) => <span key={i} className="chip">{s}</span>)}</div></div>
                  <div><Lbl>Industries</Lbl><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{profile.industries.split(", ").map((s, i) => <span key={i} className="chip" style={{ background: "#fefce8", borderColor: "#fde68a", color: "#92400e" }}>{s}</span>)}</div></div>
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", borderRadius: 9, fontSize: 12, color: "#065f46" }}>
                  Parsed! <span onClick={() => setTab("discover")} style={{ color: "#047857", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>View matches</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === STUDENT: DISCOVER === */}
        {view === "student" && tab === "discover" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Discover Internships</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>One-click apply.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              <input className="inp" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ flex: 1, minWidth: 180 }} />
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{industries.map((ind) => <button key={ind} className="btn" onClick={() => setFilter(ind)} style={{ padding: "7px 12px", fontSize: 11, background: filter === ind ? "#1a1a2e" : "#fff", color: filter === ind ? "#e8c547" : "#888", border: filter === ind ? "none" : "1px solid #e5e3dc" }}>{ind}</button>)}</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {filtered.map((c) => (
                <div key={c.id} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: c.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{c.logo}</div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span><span style={{ padding: "2px 7px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: c.match >= 90 ? "#dcfce7" : "#fef9c3", color: c.match >= 90 ? "#15803d" : "#a16207" }}>{c.match}%</span></div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{c.industry} | {c.location} | {c.deadline}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 }}>{c.roles.map((r, i) => <span key={i} className="chip">{r}</span>)}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0, minWidth: 110 }}>
                    {applied.has(c.id) ? <div style={{ padding: "8px 14px", borderRadius: 9, background: "#ecfdf5", color: "#065f46", fontWeight: 700, fontSize: 12, textAlign: "center" }}>Applied</div>
                      : applyingId === c.id ? <div className="anim-pulse" style={{ padding: "8px 14px", borderRadius: 9, background: "#fefce8", color: "#a16207", fontWeight: 600, fontSize: 12, textAlign: "center" }}>Applying...</div>
                        : <div><button className="btn" onClick={() => doApply(c, "Direct")} style={{ padding: "8px 14px", background: "#1a1a2e", color: "#e8c547", fontSize: 12, width: "100%", marginBottom: 5 }}>Apply Direct</button><button className="btn" onClick={() => doApply(c, "LinkedIn")} style={{ padding: "8px 14px", background: "#0a66c2", color: "#fff", fontSize: 12, width: "100%" }}>LinkedIn</button></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === STUDENT: TRACKER === */}
        {view === "student" && tab === "tracker" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              <div><h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Tracker</h1><p style={{ color: "#888", fontSize: 13 }}>All applications.</p></div>
              <div style={{ display: "flex", gap: 8 }}>{[{ l: "Total", v: apps.length, c: "#1a1a2e" }, { l: "Interviews", v: apps.filter((a) => a.status === "Interview").length, c: "#15803d" }, { l: "Offers", v: apps.filter((a) => a.status === "Offer").length, c: "#047857" }].map((s, i) => <div key={i} style={{ padding: "7px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e5e3dc", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 9, fontWeight: 600, color: "#999", textTransform: "uppercase" }}>{s.l}</div></div>)}</div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>{apps.map((a) => <div key={a.id} className="card" style={{ display: "flex", gap: 12, alignItems: "center", padding: 16 }}><div style={{ width: 38, height: 38, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{a.logo}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{a.company}</div><div style={{ fontSize: 11, color: "#888" }}>{a.role}</div><div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{a.date} via {a.portal}</div></div><Badge status={a.status} /></div>)}</div>
          </div>
        )}

        {/* === STUDENT: INBOX === */}
        {view === "student" && tab === "inbox" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              <div><h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Feedback Inbox</h1><p style={{ color: "#888", fontSize: 13 }}>Gmail MCP integration.</p></div>
              {gmailOk && <button className="btn" onClick={connectGmail} style={{ padding: "8px 14px", background: "#fff", border: "1px solid #e5e3dc", fontSize: 12 }}>Refresh</button>}
            </div>
            {!gmailOk ? (
              <div className="card" style={{ textAlign: "center", padding: 44, border: "2px dashed #e5e3dc" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>@</div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Connect Gmail via MCP</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 5, maxWidth: 320, marginLeft: "auto", marginRight: "auto", marginBottom: 18 }}>Scan inbox for recruitment feedback.</div>
                <button className="btn" onClick={connectGmail} disabled={gmailLoading} style={{ padding: "12px 26px", background: gmailLoading ? "#ccc" : "#1a1a2e", color: "#e8c547", fontSize: 13 }}>{gmailLoading ? "Connecting..." : "Connect Gmail"}</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>{emails.map((em) => (
                <div key={em.id} className="card" style={{ borderLeft: "4px solid " + (em.type === "positive" ? "#059669" : em.type === "negative" ? "#dc2626" : "#d97706") }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div><div style={{ fontWeight: 700, fontSize: 13 }}>{em.company}</div><div style={{ fontSize: 10, color: "#aaa" }}>{em.from}</div></div><span style={{ fontSize: 10, color: "#aaa" }}>{em.date}</span></div>
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{em.subject}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, padding: "9px 12px", borderRadius: 9, background: em.type === "positive" ? "#f0fdf4" : em.type === "negative" ? "#fef2f2" : "#fffbeb", border: "1px solid " + (em.type === "positive" ? "#86efac" : em.type === "negative" ? "#fecaca" : "#fde68a") }}>{em.snippet}</div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {/* === ADMIN: ANALYTICS === */}
        {view === "admin" && adminTab === "dashboard" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Analytics Dashboard</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Platform overview.</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[{ l: "Users", v: users.length, c: "#7C3AED" }, { l: "Apps", v: apps.length, c: "#0668E1" }, { l: "Companies", v: COMPANIES.length, c: "#059669" }, { l: "Offer Rate", v: "18%", c: "#E8C547" }].map((s, i) => <div key={i} className="card" style={{ flex: 1, minWidth: 130 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase" }}>{s.l}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div></div>)}
            </div>
            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Weekly Apps</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>{CHART.map((d, i) => <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#7C3AED" }}>{d.val}</div><div style={{ width: "100%", borderRadius: 6, background: "linear-gradient(to top,#7C3AED,#A78BFA)", height: Math.max(8, (d.val / 30) * 100) }} /><div style={{ fontSize: 10, color: "#999" }}>{d.day}</div></div>)}</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Status Dist.</div>
              {["Applied", "Review", "Interview", "Offer", "Rejected"].map((st) => { const c = apps.filter((a) => a.status === st).length; const sc = STATUS_STYLE[st]; return (<div key={st} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}><div style={{ width: 80, fontSize: 12, color: "#666" }}>{st}</div><div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0eeea", overflow: "hidden" }}><div style={{ width: (c / (apps.length || 1)) * 100 + "%", height: "100%", borderRadius: 4, background: sc.fg }} /></div><div style={{ width: 24, fontSize: 13, fontWeight: 700, textAlign: "right" }}>{c}</div></div>); })}
            </div>
          </div>
        )}

        {/* === ADMIN: USERS === */}
        {view === "admin" && adminTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
              <div><h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Users</h1><p style={{ color: "#888", fontSize: 13 }}>Manage students. {users.length > 0 && <span style={{ fontWeight: 600 }}>{users.length} total</span>}</p></div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input className="inp" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search..." style={{ width: 200, fontSize: 13 }} />
                <button className="btn" onClick={fetchAdminUsers} style={{ padding: "6px 12px", fontSize: 11, background: "#7C3AED", color: "#fff" }}>Refresh</button>
              </div>
            </div>
            {usersLoading && <div style={{ textAlign: "center", color: "#888", padding: 20 }}>Loading users...</div>}
            <div className="card" style={{ padding: 0, overflow: "auto" }}>
              <table className="tbl"><thead><tr><th>User</th><th>Uni</th><th>Plan</th><th>Apps</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{filteredUsers.map((u) => <tr key={u.id}><td><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: "#999" }}>{u.email}</div>{u.phone && <div style={{ fontSize: 10, color: "#aaa" }}>{u.phone}</div>}</td><td>{u.uni}</td><td><PlanBadge plan={u.plan} /></td><td style={{ fontWeight: 600 }}>{u.apps}</td><td style={{ fontSize: 11, color: "#888" }}>{u.joined ? new Date(u.joined).toLocaleDateString() : "-"}</td><td><UserStatusBadge status={u.status} /></td><td><div style={{ display: "flex", gap: 4 }}>{u.status === "Suspended" ? <button className="btn" onClick={() => toggleUserStatus(u.id, u.status)} style={{ padding: "4px 10px", background: "#059669", color: "#fff", fontSize: 11 }}>Activate</button> : <button className="btn" onClick={() => toggleUserStatus(u.id, u.status)} style={{ padding: "4px 10px", background: "#FEF2F2", color: "#B91C1C", fontSize: 11 }}>Suspend</button>}<button className="btn" onClick={() => removeUser(u.id, u.name)} style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", fontSize: 11 }}>Remove</button></div></td></tr>)}</tbody></table>
            </div>
          </div>
        )}

        {/* === ADMIN: APPLICATIONS === */}
        {view === "admin" && adminTab === "applications" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Monitor Applications</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 18 }}>All platform applications.</p>
            <div className="card" style={{ padding: 0, overflow: "auto" }}>
              <table className="tbl"><thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Portal</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>{apps.map((a) => <tr key={a.id}><td>{a.user || "Unknown"}</td><td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 26, height: 26, borderRadius: 6, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 9 }}>{a.logo}</div>{a.company}</div></td><td>{a.role}</td><td><span className="chip">{a.portal}</span></td><td style={{ fontSize: 12, color: "#888" }}>{a.date}</td><td><Badge status={a.status} /></td></tr>)}</tbody></table>
            </div>
          </div>
        )}

        {/* === ADMIN: INGESTION === */}
        {view === "admin" && adminTab === "ingestion" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Data Ingestion</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 18 }}>Import from external sources.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[{ src: "LinkedIn API", color: "#0A66C2" }, { src: "Handshake", color: "#E8C547" }, { src: "CSV Upload", color: "#059669" }].map((s) => (
                <div key={s.src} className="card" style={{ textAlign: "center", padding: 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{s.src}</div>
                  <button className="btn" disabled={ingesting} onClick={() => runIngestion(s.src)} style={{ padding: "9px 18px", background: s.color, color: "#fff", fontSize: 12, width: "100%" }}>{ingesting ? "Running..." : "Import"}</button>
                </div>
              ))}
            </div>
            <div className="card" style={{ background: "#1a1a2e", fontFamily: "monospace" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#e8c547", marginBottom: 10 }}>Log</div>
              <div style={{ maxHeight: 180, overflow: "auto" }}>
                {ingLog.length === 0 && <div style={{ color: "#666", fontSize: 12 }}>No runs yet.</div>}
                {ingLog.map((l, i) => <div key={i} style={{ padding: "5px 0", fontSize: 12, borderBottom: "1px solid #333", display: "flex", gap: 10 }}><span style={{ color: "#888" }}>{l.time}</span><span style={{ color: l.ok ? "#86EFAC" : "#C4B5FD" }}>{l.msg}</span></div>)}
              </div>
            </div>
          </div>
        )}

        {/* === ADMIN: SUBSCRIPTIONS === */}
        {view === "admin" && adminTab === "subscriptions" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Subscriptions</h1>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 18 }}>Revenue and plans.</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {[{ l: "MRR", v: "$340", c: "#059669" }, { l: "Paid", v: users.filter((u) => u.plan !== "Free").length, c: "#7C3AED" }, { l: "Churn", v: "2.1%", c: "#E8C547" }].map((s, i) => <div key={i} className="card" style={{ flex: 1, minWidth: 130 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase" }}>{s.l}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div></div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
              {PLANS.map((plan) => (
                <div key={plan.id} className="card" style={{ borderTop: "4px solid " + plan.color, textAlign: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: plan.color }}>{plan.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{plan.price === 0 ? "Free" : "$" + plan.price + "/mo"}</div>
                  <div style={{ padding: "10px", background: "#fafaf7", borderRadius: 9 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: plan.color }}>{users.filter((u) => u.plan === plan.name).length}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#999", textTransform: "uppercase" }}>Users</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 0, overflow: "auto" }}>
              <table className="tbl"><thead><tr><th>User</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{users.filter((u) => u.plan !== "Free").map((u) => <tr key={u.id}><td><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: "#999" }}>{u.email}</div></td><td><PlanBadge plan={u.plan} /></td><td><UserStatusBadge status={u.status} /></td><td><div style={{ display: "flex", gap: 4 }}><button className="btn" onClick={() => { const n = u.plan === "Pro" ? "Enterprise" : "Pro"; setUsers((p) => p.map((x) => x.id === u.id ? { ...x, plan: n } : x)); notify(u.name + " -> " + n); }} style={{ padding: "4px 10px", background: "#EDE9FE", color: "#7C3AED", fontSize: 11 }}>{u.plan === "Pro" ? "Upgrade" : "Downgrade"}</button><button className="btn" onClick={() => { setUsers((p) => p.map((x) => x.id === u.id ? { ...x, plan: "Free" } : x)); notify(u.name + " cancelled"); }} style={{ padding: "4px 10px", background: "#FEF2F2", color: "#DC2626", fontSize: 11 }}>Cancel</button></div></td></tr>)}</tbody></table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
