import { type LucideIcon } from "lucide-react";

interface Props {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
}

export default function EmptyState({ icone: Icone, titulo, descricao }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-14 text-center backdrop-blur-sm">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9B03]/10 text-[#FF9B03]">
        <Icone className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-white">{titulo}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400">{descricao}</p>
    </div>
  );
}