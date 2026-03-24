import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PrivacyPolicyPage, TermsPage, ContactPage } from "@/pages/LegalPages.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isAppRoute = location.pathname === "/app" || location.pathname === "/try";
  const [showSplash, setShowSplash] = useState(isAppRoute);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Index />} />
        <Route path="/try" element={<Index />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
