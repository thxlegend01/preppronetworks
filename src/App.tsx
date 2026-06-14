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
const AnnouncementsPage = lazy(() => import("./pages/AnnouncementsPage"));
const StudyToolsPage = lazy(() => import("./pages/StudyToolsPage"));
const EntertainmentPage = lazy(() => import("./pages/EntertainmentPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const OwnerChatPage = lazy(() => import("./pages/OwnerChatPage"));
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
                          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                          <Route path="/apps" element={<ProtectedRoute><AppsPage /></ProtectedRoute>} />
                          <Route path="/test-series" element={<ProtectedRoute><TestSeriesPage /></ProtectedRoute>} />
                          <Route path="/study-material" element={<ProtectedRoute><StudyMaterialPage /></ProtectedRoute>} />
                          <Route path="/batches" element={<ProtectedRoute><BatchesPage /></ProtectedRoute>} />
                          <Route path="/study-tracker" element={<ProtectedRoute><StudyTrackerPage /></ProtectedRoute>} />
                          <Route path="/preppro-world" element={<ProtectedRoute><PrepProWorldPage /></ProtectedRoute>} />
                          <Route path="/mathango-tests" element={<ProtectedRoute><MathangoTestsPage /></ProtectedRoute>} />
                          <Route path="/vots-tests" element={<ProtectedRoute><VotsTestsPage /></ProtectedRoute>} />
                          <Route path="/etoos-hub" element={<ProtectedRoute><EtoosHubPage /></ProtectedRoute>} />
                          <Route path="/prepchat" element={<ProtectedRoute><PrepChatPage /></ProtectedRoute>} />
                          <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
                          <Route path="/study-tools" element={<ProtectedRoute><StudyToolsPage /></ProtectedRoute>} />
                          <Route path="/entertainment" element={<ProtectedRoute><EntertainmentPage /></ProtectedRoute>} />
                          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                          <Route path="/owner-chat" element={<ProtectedRoute><OwnerChatPage /></ProtectedRoute>} />
                          <Route path="/batches/:batchId" element={<ProtectedRoute><BatchDetailPage /></ProtectedRoute>} />
                          <Route path="/test/:testId" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
                          <Route path="/viewer" element={<ProtectedRoute><ViewerPage /></ProtectedRoute>} />
                          <Route path="/view/:appId" element={<ProtectedRoute><ViewerPage /></ProtectedRoute>} />
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
