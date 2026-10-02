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
    <section className="py-14 border-y border-border/60 bg-muted/20 relative">
      <div className="section-shell mb-8 text-center">
        <h2 className="section-title">
          Learning platforms, one network
        </h2>
        <p className="text-xs text-muted-foreground mt-2">India's top coaching platforms — all in one place</p>
      </div>

      <div className="marquee-mask relative overflow-hidden">
        <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {items.map((p, i) => (
            <div
              key={i}
              className="shrink-0 w-[112px] h-[112px] md:w-[132px] md:h-[132px] rounded-lg bg-card border border-border hover:border-primary/40 transition-colors flex flex-col items-center justify-center p-3 gap-2"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-background flex items-center justify-center">
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