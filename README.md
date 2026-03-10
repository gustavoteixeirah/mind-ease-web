# 🧠 MindEase – Aplicativo de Foco com Acessibilidade Cognitiva
Aplicação web construída com **Next.js** para apoiar pessoas com dificuldades de foco e organização, oferecendo uma experiência simples, acessível e consistente para gerenciar sessões de foco, tarefas do dia e preferências pessoais.
---
## 🚀 Funcionalidades
### 🔐 Autenticação & Perfil
- **Login e Cadastro**: Autenticação por e‑mail/senha usando **Stack Auth** (`@stackframe/stack`).
- **Redirecionamento Inteligente**:
  - Usuário logado em `/` é redirecionado para `/dashboard`.
  - Usuário não autenticado em `/dashboard`, `/tarefas` ou `/perfil` é redirecionado para `/`.
- **Gestão de Perfil**:
  - Nome exibido na Home e editável na aba Perfil.
  - Nome salvo diretamente no perfil do Stack (campo `displayName`).
- **Logout Seguro**:
  - Botão **“Sair”** na sidebar encerra a sessão e retorna para a tela de login.
### 📋 Home & Tarefas
- **Dashboard de Foco**:
  - Saudação personalizada com nome do usuário.
  - Data em formato amigável (ex.: `Segunda - 10 de março`).
  - Seletor de energia: **Calmo**, **Presente**, **Focado**.
- **Gestão de Tarefas Unificada**:
  - Contexto de tarefas compartilhado entre Home e `/tarefas`.
  - Tarefas do dia com status concluída/não concluída.
  - Seção **“Foque agora”** com uma tarefa em destaque.
  - Botão **“Ver todas”** leva para a página de Tarefas.
- **Página de Tarefas**:
  - Mesmas tarefas exibidas na Home.
  - Clique ou teclado para marcar/desmarcar como concluída.
  - Botão **“Focar / Em foco”** para definir/remover a tarefa em destaque.
  - Link de retorno para o Dashboard.
### 🎛️ Preferências e Tema
- **Perfil com Preferências Globais**:
  - **Tamanho de texto**: Compacto / Conforto / Acessível.
  - **Minutos de foco**: 25, 30 ou 35.
  - **Minutos de pausa**: 2, 5 ou 10.
  - **Tema de cor**: 6 opções de cores suaves.
- **Aplicação Global de Tema**:
  - A cor do tema controla uma variável CSS `--mindease-accent`, usada em:
    - Pills selecionadas (Perfil, Home, Tarefas).
    - Avatar na Home.
    - Destaques e outlines de foco em vários componentes.
- **Persistência Local**:
  - Preferências salvas em `localStorage` e reaplicadas automaticamente ao recarregar o app.
### 🧭 Navegação & UX
- **Sidebar Fixa**:
  - Itens: **Home**, **Tarefas**, **Perfil**, botão **“+”** (atalho para Tarefas) e **“Sair”**.
  - Destaque visual para a rota ativa.
- **Layout Responsivo**:
  - Funciona bem em telas pequenas e grandes.
  - Blocos centrais (Home/Perfil/Tarefas) com cards brancos e bordas arredondadas.
- **Identidade Visual**:
  - Ícone `mindEase-icon-preto.svg` configurado como favicon.
  - Visual leve, com fundo em gradiente suave e cards em destaque.
### ♿ Acessibilidade
- **Teclado & Leitor de Tela**:
  - Skip link **“Pular para o conteúdo principal”**.
  - Foco visível em botões, links e itens clicáveis.
  - Itens de lista interativos respondem a **Enter** e **Espaço**.
- **ARIA Semântico**:
  - Uso de `role="main"`, `section` com `aria-labelledby`.
  - `role="group"` / `radiogroup` + `aria-pressed` para grupos de botões.
  - `role="alert"` e `aria-live` para mensagens de erro no login.
---
## 🛠️ Tecnologias Utilizadas
### Frontend
- **Next.js 16** (App Router, SSR/SSG, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS** (config via `globals.css`)
### Autenticação & Serviços
- **Stack Auth (`@stackframe/stack`)**:
  - `StackProvider`, `useUser`, `useStackApp`
  - Apps de cliente/servidor em `stack/client.tsx` e `stack/server.tsx`
### Estado & Contextos
- **Tasks Context**:
  - `lib/tasks/tasks-context.tsx`
  - Compartilha tarefas, “Foque agora” e ações entre Home e Tarefas.
- **Preferences Context**:
  - `lib/preferences/preferences-context.tsx`
  - Controla tamanho de texto, minutos de foco/pausa e tema de cor via variáveis CSS.
### UI/UX
- **Componentes de UI** em `components/ui/*` (Button, Input, Label, etc.).
- **Lucide Icons** para ícones (Home, Tarefas, Perfil, energia, foco).
- **CSS Variables**:
  - `--mindease-accent` (cor de destaque).
  - `--mindease-base-font-size` (tamanho base de fonte).
---
## 📁 Estrutura do Projeto
```text
mind-ease-web/
├── app/
│   ├── layout.tsx             # Root layout (StackProvider, fontes, globals)
│   ├── page.tsx               # Landing (login / cadastro)
│   ├── globals.css            # Tailwind + variáveis de tema + foco
│   ├── loading.tsx            # Loading global
│   ├── handler/
│   │   └── [...stack]/page.tsx# Rotas da Stack Auth
│   └── (main)/                # Área autenticada
│       ├── layout.tsx         # Sidebar + providers + auth guard + skip link
│       ├── loading.tsx        # Skeleton da área logada
│       ├── dashboard/
│       │   ├── page.tsx       # /dashboard
│       │   └── home-content.tsx
│       ├── tarefas/
│       │   └── page.tsx       # /tarefas
│       └── perfil/
│           └── page.tsx       # /perfil
├── components/
│   ├── app-sidebar.tsx        # Navegação lateral
│   ├── login/
│   │   └── login-form.tsx     # Form de login / cadastro
│   └── ui/                    # Botões, inputs, labels, etc.
├── lib/
│   ├── tasks/                 # Tipos e contexto de tarefas
│   ├── preferences/           # Tipos e contexto de preferências
│   └── utils.ts               # Helper `cn`
├── stack/                     # Configuração da Stack Auth
│   ├── client.tsx
│   └── server.tsx
├── public/                    # Logo, favicon, imagens
└── ...                        # Configs (tsconfig, next.config, etc.)
🚀 Instalação e Configuração
Pré‑requisitos
Node.js 18+
npm ou yarn
Conta e projeto configurado na Stack Auth
1. Clonar o repositório
git clone <url-do-repositorio>
cd mind-ease-web
2. Instalar as dependências
npm install
# ou
yarn install
3. Configurar as variáveis de ambiente
Crie um arquivo .env.local na raiz:

NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
(As chaves são obtidas no painel da Stack Auth.)

4. Executar o projeto
# Desenvolvimento
npm run dev
# depois abra http://localhost:3000
5. Build de produção
npm run build
npm start
📋 Scripts Disponíveis
npm run dev – Inicia o servidor de desenvolvimento.
npm run build – Gera o build de produção.
npm start – Sobe o servidor em modo produção após o build.
