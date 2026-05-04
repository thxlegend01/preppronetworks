import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Map,
  Brain,
  Wrench,
  Heart,
  AlertCircle,
  Layers,
  Upload,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ============================================================
   1. SYLLABUS & ROADMAP TRACKER
============================================================ */
type ChapterState = { theory: boolean; pyqs: boolean; revision: boolean };

const initialSyllabus: Record<string, { class11: string[]; class12: string[] }> = {
  Physics: {
    class11: ["Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Thermodynamics", "Oscillations"],
    class12: ["Electrostatics", "Current Electricity", "Magnetism", "EMI & AC", "Optics", "Modern Physics"],
  },
  Chemistry: {
    class11: ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Hydrocarbons"],
    class12: ["Solutions", "Electrochemistry", "Chemical Kinetics", "Coordination Compounds", "Haloalkanes", "Biomolecules"],
  },
  Mathematics: {
    class11: ["Sets & Relations", "Trigonometry", "Sequences & Series", "Straight Lines", "Conic Sections", "Limits"],
    class12: ["Matrices", "Determinants", "Continuity", "Differentiation", "Integration", "Vectors & 3D"],
  },
};

const SyllabusTracker = () => {
  const allChapters = useMemo(() => {
    const map: Record<string, ChapterState> = {};
    Object.entries(initialSyllabus).forEach(([sub, cls]) => {
      [...cls.class11, ...cls.class12].forEach((c) => {
        map[`${sub}::${c}`] = { theory: false, pyqs: false, revision: false };
      });
    });
    return map;
  }, []);

  const [state, setState] = useState<Record<string, ChapterState>>(allChapters);

  const toggle = (key: string, field: keyof ChapterState) => {
    setState((s) => ({ ...s, [key]: { ...s[key], [field]: !s[key][field] } }));
  };

  const subjectProgress = (subject: string) => {
    const chapters = [...initialSyllabus[subject].class11, ...initialSyllabus[subject].class12];
    let done = 0;
    let total = chapters.length * 3;
    chapters.forEach((c) => {
      const s = state[`${subject}::${c}`];
      if (s?.theory) done++;
      if (s?.pyqs) done++;
      if (s?.revision) done++;
    });
    return Math.round((done / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.keys(initialSyllabus).map((sub) => {
          const pct = subjectProgress(sub);
          const colors: Record<string, string> = {
            Physics: "from-fuchsia-500 to-purple-500",
            Chemistry: "from-orange-500 to-pink-500",
            Mathematics: "from-purple-500 to-indigo-500",
          };
          return (
            <div
              key={sub}
              className="rounded-2xl p-5 border border-border bg-card/60 backdrop-blur-xl flex items-center gap-4"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#g-${sub})"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(pct / 100) * 251} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                    style={{ stroke: "hsl(var(--primary))" }}
                  />
                </svg>
                <span className="absolute text-lg font-black">{pct}%</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subject</p>
                <h3 className={`text-lg font-extrabold bg-gradient-to-r ${colors[sub]} bg-clip-text text-transparent`}>
                  {sub}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordions */}
      {Object.entries(initialSyllabus).map(([sub, cls]) => (
        <div key={sub} className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden">
          <div className="p-4 border-b border-border bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10">
            <h3 className="text-lg font-extrabold">{sub}</h3>
          </div>
          <Accordion type="multiple" className="px-4">
            {(["class11", "class12"] as const).map((cl) => (
              <AccordionItem key={cl} value={`${sub}-${cl}`}>
                <AccordionTrigger className="text-sm font-bold">
                  {cl === "class11" ? "Class 11 Chapters" : "Class 12 Chapters"}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-2">
                    {cls[cl].map((ch) => {
                      const key = `${sub}::${ch}`;
                      const s = state[key];
                      return (
                        <div
                          key={ch}
                          className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition"
                        >
                          <span className="text-sm font-medium flex-1">{ch}</span>
                          <div className="flex gap-2">
                            {(["theory", "pyqs", "revision"] as const).map((f) => {
                              const labels = { theory: "📖", pyqs: "📝", revision: "🔄" };
                              return (
                                <button
                                  key={f}
                                  onClick={() => toggle(key, f)}
                                  title={f}
                                  className={`w-9 h-9 rounded-lg border text-sm transition-all ${
                                    s?.[f]
                                      ? "bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white border-transparent shadow-lg shadow-fuchsia-500/30"
                                      : "bg-background border-border hover:border-fuchsia-500/40"
                                  }`}
                                >
                                  {s?.[f] ? <Check className="w-4 h-4 mx-auto" /> : labels[f]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   2. AI DOUBT SOLVER (Mock)
============================================================ */
const DoubtSolver = () => {
  const [solved, setSolved] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSolve = () => setSolved(true);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 p-8 text-center hover:border-fuchsia-500/70 transition">
        <Upload className="w-10 h-10 mx-auto text-fuchsia-500 mb-3" />
        <p className="font-bold mb-1">Snap or Upload a Question</p>
        <p className="text-xs text-muted-foreground mb-4">Drag & drop image, or type your doubt below</p>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. A particle moves in a circle of radius 2m..."
          className="max-w-md mx-auto"
        />
        <Button
          variant="magentare"
          className="mt-4"
          onClick={handleSolve}
        >
          <Brain className="w-4 h-4 mr-1" /> Get Pro Approach
        </Button>
      </div>

      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-1"
          >
            <Accordion type="single" collapsible defaultValue="concept" className="px-4">
              <AccordionItem value="concept">
                <AccordionTrigger className="font-bold">
                  💡 Core Concept
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-500/15 to-purple-500/15 border border-fuchsia-500/30">
                    <p className="text-sm mb-2">Centripetal force formula:</p>
                    <p className="text-2xl font-black text-center font-mono bg-gradient-to-r from-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
                      F = mv²/r
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="approach">
                <AccordionTrigger className="font-bold">🎯 The "Pro" Approach</AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2 text-sm pl-4 list-decimal">
                    <li>Identify the system: object in uniform circular motion.</li>
                    <li>Draw FBD — find all forces acting radially.</li>
                    <li>Apply Newton's 2nd law radially: ΣF<sub>r</sub> = mv²/r.</li>
                    <li>Solve for the unknown using known constraints.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="execution">
                <AccordionTrigger className="font-bold">⚙️ Execution</AccordionTrigger>
                <AccordionContent>
                  <div className="font-mono text-sm space-y-1 p-3 rounded-lg bg-background/50">
                    <p>m = 0.5 kg, v = 4 m/s, r = 2 m</p>
                    <p>F = (0.5)(4)² / 2</p>
                    <p className="font-bold text-fuchsia-500">F = 4 N</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pitfalls">
                <AccordionTrigger className="font-bold">⚠️ Common Pitfalls</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <p className="text-sm font-semibold text-orange-500 mb-1">90% of students confuse:</p>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Centripetal vs centrifugal force direction</li>
                      <li>Forgetting v² (squaring the velocity)</li>
                      <li>Mixing tangential & radial accelerations</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   3. CBT TEST FORGE
============================================================ */
const TestForge = () => {
  const [difficulty, setDifficulty] = useState([3]);
  const [time, setTime] = useState([60]);
  const [chapters, setChapters] = useState<string[]>(["Kinematics"]);

  const allChapters = ["Kinematics", "Thermodynamics", "Electrostatics", "Optics", "Mole Concept", "Bonding", "Calculus", "Trigonometry", "Vectors"];
  const diffLabels = ["Easy", "Basic", "Medium", "Hard", "Advanced"];

  const toggleCh = (c: string) =>
    setChapters((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold">Difficulty Level</label>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white">
            {diffLabels[difficulty[0] - 1]}
          </span>
        </div>
        <Slider min={1} max={5} step={1} value={difficulty} onValueChange={setDifficulty} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold">Time Limit</label>
          <span className="text-sm font-mono text-fuchsia-500">{time[0]} min</span>
        </div>
        <Slider min={10} max={180} step={5} value={time} onValueChange={setTime} />
      </div>

      <div>
        <label className="text-sm font-bold mb-3 block">Pick Chapters</label>
        <div className="flex flex-wrap gap-2">
          {allChapters.map((c) => {
            const active = chapters.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCh(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-transparent shadow-lg shadow-fuchsia-500/30"
                    : "bg-background border-border hover:border-fuchsia-500/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-orange-500 text-white text-lg font-black shadow-2xl shadow-fuchsia-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
        <Zap className="w-5 h-5" /> Generate CBT Test
      </button>
    </div>
  );
};

/* ============================================================
   4. ZEN ZONE
============================================================ */
const ZenZone = () => {
  const [breathing, setBreathing] = useState(false);
  const toppers = [
    { name: "AIR 1 — Strategy", desc: "How I cracked JEE in 6 months", color: "from-emerald-500 to-teal-500" },
    { name: "NEET Topper", desc: "Daily routine of a 720/720 scorer", color: "from-amber-500 to-yellow-500" },
    { name: "Dropper Diaries", desc: "Coming back stronger after failure", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-amber-500/10 text-center">
        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Quote of the Day</p>
        <p className="text-2xl md:text-3xl font-black tracking-tight italic leading-tight">
          "Success is the sum of small efforts repeated day in and day out."
        </p>
        <p className="text-sm text-muted-foreground mt-3">— Robert Collier</p>
      </div>

      <div>
        <h3 className="text-lg font-extrabold mb-3">🎙️ Topper's Talk</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {toppers.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card/60 overflow-hidden group cursor-pointer hover:border-primary/40 transition"
            >
              <div className={`h-32 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                <Play className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition" />
              </div>
              <div className="p-3">
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/30 bg-card/60 p-8 text-center">
        <h3 className="text-lg font-extrabold mb-2">🧘 1-Minute Panic Reset</h3>
        <p className="text-xs text-muted-foreground mb-6">Tap to start guided breathing</p>
        <div className="flex justify-center mb-4">
          <motion.div
            onClick={() => setBreathing((b) => !b)}
            animate={breathing ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={breathing ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/50 flex items-center justify-center cursor-pointer text-white font-bold"
          >
            {breathing ? "Breathe..." : "Tap"}
          </motion.div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setBreathing((b) => !b)}>
          {breathing ? <><Pause className="w-3 h-3 mr-1" /> Stop</> : <><Play className="w-3 h-3 mr-1" /> Start</>}
        </Button>
      </div>
    </div>
  );
};

/* ============================================================
   5. SMART ERROR LOG
============================================================ */
type ErrorEntry = { id: string; question: string; topic: string; reason: string };

const ErrorLog = () => {
  const [entries, setEntries] = useState<ErrorEntry[]>([
    { id: "1", question: "Projectile range when angle = 45° (with air resistance)", topic: "Kinematics", reason: "Concept Gap" },
    { id: "2", question: "Hybridisation of XeF₄", topic: "Chemical Bonding", reason: "Formula Forgotten" },
    { id: "3", question: "Integration of sec³x dx", topic: "Calculus", reason: "Silly Error" },
  ]);
  const [draft, setDraft] = useState({ question: "", topic: "", reason: "Silly Error" });

  const reasonColor: Record<string, string> = {
    "Silly Error": "bg-amber-500/20 text-amber-500 border-amber-500/30",
    "Concept Gap": "bg-rose-500/20 text-rose-500 border-rose-500/30",
    "Formula Forgotten": "bg-purple-500/20 text-purple-500 border-purple-500/30",
  };

  const add = () => {
    if (!draft.question.trim()) return;
    setEntries((e) => [...e, { ...draft, id: Date.now().toString() }]);
    setDraft({ question: "", topic: "", reason: "Silly Error" });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-4 grid sm:grid-cols-4 gap-2">
        <Input
          placeholder="Question snippet..."
          value={draft.question}
          onChange={(e) => setDraft({ ...draft, question: e.target.value })}
          className="sm:col-span-2"
        />
        <Input
          placeholder="Topic"
          value={draft.topic}
          onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
        />
        <select
          value={draft.reason}
          onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option>Silly Error</option>
          <option>Concept Gap</option>
          <option>Formula Forgotten</option>
        </select>
        <Button variant="magentare" onClick={add} className="sm:col-span-4">
          <Plus className="w-4 h-4 mr-1" /> Log Mistake
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border text-xs font-bold uppercase text-muted-foreground">
          <div className="col-span-5">Question</div>
          <div className="col-span-3">Topic</div>
          <div className="col-span-2">Reason</div>
          <div className="col-span-2 text-right">Action</div>
        </div>
        {entries.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border/50 last:border-0 items-center text-sm hover:bg-background/40 transition"
          >
            <div className="col-span-5 truncate font-medium">{e.question}</div>
            <div className="col-span-3 text-xs text-muted-foreground">{e.topic}</div>
            <div className="col-span-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${reasonColor[e.reason]}`}>
                {e.reason}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-1">
              <button className="p-1.5 rounded-md bg-fuchsia-500/15 text-fuchsia-500 hover:bg-fuchsia-500/25" title="Re-attempt">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setEntries((es) => es.filter((x) => x.id !== e.id))}
                className="p-1.5 rounded-md bg-rose-500/15 text-rose-500 hover:bg-rose-500/25"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   6. FORMULA FLASHCARDS
============================================================ */
const flashcards = [
  { name: "Biot-Savart Law", formula: "dB = (μ₀/4π) · (I dL × r̂) / r²" },
  { name: "Lens Maker's Formula", formula: "1/f = (n-1)(1/R₁ − 1/R₂)" },
  { name: "de Broglie Wavelength", formula: "λ = h / mv" },
  { name: "Nernst Equation", formula: "E = E° − (RT/nF) ln Q" },
  { name: "Schrödinger 1D", formula: "−(ℏ²/2m) ∂²ψ/∂x² + Vψ = Eψ" },
];

const Flashcards = () => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % flashcards.length);
  };

  const card = flashcards[idx];

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-muted-foreground">
        Card {idx + 1} of {flashcards.length}
      </p>
      <div className="relative w-full max-w-sm h-72" style={{ perspective: 1200 }}>
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-orange-500 shadow-2xl shadow-fuchsia-500/40 flex flex-col items-center justify-center p-6 text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs uppercase tracking-widest opacity-80 mb-2">Concept</p>
            <p className="text-3xl font-black text-center">{card.name}</p>
            <p className="text-xs mt-6 opacity-80">Tap to reveal formula</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl bg-card border border-border shadow-2xl flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs uppercase tracking-widest text-fuchsia-500 mb-3">Formula</p>
            <p className="text-xl md:text-2xl font-mono text-center font-bold">{card.formula}</p>
            <p className="text-xs text-muted-foreground mt-6">{card.name}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={next}>
          ❌ Needs Review
        </Button>
        <Button variant="magentare" onClick={next}>
          ✅ Memorized
        </Button>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN PAGE
============================================================ */
const tabs = [
  { id: "syllabus", label: "Roadmap", icon: Map, comp: SyllabusTracker },
  { id: "doubt", label: "Mastermind AI", icon: Brain, comp: DoubtSolver },
  { id: "forge", label: "Test Forge", icon: Wrench, comp: TestForge },
  { id: "zen", label: "Zen Zone", icon: Heart, comp: ZenZone },
  { id: "errors", label: "Error Log", icon: AlertCircle, comp: ErrorLog },
  { id: "flash", label: "Flashcards", icon: Layers, comp: Flashcards },
];

const StudyToolsPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">100% Free · Pro-Grade</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              PrepPro <span className="text-gradient">Study Tools</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              The most sophisticated academic toolkit for serious JEE & NEET aspirants.
            </p>
          </div>

          <Tabs defaultValue="syllabus" className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <TabsList className="inline-flex w-auto h-auto p-1.5 bg-card/60 backdrop-blur-xl border border-border rounded-2xl">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-fuchsia-500/30 rounded-xl px-3 py-2 text-xs font-bold gap-1.5"
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((t) => (
              <TabsContent key={t.id} value={t.id} className="mt-2">
                <t.comp />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudyToolsPage;