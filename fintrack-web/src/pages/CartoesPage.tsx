import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import { cartaoApi } from "../lib/api";
import type { Cartao } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";
import { formatarReal } from "../lib/utils";

export default function CartoesPage() {
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const [nome, setNome] = useState("");
  const [limite, setLimite] = useState("");
  const [fechamento, setFechamento] = useState("5");
  const [vencimento, setVencimento] = useState("12");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await cartaoApi.criar({ nome, limite: parseFloat(limite), dia_fechamento: parseInt(fechamento), dia_vencimento: parseInt(vencimento) });
      setNome(""); setLimite("");
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar o cartão.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Cartões</h1>
          <p className="text-sm text-slate-400">Acompanhe limite, fatura e vencimento dos seus cartões.</p>
        </div>
        <Button onClick={() => setModalAberto(true)}><Plus className="h-4 w-4" /> Novo cartão</Button>
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
                <GlassCard className="relative overflow-hidden">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#FF9B03]/15 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <p className="font-semibold text-white">{c.nome}</p>
                    <CreditCard className="h-5 w-5 text-[#FF9B03]" />
                  </div>
                  <p className="relative mt-4 text-xs text-slate-400">Fatura atual</p>
                  <p className="relative text-xl font-bold text-white">{formatarReal(c.fatura_atual)}</p>
                  <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#FF9B03]" style={{ width: `${usoPercentual}%` }} />
                  </div>
                  <p className="relative mt-1.5 text-xs text-slate-400">{formatarReal(c.limite_disponivel)} disponível de {formatarReal(c.limite)}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Novo cartão">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}
          <Input label="Nome do cartão" placeholder="Ex: Nubank" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input type="number" step="0.01" label="Limite" value={limite} onChange={(e) => setLimite(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" min={1} max={28} label="Dia de fechamento" value={fechamento} onChange={(e) => setFechamento(e.target.value)} required />
            <Input type="number" min={1} max={28} label="Dia de vencimento" value={vencimento} onChange={(e) => setVencimento(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" loading={salvando}>Criar cartão</Button>
        </form>
      </Modal>
    </div>
  );
}