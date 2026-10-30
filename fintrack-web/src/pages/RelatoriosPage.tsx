import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, Cell as CellRanking,
} from "recharts";
import { relatorioApi } from "../lib/api";
import type { ComparativoMes, ResumoMes } from "../types";
import { formatarReal } from "../lib/utils";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";

const CORES = ["#FF9B03", "#04eb51", "#60A5FA", "#F87171", "#A78BFA", "#FB923C", "#34D399", "#E879F9"];

const estiloTooltip = {
  contentStyle: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(255,155,3,0.3)",
    borderRadius: 12,
    fontSize: 13,
    color: "#fff",
  },
  itemStyle: { color: "#fff" },
  labelStyle: { color: "#fff" },
};

export default function RelatoriosPage() {
  const [resumo, setResumo] = useState<ResumoMes | null>(null);
  const [gastosMes, setGastosMes] = useState<Record<string, number>>({});
  const [gastosPeriodo, setGastosPeriodo] = useState<Record<string, number>>({});
  const [comparativo, setComparativo] = useState<ComparativoMes[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      relatorioApi.resumoMes(),
      relatorioApi.gastosPorCategoria(),
      relatorioApi.gastosPorCategoriaPeriodo(6),
      relatorioApi.comparativoMensal(),
    ]).then(([r, g, gp, c]) => {
      setResumo(r);
      setGastosMes(g);
      setGastosPeriodo(gp);
      setComparativo(c);
      setCarregando(false);
    });
  }, []);

  if (carregando) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9B03] border-t-transparent" />
      </div>
    );
  }

  const entradasMes = Object.entries(gastosMes).map(([nome, valor]) => ({ nome, valor }));
  const entradasPeriodo = Object.entries(gastosPeriodo)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Relatórios</h1>
        <p className="text-sm text-slate-400">Análise detalhada das suas finanças.</p>
      </div>

      {resumo && (
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard>
            <p className="text-xs text-slate-400">Receitas do mês</p>
            <p className="mt-1 text-xl font-bold text-[#04eb51]">{formatarReal(resumo.receitas)}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-slate-400">Despesas do mês</p>
            <p className="mt-1 text-xl font-bold text-red-400">{formatarReal(resumo.despesas)}</p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs text-slate-400">Saldo do mês</p>
            <p className="mt-1 text-xl font-bold text-white">{formatarReal(resumo.saldo)}</p>
          </GlassCard>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Receitas x Despesas — últimos meses</h2>
          {comparativo.length === 0 ? (
            <EmptyState icone={BarChart3} titulo="Sem dados suficientes" descricao="Registre transações em mais de um mês para ver a comparação." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparativo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(valor: number) => formatarReal(valor)} {...estiloTooltip} />
                  <Legend />
                  <Bar dataKey="receitas" name="Receitas" fill="#04eb51" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="despesas" name="Despesas" fill="#F87171" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp className="h-4 w-4 text-[#FF9B03]" /> Onde você mais gasta (últimos 6 meses)
          </h2>
          {entradasPeriodo.length === 0 ? (
            <EmptyState icone={BarChart3} titulo="Sem dados suficientes" descricao="Registre despesas com categoria para ver o ranking de gastos." />
          ) : (
            <div style={{ height: Math.max(220, entradasPeriodo.length * 42) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={entradasPeriodo} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `R$${v}`} />
                  <YAxis type="category" dataKey="nome" stroke="#94a3b8" fontSize={12} width={110} />
                  <Tooltip formatter={(valor: number) => formatarReal(valor)} {...estiloTooltip} />
                  <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
                    {entradasPeriodo.map((_, i) => (
                      <CellRanking key={i} fill={CORES[i % CORES.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlassCard className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Gastos por categoria (este mês)</h2>
          {entradasMes.length === 0 ? (
            <EmptyState icone={BarChart3} titulo="Nenhuma despesa este mês" descricao="Registre despesas com categoria para ver a distribuição." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={entradasMes} dataKey="valor" nameKey="nome" outerRadius={100} label>
                    {entradasMes.map((_, i) => (
                      <Cell key={i} fill={CORES[i % CORES.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(valor: number) => formatarReal(valor)} {...estiloTooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}