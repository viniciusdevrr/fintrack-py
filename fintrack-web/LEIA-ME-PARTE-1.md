# FinTrack Web — Parte 1: Scaffold + Design System + Autenticação

## O que tem nessa parte
- Projeto Vite + React + TypeScript + Tailwind configurado do zero
- Design system (cores, tipografia, sombras) em `tailwind.config.ts` e `src/index.css`
- Cliente de API completo (`src/lib/api.ts`) já cobrindo TODOS os endpoints do backend
- Tipos TypeScript espelhando os schemas reais da API (`src/types/index.ts`)
- Componentes de UI base: `Button` e `Input`
- Telas de Login e Cadastro, já integradas de verdade com `/auth/login` e `/auth/registrar`
- Proxy configurado: o frontend fala com `http://127.0.0.1:8000` sem problema de CORS

## Como instalar no seu projeto

1. Copie TODOS os arquivos desta entrega para uma pasta `fintrack-web/` 
   (pode ser dentro do mesmo repositório `fintrack-py`, numa pasta irmã de `src/`)

2. Instale as dependências:
   ```
   cd fintrack-web
   npm install
   ```

3. Em um terminal, suba o backend (como sempre):
   ```
   uvicorn fintrack.api.app:app --reload --app-dir src
   ```

4. Em outro terminal, suba o frontend:
   ```
   npm run dev
   ```

5. Acesse: http://localhost:5173

## O que testar
- Criar uma conta nova pela tela de Cadastro
- Fazer login
- Ver o redirecionamento pro placeholder do Dashboard (que chega na Parte 3)
- Testar erro: tentar logar com senha errada (deve mostrar a mensagem de erro, vinda 
  de verdade da API — "E-mail ou senha incorretos")

## Próxima parte
Parte 2: Layout geral com Sidebar, navegação entre seções e toggle de tema claro/escuro.
