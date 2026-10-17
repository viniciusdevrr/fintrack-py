import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  mensagem: string;
  visivel: boolean;
}

export default function Toast({ mensagem, visivel }: ToastProps) {
  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-[#FF9B03]/40 bg-[rgba(15,23,42,0.9)] px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF9B03]/20 text-[#FF9B03]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span>{mensagem}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}