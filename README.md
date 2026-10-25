# FinTrack — Controle e Análise Financeira Pessoal

Aplicativo full stack de finanças pessoais, desenvolvido do zero como projeto de portfólio. Permite registrar receitas e despesas, organizar por categorias com orçamento, gerenciar cartões de crédito, acompanhar metas financeiras, visualizar relatórios com gráficos interativos, simular decisões financeiras e consultar os próprios dados por meio de um assistente em linguagem natural.

O projeto foi construído em etapas incrementais, com commits documentando cada fase do desenvolvimento, e inclui mais de 60 testes automatizados cobrindo regras de negócio, persistência, autenticação e isolamento de dados entre usuários.


## Status do projeto

O backend está funcional e testado. O frontend cobre todas as telas principais (autenticação, dashboard, transações, categorias, cartões, metas, relatórios, simulador e assistente). As seguintes etapas ainda estão em andamento:

- Arquitetura preparada para PWA (configuração de manifest e ícones concluída; testes finais de instalação em andamento)
- Deploy em produção (backend e frontend ainda não publicados em ambiente acessível publicamente)
- Refinamentos pontuais na funcionalidade de cartões de crédito (quitação de fatura por parcela)

## Funcionalidades

**Autenticação**
Cadastro e login com JWT, senha protegida com bcrypt, isolamento completo de dados por usuário.

**Transações**
Registro de receitas e despesas, com filtros por tipo e histórico completo.

**Categorias**
Organização de transações por categoria, com limite de gasto mensal opcional.

**Cartões de crédito**
Cadastro de cartões com cor personalizada, compras parceladas, cálculo automático de fatura e alerta visual quando o vencimento está próximo.

**Metas financeiras**
Definição de objetivos financeiros com acompanhamento de progresso por meio de aportes dedicados.

**Alertas**
Verificação automática de orçamento, com aviso quando uma categoria ultrapassa o limite definido.

**Relatórios**
Gráficos interativos de comparativo mensal, gastos por categoria e ranking dos maiores gastos ao longo do tempo.

**Simulador**
Projeção de saldo e impacto de um gasto hipotético, sem alterar dados reais.

**Assistente financeiro**
Responde perguntas em português sobre os gastos do usuário, usando reconhecimento de padrões (regex) combinado com análise de dados em Pandas, sem depender de serviços pagos de inteligência artificial.

## Arquitetura

O backend foi construído seguindo separação em camadas, uma decisão deliberada para garantir testabilidade e manutenção a longo prazo, mesmo em um projeto de portfólio:

- **Domínio**: classes que concentram as regras de negócio, aplicando herança, encapsulamento e polimorfismo (por exemplo, `Transacao` como classe base de `Receita`, `Despesa` e `DespesaCartao`).
- **Repositório**: isola completamente as consultas ao banco de dados do resto da aplicação, convertendo objetos de domínio em registros e vice-versa, sempre reaproveitando as validações já definidas no domínio.
- **Serviços**: regras que envolvem mais de uma entidade ao mesmo tempo, como verificação de orçamento, status de fatura de cartão e autenticação.
- **API**: rotas protegidas por token JWT, com isolamento de dados garantido tanto nas consultas ao banco quanto na validação de entrada.

O frontend consome a API por meio de um cliente HTTP centralizado, com tratamento unificado de autenticação e erros.

## Stack técnica

**Backend**
Python, FastAPI, SQLAlchemy, SQLite (desenvolvimento) e PostgreSQL (produção), Pydantic, JWT, bcrypt, Pandas, Matplotlib, Pytest.

**Frontend**
React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router.

**Infraestrutura planejada**
Neon (PostgreSQL), Render (backend) e Vercel (frontend), com suporte a PWA via vite-plugin-pwa.

## Estrutura do projeto

fintrack-py/
src/fintrack/
modelos/ Classes de dominio (POO)
repositorio/ Persistencia (SQLAlchemy)
servicos/ Regras de negocio que envolvem multiplas entidades
analise/ Relatorios, graficos, simulador e assistente
auth/ Seguranca (hash de senha, JWT)
api/ Rotas e schemas (FastAPI)
tests/ Testes automatizados (pytest)
fintrack-web/ Frontend (React, TypeScript, Vite)
src/
pages/ Telas do aplicativo
components/ Componentes reutilizaveis
lib/ Cliente de API e utilitarios

## Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone [https://github.com/viniciusdevrr/fintrack-py.git]
```

### 2. Configurar o Backend
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn fintrack.api.app:app --reload --app-dir src
```

A API fica disponível em `http://localhost:8000`, com documentação interativa em `http://localhost:8000/docs`.

### 3. Configurar o Frontend (Em outro Terminal)
```bash
cd fintrack-web
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

### Variáveis de ambiente

O backend requer um arquivo `.env` na raiz do projeto, com base no modelo disponível em `.env.example`:

SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./fintrack.db

## Testes

Certifique-se de que o ambiente virtual está ativado antes de rodar os testes.

```
python -m pytest -v
```

A suíte cobre validações de domínio, persistência, autenticação, isolamento de dados entre usuários, geração de relatórios, simulador e assistente financeiro.

## Roadmap

Concluído:
- Modelagem de domínio com POO
- Persistência com SQLAlchemy
- Autenticação JWT com isolamento por usuário
- API REST completa, documentada e testada
- Análise de dados com Pandas e geração de gráficos
- Frontend completo em React com interface responsiva

Em andamento:
- Arquitetura preparada para PWA (configuração de manifest e ícones concluída; testes finais de instalação em andamento)
- Deploy em produção
- Refinamento da lógica de quitação de fatura de cartão por parcela

## Licença

Este projeto está licenciado sob os termos da licença MIT.

## Autor

Vinícius Rodrigues Rocha
GitHub: github.com/viniciusdevrr
LinkedIn: linkedin.com/in/viniciusrodriguesdf