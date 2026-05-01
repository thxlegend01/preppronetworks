import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { UsernameCheckProvider } from "@/hooks/useUsernameCheck";
import { BlockCheckProvider } from "@/hooks/useBlockCheck";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import SplashScreen from "@/components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const TestPage = lazy(() => import("./pages/TestPage"));
const BatchesPage = lazy(() => import("./pages/BatchesPage"));
const BatchDetailPage = lazy(() => import("./pages/BatchDetailPage"));
const ViewerPage = lazy(() => import("./pages/ViewerPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AppsPage = lazy(() => import("./pages/AppsPage"));
const TestSeriesPage = lazy(() => import("./pages/TestSeriesPage"));
const StudyMaterialPage = lazy(() => import("./pages/StudyMaterialPage"));
const StudyTrackerPage = lazy(() => import("./pages/StudyTrackerPage"));
const PrepProWorldPage = lazy(() => import("./pages/PrepProWorldPage"));
const MathangoTestsPage = lazy(() => import("./pages/MathangoTestsPage"));
const VotsTestsPage = lazy(() => import("./pages/VotsTestsPage"));
const EtoosHubPage = lazy(() => import("./pages/EtoosHubPage"));
const PrepChatPage = lazy(() => import("./pages/PrepChatPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <AuthProvider>
            <BlockCheckProvider>
              <UsernameCheckProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Suspense fallback={<PageLoader />}>
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/reset-password" element={<ResetPasswordPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/apps" element={<AppsPage />} />
                          <Route path="/test-series" element={<TestSeriesPage />} />
                          <Route path="/study-material" element={<StudyMaterialPage />} />
                          <Route path="/batches" element={<BatchesPage />} />
                          <Route path="/study-tracker" element={<StudyTrackerPage />} />
                          <Route path="/preppro-world" element={<PrepProWorldPage />} />
                          <Route path="/mathango-tests" element={<MathangoTestsPage />} />
                          <Route path="/vots-tests" element={<VotsTestsPage />} />
                          <Route path="/etoos-hub" element={<EtoosHubPage />} />
                          <Route path="/prepchat" element={<PrepChatPage />} />
                          <Route path="/batches/:batchId" element={<BatchDetailPage />} />
                          <Route path="/test/:testId" element={<TestPage />} />
                          <Route path="/view/:appId" element={<ViewerPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AnimatePresence>
                    </Suspense>
                  </BrowserRouter>
                </TooltipProvider>
              </UsernameCheckProvider>
            </BlockCheckProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
