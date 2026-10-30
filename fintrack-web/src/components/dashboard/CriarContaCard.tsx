import { useState, type FormEvent } from "react";
import { Wallet2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { contaApi } from "../../lib/api";
import GlassPanel from "../ui/GlassPanel";

export default function CriarContaCard({ aoCriar }: { aoCriar: () => void }) {
  const [saldoInicial, setSaldoInicial] = useState("0");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await contaApi.criar({ titular: "Minha conta", saldo_inicial: parseFloat(saldoInicial) || 0 });
      aoCriar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar sua conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <GlassPanel className="mx-auto max-w-sm text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9B03]/10 text-[#FF9B03]">
        <Wallet2 className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-white">Vamos configurar sua conta</h2>
      <p className="mt-1.5 text-sm text-slate-400">Informe um saldo inicial para começar a registrar suas transações.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left">
        {erro && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{erro}</p>}
        <Input type="number" step="0.01" label="Saldo inicial" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} />
        <Button type="submit" className="w-full" loading={carregando}>Criar conta</Button>
      </form>
    </GlassPanel>
  );
}