import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, Receipt } from "lucide-react";
import { categoriaApi, contaApi } from "../lib/api";
import type { Categoria, Transacao } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
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

  useEffect(() => {
    carregar();
  }, []);

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
      setDescricao("");
      setValor("");
      setCategoriaId("");
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível registrar a transação.");
    } finally {
      setSalvando(false);
    }
  }

  const categoriasFiltradasPorTipo = categorias.filter((c) => c.tipo === tipo);

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
          <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">Transações</h1>
          <p className="text-sm text-[rgb(var(--text-secondary))]">
            Todas as suas receitas e despesas registradas.
          </p>
        </div>
        <Button onClick={() => setModalAberto(true)}>
          <Plus className="h-4 w-4" /> Nova transação
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {(["todas", "receita", "despesa"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-xl border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filtro === f
                ? "border-brand-500/60 bg-brand-500/10 text-brand-400"
                : "border-[rgb(var(--border))] text-[rgb(var(--text-secondary))]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : transacoesFiltradas.length === 0 ? (
        <EmptyState
          icone={Receipt}
          titulo="Nenhuma transação encontrada"
          descricao="Registre sua primeira receita ou despesa para começar a acompanhar seu saldo."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-base-2 shadow-card">
          <ul className="divide-y divide-[rgb(var(--border))]">
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
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        receita ? "bg-brand-500/10 text-brand-400" : "bg-danger-500/10 text-danger-400"
                      }`}
                    >
                      {receita ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[rgb(var(--text-primary))]">{t.descricao}</p>
                      <p className="text-xs text-[rgb(var(--text-secondary))]">
                        {formatarData(t.data)} · {nomeCategoria(t.categoria_id)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${receita ? "text-brand-400" : "text-danger-400"}`}>
                    {receita ? "+" : "-"} {formatarReal(t.valor)}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Nova transação">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-400">{erro}</p>}

          <div className="grid grid-cols-2 gap-2">
            {(["despesa", "receita"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  tipo === t
                    ? "border-brand-500/60 bg-brand-500/10 text-brand-400"
                    : "border-[rgb(var(--border))] text-[rgb(var(--text-secondary))]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          <Input type="number" step="0.01" label="Valor" value={valor} onChange={(e) => setValor(e.target.value)} required />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text-secondary))]">
              Categoria (opcional)
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-base-2 px-4 py-2.5 text-sm text-[rgb(var(--text-primary))] outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Sem categoria</option>
              {categoriasFiltradasPorTipo.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full" loading={salvando}>
            Registrar transação
          </Button>
        </form>
      </Modal>
    </div>
  );
}