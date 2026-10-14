import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatarReal } from "../../lib/utils";

const CORES = ["#F5A623", "#34D399", "#60A5FA", "#F87171", "#A78BFA", "#FB923C"];

interface Props {
  dados: Record<string, number>;
}

export default function GraficoCategorias({ dados }: Props) {
  const entradas = Object.entries(dados).map(([nome, valor]) => ({ nome, valor }));

  if (entradas.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-[rgb(var(--text-secondary))]">
        Nenhuma despesa registrada este mês ainda.
      </div>
    );
  }

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={entradas}
            dataKey="valor"
            nameKey="nome"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {entradas.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(valor: number) => formatarReal(valor)}
            contentStyle={{
              background: "rgb(var(--bg-elevated))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {entradas.map(({ nome }, i) => (
          <div key={nome} className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-secondary))]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: CORES[i % CORES.length] }}
            />
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}