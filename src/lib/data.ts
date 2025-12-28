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
  chapters: Chapter[];
}

export const BATCHES: Batch[] = [
  {
    id: "pw-app",
    title: "PW App",
    description: "Access Physics Wallah courses and study materials for JEE, NEET and other competitive exams.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    externalUrl: "http://Pw.theeduverse.xyz/deltakeyping",
    openInternal: true,
    chapters: [
      { id: "pw-1", title: "JEE Courses", lessons: 100, duration: "50+ hrs" },
      { id: "pw-2", title: "NEET Courses", lessons: 100, duration: "50+ hrs" },
      { id: "pw-3", title: "Foundation Courses", lessons: 80, duration: "40+ hrs" },
    ],
  },
  {
    id: "raw-app",
    title: "RAW App",
    description: "Premium content for defence exam preparation including NDA, CDS, and AFCAT.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    externalUrl: "https://spidyuniverserwa.vercel.app",
    chapters: [
      { id: "raw-1", title: "NDA Preparation", lessons: 60, duration: "30 hrs" },
      { id: "raw-2", title: "CDS Preparation", lessons: 50, duration: "25 hrs" },
      { id: "raw-3", title: "AFCAT Preparation", lessons: 40, duration: "20 hrs" },
    ],
  },
  {
    id: "kgs-app",
    title: "KGS App",
    description: "Khan Global Studies resources for UPSC, SSC and state-level exams.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    externalUrl: "https://spidykgs.vercel.app",
    chapters: [
      { id: "kgs-1", title: "UPSC Prelims", lessons: 80, duration: "40 hrs" },
      { id: "kgs-2", title: "SSC CGL", lessons: 60, duration: "30 hrs" },
      { id: "kgs-3", title: "State PSC", lessons: 50, duration: "25 hrs" },
    ],
  },
  {
    id: "selection-way-app",
    title: "Selection Way App",
    description: "Comprehensive study materials for various government job examinations.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    externalUrl: "https://spidyway.vercel.app/",
    chapters: [
      { id: "sw-1", title: "Railway Exams", lessons: 50, duration: "25 hrs" },
      { id: "sw-2", title: "Banking Exams", lessons: 60, duration: "30 hrs" },
      { id: "sw-3", title: "Defence Exams", lessons: 55, duration: "28 hrs" },
    ],
  },
  {
    id: "cds-app",
    title: "CDS App",
    description: "Specialized preparation for Combined Defence Services examination.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1579187707643-35646d22b596?w=800&q=80",
    externalUrl: "https://spidycds.vercel.app",
    chapters: [
      { id: "cds-1", title: "English", lessons: 40, duration: "20 hrs" },
      { id: "cds-2", title: "General Knowledge", lessons: 50, duration: "25 hrs" },
      { id: "cds-3", title: "Mathematics", lessons: 45, duration: "22 hrs" },
    ],
  },
  {
    id: "next-toppers-app",
    title: "Next Toppers App",
    description: "Learn from toppers and get insider tips for cracking competitive exams.",
    category: "Apps",
    status: "Live",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    externalUrl: "https://edu-vibe-nt.vercel.app/",
    chapters: [
      { id: "nt-1", title: "Topper Strategies", lessons: 30, duration: "15 hrs" },
      { id: "nt-2", title: "Time Management", lessons: 20, duration: "10 hrs" },
      { id: "nt-3", title: "Mock Interviews", lessons: 15, duration: "8 hrs" },
    ],
  },
  {
    id: "unacademy-app",
    title: "Unacademy App",
    description: "Access Unacademy courses and study materials for various competitive exams.",
    category: "Apps",
    status: "Live",
    image: "https://i.ibb.co/DLdPGLZ/Green-Modern-Badge-Gardening-Logo-Design.jpg",
    externalUrl: "https://pikachux.netlify.app/",
    openInternal: true,
    chapters: [
      { id: "ua-1", title: "JEE Courses", lessons: 80, duration: "40 hrs" },
      { id: "ua-2", title: "NEET Courses", lessons: 70, duration: "35 hrs" },
      { id: "ua-3", title: "UPSC Courses", lessons: 90, duration: "45 hrs" },
    ],
  },
  {
    id: "revision-course-app",
    title: "Revision Course",
    description: "Free comprehensive revision course for JEE preparation by JEE Simplified.",
    category: "Apps",
    status: "Live",
    image: "https://i.ibb.co/B5QnJLg/IMG-20251201-212624-980-2.jpg",
    externalUrl: "https://jeesimplified.graphy.com/courses/Revision-Course--FREE---69134e88b9d9ff53efb5281d-69134e88b9d9ff53efb5281d",
    chapters: [
      { id: "rc-1", title: "Physics Revision", lessons: 40, duration: "20 hrs" },
      { id: "rc-2", title: "Chemistry Revision", lessons: 40, duration: "20 hrs" },
      { id: "rc-3", title: "Maths Revision", lessons: 40, duration: "20 hrs" },
    ],
  },
  {
    id: "mathango-test-series",
    title: "Mathango Test Series",
    description: "Premium mathematics test series for JEE Main and Advanced preparation.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80",
    externalUrl: "https://drive.google.com/embeddedfolderview?id=1MJI-qE5ZefI1HyzRc6yAOeTqHJyPcRk_#grid",
    openInternal: true,
    chapters: [
      { id: "mt-1", title: "JEE Main Tests", lessons: 50, duration: "25 hrs" },
      { id: "mt-2", title: "JEE Advanced Tests", lessons: 40, duration: "20 hrs" },
      { id: "mt-3", title: "Topic-wise Tests", lessons: 80, duration: "40 hrs" },
    ],
  },
  {
    id: "pyq-cbt-test",
    title: "PYQ in CBT",
    description: "Practice Previous Year Questions in Computer Based Test format for JEE & NEET.",
    category: "Test Series",
    status: "Available",
    image: "https://i.ibb.co/B5QnJLg/IMG-20251201-212624-980-2.jpg",
    externalUrl: "https://novatra.in/exams/",
    chapters: [
      { id: "pyq-1", title: "JEE Main PYQs", lessons: 50, duration: "25 hrs" },
      { id: "pyq-2", title: "JEE Advanced PYQs", lessons: 40, duration: "20 hrs" },
      { id: "pyq-3", title: "NEET PYQs", lessons: 60, duration: "30 hrs" },
    ],
  },
  {
    id: "other-test-series",
    title: "Other Test Series",
    description: "Collection of various test series for multiple competitive examinations.",
    category: "Test Series",
    status: "Available",
    image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80",
    externalUrl: "coming-soon",
    chapters: [
      { id: "ot-1", title: "NEET Test Series", lessons: 60, duration: "30 hrs" },
      { id: "ot-2", title: "NDA Test Series", lessons: 40, duration: "20 hrs" },
      { id: "ot-3", title: "CDS Test Series", lessons: 35, duration: "18 hrs" },
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