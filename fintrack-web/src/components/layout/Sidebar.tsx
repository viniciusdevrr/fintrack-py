import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Logo from "../Logo";
import ThemeToggle from "./ThemeToggle";
import { itensNavegacao } from "../../lib/navegacao";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("fintrack_token");
    navigate("/login");
  }

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-[rgb(var(--border))] bg-base-2 px-4 py-5 md:flex">
      <div className="mb-8 flex items-center justify-between px-1">
        <Logo size="compacto" />
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-1">
        {itensNavegacao.map(({ to, label, icone: Icone }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500/10 text-brand-400"
                  : "text-[rgb(var(--text-secondary))] hover:bg-base-3 hover:text-[rgb(var(--text-primary))]"
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
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[rgb(var(--text-secondary))] transition-colors hover:bg-danger-500/10 hover:text-danger-400"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sair
      </button>
    </aside>
  );
}