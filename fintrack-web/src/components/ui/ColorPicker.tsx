const CORES_DISPONIVEIS = [
  { nome: "Laranja", valor: "#FF9B03" },
  { nome: "Roxo", valor: "#8B5CF6" },
  { nome: "Azul", valor: "#3B82F6" },
  { nome: "Verde", valor: "#10B981" },
  { nome: "Rosa", valor: "#EC4899" },
  { nome: "Vermelho", valor: "#EF4444" },
  { nome: "Amarelo", valor: "#EAB308" },
  { nome: "Cinza", valor: "#64748B" },
];

interface Props {
  value: string;
  onChange: (cor: string) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-300">Cor do cartão</label>
      <div className="flex flex-wrap gap-2.5">
        {CORES_DISPONIVEIS.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => onChange(c.valor)}
            title={c.nome}
            className="h-9 w-9 rounded-full transition-transform hover:scale-110"
            style={{
              background: c.valor,
              boxShadow: value === c.valor ? `0 0 0 2px #0b0f19, 0 0 0 4px ${c.valor}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}