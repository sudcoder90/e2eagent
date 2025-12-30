import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectsProvider } from "@/context/ProjectsContext";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import Scheduling from "./pages/Scheduling";
import Evaluations from "./pages/Evaluations";
import UIDrifts from "./pages/UIDrifts";
import AgentMemory from "./pages/AgentMemory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/project/:projectId" element={<ProjectDetail />} />
              <Route path="/scheduling" element={<Scheduling />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/memory" element={<AgentMemory />} />
              <Route path="/drifts" element={<UIDrifts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ProjectsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
