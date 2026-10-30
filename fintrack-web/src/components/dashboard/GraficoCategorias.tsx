import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatarReal } from "../../lib/utils";

const CORES = ["#FF9B03", "#04eb51", "#60A5FA", "#F87171", "#A78BFA", "#FB923C"];

interface Props {
  dados: Record<string, number>;
}

export default function GraficoCategorias({ dados }: Props) {
  const entradas = Object.entries(dados).map(([nome, valor]) => ({ nome, valor }));

  if (entradas.length === 0) {
    return <div className="flex h-60 items-center justify-center text-sm text-slate-400">Nenhuma despesa registrada este mês ainda.</div>;
  }

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={entradas} dataKey="valor" nameKey="nome" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {entradas.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(valor: number) => formatarReal(valor)}
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(255,155,3,0.3)",
              borderRadius: 12,
              fontSize: 13,
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {entradas.map(({ nome }, i) => (
          <div key={nome} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ background: CORES[i % CORES.length] }} />
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}