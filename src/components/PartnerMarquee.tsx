import pw from "@/assets/pw-logo-new.jpg";
import unacademy from "@/assets/unacademy-logo.jpg";
import nexttoppers from "@/assets/nexttoppers-logo.png";
import vibrant from "@/assets/vibrant-logo.png";
import careerwill from "@/assets/careerwill-logo.png";
import kgs from "@/assets/kgs-logo.png";
import iitschool from "@/assets/iitschool-logo.webp";
import utkarsh from "@/assets/utkarsh-logo.jpeg";
import sarvam from "@/assets/sarvam-logo.jpeg";
import selectionway from "@/assets/selectionway-logo.png";
import rjv from "@/assets/rj-vikramjeet-logo.png";
import raw from "@/assets/raw-logo.jpeg";
import cds from "@/assets/cds-logo.png";
import revision from "@/assets/revision-course-logo.jpg";

const partners = [
  { name: "Physics Wallah", logo: pw },
  { name: "Unacademy", logo: unacademy },
  { name: "Next Toppers", logo: nexttoppers },
  { name: "Vibrant Academy", logo: vibrant },
  { name: "Career Will", logo: careerwill },
  { name: "KGS", logo: kgs },
  { name: "IIT School", logo: iitschool },
  { name: "Utkarsh", logo: utkarsh },
  { name: "Sarvam", logo: sarvam },
  { name: "Selection Way", logo: selectionway },
  { name: "RJ Vikramjeet", logo: rjv },
  { name: "RAW", logo: raw },
  { name: "CDS", logo: cds },
  { name: "Revision Course", logo: revision },
];

const PartnerMarquee = () => {
  const items = [...partners, ...partners];

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black tracking-[-0.03em]">
          Featured <span className="text-gradient">Institutions</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-2">India's top coaching platforms — all in one place</p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
          {items.map((p, i) => (
            <div
              key={i}
              className="shrink-0 w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-3xl bg-card border border-border shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.15)] hover:shadow-[0_12px_32px_-8px_hsl(var(--primary)/0.3)] transition-shadow flex flex-col items-center justify-center p-4 gap-2"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-background flex items-center justify-center">
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] md:text-xs font-bold text-foreground text-center line-clamp-1">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;