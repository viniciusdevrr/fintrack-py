import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { formatarData, formatarReal } from "../../lib/utils";
import type { Transacao } from "../../types";

interface Props {
  transacoes: Transacao[];
}

export default function TransacoesRecentes({ transacoes }: Props) {
  if (transacoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Receipt className="mb-2 h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-400">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/10">
      {transacoes.slice(0, 6).map((t) => {
        const receita = t.tipo === "receita";
        return (
          <li key={t.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${receita ? "bg-[#04eb51]/10 text-[#04eb51]" : "bg-red-500/10 text-red-400"}`}>
                {receita ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.descricao}</p>
                <p className="text-xs text-slate-400">{formatarData(t.data)}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${receita ? "text-[#04eb51]" : "text-red-400"}`}>
              {receita ? "+" : "-"} {formatarReal(t.valor)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}