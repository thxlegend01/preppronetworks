import { useState, useEffect } from "react";
import { FileText, BookOpen, Heart, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { GridSkeleton } from "@/components/skeletons/CardSkeleton";

interface StudyItem {
  id: string;
  title: string;
  subject: string;
  class: string;
  url: string;
  icon: string;
  category: string;
}

const FILTER_CATEGORIES = [
  "All", "Books", "Notes", "DPPs", "Sheets", "PYQs", 
  "Test Series", "Study Package", "Papers", "Handbook", "Others"
];

const categorizeSubject = (subject: string): string => {
  const s = subject.toLowerCase();
  if (s.includes("book")) return "Books";
  if (s.includes("note")) return "Notes";
  if (s.includes("dpp")) return "DPPs";
  if (s.includes("sheet")) return "Sheets";
  if (s.includes("pyq")) return "PYQs";
  if (s.includes("test series")) return "Test Series";
  if (s.includes("study package") || s.includes("module")) return "Study Package";
  if (s.includes("paper")) return "Papers";
  if (s.includes("handbook") || s.includes("formula")) return "Handbook";
  return "Others";
};

const studyMaterials: StudyItem[] = [
  { id: "11th-chemistry", title: "11th Chemistry", subject: "Chemistry", class: "11th", url: "https://drive.google.com/drive/folders/17inN1lWmkK4OpGCkNvX9B8RmGIVzffSt", icon: "🧪", category: "Notes" },
  { id: "12th-chemistry", title: "12th Chemistry", subject: "Chemistry", class: "12th", url: "https://drive.google.com/drive/folders/1Nv_QLirhCOtuQGM7NDlP_gbjMGiC1knf", icon: "🧬", category: "Notes" },
  { id: "11th-physics", title: "11th Physics", subject: "Physics", class: "11th", url: "https://drive.google.com/drive/folders/16zR6XGtRGDJtB8935UfYDWsijjpcgdPQ", icon: "⚛️", category: "Notes" },
  { id: "12th-physics", title: "12th Physics", subject: "Physics", class: "12th", url: "https://drive.google.com/drive/folders/1SPFUxC9aUWyihQlf4_cKBqd9raP_xwL_", icon: "🔬", category: "Notes" },
  { id: "11th-maths", title: "11th Maths", subject: "Maths", class: "11th", url: "https://drive.google.com/drive/folders/1m3NnBCkwXMy5IN-62Xt2aWncniCWCBiA", icon: "📐", category: "Notes" },
  { id: "12th-maths", title: "12th Maths", subject: "Maths", class: "12th", url: "https://drive.google.com/drive/folders/1Ls1AmFuq26w0F9lGpfLfugzh0o-zMyZ-", icon: "📊", category: "Notes" },
  { id: "jee-mains-adv-pyqs", title: "JEE Mains/Advanced PYQs", subject: "PYQs", class: "JEE", url: "https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS", icon: "📋", category: "PYQs" },
  { id: "jee-test-series", title: "JEE Test Series", subject: "Test Series", class: "JEE", url: "https://drive.google.com/drive/folders/1A3jeVcbHMNUhhIwQRiPRWsV6InBRxwfa", icon: "✅", category: "Test Series" },
  { id: "fiitjee-study-package", title: "FIITJEE Study Package", subject: "Study Package", class: "JEE", url: "https://drive.google.com/drive/folders/1adRa1tKV5ES8TunqjYbXaCZMsfnu5NfJ", icon: "📚", category: "Study Package" },
  { id: "resonance-sheets-jee", title: "Resonance Sheets for JEE", subject: "Sheets", class: "JEE", url: "https://drive.google.com/drive/folders/1yCe8Eu4cAmd4dCcBsOKVyMFNsSty_nm0", icon: "📝", category: "Sheets" },
  { id: "unacademy-iconic-notes", title: "Unacademy Iconic JEE Notes", subject: "Notes", class: "JEE", url: "https://drive.google.com/drive/folders/1vUi5JqmpQQTCuRtj5Fp7Qb_xKcCdS9Ph", icon: "✏️", category: "Notes" },
  { id: "motion-dpps", title: "Motion DPPs", subject: "DPPs", class: "JEE", url: "https://drive.google.com/drive/folders/1Jro0mFynKdYHF_USWIjQmKbw4U4fhRSb", icon: "📄", category: "DPPs" },
  { id: "cengage-books", title: "Cengage Books", subject: "Books", class: "JEE", url: "https://drive.google.com/drive/folders/1WqqHCfNvvZKYBiGgIZZKx70Tr4R6upWP", icon: "📘", category: "Books" },
  { id: "arihant-books", title: "Arihant Books", subject: "Books", class: "JEE", url: "https://drive.google.com/drive/folders/10JTt9MYbYc1J7wKFiyPvJ4gngGVUYahu", icon: "📗", category: "Books" },
  { id: "arihant-books-pt2", title: "Arihant Books pt 2", subject: "Books", class: "JEE", url: "https://drive.google.com/drive/folders/14tD2zdst6s5r4CKGtfDqz2z7bzSicdVf", icon: "📗", category: "Books" },
  { id: "e-saral-sheets", title: "E Saral Sheets", subject: "Sheets", class: "JEE", url: "https://drive.google.com/drive/folders/1Bd4xKzf5JdCaiCLThyLMnhMKL7ZwpjGO", icon: "📝", category: "Sheets" },
  { id: "aakash-crunches", title: "Aakash Crunches", subject: "Practice", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1GvuA65mVgJDyuz_AWaGKgUDsNT4oetM7", icon: "🏃", category: "Others" },
  { id: "chemistry-jee-books", title: "Chemistry JEE Books", subject: "Chemistry", class: "JEE", url: "https://drive.google.com/drive/folders/1JwbtFUAY8XZsC_TUn0OLWePPgAdj1jZY", icon: "🧪", category: "Books" },
  { id: "physics-jee-books", title: "Physics JEE Books", subject: "Physics", class: "JEE", url: "https://drive.google.com/drive/folders/1ZH8ZCjSgb1hCgIU7T2FQ6trcUQaton5p", icon: "⚛️", category: "Books" },
  { id: "mathematics-books", title: "Mathematics Books", subject: "Maths", class: "JEE", url: "https://drive.google.com/drive/folders/1OP741lTQpGPXBgsO3WOVb1Gi0vQmP1gE", icon: "📐", category: "Books" },
  { id: "iitjee-adv-revisions", title: "IITJEE Advanced Revisions", subject: "Revision", class: "JEE Advanced", url: "https://drive.google.com/drive/folders/1J2Go2quobqgOWuOlZbdJ6PNNYLj1L7Di", icon: "🔄", category: "Others" },
  { id: "jee-handbook", title: "JEE HandBook", subject: "Handbook", class: "JEE", url: "https://drive.google.com/drive/folders/1GM4lQqbvs8KKZSL9nsxRBEPTXBJQd-Tm", icon: "📖", category: "Handbook" },
  { id: "jee-shortnotes-handwritten", title: "JEE ShortNotes Hand Written", subject: "Notes", class: "JEE", url: "https://drive.google.com/drive/folders/1owd3QqogTreEmuLpRpiMlmN00ToDTdf8", icon: "✍️", category: "Notes" },
  { id: "allen-jee-handbooks", title: "Allen JEE Handbooks", subject: "Handbook", class: "JEE", url: "https://drive.google.com/drive/folders/10Nw9lcQFKib0TLQsCRYrTb0Du8VeDN-9", icon: "📕", category: "Handbook" },
  { id: "mathango-adv-series", title: "Mathango Advance Series", subject: "Test Series", class: "JEE Advanced", url: "https://drive.google.com/drive/folders/1IqndZq8JD5y7hbVVMHWAF5QpTc3ymZ7e", icon: "🎯", category: "Test Series" },
  { id: "allen-all-test-series", title: "Allen All Test Series", subject: "Test Series", class: "JEE", url: "https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU", icon: "📊", category: "Test Series" },
  { id: "biology-all-books", title: "Biology All Books", subject: "Biology", class: "NEET", url: "https://drive.google.com/drive/folders/1ppN67wQHXGJzfu3tNqNKl-3p-lyLxxzG", icon: "🧬", category: "Books" },
  { id: "physics-all-books-pt2", title: "Physics All Books pt.2", subject: "Physics", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1-V2h5WbGiD4NE3_L706zyBvLizyuJHBb", icon: "⚛️", category: "Books" },
  { id: "chemistry-all-books-pt2", title: "Chemistry All Books pt 2", subject: "Chemistry", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/12B2mQ68LuvnFS1WAvC9QEFanQJ0pk3cZ", icon: "🧪", category: "Books" },
  { id: "maths-all-books-pt2", title: "Maths All Books pt 2", subject: "Maths", class: "JEE", url: "https://drive.google.com/drive/folders/1BBF5zIZ-Eiv2hYbnn8FlXCdce-8hJcku", icon: "📐", category: "Books" },
  { id: "allen-module", title: "Allen Module", subject: "Module", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1-bwtrDr3yjyDf0_wiPSxmIe14F41nkHo", icon: "📚", category: "Study Package" },
  { id: "resonance-biology-10th", title: "Resonance Biology 10th", subject: "Biology", class: "10th", url: "https://drive.google.com/drive/folders/1orPV9ArXpHWFmGgHPk-OlvQj_OBsP8_C", icon: "🧬", category: "Notes" },
  { id: "resonance-chemistry-10th", title: "Resonance Chemistry 10th", subject: "Chemistry", class: "10th", url: "https://drive.google.com/drive/folders/1H7CnzO3hkYrwET_wX4lFc68AI1O_HSD1", icon: "🧪", category: "Notes" },
  { id: "resonance-physics-10th", title: "Resonance Physics 10th", subject: "Physics", class: "10th", url: "https://drive.google.com/file/d/1z0pBGNYxTyxL2yALu28cOKJm12wargHP/view?usp=drivesdk", icon: "⚛️", category: "Notes" },
  { id: "resonance-10th-dpps", title: "Resonance 10th DPPs", subject: "DPPs", class: "10th", url: "https://drive.google.com/drive/folders/18dtYpyPl3NW3MBcwmzu2siJZ9jIQF4ox", icon: "📝", category: "DPPs" },
  { id: "resonance-11th-jee", title: "Resonance 11th Study Package JEE", subject: "Study Package", class: "11th", url: "https://drive.google.com/drive/folders/1BDNxTETD-G-8O0PIHo_XaYVZIcESn7oy", icon: "📚", category: "Study Package" },
  { id: "resonance-12th-jee", title: "Resonance 12th Study Package JEE", subject: "Study Package", class: "12th", url: "https://drive.google.com/drive/folders/1LOqXDhWVmwJsgCRypomki3AT2Wct_SGU", icon: "📚", category: "Study Package" },
  { id: "class-11th-maths", title: "Class 11th Maths", subject: "Maths", class: "11th", url: "https://drive.google.com/file/d/1EhqzBKrPBqUaq1qgci77ilPVQOw57Qfs/view?usp=drivesdk", icon: "📐", category: "Notes" },
  { id: "class-11th-physics", title: "Class 11th Physics", subject: "Physics", class: "11th", url: "https://drive.google.com/file/d/1ICGXKV0_2FlMHz4Al1C9W2DVUS6b66ty/view?usp=drivesdk", icon: "⚛️", category: "Notes" },
  { id: "class-11th-chemistry", title: "Class 11th Chemistry", subject: "Chemistry", class: "11th", url: "https://drive.google.com/file/d/1D_A0UbQsaLobzMVJsSiEB1NEu9YOGU9E/view?usp=drivesdk", icon: "🧪", category: "Notes" },
  { id: "jee-advanced-study-package", title: "JEE Advanced Study Package", subject: "Study Package", class: "JEE Advanced", url: "https://drive.google.com/drive/folders/1JdM_Mr7uRa2yTTAFvanA8rcfx2x8hoa1", icon: "🏆", category: "Study Package" },
  { id: "jee-notes", title: "JEE Notes", subject: "Notes", class: "JEE", url: "https://drive.google.com/drive/folders/1sulVgEQE-FOS5maQZkD2c58_lr4DKayn", icon: "📝", category: "Notes" },
  { id: "jee-advanced-material", title: "JEE Advanced Material", subject: "Material", class: "JEE Advanced", url: "https://drive.google.com/drive/folders/1bIieyKO_uhrA9EU8uxhqbzgjI5mW44RI", icon: "🎯", category: "Others" },
  { id: "neet-in-9-hours", title: "NEET in 9 Hours", subject: "Crash Course", class: "NEET", url: "https://drive.google.com/file/d/1osNsev0ivaPLEY3hgmNWkvISjXfjbbx-/view?usp=drivesdk", icon: "⏰", category: "Others" },
  { id: "mathango-dpps", title: "Mathango DPPs", subject: "DPPs", class: "JEE", url: "https://drive.google.com/drive/folders/1qqBixF3yXMysZV58OoWuKdINpGzqMjsG", icon: "📄", category: "DPPs" },
  { id: "jee-chapterwise-dpps", title: "JEE Chapter Wise DPPs", subject: "DPPs", class: "JEE", url: "https://drive.google.com/drive/folders/1el8T4tJHLl04e5dLW8mCWiiCYdqYGIl8", icon: "📝", category: "DPPs" },
  { id: "mathongo-jee-adv", title: "Mathongo JEE ADV", subject: "JEE Advanced", class: "JEE", url: "https://drive.google.com/drive/folders/1IqndZq8JD5y7hbVVMHWAF5QpTc3ymZ7e", icon: "🎯", category: "Others" },
  { id: "fiitjee-old-papers", title: "FIITJEE Old Papers", subject: "Papers", class: "JEE", url: "https://drive.google.com/drive/folders/1QMHDdetiQn4QsQAqTCFXXfSDWDSzfVA3", icon: "📄", category: "Papers" },
  { id: "allen-papers", title: "ALLEN Papers", subject: "Papers", class: "JEE", url: "https://drive.google.com/drive/folders/14vNdkg7nSf6G3zD6WmPewmQB2Avgc6bU", icon: "📝", category: "Papers" },
  { id: "allen-booster-sheets", title: "ALLEN Booster Sheets", subject: "Sheets", class: "JEE", url: "https://drive.google.com/folderview?id=1dQMhfn290NP45IHSiq9RnciAty38VCyS", icon: "🚀", category: "Sheets" },
  { id: "formula-booklet", title: "Formula Booklet", subject: "Formulas", class: "All", url: "https://drive.google.com/drive/folders/1_RvSIPntpjYYSWd1QWDf3vT4I-OIqFQT?usp=sharing", icon: "📖", category: "Handbook" },
  { id: "narayan-sri-chaitanya", title: "Narayan & Sri Chaitanya", subject: "Institute", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1XcBSnODk0Pr-JBIecNvlPW8R_u1FUYPh", icon: "🏫", category: "Study Package" },
  { id: "allen-latest", title: "Allen Latest", subject: "Institute", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1KTa7EvsN2aTXrt3iKmT3gNxF7R74nIcW", icon: "📚", category: "Study Package" },
  { id: "padhle-akhay", title: "Padhle Akhay", subject: "Notes", class: "All", url: "https://drive.google.com/drive/folders/1QO1pJbDnHwOgLfyoEM8e73rPy2fso-Mw", icon: "✏️", category: "Notes" },
  { id: "jee-pyqs", title: "JEE PYQs", subject: "PYQs", class: "JEE", url: "https://drive.google.com/drive/folders/1qIuISGPPZRZXoLiFF0XarGRMsm84laGS", icon: "📋", category: "PYQs" },
  { id: "allen-jee-mains", title: "Allen JEE Mains", subject: "JEE Main", class: "JEE", url: "https://drive.google.com/drive/folders/1E9-WziWsbefDdUPEL27VgZ-pJY9vzUE2", icon: "🎓", category: "Others" },
  { id: "allen-race", title: "Allen Race", subject: "Practice", class: "JEE", url: "https://drive.google.com/drive/folders/1wWhR-98EKUnAlAPGDicTnrO2Nl5shBav", icon: "🏃", category: "Others" },
  { id: "allen-11th-test-series", title: "Allen 11th Test Series", subject: "Test Series", class: "11th", url: "https://drive.google.com/drive/folders/1CJyw-sE4TP_zfeRnU4rG_gr6U2wm3ekw", icon: "📊", category: "Test Series" },
  { id: "pw-test-series", title: "PW Test Series", subject: "Test Series", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1mwLdVTeOCBlZvxCY-8fy8hlPWlVxHgaF", icon: "✅", category: "Test Series" },
  { id: "non-academic-books", title: "Non Academic Books", subject: "Books", class: "General", url: "https://drive.google.com/drive/folders/1G2j84CYkNgKRnDA7JkHOD9CjvFkw_KhD", icon: "📕", category: "Books" },
  { id: "iit-jee-books", title: "IIT JEE Books", subject: "Books", class: "JEE", url: "https://drive.google.com/drive/folders/1sud8GE2Q7v8DdOVb0w0Vn_hZ1hIuTiMi", icon: "📘", category: "Books" },
  { id: "jee-neet-all-books", title: "JEE & NEET All Books", subject: "Books", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/1Vcf-MtfhkKXB-d2AruTKoAGuVuBTR-yJ", icon: "📗", category: "Books" },
  { id: "jee-materials", title: "JEE Materials", subject: "Materials", class: "JEE", url: "https://drive.google.com/drive/folders/1-3L_v9w4TmyaiJ00btLMwahu63wb0XuK", icon: "📦", category: "Others" },
  { id: "allen-material", title: "Allen Material", subject: "Materials", class: "JEE/NEET", url: "https://drive.google.com/drive/folders/18bWgHaYoTviwZK3dCEnA_-C14K1AhnwT", icon: "🗂️", category: "Others" },
  { id: "jee-books-test", title: "JEE Books + Test", subject: "Books & Tests", class: "JEE", url: "https://drive.google.com/drive/folders/1-9e_m2LSJUT5qb0fXVIEfEYfGVFhQbmy", icon: "📚", category: "Books" },
];

const StudyMaterialPage = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenMaterial = (material: StudyItem) => {
    if (!user) { navigate("/auth"); return; }
    window.open(material.url, "_blank");
  };

  const filteredMaterials = studyMaterials.filter(m => {
    const matchesSearch = !searchQuery.trim() || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || m.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Study Materials</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Study <span className="text-gradient">Material</span>
            </h1>
            <p className="text-lg text-muted-foreground">Access comprehensive study materials, notes, papers & books</p>
          </motion.div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search study materials..." />

          {/* Filter Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map((cat) => {
                const count = cat === "All" 
                  ? studyMaterials.length 
                  : studyMaterials.filter(m => m.category === cat).length;
                
                if (cat !== "All" && count === 0) return null;
                
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === cat
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {cat} <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {isLoading ? (
            <GridSkeleton count={8} type="material" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <div className="glass-card card-hover shine-effect rounded-2xl p-6 text-center group relative">
                      <button
                        onClick={() => toggleFavorite(material.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
                          isFavorite(material.id) ? 'bg-destructive/20 text-destructive' : 'bg-secondary/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(material.id) ? 'fill-current' : ''}`} />
                      </button>

                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto text-3xl group-hover:scale-110 group-hover:bg-primary/30 transition-all">
                        {material.icon}
                      </div>

                      <h3 className="text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {material.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{material.subject} • {material.class}</p>
                      <span className="inline-block px-2 py-0.5 text-xs bg-secondary/50 text-muted-foreground rounded-full mb-4">{material.category}</span>

                      <Button variant="hero" onClick={() => handleOpenMaterial(material)} size="sm" className="w-full">
                        <BookOpen className="mr-2 w-4 h-4" />
                        {user ? "Open" : "Login to Open"}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {searchQuery && filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No materials found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default StudyMaterialPage;
