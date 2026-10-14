import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Wallet2 } from "lucide-react";
import { formatarReal } from "../../lib/utils";
import type { ResumoMes } from "../../types";

interface Props {
  saldo: number;
  resumo: ResumoMes | null;
}

export default function SaldoCard({ saldo, resumo }: Props) {
  const positivo = saldo >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-6 shadow-card"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))]">
        <Wallet2 className="h-4 w-4" />
        Saldo atual
      </div>

      <p
        className={`relative mt-2 text-4xl font-bold tracking-tight ${
          positivo ? "text-[rgb(var(--text-primary))]" : "text-danger-400"
        }`}
      >
        {formatarReal(saldo)}
      </p>

      {resumo && (
        <div className="relative mt-5 flex gap-6 border-t border-[rgb(var(--border))] pt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="h-4 w-4 text-brand-400" />
            <span className="text-[rgb(var(--text-secondary))]">Receitas</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">
              {formatarReal(resumo.receitas)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowDownRight className="h-4 w-4 text-danger-400" />
            <span className="text-[rgb(var(--text-secondary))]">Despesas</span>
            <span className="font-medium text-[rgb(var(--text-primary))]">
              {formatarReal(resumo.despesas)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}