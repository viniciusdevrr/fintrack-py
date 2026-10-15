import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import AppLayout from "./components/layout/AppLayout";
import PaginaEmBreve from "./components/PaginaEmBreve";
import DashboardPage from "./pages/DashboardPage";
import CategoriasPage from "./pages/CategoriasPage";
import CartoesPage from "./pages/CartoesPage";
import MetasPage from "./pages/MetasPage";

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
      return;
    }
    const timer = setTimeout(() => {
      setMostrarSplash(false);
      sessionStorage.setItem("fintrack_intro_vista", "true");
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {mostrarSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
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
              <Route path="/transacoes" element={<PaginaEmBreve nome="Transações" />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/cartoes" element={<CartoesPage />} />
              <Route path="/metas" element={<MetasPage />} />
              <Route path="/relatorios" element={<PaginaEmBreve nome="Relatórios" />} />
              <Route path="/simulador" element={<PaginaEmBreve nome="Simulador" />} />
              <Route path="/assistente" element={<PaginaEmBreve nome="Assistente" />} />
            </Route>
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}