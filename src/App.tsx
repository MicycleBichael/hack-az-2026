import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index, { AiReviewPage, DemoDashboardPage, NotesPage, ResourcesPage, WeeklyPlanPage } from "./pages/Index.tsx";
import AppHome from "./pages/AppHome.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "./lib/auth.tsx";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<AppHome />} />
        <Route path="/demo" element={<DemoDashboardPage />} />
        <Route path="/demo/ai-review" element={<AiReviewPage />} />
        <Route path="/demo/weekly-plan" element={<WeeklyPlanPage />} />
        <Route path="/demo/notes" element={<NotesPage />} />
        <Route path="/demo/resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
