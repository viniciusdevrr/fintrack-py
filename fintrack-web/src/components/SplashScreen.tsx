import { motion } from "framer-motion";
import Logo from "./Logo";

/**
 * Tela de abertura do app. Mostra a logo com uma animação de entrada,
 * um leve "respirar" de brilho enquanto fica parada, e depois é removida
 * pelo App.tsx (que já cuida da transição de saída suave até o login).
 */
export default function SplashScreen() {
  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-1"
    >
      <div className="relative flex flex-col items-center">
        {/* Brilho pulsante atrás da logo — efeito "respirando" */}
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute h-40 w-40 rounded-full bg-brand-500/30 blur-3xl"
        />

        {/* Logo: entra com fade + leve escala, por cima do brilho */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <Logo size="hero" />
        </motion.div>

        {/* Barra de carregamento decorativa, reforça a sensação de "abrindo" */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 72 }}
          transition={{ duration: 1.3, delay: 0.4, ease: "easeInOut" }}
          className="relative mt-8 h-[3px] rounded-full bg-brand-500/60"
        />
      </div>
    </motion.div>
  );
}