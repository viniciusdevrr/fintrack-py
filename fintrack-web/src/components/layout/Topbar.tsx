import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Logo from "../Logo";
import { alertaApi } from "../../lib/api";

export default function Topbar() {
  const [totalAlertas, setTotalAlertas] = useState(0);

  useEffect(() => {
    alertaApi
      .listar()
      .then((alertas) => setTotalAlertas(alertas.length))
      .catch(() => setTotalAlertas(0));
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[rgb(var(--border))] bg-base-1/90 px-4 py-3 backdrop-blur md:hidden">
      <Logo size="compacto" />

      <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]">
        <Bell className="h-5 w-5" />
        {totalAlertas > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500" />
        )}
      </button>
    </header>
  );
}