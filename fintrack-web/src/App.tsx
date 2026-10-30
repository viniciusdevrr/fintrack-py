import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import CategoriasPage from "./pages/CategoriasPage";
import CartoesPage from "./pages/CartoesPage";
import MetasPage from "./pages/MetasPage";
import TransacoesPage from "./pages/TransacoesPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import SimuladorPage from "./pages/SimuladorPage";
import AssistentePage from "./pages/AssistentePage";


function estaAutenticado() {
  return Boolean(localStorage.getItem("fintrack_token"));
}

function RotaProtegida({ children }: { children: React.ReactNode }) {
  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  useEffect(() => {
    const jaViuIntro = sessionStorage.getItem("fintrack_intro_vista");
    if (jaViuIntro) {
      setMostrarSplash(false);
    }
  }, []);

  // Chamado automaticamente quando a barra de progresso atinge 100%
  function handleSplashComplete() {
    setMostrarSplash(false);
    sessionStorage.setItem("fintrack_intro_vista", "true");
  }

  return (
    <AnimatePresence mode="wait">
      {mostrarSplash ? (
        <SplashScreen key="splash" onFinish={handleSplashComplete} />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-[#0b0f19] text-slate-100"
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<SignupPage />} />

            <Route
              element={
                <RotaProtegida>
                  <AppLayout />
                </RotaProtegida>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transacoes" element={<TransacoesPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/cartoes" element={<CartoesPage />} />
              <Route path="/metas" element={<MetasPage />} />
              <Route path="/relatorios" element={<RelatoriosPage />} />
              <Route path="/simulador" element={<SimuladorPage />} />
              <Route path="/assistente" element={<AssistentePage />} />
            </Route>

            <Route path="*" element={<Navigate to={estaAutenticado() ? "/" : "/login"} replace />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}