import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import Index from "./pages/Index";
import WidgetManagement from "./pages/WidgetManagement";
import DashboardBuilder from "./pages/DashboardBuilder";
import NotFound from "./pages/NotFound";
import UploadPage from "./pages/UploadPage";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/widgets" element={<WidgetManagement />} />
            <Route path="/dashboard" element={<DashboardBuilder />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
