import { NavLink } from "react-router-dom";
import { itensNavegacao } from "../../lib/navegacao";
import { cn } from "../../lib/utils";

// No celular, mostramos só os 5 itens mais usados na barra inferior
// (o resto fica acessível dentro das próprias telas/links internos).
const itensPrincipais = itensNavegacao.slice(0, 5);

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[rgb(var(--border))] bg-base-2/95 px-1 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur md:hidden">
      {itensPrincipais.map(({ to, label, icone: Icone }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive ? "text-brand-400" : "text-[rgb(var(--text-secondary))]"
            )
          }
        >
          <Icone className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}