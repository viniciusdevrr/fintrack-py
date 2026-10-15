import { type LucideIcon } from "lucide-react";

interface Props {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
}

export default function EmptyState({ icone: Icone, titulo, descricao }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border))] py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-base-3 text-[rgb(var(--text-secondary))]">
        <Icone className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-[rgb(var(--text-primary))]">{titulo}</p>
      <p className="mt-1 max-w-xs text-sm text-[rgb(var(--text-secondary))]">{descricao}</p>
    </div>
  );
}