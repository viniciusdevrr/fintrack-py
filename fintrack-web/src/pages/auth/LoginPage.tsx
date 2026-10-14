import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authApi } from "../../lib/api";
import Logo from "../../components/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
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
    <div className="flex min-h-screen bg-base-1">
      <AuthBrandPanel />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center text-center md:items-start md:text-left">
            <Logo size="padrao" className="mb-6 md:hidden" />
            <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Bem-vindo de volta</h1>
            <p className="mt-1.5 text-sm text-[rgb(var(--text-secondary))]">
              Entre com sua conta para acessar seu painel financeiro.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-6 shadow-card">
            {erro && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-danger-500/10 px-3 py-2 text-sm text-danger-400"
              >
                {erro}
              </motion.p>
            )}

            <Input
              id="email"
              type="email"
              label="E-mail"
              placeholder="voce@email.com"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="senha"
              type="password"
              label="Senha"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" loading={carregando}>
              Entrar <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[rgb(var(--text-secondary))] md:text-left">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-medium text-brand-400 hover:text-brand-300">
              Criar conta gratuita
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}