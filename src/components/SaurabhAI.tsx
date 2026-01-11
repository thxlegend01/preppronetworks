import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SaurabhAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm **Saurabh's AI** - your personal study assistant. Ask me any question about Physics, Chemistry, Maths, or any topic. I'll explain with clarity and accuracy! 📚✨",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("physics") || lowerQ.includes("newton") || lowerQ.includes("force")) {
      return "🔬 **Physics Insight:**\n\nGreat question! Physics is all about understanding how the universe works. For any topic, I recommend:\n\n1️⃣ Start with the concept\n2️⃣ Understand the formula derivation\n3️⃣ Practice numerical problems\n\n💡 **Pro Tip:** Visualize the physical scenario - it helps in JEE/NEET!";
    }
    
    if (lowerQ.includes("chemistry") || lowerQ.includes("organic") || lowerQ.includes("inorganic")) {
      return "🧪 **Chemistry Guide:**\n\nChemistry connects atoms to real life! Here's my approach:\n\n1️⃣ For **Organic**: Learn mechanisms, not reactions\n2️⃣ For **Inorganic**: Focus on periodic trends\n3️⃣ For **Physical**: Master formulas & graphs\n\n📖 **Exam Tip:** Use mnemonics for remembering reactions!";
    }
    
    if (lowerQ.includes("math") || lowerQ.includes("calculus") || lowerQ.includes("algebra")) {
      return "📐 **Mathematics Solution:**\n\nMaths is about pattern recognition! My strategy:\n\n1️⃣ Understand the **concept** first\n2️⃣ Memorize **standard formulas**\n3️⃣ Practice **variety of problems**\n\n🎯 **Speed Tip:** Learn shortcuts for competitive exams!";
    }
    
    if (lowerQ.includes("jee") || lowerQ.includes("neet") || lowerQ.includes("exam")) {
      return "🏆 **Exam Strategy:**\n\nFor JEE/NEET success:\n\n✅ **Strong Basics** - NCERT first\n✅ **Consistent Practice** - Daily problems\n✅ **Mock Tests** - Weekly full syllabus\n✅ **Revision** - Short notes ready\n\n💪 You've got this! Stay focused and believe in yourself!";
    }
    
    return `📚 **I'm analyzing your question...**\n\nThis is a great topic to explore! Here's my approach:\n\n1️⃣ **Understand** the fundamental concept\n2️⃣ **Connect** it to related topics\n3️⃣ **Practice** with examples\n\n💡 Feel free to ask more specific questions - I'm here to help you master every topic!\n\n*Tip: Upload an image of your doubt for better explanation!*`;
  };

  return (
    <>
      {/* Floating AI Button - Always visible */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-6 z-50 group",
          isOpen && "hidden"
        )}
        aria-label="Open Saurabh's AI"
      >
        <div className="relative">
          {/* Neon glow rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 opacity-75 blur-md group-hover:blur-lg transition-all neon-border-flow" />
          
          {/* Main button */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-pink-500/50 group-hover:scale-110 transition-transform">
            <Bot className="w-8 h-8 text-white" />
            
            {/* Badge */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-pink-500 items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </span>
            </span>
          </div>
          
          {/* Label */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-background/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full border border-pink-500/30 text-foreground whitespace-nowrap shadow-lg">
              Saurabh's AI
            </span>
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300 ease-out",
            isMinimized
              ? "bottom-6 right-6 w-72"
              : "bottom-6 right-6 w-[380px] sm:w-[420px] h-[600px] max-h-[80vh]"
          )}
        >
          {/* Neon border glow */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-75 blur-sm neon-border-flow" />
          
          <div className="relative h-full rounded-2xl overflow-hidden bg-background/95 backdrop-blur-xl border border-pink-500/30 shadow-2xl shadow-pink-500/20 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 p-4 flex items-center justify-between border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-1.5">
                    Saurabh's AI
                    <Sparkles className="w-4 h-4 text-pink-500" />
                  </h3>
                  <p className="text-xs text-muted-foreground">Your Study Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-pink-500/10"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-pink-500/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-500/20">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                          msg.role === "user"
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md"
                            : "bg-secondary/80 text-foreground rounded-bl-md border border-pink-500/10"
                        )}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/80 rounded-2xl rounded-bl-md px-4 py-3 border border-pink-500/10">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-pink-500/20 bg-background/50">
                  <div className="relative flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask your doubt..."
                      className="flex-1 bg-secondary/50 border border-pink-500/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-muted-foreground"
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="h-11 w-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Powered by Saurabh's AI • 100% Accurate Study Help
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Neon animation styles */}
      <style>{`
        @keyframes neon-border-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .neon-border-flow {
          background-size: 200% 200%;
          animation: neon-border-flow 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default SaurabhAI;
