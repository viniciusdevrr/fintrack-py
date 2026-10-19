import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { FinanceBackground } from "../../components/ui/FinanceBackground";
import Toast from "../../components/ui/Toats";
import { useToast } from "../../lib/useToast";
import { authApi } from "../../lib/api";
import Logo from "../../components/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { mensagem, visivel, mostrarToast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    mostrarToast("A carregar o seu painel FinTrack...");
    try {
      const { access_token } = await authApi.login({ email, senha });
      localStorage.setItem("fintrack_token", access_token);
      navigate("/");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden select-none bg-[#0b0f19] text-slate-100 font-sans">
      <FinanceBackground />

      <main className="relative z-10 w-full max-w-md p-4 sm:p-6 my-8">
        {/* LOGO BRANDING */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="flex items-center gap-3 mb-1">
            <Logo size="destaque" className="h-12 w-auto" />

          </div>
        </div>

        {/* GLASS CARD */}
        <div className="bg-[rgba(15,23,42,0.75)] backdrop-blur-xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_30px_rgba(255,155,3,0.1)] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF9B03]/50 to-transparent" />

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Bem-vindo de volta</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Entre com sua conta para acessar seu painel financeiro.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">E-mail</label>
              <div className="relative flex items-center rounded-xl bg-slate-900/60 border border-slate-700/80 focus-within:border-[#FF9B03] focus-within:ring-1 focus-within:ring-[#FF9B03] transition duration-200">
                <span className="pl-3.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-transparent py-3 px-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Senha</label>
                <button
                  type="button"
                  onClick={() => mostrarToast("Recuperação de senha enviada para seu e-mail.")}
                  className="text-xs text-[#FF9B03] hover:text-[#e28800] transition font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative flex items-center rounded-xl bg-slate-900/60 border border-slate-700/80 focus-within:border-[#FF9B03] focus-within:ring-1 focus-within:ring-[#FF9B03] transition duration-200">
                <span className="pl-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 px-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="pr-3 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full mt-2 bg-gradient-to-r from-[#FF9B03] via-[#e28800] to-orange-500 hover:from-[#e28800] hover:to-orange-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#FF9B03]/20 flex items-center justify-center gap-2 text-sm transition-all duration-200 active:scale-[0.99]"
            >
              <span>{carregando ? "Entrando..." : "Entrar"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
            <p className="text-xs text-slate-400">
              Ainda não tem conta?{" "}
              <button
                onClick={() => navigate("/cadastro")}
                className="text-[#FF9B03] hover:text-[#e28800] font-semibold transition ml-1 underline decoration-[#FF9B03]/30 underline-offset-4"
              >
                Criar conta gratuita
              </button>
            </p>
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="mt-4 flex items-center justify-center text-xs text-slate-500 px-2">
          <span className="flex items-center gap-1.5">
          </span>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      <Toast mensagem={mensagem} visivel={visivel} />
    </div>
  );
}