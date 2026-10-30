import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Topbar from "./Topbar";
import { FinanceBackground } from "../ui/FinanceBackground";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-slate-100">
      <FinanceBackground />

      <Sidebar />

      <div className="relative z-10 flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-5 md:px-8 md:pb-8 md:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}