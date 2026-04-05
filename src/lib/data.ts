export interface Chapter {
  id: string;
  title: string;
  lessons: number;
  duration: string;
}

export interface Batch {
  id: string;
  title: string;
  description: string;
  category: "Apps" | "Test Series";
  status: "Live" | "Available";
  image: string;
  externalUrl: string;
  openInternal?: boolean;
  showLoadingAnimation?: boolean;
  openExternalAfterLoading?: boolean;
  chapters: Chapter[];
  featured?: boolean;
}

import pwLogoNew from "@/assets/pw-logo-new.jpg";

// App-specific access codes (only for apps that need them)
export const APP_ACCESS_CODES: Record<string, { code: string; label: string }> = {
  "unacademy-app": { code: "PUSHPARAJ", label: "Use Code" },
};

export const BATCHES: Batch[] = [
  // ──── FEATURED APPS (shown by default) ────
  // ──── FEATURED APPS (shown by default) ────
  {
    id: "pw-app",
    title: "Physics Wallah",
    description: "Access Physics Wallah premium courses and study materials with enhanced features.",
    category: "Apps",
    status: "Live",
    image: pwLogoNew,
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=pw&target=https%3A%2F%2Fpwthor.site%2Fstudy%2Fbatches&title=PW+Portal+1",
    openInternal: false,
    featured: true,
    chapters: [
      { id: "pw-1", title: "JEE Advanced", lessons: 120, duration: "60+ hrs" },
      { id: "pw-2", title: "NEET Advanced", lessons: 110, duration: "55+ hrs" },
      { id: "pw-3", title: "Premium Courses", lessons: 90, duration: "45+ hrs" },
    ],
  },
  {
    id: "next-toppers-app",
    title: "Next Toppers",
    description: "Learn from toppers and get insider tips for cracking competitive exams.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=iframe&source=nexttoppers&target=https%3A%2F%2Fnexttoppers.thescholarverse.site%2F&title=Next+Toppers+Portal",
    openInternal: false,
    featured: true,
    chapters: [
      { id: "nt-1", title: "Topper Strategies", lessons: 30, duration: "15 hrs" },
      { id: "nt-2", title: "Time Management", lessons: 20, duration: "10 hrs" },
      { id: "nt-3", title: "Mock Interviews", lessons: 15, duration: "8 hrs" },
    ],
  },
  {
    id: "unacademy-app",
    title: "Unacademy",
    description: "Access Unacademy courses and study materials for various competitive exams.",
    category: "Apps",
    status: "Live",
    image: "https://i.ibb.co/DLdPGLZ/Green-Modern-Badge-Gardening-Logo-Design.jpg",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=iframe&source=unacademy&target=https%3A%2F%2Funacademy.thescholarverse.site%2F&title=Unacademy+Portal",
    openInternal: false,
    featured: true,
    chapters: [
      { id: "ua-1", title: "JEE Courses", lessons: 80, duration: "40 hrs" },
      { id: "ua-2", title: "NEET Courses", lessons: 70, duration: "35 hrs" },
      { id: "ua-3", title: "UPSC Courses", lessons: 90, duration: "45 hrs" },
    ],
  },
  {
    id: "vibrant-academy-app",
    title: "CW / Vibrant Academy",
    description: "Vibrant Academy premium content for JEE & competitive exam preparation.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=vibrant&target=https%3A%2F%2Fdeltastudy.site%2Fvibrant&title=Vibrant+Portal",
    openInternal: false,
    featured: true,
    chapters: [
      { id: "va-1", title: "JEE Advanced", lessons: 60, duration: "30 hrs" },
      { id: "va-2", title: "JEE Main", lessons: 50, duration: "25 hrs" },
    ],
  },
  // ──── MORE APPS (hidden behind "Get More Apps") ────
  {
    id: "mission-jeet-app",
    title: "Mission JEET",
    description: "Mission JEET - Focused JEE preparation with expert guidance and strategies.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=iframe&source=missionjeet&target=https%3A%2F%2Fmissionjeet.thescholarverse.site%2F&title=Mission+JEET+Portal",
    openInternal: false,
    chapters: [
      { id: "mj-1", title: "JEE Preparation", lessons: 70, duration: "35 hrs" },
    ],
  },
  {
    id: "study-iq-app",
    title: "Study IQ",
    description: "Study IQ resources for government exams, UPSC, SSC and more.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=studyiq&target=https%3A%2F%2Fspidyiq.vercel.app&title=Study+IQ+Portal",
    openInternal: false,
    chapters: [
      { id: "siq-1", title: "Government Exams", lessons: 60, duration: "30 hrs" },
    ],
  },
  {
    id: "raw-app",
    title: "RWA",
    description: "Premium content for defence exam preparation including NDA, CDS, and AFCAT.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=rwa&target=https%3A%2F%2Fspidyuniverserwa.vercel.app&title=RWA+Portal",
    openInternal: false,
    chapters: [
      { id: "raw-1", title: "NDA Preparation", lessons: 60, duration: "30 hrs" },
      { id: "raw-2", title: "CDS Preparation", lessons: 50, duration: "25 hrs" },
    ],
  },
  {
    id: "kgs-app",
    title: "Khan Global Studies",
    description: "Khan Global Studies resources for UPSC, SSC and state-level exams.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=kgs&target=https%3A%2F%2Fspidykgs.vercel.app&title=Khan+Global+Studies+Portal",
    openInternal: false,
    chapters: [
      { id: "kgs-1", title: "UPSC Prelims", lessons: 80, duration: "40 hrs" },
    ],
  },
  {
    id: "selection-way-app",
    title: "Selection Way",
    description: "Comprehensive study materials for various government job examinations.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=selectionway&target=https%3A%2F%2Fspidyway.vercel.app&title=Selection+Way+Portal",
    openInternal: false,
    chapters: [
      { id: "sw-1", title: "Railway Exams", lessons: 50, duration: "25 hrs" },
    ],
  },
  {
    id: "cds-app",
    title: "CDS Journey",
    description: "Specialized preparation for Combined Defence Services examination.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1579187707643-35646d22b596?w=800&q=80",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=cdsjourney&target=https%3A%2F%2Fspidycds.vercel.app&title=CDS+Journey+Portal",
    openInternal: false,
    chapters: [
      { id: "cds-1", title: "English", lessons: 40, duration: "20 hrs" },
    ],
  },
  {
    id: "revision-course-app",
    title: "Revision Course",
    description: "Free comprehensive revision course for JEE preparation by JEE Simplified.",
    category: "Apps",
    status: "Live",
    image: "https://i.ibb.co/B5QnJLg/IMG-20251201-212624-980-2.jpg",
    externalUrl: "coming-soon",
    openInternal: false,
    chapters: [
      { id: "rc-1", title: "Physics Revision", lessons: 40, duration: "20 hrs" },
    ],
  },
  {
    id: "sarvam-neet-app",
    title: "Sarvam Neet",
    description: "Comprehensive NEET preparation platform with quality study materials.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    externalUrl: "coming-soon",
    openInternal: false,
    chapters: [
      { id: "sn-1", title: "Biology", lessons: 80, duration: "40 hrs" },
    ],
  },
  {
    id: "utkarsh-app",
    title: "Utkarsh",
    description: "Utkarsh Classes - Premium coaching for competitive exams.",
    category: "Apps",
    status: "Live",
    image: "/src/assets/utkarsh-logo.jpeg",
    externalUrl: "https://prepproportals.lovable.app/portal-access?mode=external&source=utkarsh&target=https%3A%2F%2Fspidyutkarsh.vercel.app&title=Utkarsh+Portal",
    openInternal: false,
    chapters: [
      { id: "ut-1", title: "Complete Courses", lessons: 100, duration: "50 hrs" },
    ],
  },
  {
    id: "rj-vikramjeet-app",
    title: "RJ VIKRAMJEET",
    description: "RG Vikramjeet App for comprehensive exam preparation.",
    category: "Apps",
    status: "Live",
    image: "/src/assets/rj-vikramjeet-logo.png",
    externalUrl: "coming-soon",
    openInternal: false,
    chapters: [
      { id: "rj-1", title: "Complete Courses", lessons: 50, duration: "25 hrs" },
    ],
  },
  // ──── TEST SERIES ────
  {
    id: "pw-test-series",
    title: "PW Test Series",
    description: "Physics Wallah Test Series for JEE and NEET preparation in CBT format.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    externalUrl: "http://PwPrepPro.lovable.app",
    openInternal: false,
    chapters: [
      { id: "pwts-1", title: "JEE Tests", lessons: 50, duration: "25 hrs" },
      { id: "pwts-2", title: "NEET Tests", lessons: 50, duration: "25 hrs" },
    ],
  },
  {
    id: "mathango-test",
    title: "Mathango Test Series",
    description: "25 Full Length Mock Tests for JEE MAINS Preparation with video solutions.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80",
    externalUrl: "/mathango-tests",
    openInternal: true,
    chapters: [
      { id: "mt-1", title: "JEE Main Tests", lessons: 25, duration: "75 hrs" },
    ],
  },
  {
    id: "pyq-cbt-test",
    title: "PYQs (CBT)",
    description: "Practice Previous Year Questions in Computer Based Test format for JEE & NEET.",
    category: "Test Series",
    status: "Available",
    image: "https://i.ibb.co/B5QnJLg/IMG-20251201-212624-980-2.jpg",
    externalUrl: "https://www.acrolly.com/full-test-selection",
    openInternal: true,
    chapters: [
      { id: "pyq-1", title: "JEE Main PYQs", lessons: 50, duration: "25 hrs" },
      { id: "pyq-2", title: "JEE Advanced PYQs", lessons: 40, duration: "20 hrs" },
      { id: "pyq-3", title: "NEET PYQs", lessons: 60, duration: "30 hrs" },
    ],
  },
  {
    id: "chapter-wise-test",
    title: "Chapter Wise Test / PYQs",
    description: "Chapter-wise tests and PYQs for targeted practice and revision.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    externalUrl: "https://www.acrolly.com/chapter-selection",
    openInternal: true,
    chapters: [
      { id: "cw-1", title: "Physics Chapters", lessons: 40, duration: "20 hrs" },
      { id: "cw-2", title: "Chemistry Chapters", lessons: 40, duration: "20 hrs" },
      { id: "cw-3", title: "Maths Chapters", lessons: 40, duration: "20 hrs" },
    ],
  },
  {
    id: "vots-test",
    title: "VOTS-2 Test Series",
    description: "Full Syllabus Mock Tests for JEE MAINS with detailed analysis and solutions.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    externalUrl: "/vots-tests",
    openInternal: true,
    chapters: [
      { id: "vots-1", title: "Full Syllabus Tests", lessons: 7, duration: "21 hrs" },
    ],
  },
];

export const CATEGORIES = ["All", "Apps", "Test Series"] as const;
export type Category = (typeof CATEGORIES)[number];

export const getBatchById = (id: string): Batch | undefined => {
  return BATCHES.find((batch) => batch.id === id);
};

export const getBatchesByCategory = (category: Category): Batch[] => {
  if (category === "All") return BATCHES;
  return BATCHES.filter((batch) => batch.category === category);
};
