import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Bot, X, Send, Sparkles, Loader2, Minimize2, Maximize2, 
  Mic, MicOff, Image, Trash2, Volume2, VolumeX, Copy, Check,
  Brain, Zap, BookOpen, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

const SaurabhAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm **Saurabh's AI** - your premium AI study assistant!\n\n🎯 I can help you with:\n• 📚 Any subject - Physics, Chemistry, Maths, Biology\n• 🎤 Voice input - Just speak your question\n• 📷 Image analysis - Upload question images\n• 🧠 Step-by-step explanations\n\nAsk me anything! I'll explain with clarity and accuracy! ✨",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { toast } = useToast();

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

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({ variant: "destructive", title: "Voice Error", description: "Could not process voice input." });
      };
    }
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [toast]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast({ variant: "destructive", title: "Not Supported", description: "Voice input is not supported." });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({ title: "Listening... 🎤", description: "Speak your question." });
    }
  }, [isListening, toast]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '').replace(/`{1,3}/g, '').replace(/\n/g, ' ');
    synthesisRef.current = new SpeechSynthesisUtterance(cleanText);
    synthesisRef.current.lang = 'en-IN';
    synthesisRef.current.onstart = () => setIsSpeaking(true);
    synthesisRef.current.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(synthesisRef.current);
  }, []);

  const stopSpeaking = useCallback(() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => { setSelectedImage(event.target?.result as string); };
      reader.readAsDataURL(file);
    }
  }, []);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() || "Analyze this image", timestamp: new Date(), imageUrl: selectedImage || undefined };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/saurabh-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ message: userMessage.content, history }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.response || "Please try again.", timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ Connection error. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([{ id: "welcome", role: "assistant", content: "👋 Chat cleared! What would you like to learn? 🎯", timestamp: new Date() }]);

  const formatMessage = (content: string) => content.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <h4 key={i} className="font-bold text-base mt-3 mb-1 text-primary">{line.slice(4)}</h4>;
    if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-lg mt-3 mb-1 text-primary">{line.slice(3)}</h3>;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <p key={i} className="mb-1">{parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-primary">{part}</strong> : part)}</p>;
  });

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setIsOpen(true)} className="fixed bottom-24 right-6 z-50 group" aria-label="Open Saurabh's AI">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-60 group-hover:opacity-100 animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-pink-500/50 group-hover:scale-110 transition-transform">
                <Bot className="w-8 h-8 text-white" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute h-full w-full rounded-full bg-pink-400 opacity-75" /><span className="relative rounded-full h-5 w-5 bg-pink-500 flex items-center justify-center"><Sparkles className="w-3 h-3 text-white" /></span></span>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn("fixed z-50", isMinimized ? "bottom-6 right-6 w-72" : "bottom-6 right-6 w-[400px] sm:w-[450px] h-[600px] max-h-[85vh]")}>
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-75 blur-sm" />
            <div className="relative h-full rounded-2xl overflow-hidden bg-background/95 backdrop-blur-xl border border-pink-500/30 shadow-2xl flex flex-col">
              <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 p-4 flex items-center justify-between border-b border-pink-500/20">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
                  <div><h3 className="font-bold flex items-center gap-1.5">Saurabh's AI <Sparkles className="w-4 h-4 text-pink-500" /></h3><p className="text-xs text-muted-foreground flex items-center gap-1"><Brain className="w-3 h-3" />Premium AI Assistant</p></div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat}><Trash2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>{isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex gap-2 px-4 py-2 border-b border-pink-500/10 overflow-x-auto">
                    {[{ icon: BookOpen, label: "All Subjects" }, { icon: Mic, label: "Voice" }, { icon: Camera, label: "Image" }, { icon: Zap, label: "Instant" }].map((f, i) => (
                      <span key={i} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-pink-500/10 text-pink-500 whitespace-nowrap"><f.icon className="w-3 h-3" />{f.label}</span>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[90%] rounded-2xl px-4 py-3 text-sm relative group", msg.role === "user" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md" : "bg-secondary/80 rounded-bl-md border border-pink-500/10")}>
                          {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded" className="max-w-full rounded-lg mb-2 max-h-40 object-contain" />}
                          <div className="whitespace-pre-wrap">{msg.role === "assistant" ? formatMessage(msg.content) : msg.content}</div>
                          {msg.role === "assistant" && msg.id !== "welcome" && (
                            <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                              <button onClick={() => copyToClipboard(msg.content, msg.id)} className="p-1.5 rounded-full bg-background/90 border shadow-sm">{copiedId === msg.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}</button>
                              <button onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)} className="p-1.5 rounded-full bg-background/90 border shadow-sm">{isSpeaking ? <VolumeX className="w-3 h-3 text-pink-500" /> : <Volume2 className="w-3 h-3" />}</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="bg-secondary/80 rounded-2xl px-4 py-3 border border-pink-500/10"><div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-pink-500" /><span className="text-sm">Thinking...</span></div></div></div>}
                    <div ref={messagesEndRef} />
                  </div>

                  {selectedImage && <div className="px-4 py-2 border-t border-pink-500/20"><div className="relative inline-block"><img src={selectedImage} alt="Selected" className="h-16 rounded-lg object-cover" /><button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white"><X className="w-3 h-3" /></button></div></div>}

                  <form onSubmit={handleSubmit} className="p-4 border-t border-pink-500/20 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="ghost" size="icon" className={cn("h-10 w-10 rounded-xl", isListening && "bg-pink-500 text-white")} onClick={toggleListening}>{isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</Button>
                      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => fileInputRef.current?.click()}><Image className="w-4 h-4" /></Button>
                      <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={isListening ? "Listening..." : "Ask anything..."} className="flex-1 bg-secondary/50 border border-pink-500/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" />
                      <Button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="h-10 w-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600">{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1"><Sparkles className="w-3 h-3 text-pink-500" />Powered by Saurabh's AI</p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SaurabhAI;
