import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CreditCard, Pencil, Plus, Receipt, Trash2 } from "lucide-react";
import { cartaoApi } from "../lib/api";
import type { Cartao } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarReal } from "../lib/utils";

export default function CartoesPage() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [limite, setLimite] = useState("");
  const [fechamento, setFechamento] = useState("5");
  const [vencimento, setVencimento] = useState("12");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [comprandoId, setComprandoId] = useState<number | null>(null);
  const [descricaoCompra, setDescricaoCompra] = useState("");
  const [valorCompra, setValorCompra] = useState("");
  const [parcelasCompra, setParcelasCompra] = useState("1");
  const [erroCompra, setErroCompra] = useState("");
  const [salvandoCompra, setSalvandoCompra] = useState(false);

  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregar() {
    setCarregando(true);
    setErroCarregamento("");
    try {
      setCartoes(await cartaoApi.listar());
    } catch (e) {
      setErroCarregamento(e instanceof Error ? e.message : "Não foi possível carregar seus cartões.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function abrirCriar() {
    setEditandoId(null);
    setNome(""); setLimite(""); setFechamento("5"); setVencimento("12");
    setModalAberto(true);
  }

  function abrirEditar(c: Cartao) {
    setEditandoId(c.id);
    setNome(c.nome); setLimite(String(c.limite));
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      if (editandoId) {
        await cartaoApi.atualizar(editandoId, { nome, limite: parseFloat(limite) });
      } else {
        await cartaoApi.criar({ nome, limite: parseFloat(limite), dia_fechamento: parseInt(fechamento), dia_vencimento: parseInt(vencimento) });
      }
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o cartão.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleCompra(e: FormEvent) {
    e.preventDefault();
    if (!comprandoId) return;
    setErroCompra("");
    setSalvandoCompra(true);
    try {
      await cartaoApi.lancarCompra(comprandoId, {
        descricao: descricaoCompra,
        valor: parseFloat(valorCompra),
        parcelas: parseInt(parcelasCompra) || 1,
      });
      setComprandoId(null);
      setDescricaoCompra(""); setValorCompra(""); setParcelasCompra("1");
      carregar();
    } catch (e) {
      setErroCompra(e instanceof Error ? e.message : "Não foi possível lançar a compra.");
    } finally {
      setSalvandoCompra(false);
    }
  }

  async function confirmarExclusao() {
    if (!excluindoId) return;
    await cartaoApi.excluir(excluindoId);
    setExcluindoId(null);
    carregar();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Cartões</h1>
          <p className="text-sm text-slate-400">Acompanhe limite, fatura e vencimento dos seus cartões.</p>
        </div>
        <Button onClick={abrirCriar}><Plus className="h-4 w-4" /> Novo cartão</Button>
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF9B03] border-t-transparent" />
        </div>
      ) : erroCarregamento ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{erroCarregamento}</div>
      ) : cartoes.length === 0 ? (
        <EmptyState icone={CreditCard} titulo="Nenhum cartão cadastrado" descricao="Adicione seus cartões de crédito para acompanhar fatura e limite disponível." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cartoes.map((c, i) => {
            const usoPercentual = Math.min(100, (c.fatura_atual / c.limite) * 100);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="group relative overflow-hidden">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#FF9B03]/15 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <p className="font-semibold text-white">{c.nome}</p>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-5 w-5 text-[#FF9B03]" />
                      <div className="ml-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => abrirEditar(c)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setExcluindoId(c.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="relative mt-4 text-xs text-slate-400">Fatura atual</p>
                  <p className="relative text-xl font-bold text-white">{formatarReal(c.fatura_atual)}</p>

                  <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#FF9B03]" style={{ width: `${usoPercentual}%` }} />
                  </div>
                  <p className="relative mt-1.5 text-xs text-slate-400">{formatarReal(c.limite_disponivel)} disponível de {formatarReal(c.limite)}</p>

                  <button
                    onClick={() => { setComprandoId(c.id); setDescricaoCompra(""); setValorCompra(""); setParcelasCompra("1"); setErroCompra(""); }}
                    className="relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#FF9B03]/30 bg-[#FF9B03]/10 py-2 text-xs font-medium text-[#FF9B03] transition-colors hover:bg-[#FF9B03]/20"
                  >
                    <Receipt className="h-3.5 w-3.5" /> Lançar compra
                  </button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo={editandoId ? "Editar cartão" : "Novo cartão"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}
          <Input label="Nome do cartão" placeholder="Ex: Nubank" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="number" step="0.01" label="Limite" value={limite} onChange={(e) => setLimite(e.target.value)} required />
          {!editandoId && (
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" min={1} max={28} label="Dia de fechamento" value={fechamento} onChange={(e) => setFechamento(e.target.value)} required />
              <Input type="number" min={1} max={28} label="Dia de vencimento" value={vencimento} onChange={(e) => setVencimento(e.target.value)} required />
            </div>
          )}
          <Button type="submit" className="w-full" loading={salvando}>{editandoId ? "Salvar alterações" : "Criar cartão"}</Button>
        </form>
      </Modal>

      <Modal aberto={comprandoId !== null} aoFechar={() => setComprandoId(null)} titulo="Lançar compra no cartão">
        <form onSubmit={handleCompra} className="space-y-4">
          {erroCompra && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erroCompra}</p>}
          <Input label="Descrição" placeholder="Ex: Notebook" value={descricaoCompra} onChange={(e) => setDescricaoCompra(e.target.value)} required autoFocus />
          <Input type="number" step="0.01" label="Valor total" value={valorCompra} onChange={(e) => setValorCompra(e.target.value)} required />
          <Input type="number" min={1} max={24} label="Número de parcelas" value={parcelasCompra} onChange={(e) => setParcelasCompra(e.target.value)} required />
          <Button type="submit" className="w-full" loading={salvandoCompra}>Lançar compra</Button>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={excluindoId !== null}
        titulo="Excluir cartão"
        mensagem="Tem certeza? O histórico de compras desse cartão também será removido."
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setExcluindoId(null)}
      />
    </div>
  );
}