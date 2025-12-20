import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import edufinicLogo from "@/assets/edufinic-logo.jpg";

const PDF_URL = "https://drive.google.com/drive/folders/1MJI-qE5ZefI1HyzRc6yAOeTqHJyPcRk_";

// Test URL mapping
const testUrls: Record<string, string> = {
  qft1: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft1/qft1.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA",
  qft2: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft2/qft2.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA",
  qft3: "https://stark-beta-q8u9.onrender.com/mathongo/tests/qft3/qft3.html?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk0MmNjMjc2NGZkZjQ0YWRkYWU0Yzc5IiwiaXNBZG1pbiI6ZmFsc2V9LCJpYXQiOjE3NjYwNDI4NzYsImV4cCI6MTc2NjQwMjg3Nn0.ilkxqTxdXtwYZ-K7aksriShMASURMKurHGfdAFGFwvA",
  pdf: PDF_URL,
};

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const externalUrl = testId ? testUrls[testId] : null;
  const isPdfPage = testId === "pdf";

  if (!externalUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Test not found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <img src={edufinicLogo} alt="Edufusion" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-foreground">
            {isPdfPage ? "QFT PDF" : `Mathango Test - ${testId?.toUpperCase()}`}
          </span>
        </div>
      </header>

      {/* Embedded Content - Takes remaining height */}
      <div className="flex-1 w-full overflow-hidden relative">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading {isPdfPage ? "PDF" : "Test"}...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={externalUrl}
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 60px)' }}
          title={isPdfPage ? "QFT PDF" : `Test ${testId}`}
          allow="fullscreen"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default TestPage;
