import { cn } from "../lib/utils";

type TamanhoLogo = "compacto" | "padrao" | "destaque" | "hero";

interface LogoProps {
  size?: TamanhoLogo;
  className?: string;
}

const dimensoes = {
  compacto: { icon: "w-10 h-10", text: "text-xl", sub: "text-[7px]", gap: "gap-3" },
  padrao: { icon: "w-9 h-9", text: "text-2xl", sub: "text-[8px]", gap: "gap-2.5" },
  destaque: { icon: "w-16 h-16", text: "text-3xl", sub: "text-[9px]", gap: "gap-3" },
  hero: {icon: "w-24 h-24", text: "text-6xl", sub: "text-[14px]", gap: "gap-6" }
};

export default function Logo({ size = "padrao", className }: LogoProps) {
  const currentSize = dimensoes[size];

  return (
    <div className={cn("flex items-center select-none font-sans", currentSize.gap, className)}>
      {/* SÍMBOLO DA LOGO EM SVG (Eixo em L + 3 Barras em Destaque) */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <svg
          className={cn(currentSize.icon, "text-[#FF9B03] filter drop-shadow-[0_0_6px_rgba(255,155,3,0.45)]")}
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Eixo L (Linha vertical esquerda + base horizontal) */}
          <path
            d="M 12 8 V 68 H 92"
            stroke="#FF9B03"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3 Barras Cromaticamente Alinhadas */}
          {/* Barra 1 (Pequena) */}
          <rect x="23" y="40" width="16" height="22" rx="2" fill="#FF9B03" />

          {/* Barra 2 (Média) */}
          <rect x="46" y="24" width="16" height="38" rx="2" fill="#FF9B03" />

          {/* Barra 3 (Grande) */}
          <rect x="69" y="10" width="16" height="52" rx="2" fill="#FF9B03" />
        </svg>
      </div>

      {/* TEXTO FINTRACK + SUBTÍTULO (Font Sans-Serif Limpa) */}
      <div className="flex flex-col text-left justify-center">
        <span className={cn("font-extrabold tracking-tight text-white flex items-center leading-none", currentSize.text)}>
          Fin<span className="text-[#FF9B03]">Track</span>
        </span>
        <span className={cn("tracking-[0.45em] font-semibold text-white uppercase mt-1 leading-none", currentSize.sub)}>
          FINANCE TRACK
        </span>
      </div>
    </div>
  );
}