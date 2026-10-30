import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Tags, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { categoriaApi } from "../lib/api";
import type { Categoria } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarReal } from "../lib/utils";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
  const [limite, setLimite] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setCategorias(await categoriaApi.listar());
    setCarregando(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirCriar() {
    setEditandoId(null);
    setNome(""); setTipo("despesa"); setLimite("");
    setModalAberto(true);
  }

  function abrirEditar(c: Categoria) {
    setEditandoId(c.id);
    setNome(c.nome); setTipo(c.tipo); setLimite(c.limite_mensal ? String(c.limite_mensal) : "");
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const payload = { nome, tipo, limite_mensal: limite ? parseFloat(limite) : null };
      if (editandoId) {
        await categoriaApi.atualizar(editandoId, payload);
      } else {
        await categoriaApi.criar(payload);
      }
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a categoria.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindoId) return;
    await categoriaApi.excluir(excluindoId);
    setExcluindoId(null);
    carregar();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Categorias</h1>
          <p className="text-sm text-slate-400">Organize suas receitas e despesas por categoria.</p>
        </div>
        <Button onClick={abrirCriar}><Plus className="h-4 w-4" /> Nova categoria</Button>
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
              <GlassCard className="group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.tipo === "receita" ? "bg-[#04eb51]/10 text-[#04eb51]" : "bg-red-500/10 text-red-400"}`}>
                      {c.tipo === "receita" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.nome}</p>
                      <p className="text-xs capitalize text-slate-400">{c.tipo}{c.limite_mensal ? ` · limite ${formatarReal(c.limite_mensal)}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => abrirEditar(c)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setExcluindoId(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo={editandoId ? "Editar categoria" : "Nova categoria"}>
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
          <Button type="submit" className="w-full" loading={salvando}>{editandoId ? "Salvar alterações" : "Criar categoria"}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={excluindoId !== null}
        titulo="Excluir categoria"
        mensagem="Tem certeza? Transações que usam essa categoria não serão apagadas, apenas ficarão sem categoria."
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setExcluindoId(null)}
      />
    </div>
  );
}