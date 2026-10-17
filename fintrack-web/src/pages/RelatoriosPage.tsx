import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";
import { relatorioApi } from "../lib/api";
import type { ComparativoMes, ResumoMes } from "../types";
import { formatarReal } from "../lib/utils";
import EmptyState from "../components/ui/EmptyState";

const CORES = ["#F5A623", "#34D399", "#60A5FA", "#F87171", "#A78BFA", "#FB923C"];

export default function RelatoriosPage() {
  const [resumo, setResumo] = useState<ResumoMes | null>(null);
  const [gastos, setGastos] = useState<Record<string, number>>({});
  const [comparativo, setComparativo] = useState<ComparativoMes[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      relatorioApi.resumoMes(),
      relatorioApi.gastosPorCategoria(),
      relatorioApi.comparativoMensal(),
    ]).then(([r, g, c]) => {
      setResumo(r);
      setGastos(g);
      setComparativo(c);
      setCarregando(false);
    });
  }, []);

  if (carregando) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const entradasCategoria = Object.entries(gastos).map(([nome, valor]) => ({ nome, valor }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">Relatórios</h1>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          Análise detalhada das suas finanças.
        </p>
      </div>

      {resumo && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card">
            <p className="text-xs text-[rgb(var(--text-secondary))]">Receitas do mês</p>
            <p className="mt-1 text-xl font-bold text-brand-400">{formatarReal(resumo.receitas)}</p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card">
            <p className="text-xs text-[rgb(var(--text-secondary))]">Despesas do mês</p>
            <p className="mt-1 text-xl font-bold text-danger-400">{formatarReal(resumo.despesas)}</p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card">
            <p className="text-xs text-[rgb(var(--text-secondary))]">Saldo do mês</p>
            <p className="mt-1 text-xl font-bold text-[rgb(var(--text-primary))]">{formatarReal(resumo.saldo)}</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card"
      >
        <h2 className="mb-4 text-sm font-semibold text-[rgb(var(--text-primary))]">
          Receitas x Despesas — últimos meses
        </h2>
        {comparativo.length === 0 ? (
          <EmptyState
            icone={BarChart3}
            titulo="Sem dados suficientes"
            descricao="Registre transações em mais de um mês para ver a comparação."
          />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativo}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="rgb(var(--text-secondary))" fontSize={12} />
                <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  formatter={(valor: number) => formatarReal(valor)}
                  contentStyle={{
                    background: "rgb(var(--bg-elevated))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                />
                <Legend />
                <Bar dataKey="receitas" name="Receitas" fill="#34D399" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#F87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card"
      >
        <h2 className="mb-4 text-sm font-semibold text-[rgb(var(--text-primary))]">
          Gastos por categoria
        </h2>
        {entradasCategoria.length === 0 ? (
          <EmptyState
            icone={BarChart3}
            titulo="Nenhuma despesa este mês"
            descricao="Registre despesas para ver a distribuição por categoria."
          />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={entradasCategoria} dataKey="valor" nameKey="nome" outerRadius={100} label>
                  {entradasCategoria.map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(valor: number) => formatarReal(valor)}
                  contentStyle={{
                    background: "rgb(var(--bg-elevated))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
}