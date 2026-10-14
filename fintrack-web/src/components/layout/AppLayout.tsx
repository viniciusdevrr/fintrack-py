import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Topbar from "./Topbar";

/**
 * Molde compartilhado por todas as telas internas do app (depois do login).
 * <Outlet /> é onde o React Router "encaixa" a página da rota atual.
 */
export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-base-1">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8 md:pt-6">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}