import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
}

export default function Modal({ aberto, aoFechar, titulo, children }: ModalProps) {
  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={aoFechar}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-6 shadow-card"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">{titulo}</h2>
              <button
                onClick={aoFechar}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--text-secondary))] hover:bg-base-3"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}