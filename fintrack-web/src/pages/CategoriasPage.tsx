import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, Tags, TrendingDown, TrendingUp } from "lucide-react";
import { categoriaApi } from "../lib/api";
import type { Categoria } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarReal } from "../lib/utils";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
  const [limite, setLimite] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    try {
      setCategorias(await categoriaApi.listar());
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await categoriaApi.criar({ nome, tipo, limite_mensal: limite ? parseFloat(limite) : null });
      setNome(""); setLimite(""); setTipo("despesa");
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar a categoria.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Categorias</h1>
          <p className="text-sm text-slate-400">Organize suas receitas e despesas por categoria.</p>
        </div>
        <Button onClick={() => setModalAberto(true)}><Plus className="h-4 w-4" /> Nova categoria</Button>
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9B03] border-t-transparent" />
        </div>
      ) : categorias.length === 0 ? (
        <EmptyState icone={Tags} titulo="Nenhuma categoria criada" descricao="Crie categorias para organizar melhor suas transações e definir limites de gasto." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categorias.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.tipo === "receita" ? "bg-[#04eb51]/10 text-[#04eb51]" : "bg-red-500/10 text-red-400"}`}>
                      {c.tipo === "receita" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.nome}</p>
                      <p className="text-xs capitalize text-slate-400">{c.tipo}</p>
                    </div>
                  </div>
                  {c.limite_mensal && <span className="text-xs text-slate-400">limite {formatarReal(c.limite_mensal)}</span>}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Nova categoria">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              {(["despesa", "receita"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTipo(t)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${tipo === t ? "border-[#FF9B03]/60 bg-[#FF9B03]/10 text-[#FF9B03]" : "border-white/10 text-slate-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Input type="number" step="0.01" label="Limite mensal (opcional)" placeholder="Ex: 500" value={limite} onChange={(e) => setLimite(e.target.value)} />
          <Button type="submit" className="w-full" loading={salvando}>Criar categoria</Button>
        </form>
      </Modal>
    </div>
  );
}