import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plus, Target } from "lucide-react";
import { metaApi } from "../lib/api";
import type { Meta } from "../types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { formatarReal } from "../lib/utils";

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [nome, setNome] = useState("");
  const [valorAlvo, setValorAlvo] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    const dados = await metaApi.listar();
    setMetas(dados);
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
      await metaApi.criar({
        nome,
        valor_alvo: parseFloat(valorAlvo),
        data_limite: dataLimite || null,
      });
      setNome("");
      setValorAlvo("");
      setDataLimite("");
      setModalAberto(false);
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar a meta.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">Metas</h1>
          <p className="text-sm text-[rgb(var(--text-secondary))]">
            Defina objetivos financeiros e acompanhe seu progresso.
          </p>
        </div>
        <Button onClick={() => setModalAberto(true)}>
          <Plus className="h-4 w-4" /> Nova meta
        </Button>
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : metas.length === 0 ? (
        <EmptyState
          icone={Target}
          titulo="Nenhuma meta criada"
          descricao="Defina um objetivo, como uma viagem ou reserva de emergência, e acompanhe o progresso."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {metas.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[rgb(var(--text-primary))]">{m.nome}</p>
                {m.concluida && <CheckCircle2 className="h-5 w-5 text-brand-400" />}
              </div>

              <p className="mt-3 text-sm text-[rgb(var(--text-secondary))]">
                {formatarReal(m.valor_atual)} de {formatarReal(m.valor_alvo)}
              </p>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-base-3">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${m.progresso_percentual}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-[rgb(var(--text-secondary))]">
                {m.progresso_percentual}% concluído
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} aoFechar={() => setModalAberto(false)} titulo="Nova meta">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && <p className="rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-400">{erro}</p>}

          <Input label="Nome da meta" placeholder="Ex: Viagem" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input
            type="number"
            step="0.01"
            label="Valor alvo"
            value={valorAlvo}
            onChange={(e) => setValorAlvo(e.target.value)}
            required
          />
          <Input
            type="date"
            label="Data limite (opcional)"
            value={dataLimite}
            onChange={(e) => setDataLimite(e.target.value)}
          />

          <Button type="submit" className="w-full" loading={salvando}>
            Criar meta
          </Button>
        </form>
      </Modal>
    </div>
  );
}