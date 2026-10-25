import prepproLogo from "@/assets/preppro-logo.jpg";
import nextToppersLogo from "@/assets/nexttoppers-logo.png";
import pwLogo from "@/assets/pw-logo-new.jpg";
import vibrantLogo from "@/assets/vibrant-logo.png";
import unacademyLogo from "@/assets/unacademy-logo.jpg";

type InfinityApp = {
  id: string;
  title: string;
  label: string;
  description: string;
  details: string[];
  url: string;
  logo: string;
  soon: boolean;
  /** Opens the URL directly (redirect) instead of embedding it in an iframe. */
  direct?: boolean;
  credit?: string;
  telegramHeader?: boolean;
};

export const INFINITY_APPS: InfinityApp[] = [
  { id: "mission-jeet", title: "PrepPro Mission Jeet", label: "Mission Jeet", description: "Your Mission Jeet study portal, together with the PrepPro collection.", details: ["Mission Jeet", "Study portal"], url: "https://mj.eduvibe.cc.cd/", logo: prepproLogo, soon: false, credit: undefined },
  { id: "next-topper", title: "PrepPro Next Topper", label: "Next Topper", description: "Continue your preparation with the Next Topper learning portal.", details: ["Next Topper", "Study portal"], url: "https://eduvibe-nt.pages.dev/", logo: nextToppersLogo, soon: false, credit: undefined },
  { id: "pw", title: "PrepPro Physics Wallah", label: "Physics Wallah", description: "Explore Physics Wallah batches and choose your next step in preparation.", details: ["Physics Wallah", "Batches"], url: "https://preppronetworkpw.xyz/", logo: pwLogo, soon: false, direct: true },
  { id: "vibrant-academy", title: "PrepPro Vibrant Academy", label: "Vibrant Academy", description: "Keep your Vibrant Academy study portal close, in PrepPro Infinity.", details: ["Vibrant Academy", "Study portal"], url: "https://va.eduvibe.cc.cd/", logo: vibrantLogo, soon: true, credit: undefined },
  { id: "unacademy-batches", title: "Unacademy Batches", label: "Unacademy Batches", description: "Explore Unacademy batch categories and find the classes for your preparation.", details: ["Unacademy", "Batch categories"], url: "https://nexthope.pages.dev/uncoffline/", logo: unacademyLogo, soon: false, telegramHeader: true },
  { id: "unacademy-teachers", title: "Unacademy Teacher's Batches & Courses", label: "Unacademy Teacher's Batches & Courses", description: "Browse Unacademy goals, teacher batches and courses in one study portal.", details: ["Teacher batches", "Courses & goals"], url: "https://nexthope.pages.dev/unacademy/", logo: unacademyLogo, soon: false, telegramHeader: true },
];