import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ThemeProvider } from "@/hooks/useTheme";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Cohorts } from "./pages/Cohorts";
import { CohortDetail } from "./pages/CohortDetail";
import { Candidates } from "./pages/Candidates";
import { DailyEfforts } from "./pages/DailyEfforts";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Coaches } from "./pages/Coaches";
import { Stakeholders } from "./pages/Stakeholders";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Only Route
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AdminOrCoachRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();

  if (user?.role !== 'ADMIN' && user?.role !== 'COACH') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cohorts" element={<Cohorts />} />
              <Route path="/cohorts/:id" element={<CohortDetail />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/efforts" element={<DailyEfforts />} />
              <Route path="/reports" element={<Reports />} />

              {/* Admin Only Routes */}
              <Route
                path="/coaches"
                element={
                  <AdminRoute>
                    <Coaches />
                  </AdminRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AdminRoute>
                    <Settings />
                  </AdminRoute>
                }
              />

              {/* Stakeholders Accessible to Admin and Coach */}
              <Route
                path="/stakeholders"
                element={
                  <AdminOrCoachRoute>
                    <Stakeholders />
                  </AdminOrCoachRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;