import { FileText, ExternalLink, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { useFavorites } from "@/hooks/useFavorites";

interface SubjectFolder {
  id: string;
  title: string;
  subject: string;
  class: string;
  url: string;
  icon: string;
}

const studyMaterials: SubjectFolder[] = [
  // Chapter Wise Notes
  {
    id: "11th-chemistry",
    title: "11th Chemistry",
    subject: "Chemistry",
    class: "11th",
    url: "https://drive.google.com/drive/folders/17inN1lWmkK4OpGCkNvX9B8RmGIVzffSt",
    icon: "🧪"
  },
  {
    id: "12th-chemistry",
    title: "12th Chemistry",
    subject: "Chemistry",
    class: "12th",
    url: "https://drive.google.com/drive/folders/1Nv_QLirhCOtuQGM7NDlP_gbjMGiC1knf",
    icon: "🧬"
  },
  {
    id: "11th-physics",
    title: "11th Physics",
    subject: "Physics",
    class: "11th",
    url: "https://drive.google.com/drive/folders/16zR6XGtRGDJtB8935UfYDWsijjpcgdPQ",
    icon: "⚛️"
  },
  {
    id: "12th-physics",
    title: "12th Physics",
    subject: "Physics",
    class: "12th",
    url: "https://drive.google.com/drive/folders/1SPFUxC9aUWyihQlf4_cKBqd9raP_xwL_",
    icon: "🔬"
  },
  {
    id: "11th-maths",
    title: "11th Maths",
    subject: "Maths",
    class: "11th",
    url: "https://drive.google.com/drive/folders/1m3NnBCkwXMy5IN-62Xt2aWncniCWCBiA",
    icon: "📐"
  },
  {
    id: "12th-maths",
    title: "12th Maths",
    subject: "Maths",
    class: "12th",
    url: "https://drive.google.com/drive/folders/1Ls1AmFuq26w0F9lGpfLfugzh0o-zMyZ-",
    icon: "📊"
  },
  // Additional Study Materials
  {
    id: "mathongo-jee-adv",
    title: "Mathongo JEE ADV",
    subject: "JEE Advanced",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1IqndZq8JD5y7hbVVMHWAF5QpTc3ymZ7e",
    icon: "🎯"
  },
  {
    id: "fiitjee-old-papers",
    title: "FIITJEE Old Papers",
    subject: "Papers",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1QMHDdetiQn4QsQAqTCFXXfSDWDSzfVA3",
    icon: "📄"
  },
  {
    id: "allen-papers",
    title: "ALLEN Papers",
    subject: "Papers",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU",
    icon: "📝"
  },
  {
    id: "allen-booster-sheets",
    title: "ALLEN Booster Sheets",
    subject: "Sheets",
    class: "JEE",
    url: "https://drive.google.com/folderview?id=1dQMhfn290NP45IHSiq9RnciAty38VCyS",
    icon: "🚀"
  },
  {
    id: "formula-booklet",
    title: "Formula Booklet",
    subject: "Formulas",
    class: "All",
    url: "https://drive.google.com/drive/folders/1_RvSIPntpjYYSWd1QWDf3vT4I-OIqFQT?usp=sharing",
    icon: "📖"
  },
  {
    id: "jee-adv-material",
    title: "JEE ADV Material",
    subject: "JEE Advanced",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1JdM_Mr7uRa2yTTAFvanA8rcfx2x8hoa1",
    icon: "🏆"
  },
  {
    id: "narayan-sri-chaitanya",
    title: "Narayan & Sri Chaitanya",
    subject: "Institute",
    class: "JEE/NEET",
    url: "https://drive.google.com/drive/folders/1XcBSnODk0Pr-JBIecNvlPW8R_u1FUYPh",
    icon: "🏫"
  },
  {
    id: "allen-latest",
    title: "Allen Latest",
    subject: "Institute",
    class: "JEE/NEET",
    url: "https://drive.google.com/drive/folders/1KTa7EvsN2aTXrt3iKmT3gNxF7R74nIcW",
    icon: "📚"
  },
  {
    id: "padhle-akhay",
    title: "Padhle Akhay",
    subject: "Notes",
    class: "All",
    url: "https://drive.google.com/drive/folders/1QO1pJbDnHwOgLfyoEM8e73rPy2fso-Mw",
    icon: "✏️"
  },
  {
    id: "jee-pyqs",
    title: "JEE PYQs",
    subject: "PYQs",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS",
    icon: "📋"
  },
  {
    id: "allen-jee-mains",
    title: "Allen JEE Mains",
    subject: "JEE Main",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1E9-WziWsbefDdUPEL27VgZ-pJY9vzUE2",
    icon: "🎓"
  },
  {
    id: "allen-race",
    title: "Allen Race",
    subject: "Practice",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1wWhR-98EKUnAlAPGDicTnrO2Nl5shBav",
    icon: "🏃"
  },
  {
    id: "allen-11th-test-series",
    title: "Allen 11th Test Series",
    subject: "Test Series",
    class: "11th",
    url: "https://drive.google.com/drive/folders/1CJyw-sE4TP_zfeRnU4rG_gr6U2wm3ekw",
    icon: "📊"
  },
  {
    id: "pw-test-series",
    title: "PW Test Series",
    subject: "Test Series",
    class: "JEE/NEET",
    url: "https://drive.google.com/drive/folders/1mwLdVTeOCBlZvxCY-8fy8hlPWlVxHgaF",
    icon: "✅"
  },
  {
    id: "non-academic-books",
    title: "Non Academic Books",
    subject: "Books",
    class: "General",
    url: "https://drive.google.com/drive/folders/1G2j84CYkNgKRnDA7JkHOD9CjvFkw_KhD",
    icon: "📕"
  },
  {
    id: "iit-jee-books",
    title: "IIT JEE Books",
    subject: "Books",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1sud8GE2Q7v8DdOVb0w0Vn_hZ1hIuTiMi",
    icon: "📘"
  },
  {
    id: "jee-neet-all-books",
    title: "JEE & NEET All Books",
    subject: "Books",
    class: "JEE/NEET",
    url: "https://drive.google.com/drive/folders/1Vcf-MtfhkKXB-d2AruTKoAGuVuBTR-yJ",
    icon: "📗"
  },
  {
    id: "jee-materials",
    title: "JEE Materials",
    subject: "Materials",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1-3L_v9w4TmyaiJ00btLMwahu63wb0XuK",
    icon: "📦"
  },
  {
    id: "allen-material",
    title: "Allen Material",
    subject: "Materials",
    class: "JEE/NEET",
    url: "https://drive.google.com/drive/folders/18bWgHaYoTviwZK3dCEnA_-C14K1AhnwT",
    icon: "🗂️"
  },
  {
    id: "jee-books-test",
    title: "JEE Books + Test",
    subject: "Books & Tests",
    class: "JEE",
    url: "https://drive.google.com/drive/folders/1-9e_m2LSJUT5qb0fXVIEfEYfGVFhQbmy",
    icon: "📚"
  },
];

const StudyMaterial = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenMaterial = (material: SubjectFolder) => {
    // Open externally for all study materials
    navigate(`/view/${encodeURIComponent(material.title)}`, {
      state: { 
        url: material.url, 
        title: `${material.title} - Study Material`, 
        appId: "study-material",
        openExternal: true
      }
    });
  };

  const filteredMaterials = studyMaterials.filter(material => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      material.title.toLowerCase().includes(query) ||
      material.subject.toLowerCase().includes(query) ||
      material.class.toLowerCase().includes(query)
    );
  });

  return (
    <section id="study-material" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 hover-scale cursor-default">
            <FileText className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Study Materials</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Study <span className="text-gradient animate-pulse">Material</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Access comprehensive study materials, notes, papers & books
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search study materials..."
        />
        
        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material, index) => (
            <div 
              key={material.id}
              className="glass-card card-hover shine-effect rounded-2xl p-6 text-center animate-fade-in group relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(material.id)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 ${
                  isFavorite(material.id) 
                    ? 'bg-destructive/20 text-destructive' 
                    : 'bg-secondary/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                }`}
              >
                <Heart 
                  className={`w-4 h-4 transition-transform ${isFavorite(material.id) ? 'fill-current animate-heart-beat' : ''}`} 
                />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto text-3xl group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                {material.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {material.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {material.subject} • {material.class}
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleOpenMaterial(material)}
                size="sm"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all group/btn hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                <BookOpen className="mr-2 w-4 h-4" />
                Open
                <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No materials found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyMaterial;