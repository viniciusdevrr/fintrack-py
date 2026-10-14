import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Target } from "lucide-react";
import { alertaApi, contaApi, metaApi, relatorioApi } from "../lib/api";
import type { Alerta, Conta, Meta, ResumoMes } from "../types";
import SaldoCard from "../components/dashboard/SaldoCard";
import GraficoCategorias from "../components/dashboard/GraficoCategorias";
import TransacoesRecentes from "../components/dashboard/TransacoesRecentes";
import CriarContaCard from "../components/dashboard/CriarContaCard";
import { formatarReal } from "../lib/utils";

export default function DashboardPage() {
  const [conta, setConta] = useState<Conta | null>(null);
  const [resumo, setResumo] = useState<ResumoMes | null>(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<Record<string, number>>({});
  const [transacoes, setTransacoes] = useState<import("../types").Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [temConta, setTemConta] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarTudo() {
    setCarregando(true);
    try {
      const c = await contaApi.minha();
      setConta(c);
      setTemConta(true);

      const [r, gpc, t, m, a] = await Promise.all([
        relatorioApi.resumoMes(),
        relatorioApi.gastosPorCategoria(),
        contaApi.listarTransacoes(),
        metaApi.listar(),
        alertaApi.listar(),
      ]);
      setResumo(r);
      setGastosPorCategoria(gpc);
      setTransacoes(t);
      setMetas(m);
      setAlertas(a);

      // Roda a checagem de orçamento silenciosamente, para alertas futuros
      await alertaApi.verificar();
    } catch {
      setTemConta(false);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  if (carregando) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!temConta) {
    return <CriarContaCard aoCriar={carregarTudo} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">Visão geral</h1>
        <p className="text-sm text-[rgb(var(--text-secondary))]">
          Resumo das suas finanças neste mês.
        </p>
      </div>

      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-xl border border-danger-500/20 bg-danger-500/10 px-4 py-3 text-sm text-danger-400"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {a.mensagem}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <SaldoCard saldo={conta?.saldo ?? 0} resumo={resumo} />
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card md:col-span-2">
          <h2 className="mb-1 text-sm font-semibold text-[rgb(var(--text-primary))]">
            Gastos por categoria
          </h2>
          <GraficoCategorias dados={gastosPorCategoria} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card md:col-span-3">
          <h2 className="mb-1 text-sm font-semibold text-[rgb(var(--text-primary))]">
            Transações recentes
          </h2>
          <TransacoesRecentes transacoes={transacoes} />
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card md:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--text-primary))]">
            <Target className="h-4 w-4 text-brand-400" /> Metas
          </h2>
          {metas.length === 0 ? (
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Você ainda não criou nenhuma meta.
            </p>
          ) : (
            <div className="space-y-4">
              {metas.slice(0, 3).map((m) => (
                <div key={m.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-[rgb(var(--text-primary))]">{m.nome}</span>
                    <span className="text-[rgb(var(--text-secondary))]">
                      {formatarReal(m.valor_atual)} / {formatarReal(m.valor_alvo)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-base-3">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${m.progresso_percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}