import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../Logo";
import { itensNavegacao } from "../../lib/navegacao";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("fintrack_token");
    navigate("/login");
  }

  return (
    <aside className="relative z-10 hidden h-full w-64 flex-col border-r border-white/10 bg-[rgba(15,23,42,0.75)] px-4 py-5 backdrop-blur-xl md:flex">
      <div className="mb-8 px-1">
        <Logo size="compacto" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {itensNavegacao.map(({ to, label, icone: Icone }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#FF9B03]/30 bg-gradient-to-r from-[#FF9B03]/20 to-transparent text-[#FF9B03]"
                  : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <Icone className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={sair}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sair
      </button>
    </aside>
  );
}