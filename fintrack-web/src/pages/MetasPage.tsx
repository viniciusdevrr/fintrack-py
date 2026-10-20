import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, PiggyBank, Pencil, Plus, Target, Trash2 } from "lucide-react";
import { metaApi } from "../lib/api";
import type { Meta } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarReal } from "../lib/utils";

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [aportandoId, setAportandoId] = useState<number | null>(null);
  const [valorAporte, setValorAporte] = useState("");
  const [erroAporte, setErroAporte] = useState("");
  const [salvandoAporte, setSalvandoAporte] = useState(false);

  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregar() {
    setCarregando(true);
    setMetas(await metaApi.listar());
    setCarregando(false);
  }

  useEffect(() => { carregar(); }, []);

  function abrirCriar() {
    setEditandoId(null);
    setNome(""); setValorAlvo(""); setDataLimite("");
    setModalAberto(true);
  }

  function abrirEditar(m: Meta) {
    setEditandoId(m.id);
    setNome(m.nome); setValorAlvo(String(m.valor_alvo)); setDataLimite("");
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const payload = { nome, valor_alvo: parseFloat(valorAlvo), data_limite: dataLimite || null };
      if (editandoId) {
        await metaApi.atualizar(editandoId, payload);
      } else {
        await metaApi.criar(payload);
      }
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a meta.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleAporte(e: FormEvent) {
    e.preventDefault();
    if (!aportandoId) return;
    setErroAporte("");
    setSalvandoAporte(true);
    try {
      await metaApi.aportar(aportandoId, parseFloat(valorAporte));
      setAportandoId(null);
      setValorAporte("");
      carregar();
    } catch (e) {
      setErroAporte(e instanceof Error ? e.message : "Não foi possível registrar o aporte.");
    } finally {
      setSalvandoAporte(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindoId) return;
    await metaApi.excluir(excluindoId);
    setExcluindoId(null);
    carregar();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Metas</h1>
          <p className="text-sm text-slate-400">Defina objetivos financeiros e acompanhe seu progresso.</p>
        </div>
        <Button onClick={abrirCriar}><Plus className="h-4 w-4" /> Nova meta</Button>
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9B03] border-t-transparent" />
        </div>
      ) : metas.length === 0 ? (
        <EmptyState icone={Target} titulo="Nenhuma meta criada" descricao="Defina um objetivo, como uma viagem ou reserva de emergência, e acompanhe o progresso." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {metas.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="group">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{m.nome}</p>
                  <div className="flex items-center gap-1">
                    {m.concluida && <CheckCircle2 className="h-5 w-5 text-[#04eb51]" />}
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => abrirEditar(m)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setExcluindoId(m.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-400">{formatarReal(m.valor_atual)} de {formatarReal(m.valor_alvo)}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#FF9B03] transition-all" style={{ width: `${m.progresso_percentual}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">{m.progresso_percentual}% concluído</p>
                  {!m.concluida && (
                    <button
                      onClick={() => { setAportandoId(m.id); setValorAporte(""); setErroAporte(""); }}
                      className="flex items-center gap-1 text-xs font-medium text-[#FF9B03] hover:text-[#e28800]"
                    >
                      <PiggyBank className="h-3.5 w-3.5" /> Aportar
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo={editandoId ? "Editar meta" : "Nova meta"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}
          <Input label="Nome da meta" placeholder="Ex: Viagem" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="number" step="0.01" label="Valor alvo" value={valorAlvo} onChange={(e) => setValorAlvo(e.target.value)} required />
          <Input type="date" label="Data limite (opcional)" value={dataLimite} onChange={(e) => setDataLimite(e.target.value)} />
          <Button type="submit" className="w-full" loading={salvando}>{editandoId ? "Salvar alterações" : "Criar meta"}</Button>
        </form>
      </Modal>

      <Modal aberto={aportandoId !== null} aoFechar={() => setAportandoId(null)} titulo="Fazer aporte">
        <form onSubmit={handleAporte} className="space-y-4">
          {erroAporte && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erroAporte}</p>}
          <p className="text-sm text-slate-400">Quanto você quer adicionar ao progresso dessa meta?</p>
          <Input type="number" step="0.01" label="Valor do aporte" value={valorAporte} onChange={(e) => setValorAporte(e.target.value)} required autoFocus />
          <Button type="submit" className="w-full" loading={salvandoAporte}>Confirmar aporte</Button>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={excluindoId !== null}
        titulo="Excluir meta"
        mensagem="Essa ação não pode ser desfeita. Tem certeza que deseja excluir essa meta?"
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setExcluindoId(null)}
      />
    </div>
  );
}