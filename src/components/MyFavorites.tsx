import { Heart, ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useDbFavorites } from "@/hooks/useDbFavorites";
import { useAuth } from "@/hooks/useAuth";
import { BATCHES } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DisclaimerDialog from "./DisclaimerDialog";

// Import logos
import pwLogo from "@/assets/pw-logo.jpg";
import rawLogo from "@/assets/raw-logo.jpeg";
import kgsLogo from "@/assets/kgs-logo.png";
import selectionwayLogo from "@/assets/selectionway-logo.png";
import nexttoppersLogo from "@/assets/nexttoppers-logo.png";
import mathangoLogo from "@/assets/mathango-logo.png";
import prepproLogo from "@/assets/preppro-logo.jpg";
import cdsLogo from "@/assets/cds-logo.png";
import unacademyLogo from "@/assets/unacademy-logo.jpg";
import revisionCourseLogo from "@/assets/revision-course-logo.jpg";

const logoMap: Record<string, string> = {
  "pw-app": pwLogo,
  "raw-app": rawLogo,
  "kgs-app": kgsLogo,
  "selection-way-app": selectionwayLogo,
  "cds-app": cdsLogo,
  "next-toppers-app": nexttoppersLogo,
  "mathango-test-series": mathangoLogo,
  "other-test-series": prepproLogo,
  "unacademy-app": revisionCourseLogo,
  "revision-course-app": unacademyLogo,
  "pyq-cbt-test": revisionCourseLogo,
};

// Study material icon mapping
const studyMaterialIcons: Record<string, string> = {
  "11th-chemistry": "🧪",
  "12th-chemistry": "🧬",
  "11th-physics": "⚛️",
  "12th-physics": "🔬",
  "11th-maths": "📐",
  "12th-maths": "📊",
  "mathongo-jee-adv": "🎯",
  "fiitjee-old-papers": "📄",
  "allen-papers": "📝",
  "allen-booster-sheets": "🚀",
  "formula-booklet": "📖",
  "jee-adv-material": "🏆",
  "narayan-sri-chaitanya": "🏫",
  "allen-latest": "📚",
  "padhle-akhay": "✏️",
  "jee-pyqs": "📋",
  "allen-jee-mains": "🎓",
  "allen-race": "🏃",
  "allen-11th-test-series": "📊",
  "pw-test-series": "✅",
  "non-academic-books": "📕",
  "iit-jee-books": "📘",
  "jee-neet-all-books": "📗",
  "jee-materials": "📦",
  "allen-material": "🗂️",
  "jee-books-test": "📚",
};

// Study material URLs
const studyMaterialUrls: Record<string, { url: string; title: string }> = {
  "11th-chemistry": { url: "https://drive.google.com/drive/folders/17inN1lWmkK4OpGCkNvX9B8RmGIVzffSt", title: "11th Chemistry" },
  "12th-chemistry": { url: "https://drive.google.com/drive/folders/1Nv_QLirhCOtuQGM7NDlP_gbjMGiC1knf", title: "12th Chemistry" },
  "11th-physics": { url: "https://drive.google.com/drive/folders/16zR6XGtRGDJtB8935UfYDWsijjpcgdPQ", title: "11th Physics" },
  "12th-physics": { url: "https://drive.google.com/drive/folders/1SPFUxC9aUWyihQlf4_cKBqd9raP_xwL_", title: "12th Physics" },
  "11th-maths": { url: "https://drive.google.com/drive/folders/1m3NnBCkwXMy5IN-62Xt2aWncniCWCBiA", title: "11th Maths" },
  "12th-maths": { url: "https://drive.google.com/drive/folders/1Ls1AmFuq26w0F9lGpfLfugzh0o-zMyZ-", title: "12th Maths" },
  "mathongo-jee-adv": { url: "https://drive.google.com/drive/folders/1IqndZq8JD5y7hbVVMHWAF5QpTc3ymZ7e", title: "Mathongo JEE ADV" },
  "fiitjee-old-papers": { url: "https://drive.google.com/drive/folders/1QMHDdetiQn4QsQAqTCFXXfSDWDSzfVA3", title: "FIITJEE Old Papers" },
  "allen-papers": { url: "https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU", title: "ALLEN Papers" },
  "allen-booster-sheets": { url: "https://drive.google.com/folderview?id=1dQMhfn290NP45IHSiq9RnciAty38VCyS", title: "ALLEN Booster Sheets" },
  "formula-booklet": { url: "https://drive.google.com/drive/folders/1_RvSIPntpjYYSWd1QWDf3vT4I-OIqFQT?usp=sharing", title: "Formula Booklet" },
  "jee-adv-material": { url: "https://drive.google.com/drive/folders/1JdM_Mr7uRa2yTTAFvanA8rcfx2x8hoa1", title: "JEE ADV Material" },
  "narayan-sri-chaitanya": { url: "https://drive.google.com/drive/folders/1XcBSnODk0Pr-JBIecNvlPW8R_u1FUYPh", title: "Narayan & Sri Chaitanya" },
  "allen-latest": { url: "https://drive.google.com/drive/folders/1KTa7EvsN2aTXrt3iKmT3gNxF7R74nIcW", title: "Allen Latest" },
  "padhle-akhay": { url: "https://drive.google.com/drive/folders/1QO1pJbDnHwOgLfyoEM8e73rPy2fso-Mw", title: "Padhle Akhay" },
  "jee-pyqs": { url: "https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS", title: "JEE PYQs" },
  "allen-jee-mains": { url: "https://drive.google.com/drive/folders/1E9-WziWsbefDdUPEL27VgZ-pJY9vzUE2", title: "Allen JEE Mains" },
  "allen-race": { url: "https://drive.google.com/drive/folders/1wWhR-98EKUnAlAPGDicTnrO2Nl5shBav", title: "Allen Race" },
  "allen-11th-test-series": { url: "https://drive.google.com/drive/folders/1CJyw-sE4TP_zfeRnU4rG_gr6U2wm3ekw", title: "Allen 11th Test Series" },
  "pw-test-series": { url: "https://drive.google.com/drive/folders/1mwLdVTeOCBlZvxCY-8fy8hlPWlVxHgaF", title: "PW Test Series" },
  "non-academic-books": { url: "https://drive.google.com/drive/folders/1G2j84CYkNgKRnDA7JkHOD9CjvFkw_KhD", title: "Non Academic Books" },
  "iit-jee-books": { url: "https://drive.google.com/drive/folders/1sud8GE2Q7v8DdOVb0w0Vn_hZ1hIuTiMi", title: "IIT JEE Books" },
  "jee-neet-all-books": { url: "https://drive.google.com/drive/folders/1Vcf-MtfhkKXB-d2AruTKoAGuVuBTR-yJ", title: "JEE & NEET All Books" },
  "jee-materials": { url: "https://drive.google.com/drive/folders/1-3L_v9w4TmyaiJ00btLMwahu63wb0XuK", title: "JEE Materials" },
  "allen-material": { url: "https://drive.google.com/drive/folders/18bWgHaYoTviwZK3dCEnA_-C14K1AhnwT", title: "Allen Material" },
  "jee-books-test": { url: "https://drive.google.com/drive/folders/1-9e_m2LSJUT5qb0fXVIEfEYfGVFhQbmy", title: "JEE Books + Test" },
};

const MyFavorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use localStorage for non-logged-in users, database for logged-in users
  const localFavorites = useFavorites();
  const dbFavorites = useDbFavorites();
  
  const favorites = user ? dbFavorites.favorites.map(f => f.item_id) : localFavorites.favorites;
  const toggleFavorite = user 
    ? (id: string) => {
        const fav = dbFavorites.favorites.find(f => f.item_id === id);
        const type = BATCHES.find(b => b.id === id) 
          ? (BATCHES.find(b => b.id === id)?.category === "Test Series" ? "test" : "batch")
          : "material";
        dbFavorites.toggleFavorite(id, type as "batch" | "test" | "material");
      }
    : localFavorites.toggleFavorite;
  
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ url: string; title: string; id: string } | null>(null);

  // Get favorited apps from BATCHES
  const favoritedApps = BATCHES.filter(batch => favorites.includes(batch.id));
  
  // Get favorited study materials
  const favoritedStudyMaterials = favorites
    .filter(id => studyMaterialUrls[id])
    .map(id => ({
      id,
      ...studyMaterialUrls[id],
      icon: studyMaterialIcons[id] || "📁"
    }));

  const handleExploreApp = (id: string, url: string, title: string) => {
    setSelectedApp({ url, title, id });
    setDisclaimerOpen(true);
  };

  const handleContinue = () => {
    if (selectedApp) {
      navigate(`/view/${encodeURIComponent(selectedApp.title)}`, {
        state: { url: selectedApp.url, title: selectedApp.title, appId: selectedApp.id }
      });
    }
    setDisclaimerOpen(false);
  };

  const handleOpenMaterial = (material: { id: string; url: string; title: string }) => {
    navigate(`/view/${encodeURIComponent(material.title)}`, {
      state: { 
        url: material.url, 
        title: `${material.title} - Study Material`, 
        appId: "study-material",
        openExternal: true
      }
    });
  };

  // Don't show section if no favorites
  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full mb-4 hover-scale cursor-default">
            <Heart className="w-4 h-4 text-destructive fill-current animate-pulse" />
            <span className="text-sm font-medium text-destructive">Quick Access</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
            My <span className="text-gradient">Favorites</span>
          </h2>
          <p className="text-muted-foreground">
            Your favorite apps and study materials
          </p>
        </div>
        
        {/* Favorites Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Apps */}
          {favoritedApps.map((app, index) => (
            <div 
              key={app.id}
              className="glass-card card-hover shine-effect rounded-xl p-4 text-center animate-fade-in group relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Remove from favorites */}
              <button
                onClick={() => toggleFavorite(app.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive transition-all duration-300 z-10 hover:bg-destructive/30"
              >
                <Heart className="w-3 h-3 fill-current" />
              </button>

              {/* Logo */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center mb-3 mx-auto bg-background shadow-md group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                {logoMap[app.id] ? (
                  <img 
                    src={logoMap[app.id]} 
                    alt={app.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-6 h-6 text-primary" />
                )}
              </div>
              
              <h3 className="text-sm font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {app.title.replace(" App", "")}
              </h3>
              
              <Button 
                onClick={() => handleExploreApp(app.id, app.externalUrl, app.title)}
                size="sm"
                className="w-full text-xs bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              >
                Open
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </div>
          ))}

          {/* Study Materials */}
          {favoritedStudyMaterials.map((material, index) => (
            <div 
              key={material.id}
              className="glass-card card-hover shine-effect rounded-xl p-4 text-center animate-fade-in group relative"
              style={{ animationDelay: `${(favoritedApps.length + index) * 0.05}s` }}
            >
              {/* Remove from favorites */}
              <button
                onClick={() => toggleFavorite(material.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive transition-all duration-300 z-10 hover:bg-destructive/30"
              >
                <Heart className="w-3 h-3 fill-current" />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3 mx-auto text-2xl group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                {material.icon}
              </div>
              
              <h3 className="text-sm font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {material.title}
              </h3>
              
              <Button 
                onClick={() => handleOpenMaterial(material)}
                size="sm"
                className="w-full text-xs bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              >
                Open
                <ExternalLink className="ml-1 w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DisclaimerDialog 
        isOpen={disclaimerOpen} 
        onClose={() => setDisclaimerOpen(false)} 
        onContinue={handleContinue}
        externalUrl={selectedApp?.url || ""}
      />
    </section>
  );
};

export default MyFavorites;