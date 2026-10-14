import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authApi } from "../../lib/api";
import Logo from "../../components/Logo";

export default function SignupPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha.length < 8) {
      setErro("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);
    try {
      await authApi.registrar({ nome, email, senha });
      const { access_token } = await authApi.login({ email, senha });
      localStorage.setItem("fintrack_token", access_token);
      navigate("/");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível criar sua conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-1 px-4 py-10">
      <div className="pointer-events-none fixed left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="destaque" className="mb-6" />
          <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">
            Crie sua conta
          </h1>
          <p className="mt-2 max-w-xs text-sm text-[rgb(var(--text-secondary))]">
            Organize suas finanças em um único lugar — leva menos de um
            minuto para começar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-[rgb(var(--border))] bg-base-2 p-6 shadow-card"
        >
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
            id="nome"
            label="Nome"
            placeholder="Seu nome completo"
            icon={<User className="h-4 w-4" />}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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
            placeholder="Mínimo de 8 caracteres"
            icon={<Lock className="h-4 w-4" />}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" loading={carregando}>
            Criar conta <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[rgb(var(--text-secondary))]">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}