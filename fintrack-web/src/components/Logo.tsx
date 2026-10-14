import logoImg from "../assets/logo.png";
import { cn } from "../lib/utils";

type TamanhoLogo = "compacto" | "padrao" | "destaque" | "hero";

interface LogoProps {
  /** compacto = sidebar/topbar · padrao = uso geral · hero = tela de abertura/autenticação */
  size?: TamanhoLogo;
  className?: string;
}

const tamanhos: Record<TamanhoLogo, string> = {
  compacto: "h-10 w-auto",       // sidebar / topbar — antes h-7, bem pequeno
  padrao: "h-12 w-auto",
  destaque: "h-20 w-auto md:h-24", // cabeçalho do login/cadastro — antes h-14/h-16
  hero: "h-auto w-[min(78vw,420px)] max-h-[40vh] md:w-[min(42vw,560px)] md:max-h-[46vh]",
};

/**
 * Logo oficial do FinTrack — usada em toda a interface (splash, sidebar,
 * topbar, telas de autenticação) a partir deste único componente.
 */
export default function Logo({ size = "padrao", className }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt="FinTrack — Finance Track"
      className={cn(tamanhos[size], "select-none object-contain", className)}
      draggable={false}
    />
  );
}