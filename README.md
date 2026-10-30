# FinTrack — App de Finanças Pessoais (Web + Mobile)

O FinTrack é uma aplicação full-stack completa e moderna de gestão e análise financeira pessoal, desenvolvida com arquitetura desacoplada em camadas. Permite registrar receitas e despesas, organizar por categorias com limites de orçamento, gerenciar cartões de crédito com controle de faturas, acompanhar metas financeiras, visualizar relatórios interativos, simular decisões e consultar os próprios dados por meio de um assistente inteligente em linguagem natural.

O projeto conta com design responsivo (com suporte a PWA para instalação no celular) e inclui mais de 60 testes automatizados cobrindo regras de negócio, persistência, autenticação JWT e isolamento estrito de dados entre usuários.

---

## Demonstração Visual

<p align="center">
  <img src="docs/gifs/login-splash.gif" width="45%" alt="Login e Splash Screen" />
</p>

---

## Status do Projeto

**Concluído (v1.0.0)**

O projeto está totalmente finalizado, com backend robusto, cobertura de testes automatizados e frontend completo cobrindo todas as telas principais (autenticação, dashboard, transações, categorias, cartões, metas, relatórios, simulador e assistente). Conta também com suporte a PWA testado e aprovado para instalação em dispositivos móveis.

---

## Funcionalidades

* **Autenticação:** Cadastro e login com JWT, senha protegida com bcrypt e isolamento completo de dados por usuário.
* **Transações:** Registro de receitas e despesas, com filtros por tipo e histórico completo.
* **Categorias:** Organização de transações por categoria, com limite de gasto mensal opcional.
* **Cartões de crédito:** Cadastro de cartões com cor personalizada, compras parceladas, cálculo automático de fatura e alerta visual quando o vencimento está próximo.
* **Metas financeiras:** Definição de objetivos financeiros com acompanhamento de progresso por meio de aportes dedicados e modais responsivos centralizados.
* **Alertas:** Verificação automática de orçamento, com aviso quando uma categoria ultrapassa o limite definido.
* **Relatórios:** Gráficos interativos de comparativo mensal, gastos por categoria e ranking dos maiores gastos ao longo do tempo.
* **Simulador:** Projeção de saldo e impacto de um gasto hipotético, sem alterar dados reais.
* **Assistente financeiro:** Responde perguntas em português sobre os gastos do usuário, usando reconhecimento de padrões (regex) combinado com análise de dados em Pandas, sem depender de serviços pagos de inteligência artificial.

---

## Arquitetura

O backend foi construído seguindo separação estrita em camadas, garantindo testabilidade e manutenção a longo prazo:

* **Domínio:** Classes que concentram as regras de negócio, aplicando herança, encapsulamento e polimorfismo (por exemplo, `Transacao` como classe base de `Receita`, `Despesa` e `DespesaCartao`).
* **Repositório:** Isola completamente as consultas ao banco de dados do resto da aplicação, convertendo objetos de domínio em registros e vice-versa, sempre reaproveitando as validações já definidas no domínio.
* **Serviços:** Regras que envolvem mais de uma entidade ao mesmo tempo, como verificação de orçamento, status de fatura de cartão e autenticação.
* **API:** Rotas protegidas por token JWT, com isolamento de dados garantido tanto nas consultas ao banco quanto na validação de entrada via Pydantic.

O frontend consome a API por meio de um cliente HTTP centralizado, com tratamento unificado de autenticação e erros.

---

## Stack Técnica

* **Backend:** Python, FastAPI, SQLAlchemy, SQLite (desenvolvimento) / PostgreSQL (produção), Pydantic, JWT, bcrypt, Pandas, Matplotlib, Pytest.
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router.
* **Infraestrutura / PWA:** Suporte a PWA via `vite-plugin-pwa`, preparado para deploy na Vercel (frontend) e Render/Neon (backend/database).

---

## Estrutura do Projeto

```bash
fintrack-py/
├── src/fintrack/
│   ├── modelos/      # Classes de dominio (POO)
│   ├── repositorio/  # Persistencia (SQLAlchemy)
│   ├── servicos/     # Regras de negocio que envolvem multiplas entidades
│   ├── analise/      # Relatorios, graficos, simulador e assistente
│   ├── auth/         # Seguranca (hash de senha, JWT)
│   ├── api/          # Rotas e schemas (FastAPI)
│   └── tests/        # Testes automatizados (pytest)
└── fintrack-web/     # Frontend (React, TypeScript, Vite)
    └── src/
        ├── pages/      # Telas do aplicativo
        ├── components/ # Componentes reutilizaveis
        └── lib/        # Cliente de API e utilitarios
```

## Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone [https://github.com/viniciusdevrr/fintrack-py.git]
cd fintrack-py
```

### 2. Configurar o Backend
```bash
python -m venv .venv

# No Windows:
.venv\Scripts\activate
# No Linux/Mac:
source .venv/bin/activate

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

```bash
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./fintrack.db
```

## Testes

Certifique-se de que o ambiente virtual está ativado antes de rodar os testes.

```bash
python -m pytest -v
```

A suíte cobre validações de domínio, persistência, autenticação, isolamento de dados entre usuários, geração de relatórios, simulador e assistente financeiro.

## Licença

Este projeto está licenciado sob os termos da licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Autor

```bash
Vinícius Rodrigues Rocha
GitHub: github.com/viniciusdevrr
LinkedIn: linkedin.com/in/viniciusrodriguesdf
```