import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calculator, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { categoriaApi, simuladorApi } from "../lib/api";
import type { Categoria, SimulacaoResultado } from "../types";
import { formatarReal } from "../lib/utils";
import GlassPanel from "../components/ui/GlassPanel";

const atalhos = [100, 300, 500, 1000];

export default function SimuladorPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [resultado, setResultado] = useState<SimulacaoResultado | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    categoriaApi.listar().then(setCategorias);
  }, []);

  async function simular(valorNumerico: number) {
    setErro("");
    setCarregando(true);
    try {
      const categoriaNome = categorias.find((c) => c.id === Number(categoriaId))?.nome;
      const dados = await simuladorApi.simular({
        valor: valorNumerico,
        categoria: categoriaNome ?? null,
      });
      setResultado(dados);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível simular.");
    } finally {
      setCarregando(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numero = parseFloat(valor);
    if (!numero || numero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    simular(numero);
  }

  function handleAtalho(v: number) {
    setValor(String(v));
    simular(v);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white">
          <Calculator className="h-5 w-5 text-[#FF9B03]" /> Simulador financeiro
        </h1>
        <p className="text-sm text-slate-400">
          Veja como ficaria seu saldo antes de gastar — sem alterar nenhum dado real.
        </p>
      </div>

      <GlassPanel>
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {erro}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Se eu gastar quanto?
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-700/80 bg-slate-900/60 transition duration-200 focus-within:border-[#FF9B03] focus-within:ring-1 focus-within:ring-[#FF9B03]">
              <span className="pl-3.5 text-slate-400">R$</span>
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Categoria (opcional)
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-3 text-sm text-white outline-none focus:border-[#FF9B03] focus:ring-1 focus:ring-[#FF9B03]"
            >
              <option value="">Sem categoria específica</option>
              {categorias
                .filter((c) => c.tipo === "despesa")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {atalhos.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleAtalho(v)}
                className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-[#FF9B03]/60 hover:text-[#FF9B03]"
              >
                <Zap className="h-3 w-3" /> {formatarReal(v)}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9B03] via-[#e28800] to-orange-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-[#FF9B03]/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
          >
            {carregando ? "Simulando..." : "Simular"}
          </button>
        </form>
      </GlassPanel>

      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-5"
        >
          <GlassPanel>
            {resultado.ficaria_negativo && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Esse gasto deixaria seu saldo negativo.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400">Saldo atual</p>
                <p className="mt-1 text-lg font-bold text-white">{formatarReal(resultado.saldo_atual)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Saldo projetado</p>
                <p
                  className={`mt-1 flex items-center justify-center gap-1 text-lg font-bold ${
                    resultado.ficaria_negativo ? "text-red-400" : "text-[#04eb51]"
                  }`}
                >
                  {resultado.ficaria_negativo ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {formatarReal(resultado.saldo_projetado)}
                </p>
              </div>
            </div>

            {resultado.categoria && (
              <div className="mt-5 border-t border-slate-800/80 pt-4 text-sm text-slate-300">
                Em <span className="font-semibold text-[#FF9B03]">{resultado.categoria}</span>, você iria de{" "}
                {formatarReal(resultado.gasto_atual_categoria ?? 0)} para{" "}
                <span className="font-semibold text-white">
                  {formatarReal(resultado.gasto_projetado_categoria ?? 0)}
                </span>{" "}
                este mês.
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}
    </div>
  );
}