import { FileText, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubjectFolder {
  id: string;
  title: string;
  subject: string;
  class: string;
  url: string;
  icon: string;
}

const studyMaterials: SubjectFolder[] = [
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
  }
];

const StudyMaterial = () => {
  const navigate = useNavigate();

  const handleOpenMaterial = (material: SubjectFolder) => {
    navigate(`/view/${encodeURIComponent(material.title)}`, {
      state: { 
        url: material.url, 
        title: `${material.title} - Chapter Wise Notes`, 
        appId: "study-material" 
      }
    });
  };

  return (
    <section id="study-material" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 hover-scale cursor-default">
            <FileText className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Chapter Wise Notes</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Study <span className="text-gradient animate-pulse">Material</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Access chapter-wise short notes for Physics, Chemistry & Maths
          </p>
        </div>
        
        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyMaterials.map((material, index) => (
            <div 
              key={material.id}
              className="glass-card card-hover shine-effect rounded-2xl p-8 text-center animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto text-4xl group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                {material.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                {material.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                Chapter Wise Short Notes
              </p>
              
              {/* CTA */}
              <Button 
                onClick={() => handleOpenMaterial(material)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all group/btn hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                <BookOpen className="mr-2 w-4 h-4" />
                Open Notes
                <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudyMaterial;
