import { HashRouter, Route, Routes } from "react-router-dom";
import Index, { AiReviewPage, DemoDashboardPage, NotesPage, ResourcesPage, WeeklyPlanPage } from "./pages/Index.tsx";
import AppShell from "./pages/AppShell.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "./lib/auth.tsx";
import { Navigate } from "react-router-dom";

const App = () => (
  <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<AppShell />} />
        <Route path="/app/workspace" element={<Navigate to="/app?tab=courses" replace />} />
        <Route path="/demo" element={<DemoDashboardPage />} />
        <Route path="/demo/ai-review" element={<AiReviewPage />} />
        <Route path="/demo/weekly-plan" element={<WeeklyPlanPage />} />
        <Route path="/demo/notes" element={<NotesPage />} />
        <Route path="/demo/resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </AuthProvider>
);

export default App;
