import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, RotateCw, Download, Maximize2, Minimize2, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use cdn worker matching installed pdfjs version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
  downloadUrl?: string;
  fallbackIframeUrl?: string;
}

const PdfViewer = ({ fileUrl, downloadUrl, fallbackIframeUrl }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const update = () => setContainerWidth(Math.min(window.innerWidth - 32, isFullscreen ? 1180 : 900));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isFullscreen]);

  return (
    <div className={`flex flex-col bg-background ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-full"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-semibold text-foreground tabular-nums min-w-[70px] text-center">
            {pageNumber} / {numPages || "—"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground tabular-nums w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={() => setScale((s) => Math.min(3, s + 0.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setRotation((r) => (r + 90) % 360)}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} title="Copy shareable PDF link">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen((v) => !v)} title="Fullscreen PDF">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          {downloadUrl && (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-secondary text-foreground"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Document */}
      <div className="flex-1 overflow-auto flex justify-center p-4 bg-secondary/20">
        {error ? (
          fallbackIframeUrl ? (
            <iframe
              src={fallbackIframeUrl}
              title="PDF preview"
              className="w-full h-full border-0 rounded-md bg-white"
              allow="autoplay"
              allowFullScreen
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-destructive font-semibold mb-2">Could not load PDF</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                {error}. Try opening from the original source.
              </p>
            </div>
          )
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(e) => setError(e.message)}
            loading={
              <div className="flex items-center gap-2 text-muted-foreground py-12">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading PDF…
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              width={containerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl rounded-md overflow-hidden"
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
