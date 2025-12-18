import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertCircle } from "lucide-react";
import edufinicLogo from "@/assets/edufinic-logo.jpg";

// Mock question data
const mockQuestions = [
  {
    id: 1,
    question: "A ball is thrown vertically upward with a velocity of 20 m/s from the top of a building of height 25 m. How long will it take for the ball to reach the ground? (g = 10 m/s²)",
    options: ["2 s", "3 s", "4 s", "5 s"],
    subject: "Physics"
  },
  {
    id: 2,
    question: "The value of ∫₀^π sin²x dx is:",
    options: ["π/2", "π/4", "π", "2π"],
    subject: "Mathematics"
  },
  {
    id: 3,
    question: "Which of the following is the most acidic?",
    options: ["Phenol", "Ethanol", "Water", "p-Nitrophenol"],
    subject: "Chemistry"
  },
  {
    id: 4,
    question: "A particle moves along a straight line according to x = t³ - 6t² + 9t + 2. The particle is at rest at t =",
    options: ["1 s", "2 s", "3 s", "1 s and 3 s"],
    subject: "Physics"
  },
  {
    id: 5,
    question: "If z = x + iy and |z - 2| = |z + 2|, then z lies on:",
    options: ["x-axis", "y-axis", "A circle", "A parabola"],
    subject: "Mathematics"
  },
];

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockQuestions.length).fill(null));
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestion)) {
      newMarked.delete(currentQuestion);
    } else {
      newMarked.add(currentQuestion);
    }
    setMarkedForReview(newMarked);
  };

  const getQuestionStatus = (index: number) => {
    if (markedForReview.has(index) && answers[index] !== null) return "review-answered";
    if (markedForReview.has(index)) return "review";
    if (answers[index] !== null) return "answered";
    if (index === currentQuestion) return "current";
    return "not-visited";
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const reviewCount = markedForReview.size;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={edufinicLogo} alt="Edufinic" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-foreground">Mathango Test #{testId}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
          <Clock className={`w-5 h-5 ${timeLeft < 600 ? "text-destructive animate-pulse" : "text-primary"}`} />
          <span className={`font-mono font-bold text-lg ${timeLeft < 600 ? "text-destructive" : "text-foreground"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <Button variant="destructive" onClick={() => setShowSubmitDialog(true)}>
          Submit Test
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full">
                {mockQuestions[currentQuestion].subject}
              </span>
              <span className="text-muted-foreground text-sm">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </span>
            </div>

            {/* Question */}
            <div className="glass-card rounded-xl p-6 mb-6">
              <p className="text-lg leading-relaxed text-foreground">
                {mockQuestions[currentQuestion].question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {mockQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? "bg-primary/20 border-primary text-foreground glow-subtle"
                      : "bg-secondary/50 border-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-sm font-bold mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={toggleMarkForReview}
                className={markedForReview.has(currentQuestion) ? "border-accent text-accent" : ""}
              >
                <Flag className="w-4 h-4" />
                {markedForReview.has(currentQuestion) ? "Unmark" : "Mark for Review"}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="default"
                  onClick={() => setCurrentQuestion((prev) => Math.min(mockQuestions.length - 1, prev + 1))}
                  disabled={currentQuestion === mockQuestions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Question Palette */}
        <aside className="w-72 bg-card border-l border-border p-4 overflow-y-auto hidden lg:block">
          <h3 className="font-bold text-foreground mb-4">Question Palette</h3>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-success" />
              <span className="text-muted-foreground">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent" />
              <span className="text-muted-foreground">Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary" />
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-secondary border border-border" />
              <span className="text-muted-foreground">Not Visited</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {mockQuestions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <Button
                  key={index}
                  size="palette"
                  variant={
                    status === "answered" ? "palette-answered" :
                    status === "review" || status === "review-answered" ? "palette-review" :
                    status === "current" ? "palette-active" : "palette"
                  }
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="space-y-3 p-4 bg-secondary/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Answered</span>
              <span className="font-bold text-success">{answeredCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Marked for Review</span>
              <span className="font-bold text-accent">{reviewCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Not Answered</span>
              <span className="font-bold text-muted-foreground">{mockQuestions.length - answeredCount}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Submit Test?</h2>
              <p className="text-muted-foreground">
                You have answered {answeredCount} out of {mockQuestions.length} questions.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowSubmitDialog(false)}>
                Continue Test
              </Button>
              <Button variant="hero" className="flex-1" onClick={() => navigate("/")}>
                <CheckCircle className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
