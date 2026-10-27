import { NavLink } from "react-router-dom";
import { itensNavegacao } from "../../lib/navegacao";
import { cn } from "../../lib/utils";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[rgba(15,23,42,0.9)] backdrop-blur-xl md:hidden">
      <div className="flex gap-1 overflow-x-auto px-1 pb-[env(safe-area-inset-bottom,0px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {itensNavegacao.map(({ to, label, icone: Icone }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex min-w-[40px] flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                isActive ? "text-[#FF9B03]" : "text-slate-400"
              )
            }
          >
            <Icone className="h-5 w-5" />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}