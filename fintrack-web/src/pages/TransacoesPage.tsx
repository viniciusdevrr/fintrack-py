import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, Receipt } from "lucide-react";
import { categoriaApi, contaApi } from "../lib/api";
import type { Categoria, Transacao } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarData, formatarReal } from "../lib/utils";

type Filtro = "todas" | "receita" | "despesa";

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [modalAberto, setModalAberto] = useState(false);

  const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    const [t, c] = await Promise.all([contaApi.listarTransacoes(), categoriaApi.listar()]);
    setTransacoes(t);
    setCategorias(c);
    setCarregando(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirModal() {
    setCategoriaId(""); // sempre reinicia ao abrir, evita "herdar" escolha de outra vez
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await contaApi.registrarTransacao({
        tipo,
        descricao,
        valor: parseFloat(valor),
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
      });
      setDescricao(""); setValor(""); setCategoriaId("");
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível registrar a transação.");
    } finally {
      setSalvando(false);
    }
  }

  const opcoesCategoria = categorias
    .filter((c) => c.tipo === tipo)
    .map((c) => ({ value: String(c.id), label: c.nome }));

  const transacoesFiltradas = transacoes.filter((t) => {
    if (filtro === "todas") return true;
    if (filtro === "receita") return t.tipo === "receita";
    return t.tipo === "despesa" || t.tipo === "despesa_cartao";
  });

  function nomeCategoria(id: number | null) {
    if (!id) return "Sem categoria";
    return categorias.find((c) => c.id === id)?.nome ?? "Sem categoria";
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Transações</h1>
          <p className="text-sm text-slate-400">Todas as suas receitas e despesas registradas.</p>
        </div>
        <Button onClick={abrirModal}><Plus className="h-4 w-4" /> Nova transação</Button>
      </div>

      <div className="mb-4 flex gap-2">
        {(["todas", "receita", "despesa"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-xl border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filtro === f ? "border-[#FF9B03]/60 bg-[#FF9B03]/10 text-[#FF9B03]" : "border-white/10 text-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9B03] border-t-transparent" />
        </div>
      ) : transacoesFiltradas.length === 0 ? (
        <EmptyState icone={Receipt} titulo="Nenhuma transação encontrada" descricao="Registre sua primeira receita ou despesa para começar a acompanhar seu saldo." />
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <ul className="divide-y divide-white/10">
            {transacoesFiltradas.map((t, i) => {
              const receita = t.tipo === "receita";
              return (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${receita ? "bg-[#04eb51]/10 text-[#04eb51]" : "bg-red-500/10 text-red-400"}`}>
                      {receita ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.descricao}</p>
                      <p className="text-xs text-slate-400">{formatarData(t.data)} · {nomeCategoria(t.categoria_id)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${receita ? "text-[#04eb51]" : "text-red-400"}`}>
                    {receita ? "+" : "-"} {formatarReal(t.valor)}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </GlassCard>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Nova transação">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}

          <div className="grid grid-cols-2 gap-2">
            {(["despesa", "receita"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTipo(t); setCategoriaId(""); }}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  tipo === t ? "border-[#FF9B03]/60 bg-[#FF9B03]/10 text-[#FF9B03]" : "border-white/10 text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          <Input type="number" step="0.01" label="Valor" value={valor} onChange={(e) => setValor(e.target.value)} required />

          <Select
            label="Categoria (opcional)"
            value={categoriaId}
            onChange={setCategoriaId}
            placeholder="Sem categoria"
            options={opcoesCategoria}
          />

          <Button type="submit" className="w-full" loading={salvando}>Registrar transação</Button>
        </form>
      </Modal>
    </div>
  );
}