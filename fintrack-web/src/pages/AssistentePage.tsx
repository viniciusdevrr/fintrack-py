import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { assistenteApi } from "../lib/api";
import GlassPanel from "../components/ui/GlassPanel";

interface Mensagem {
  id: number;
  autor: "usuario" | "assistente";
  texto: string;
}

const perguntasSugeridas = [
  "Qual meu saldo?",
  "Quanto gastei esse mês?",
  "Onde eu mais gasto?",
  "Comparado ao mês passado?",
];

let proximoId = 1;

export default function AssistentePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: proximoId++,
      autor: "assistente",
      texto: "Olá! Sou o assistente financeiro do FinTrack. Pergunte sobre seus gastos, saldo ou categorias.",
    },
  ]);
  const [pergunta, setPergunta] = useState("");
  const [digitando, setDigitando] = useState(false);
  const fimDaListaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, digitando]);

  async function enviarPergunta(texto: string) {
    if (!texto.trim()) return;
    setMensagens((atual) => [...atual, { id: proximoId++, autor: "usuario", texto }]);
    setPergunta("");
    setDigitando(true);

    try {
      const { resposta } = await assistenteApi.perguntar(texto);
      setMensagens((atual) => [...atual, { id: proximoId++, autor: "assistente", texto: resposta }]);
    } catch (e) {
      setMensagens((atual) => [
        ...atual,
        {
          id: proximoId++,
          autor: "assistente",
          texto: e instanceof Error ? e.message : "Não consegui responder agora.",
        },
      ]);
    } finally {
      setDigitando(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    enviarPergunta(pergunta);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl flex-col md:h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white">
          <Bot className="h-5 w-5 text-[#FF9B03]" /> Assistente financeiro
        </h1>
        <p className="text-sm text-slate-400">Pergunte, em português, sobre seus próprios gastos.</p>
      </div>

      <GlassPanel className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {mensagens.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2.5 ${m.autor === "usuario" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    m.autor === "usuario" ? "bg-slate-700 text-slate-200" : "bg-[#FF9B03]/15 text-[#FF9B03]"
                  }`}
                >
                  {m.autor === "usuario" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.autor === "usuario"
                      ? "bg-slate-800 text-slate-100"
                      : "border border-white/10 bg-slate-900/60 text-slate-200"
                  }`}
                >
                  {m.texto}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {digitando && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF9B03]/15 text-[#FF9B03]">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex gap-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-slate-400"
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={fimDaListaRef} />
        </div>

        {mensagens.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-800/80 px-5 py-3">
            {perguntasSugeridas.map((p) => (
              <button
                key={p}
                onClick={() => enviarPergunta(p)}
                className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-[#FF9B03]/60 hover:text-[#FF9B03]"
              >
                <Sparkles className="h-3 w-3" /> {p}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-800/80 p-4">
          <input
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Pergunte sobre suas finanças..."
            className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FF9B03] focus:ring-1 focus:ring-[#FF9B03]"
          />
          <button
            type="submit"
            disabled={digitando}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF9B03] via-[#e28800] to-orange-500 px-4 text-slate-950 transition-all active:scale-95 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}