import { motion } from "framer-motion";
import Logo from "./Logo";

interface SplashScreenProps {
  onFinish?: () => void;
}

/**
 * Tela de carregamento com exibição da logo, barra de progresso cadenciada
 * e redirecionamento automático para o login assim que o carregamento é concluído.
 */
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] select-none"
    >
      <div className="relative flex flex-col items-center">
        {/* Brilho de fundo na cor principal #FF9B03 */}
        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#FF9B03]/25 blur-3xl animate-pulse" />

        {/* Logo em destaque visual */}
        <div className="relative scale-100 opacity-100">
          <Logo size="hero" />
        </div>

        {/* Trilho da Barra de Progresso */}
        <div className="relative mt-10 h-[4px] w-[200px] overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/50">
          {/* Preenchimento gradual da barra */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }} 
            onAnimationComplete={() => {
              if (onFinish) onFinish();
            }}
            className="h-full bg-gradient-to-r from-[#FF9B03] to-amber-400 rounded-full shadow-[0_0_12px_rgba(255,155,3,0.8)]"
          />
        </div>

        {/* Indicador textual opcional para reforçar o carregamento */}
        <p className="mt-3 text-xs font-medium text-slate-400 tracking-wider">
          Carregando painel financeiro...
        </p>
      </div>
    </motion.div>
  );
}