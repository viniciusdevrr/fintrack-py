import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import Logo from "../Logo";
import { alertaApi } from "../../lib/api";

export default function Topbar() {
  const navigate = useNavigate();
  const [totalAlertas, setTotalAlertas] = useState(0);

  useEffect(() => {
    alertaApi.listar().then((a) => setTotalAlertas(a.length)).catch(() => setTotalAlertas(0));
  }, []);

  function sair() {
    localStorage.removeItem("fintrack_token");
    navigate("/login");
  }

  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-[rgba(15,23,42,0.75)] px-4 py-3 backdrop-blur-xl md:hidden">
      <Logo size="compacto" />
      <div className="flex items-center gap-1">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-white">
          <Bell className="h-5 w-5" />
          {totalAlertas > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
        </button>
        <button onClick={sair} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-red-400">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}