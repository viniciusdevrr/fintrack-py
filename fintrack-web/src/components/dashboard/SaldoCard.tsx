import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Wallet2 } from "lucide-react";
import { formatarReal } from "../../lib/utils";
import type { ResumoMes } from "../../types";
import GlassCard from "../ui/GlassCard";

interface Props {
  saldo: number;
  resumo: ResumoMes | null;
}

export default function SaldoCard({ saldo, resumo }: Props) {
  const positivo = saldo >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF9B03]/15 blur-3xl" />

        <div className="relative flex items-center gap-2 text-sm text-slate-400">
          <Wallet2 className="h-4 w-4" /> Saldo atual
        </div>

        <p className={`relative mt-2 text-4xl font-bold tracking-tight ${positivo ? "text-white" : "text-red-400"}`}>
          {formatarReal(saldo)}
        </p>

        {resumo && (
          <div className="relative mt-5 flex gap-6 border-t border-white/10 pt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-[#04eb51]" />
              <span className="text-slate-400">Receitas</span>
              <span className="font-medium text-white">{formatarReal(resumo.receitas)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowDownRight className="h-4 w-4 text-red-400" />
              <span className="text-slate-400">Despesas</span>
              <span className="font-medium text-white">{formatarReal(resumo.despesas)}</span>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}