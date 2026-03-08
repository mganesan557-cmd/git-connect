import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import VisualizerPage from "./pages/VisualizerPage";
import AlgorithmVisualizerPage from "./pages/AlgorithmVisualizerPage";
import RecursionTreePage from "./pages/RecursionTreePage";
import MemoryVisualizerPage from "./pages/MemoryVisualizerPage";
import AlgorithmComparisonPage from "./pages/AlgorithmComparisonPage";
import LearnPage from "./pages/LearnPage";
import ExamplesPage from "./pages/ExamplesPage";
import SavedSessionsPage from "./pages/SavedSessionsPage";
import ProfilePage from "./pages/ProfilePage";
import AiTutorPage from "./pages/AiTutorPage";
import NotFound from "./pages/NotFound";
import MachineCodeVisualizerPage from "./pages/MachineCodeVisualizerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/visualizer" element={<VisualizerPage />} />
              <Route path="/algorithms" element={<AlgorithmVisualizerPage />} />
              <Route path="/recursion" element={<RecursionTreePage />} />
              <Route path="/memory" element={<MemoryVisualizerPage />} />
              <Route path="/compare" element={<AlgorithmComparisonPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              <Route path="/saved" element={<SavedSessionsPage />} />
              <Route path="/tutor" element={<AiTutorPage />} />
              <Route path="/machine" element={<MachineCodeVisualizerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
