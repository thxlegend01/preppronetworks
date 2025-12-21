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
  category: "JEE" | "NEET" | "NDA" | "CDS";
  duration: string;
  students: string;
  rating: number;
  price: string;
  originalPrice: string;
  badge: string;
  badgeVariant: "default" | "secondary" | "outline";
  status: "Live" | "Recorded";
  image: string;
  instructor: string;
  chapters: Chapter[];
}

export const BATCHES: Batch[] = [
  {
    id: "jee-main-2025-crash",
    title: "JEE Main 2025 Crash Course",
    description: "Intensive 3-month program covering complete JEE Main syllabus with daily live classes and tests.",
    category: "JEE",
    duration: "3 Months",
    students: "500+",
    rating: 4.8,
    price: "₹9,999",
    originalPrice: "₹14,999",
    badge: "Popular",
    badgeVariant: "default",
    status: "Live",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    instructor: "Dr. Rajesh Kumar",
    chapters: [
      { id: "phy-1", title: "Physics - Mechanics", lessons: 24, duration: "12 hrs" },
      { id: "phy-2", title: "Physics - Electromagnetism", lessons: 20, duration: "10 hrs" },
      { id: "chem-1", title: "Chemistry - Physical Chemistry", lessons: 18, duration: "9 hrs" },
      { id: "chem-2", title: "Chemistry - Organic Chemistry", lessons: 22, duration: "11 hrs" },
      { id: "math-1", title: "Mathematics - Calculus", lessons: 26, duration: "13 hrs" },
      { id: "math-2", title: "Mathematics - Algebra", lessons: 20, duration: "10 hrs" },
    ],
  },
  {
    id: "jee-advanced-foundation",
    title: "JEE Advanced Foundation",
    description: "Complete foundation course for JEE Advanced with in-depth problem solving and concept building.",
    category: "JEE",
    duration: "6 Months",
    students: "300+",
    rating: 4.9,
    price: "₹19,999",
    originalPrice: "₹29,999",
    badge: "Best Value",
    badgeVariant: "secondary",
    status: "Live",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    instructor: "Prof. Amit Sharma",
    chapters: [
      { id: "adv-phy-1", title: "Advanced Physics - Waves & Optics", lessons: 28, duration: "14 hrs" },
      { id: "adv-phy-2", title: "Advanced Physics - Thermodynamics", lessons: 22, duration: "11 hrs" },
      { id: "adv-chem-1", title: "Advanced Chemistry - Inorganic", lessons: 24, duration: "12 hrs" },
      { id: "adv-math-1", title: "Advanced Math - Coordinate Geometry", lessons: 26, duration: "13 hrs" },
    ],
  },
  {
    id: "neet-2025-complete",
    title: "NEET 2025 Complete",
    description: "Comprehensive NEET preparation with Biology focus, Physics, Chemistry and mock tests.",
    category: "NEET",
    duration: "12 Months",
    students: "800+",
    rating: 4.7,
    price: "₹24,999",
    originalPrice: "₹39,999",
    badge: "New",
    badgeVariant: "outline",
    status: "Live",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    instructor: "Dr. Priya Singh",
    chapters: [
      { id: "bio-1", title: "Biology - Cell Biology & Genetics", lessons: 30, duration: "15 hrs" },
      { id: "bio-2", title: "Biology - Human Physiology", lessons: 28, duration: "14 hrs" },
      { id: "bio-3", title: "Biology - Ecology & Environment", lessons: 20, duration: "10 hrs" },
      { id: "neet-phy", title: "Physics for NEET", lessons: 24, duration: "12 hrs" },
      { id: "neet-chem", title: "Chemistry for NEET", lessons: 24, duration: "12 hrs" },
    ],
  },
  {
    id: "neet-biology-master",
    title: "NEET Biology Master Class",
    description: "Deep dive into Biology with detailed explanations of all NCERT concepts and previous year questions.",
    category: "NEET",
    duration: "4 Months",
    students: "650+",
    rating: 4.8,
    price: "₹7,999",
    originalPrice: "₹12,999",
    badge: "Trending",
    badgeVariant: "default",
    status: "Recorded",
    image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=800&q=80",
    instructor: "Dr. Meena Agarwal",
    chapters: [
      { id: "ncert-11", title: "Class 11 NCERT Biology", lessons: 35, duration: "18 hrs" },
      { id: "ncert-12", title: "Class 12 NCERT Biology", lessons: 32, duration: "16 hrs" },
      { id: "pyq-bio", title: "Previous Year Questions Analysis", lessons: 15, duration: "8 hrs" },
    ],
  },
  {
    id: "nda-complete-2025",
    title: "NDA 2025 Complete Course",
    description: "Complete preparation for NDA written exam covering Mathematics and GAT with physical training guidance.",
    category: "NDA",
    duration: "6 Months",
    students: "450+",
    rating: 4.6,
    price: "₹12,999",
    originalPrice: "₹19,999",
    badge: "Defence",
    badgeVariant: "secondary",
    status: "Live",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    instructor: "Maj. Vikram Rathore (Retd.)",
    chapters: [
      { id: "nda-math", title: "NDA Mathematics", lessons: 40, duration: "20 hrs" },
      { id: "nda-gat-eng", title: "GAT - English", lessons: 20, duration: "10 hrs" },
      { id: "nda-gat-gk", title: "GAT - General Knowledge", lessons: 25, duration: "12 hrs" },
      { id: "nda-gat-science", title: "GAT - Science", lessons: 22, duration: "11 hrs" },
      { id: "nda-ssb", title: "SSB Interview Preparation", lessons: 15, duration: "8 hrs" },
    ],
  },
  {
    id: "nda-maths-intensive",
    title: "NDA Maths Intensive",
    description: "Focused Mathematics preparation for NDA with shortcuts, tricks and extensive practice sets.",
    category: "NDA",
    duration: "3 Months",
    students: "280+",
    rating: 4.7,
    price: "₹5,999",
    originalPrice: "₹8,999",
    badge: "Fast Track",
    badgeVariant: "outline",
    status: "Recorded",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&q=80",
    instructor: "Capt. Suresh Yadav (Retd.)",
    chapters: [
      { id: "nda-algebra", title: "Algebra & Matrices", lessons: 18, duration: "9 hrs" },
      { id: "nda-trig", title: "Trigonometry", lessons: 15, duration: "7 hrs" },
      { id: "nda-calc", title: "Calculus Basics", lessons: 12, duration: "6 hrs" },
      { id: "nda-geo", title: "Geometry & Mensuration", lessons: 14, duration: "7 hrs" },
    ],
  },
  {
    id: "cds-2025-complete",
    title: "CDS 2025 Complete Course",
    description: "Full preparation for CDS exam with English, GK, and Elementary Mathematics coverage.",
    category: "CDS",
    duration: "5 Months",
    students: "320+",
    rating: 4.5,
    price: "₹11,999",
    originalPrice: "₹17,999",
    badge: "Officer",
    badgeVariant: "default",
    status: "Live",
    image: "https://images.unsplash.com/photo-1579187707643-35646d22b596?w=800&q=80",
    instructor: "Lt. Col. Raghav Menon (Retd.)",
    chapters: [
      { id: "cds-eng", title: "English - Grammar & Comprehension", lessons: 25, duration: "12 hrs" },
      { id: "cds-gk-hist", title: "GK - History & Polity", lessons: 22, duration: "11 hrs" },
      { id: "cds-gk-geo", title: "GK - Geography & Economics", lessons: 18, duration: "9 hrs" },
      { id: "cds-math", title: "Elementary Mathematics", lessons: 30, duration: "15 hrs" },
      { id: "cds-current", title: "Current Affairs", lessons: 20, duration: "10 hrs" },
    ],
  },
  {
    id: "cds-gk-special",
    title: "CDS GK Special Batch",
    description: "Specialized General Knowledge course for CDS with focus on current affairs and static GK.",
    category: "CDS",
    duration: "2 Months",
    students: "180+",
    rating: 4.6,
    price: "₹3,999",
    originalPrice: "₹6,999",
    badge: "Quick Prep",
    badgeVariant: "secondary",
    status: "Recorded",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    instructor: "Prof. Sanjay Trivedi",
    chapters: [
      { id: "cds-static-gk", title: "Static GK Essentials", lessons: 20, duration: "10 hrs" },
      { id: "cds-current-affairs", title: "Current Affairs Last 6 Months", lessons: 12, duration: "6 hrs" },
      { id: "cds-gk-practice", title: "GK Practice Sets", lessons: 10, duration: "5 hrs" },
    ],
  },
];

export const CATEGORIES = ["All", "JEE", "NEET", "NDA", "CDS"] as const;
export type Category = typeof CATEGORIES[number];

export const getBatchById = (id: string): Batch | undefined => {
  return BATCHES.find((batch) => batch.id === id);
};

export const getBatchesByCategory = (category: Category): Batch[] => {
  if (category === "All") return BATCHES;
  return BATCHES.filter((batch) => batch.category === category);
};
