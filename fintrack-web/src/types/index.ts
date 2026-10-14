// Espelha exatamente os schemas Pydantic do backend (src/fintrack/api/schemas.py)

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Categoria {
  id: number;
  nome: string;
  tipo: "receita" | "despesa";
  limite_mensal: number | null;
}

export interface Cartao {
  id: number;
  nome: string;
  limite: number;
  fatura_atual: number;
  limite_disponivel: number;
}

export interface Meta {
  id: number;
  nome: string;
  valor_alvo: number;
  valor_atual: number;
  progresso_percentual: number;
  concluida: boolean;
}

export interface Conta {
  id: number;
  titular: string;
  saldo: number;
}

export interface Transacao {
  id: number;
  tipo: "receita" | "despesa" | "despesa_cartao";
  descricao: string;
  valor: number;
  data: string; // ISO date
  categoria_id: number | null;
}

export interface Alerta {
  tipo: string;
  mensagem: string;
  lido: boolean;
}

export interface ResumoMes {
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface ComparativoMes {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface SimulacaoResultado {
  saldo_atual: number;
  valor_simulado: number;
  saldo_projetado: number;
  ficaria_negativo: boolean;
  categoria?: string | null;
  gasto_atual_categoria?: number | null;
  gasto_projetado_categoria?: number | null;
}
