import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { UsernameCheckProvider } from "@/hooks/useUsernameCheck";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import BatchesPage from "./pages/BatchesPage";
import BatchDetailPage from "./pages/BatchDetailPage";
import ViewerPage from "./pages/ViewerPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <UsernameCheckProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/batches" element={<ProtectedRoute><BatchesPage /></ProtectedRoute>} />
                <Route path="/batches/:batchId" element={<ProtectedRoute><BatchDetailPage /></ProtectedRoute>} />
                <Route path="/test/:testId" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
                <Route path="/view/:appId" element={<ViewerPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UsernameCheckProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
