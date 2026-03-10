# MindEase – Aplicativo de Foco com Acessibilidade Cognitiva

Aplicação web construída com Next.js para apoiar pessoas neurodivergentes com dificuldades de foco e organização, oferecendo uma experiência simples, acessível e consistente para gerenciar tarefas, sessões de foco Pomodoro e preferências pessoais.

---

<details>
<summary><h2>🧠 Design para Neurodivergência</h2></summary>

O MindEase foi projetado com as necessidades específicas de pessoas neurodivergentes como ponto de partida. Esta seção documenta os desafios identificados nesse público e as decisões de design e desenvolvimento que os endereçam.

✏️ [Figma do Projeto](https://www.figma.com/design/c6DYy4x0nJfbEYsOJWZbZ7/MindEase---Tech-Challenge--5?node-id=0-1)

### Desafios identificados

Pessoas com TDAH, autismo, dislexia e outras condições neurodivergentes frequentemente relatam dificuldades comuns ao usar aplicativos de produtividade tradicionais:

| Desafio | Manifestação comum |
|---|---|
| **Paralisia de decisão** | Listas longas sem hierarquia travam o início de qualquer tarefa |
| **Regulação de energia** | Dificuldade em reconhecer o próprio estado mental e escolher tarefas compatíveis |
| **Hiperfoco e perda de tempo** | Dificuldade em perceber o tempo passando durante tarefas absorventes |
| **Sobrecarga cognitiva** | Formulários com muitos campos visíveis ao mesmo tempo aumentam a ansiedade |
| **Dificuldade com planejamento temporal** | Conceitos como "amanhã" ou "semana que vem" são mais fáceis de processar que datas abstratas |
| **Abandono de rotinas** | Aplicativos que não persistem o contexto forçam o usuário a "recomeçar" a cada visita |
| **Sensibilidade sensorial** | Cores saturadas, animações bruscas e sons inesperados causam desconforto |

---

## Soluções implementadas

#### Seletor de energia como ponto de entrada
- Em vez de perguntar "o que você quer fazer?", a Home começa com "como você está agora?". O seletor de energia (Calmo / Presente / Focado) é o único input para começar a usar o app de forma mais dinâmica. Essa âncora emocional reduz a paralisia de decisão porque o sistema assume a responsabilidade de filtrar e ordenar as tarefas de acordo com a capacidade atual do usuário.
  - Todas as energias são válidas e levam a tarefas adequadas.


#### "Foque agora"
- A seção de destaque na Home exibe uma tarefa: a mais compatível com a energia do dia.
  - Isso elimina a sobrecarga de escolha. O usuário pode ignorá-la e ver a lista completa, mas o padrão é sempre uma sugestão clara e acionável.


#### Agrupamento por esforço na listagem
- As tarefas nunca aparecem como uma lista plana e indiscriminada. Elas são sempre agrupadas em **Leve → Normal → Exigente**, e o grupo correspondente à energia do dia aparece em primeiro lugar.
  - Um usuário com energia baixa vê imediatamente as tarefas que consegue fazer, sem precisar filtrar mentalmente uma lista mista.


#### Temporalidade em linguagem natural
- O campo "quando" usa rótulos (`Agora`, `Hoje`, `Amanhã`, `Qualquer dia`) em vez de um campo de data como padrão.

- Datas específicas existem como opção avançada, mas a maioria das pessoas consegue classificar uma tarefa em linguagem natural muito mais facilmente do que atribuir uma data.
  - Isso reduz a fricção de criação e aumenta a chance de a tarefa ser registrada em vez de esquecida.


#### Formulário progressivo com "Mais detalhes"
- O formulário de criação de tarefas exibe apenas os campos essenciais por padrão: título, quando e esforço. Campos adicionais (descrição, prioridade, estimativa, tags) ficam ocultos atrás de um accordion "Mais detalhes".
  - Isso respeita o princípio de carga cognitiva progressiva — o usuário não precisa processar tudo de uma vez para registrar uma tarefa simples.


#### Sub-tarefas para decomposição
- Grandes tarefas são frequentemente a causa da procrastinação em pessoas neurodivergentes, o cérebro não consegue começar porque não consegue visualizar o primeiro passo.

- O suporte a sub-tarefas dentro do formulário e do painel de foco incentiva a decomposição no momento do planejamento, e o progresso visual (barra de progresso nas sub-tarefas) fornece feedback imediato de avanço.


#### Modo Foco com Pomodoro configurável
- A técnica Pomodoro é particularmente eficaz para pessoas com TDAH porque externaliza o controle do tempo, reduzindo a ansiedade de "quanto tempo já passou?".

- O MindEase implementa o ciclo completo com transições automáticas e sons de sinalização, para que o usuário não precise monitorar o timer ativamente.

- Os parâmetros são configuráveis (duração do foco e pausas curtas), já que pessoas neurodivergentes têm janelas de atenção muito variáveis.

- O botão **+ 5 minutos** reconhece que o hiperfoco é real: às vezes o usuário está no meio de um fluxo produtivo e forçar uma pausa nesse momento é contraproducente. A extensão rápida respeita esse estado sem abandonar a estrutura do Pomodoro.


#### FocusFooter — contexto sempre visível
- Enquanto uma sessão está ativa e página estiver fechada, uma barra persistente exibe um aviso de que uma tarefa está em foco e o tempo restante em qualquer página do app.
  - Isso serve como âncora contextual — o usuário nunca perde o fio de onde estava, mesmo que tenha navegado para outra seção.

#### Indicador visual no TaskCard
- O card da tarefa em foco exibe uma borda colorida e ícone ativo.

- Quando o timer é pausado, o indicador desaparece.
  - Esse feedback visual direto evita que o usuário precise lembrar qual tarefa estava focando — o app mantém esse contexto externamente.

#### Tipografia acessível (Atkinson Hyperlegible)
- A fonte padrão do app é Inter e Atkinson Hyperlegible, essa última, desenvolvida pela Braille Institute especificamente para maximizar a legibilidade para pessoas com baixa visão e dislexia.

#### Tema de cor suave e configurável
- As 7 opções de tema usam tons dessaturados e suaves.
  - Cores saturadas e de alto contraste podem causar sobrecarga sensorial em pessoas no espectro autista e em pessoas com sensibilidade visual.

#### Sons não intrusivos e controláveis
- Os sons de transição do Pomodoro são acionados apenas em momentos específicos e previsíveis (início, fim de foco, fim de pausa). Não há notificações inesperadas. A previsibilidade dos sons reduz o sobressalto e ajuda a criar uma associação positiva com as transições de bloco.

#### Navegação estável sem remontagem de contexto
- Uma decisão técnica com impacto direto na experiência: os providers de contexto (`UserContext`, `TaskContext`, `FocusContext`) são encapsulados em um `ClientProviders` estável que não remonta durante a navegação. Isso significa que o estado do app — energia selecionada, tarefa em foco, timer rodando — permanece intacto enquanto o usuário navega entre páginas. Para pessoas que perdem o fio com facilidade, nunca "recomeçar do zero" ao navegar é um ganho significativo.

</details>

---

## 🚀 Funcionalidades

### 🔐 Autenticação & Perfil

- **Login e Cadastro:** Autenticação por e-mail/senha usando Stack Auth (`@stackframe/stack`).
- **Redirecionamento Inteligente:**
  - Usuário logado em `/` é redirecionado para `/home`.
  - Usuário não autenticado em rotas protegidas é redirecionado para `/`.
- **Gestão de Perfil:**
  - Nome exibido na Home e editável na aba Perfil.
  - Nome salvo diretamente no perfil do Stack (`displayName`).
- **Logout Seguro:** Botão "Sair" na sidebar encerra a sessão e retorna para a tela de login.

---

### 📋 Tarefas

#### Criação de Tarefas
- Formulário completo com os campos:
  - **Título** (obrigatório)
  - **Quando:** Agora, Hoje, Amanhã, Qualquer dia, ou data específica via calendário
  - **Esforço mental:** Leve, Normal ou Exigente
  - **Sub-tarefas:** criação inline com lista de itens removíveis
  - **Mais detalhes** (expansível): descrição, prioridade, estimativa de tempo e tags
- **Criar tarefa + Foco:** cria a tarefa e inicia imediatamente uma sessão de foco
- Recomendação de foco exibida quando a tarefa tem esforço exigente, é para agora/hoje, estimativa acima de 30 minutos ou prioridade alta

#### Listagem de Tarefas
- Tarefas agrupadas por esforço mental: **Leve → Normal → Exigente**
- **Ordenação por energia do usuário:** a energia selecionada na Home mapeia para o esforço preferido (`calmo → leve`, `presente → normal`, `focado → exigente`), e as tarefas correspondentes aparecem primeiro
- Navegação por data com setas e calendário via `DateNavigator`
- Toggle "Ver detalhes" alterna entre visualização simples e detalhada (tags, prioridade, estimativa) para diminuir carga cognitiva
- Marcação de tarefas e sub-tarefas como concluídas (com linha riscada e checkmark visual)
- Atualização otimista — a UI reflete a mudança antes da resposta da API

#### Detalhes & Edição de Tarefas
- **Mobile:** página dedicada em `/task-details/[id]`
- **Desktop:** modal interceptado via Next.js parallel routes (`@modal/(.)task-details/[id]`)
- Edição completa de todos os campos da tarefa

#### TaskCard com Indicador de Foco
- Borda e ícone de foco mudam de cor quando a tarefa está sendo focada ativamente
- Indicador desaparece quando o timer está pausado ou parado

---

### 🏠 Home

- Saudação personalizada com nome do usuário e data em formato amigável
- **Seletor de energia:** Calmo, Presente, Focado — persiste no banco por dia
- **Seção "Foque agora":** exibe a tarefa mais indicada para o momento com base na energia selecionada e esforço mental
- **Tarefas de hoje:** lista compacta das tarefas do dia com botão "Ver todas" para `/tasks`

---

### ⏱️ Modo Foco (Pomodoro)

#### Sessão de Foco
- Inicia a partir de qualquer `TaskCard` via botão de foco
- Sessão persiste via `sessionStorage` — sobrevive a navegação entre páginas

#### Timer
- **Baseado em timestamps** (`Date.now()`), não em contagem regressiva de intervalo — não é afetado por troca de abas ou navegação
- Play / Pausa com ícone dinâmico
- Transições automáticas entre blocos:
  - `Foco → Pausa curta → Foco` (repetido por N ciclos)
  - `Último foco → Pausa longa → Ciclo concluído`
- Sons em cada transição (`start`, `focus-to-break`, `break-to-focus`, `long-start`, `long-end`)

#### Interface do Foco
- **Mobile:** página dedicada `/focus` com `FocusPanel` completo
- **Desktop:** painel lateral abrível/fechável via `FocusPanelWrapper`
- **FocusFooter:** barra persistente (mobile: acima da nav, desktop: pill flutuante) exibida quando o timer está rodando e o painel está fechado — ao ser clicado navega de volta para a aba de Foco
- `CircularTimer` com anel de progresso SVG em tamanhos `sm` e `lg`
- Lista de sub-tarefas com toggle inline dentro do painel de foco

---

### 🎛️ Preferências e Tema

- **Tamanho de texto:** Compacto, Conforto, Acessível
- **Tema de cor:** 6 opções de cores suaves
- **Pomodoro configurável:** minutos de foco e pausa curta
- Preferências salvas no banco e aplicadas globalmente via `UserContext`

---

### 🧭 Navegação & UX

- **Mobile:** bottom navigation bar com Home, Tarefas, Perfil e botão `+`
- **Desktop:** sidebar vertical em pill com os mesmos itens + "Sair"
- Detecção de breakpoint via CSS (`hidden md:block`) — sem flash de hidratação
- **Modais no desktop** via Next.js parallel routes + route interception:
  - `@modal/(.)new-task` → modal de criação
  - `@modal/(.)task-details/[id]` → modal de edição

---

### ♿ Acessibilidade

- Skip link "Pular para o conteúdo principal"
- Foco visível em botões, links e itens clicáveis
- ARIA semântico: `role="main"`, `aria-labelledby`, `aria-pressed`, `aria-label`, `role="status"` no footer de foco
- Leitor de tela: nenhum elemento relevante oculto com `hidden` duplo (modais mobile usam página separada via middleware)
- Suporte a navegação por teclado em cards de tarefa e grupos de botões

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** (App Router, SSR, Turbopack, Parallel Routes, Route Interception)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### Autenticação
- **Stack Auth** (`@stackframe/stack`): `StackProvider`, `useUser`, `useStackApp`

### Estado & Contextos
| Contexto | Responsabilidade |
|---|---|
| `UserContext` | userId, preferências, energia diária |
| `TaskContext` | tarefas, data visualizada, ações CRUD, derivações por energia |
| `FocusContext` | sessão ativa, timer Pomodoro, persistência via sessionStorage |

### Backend / Dados
- API Routes Next.js (`/api/tasks`, `/api/users/init`, `/api/users/preferences`, `/api/energy`)
- Banco de dados flat em `db.json` via `readDb` / `writeDb`
- Autenticação server-side via Stack Auth em todas as rotas

### UI
- Componentes em `components/ui/*` (Button, Input, Label, Card…)
- Lucide Icons
- Sonner (toasts)
- CSS Variables: `--user-theme`, `--font-atkinson`

---

## 📁 Estrutura do Projeto

```
mind-ease-web/
├── app/
│   ├── layout.tsx                  # Root layout (providers, fontes, modal slot)
│   ├── globals.css
│   ├── @modal/                     # Parallel route para modais desktop
│   │   ├── default.tsx
│   │   ├── (.)new-task/
│   │   │   ├── page.tsx            # Server component — split mobile/desktop
│   │   │   └── NewTaskModalClient.tsx
│   │   └── (.)task-details/[id]/
│   │       ├── page.tsx
│   │       └── TaskDetailsModalClient.tsx
│   ├── api/
│   │   ├── tasks/route.ts          # GET + POST
│   │   ├── tasks/[id]/route.ts     # PATCH + DELETE
│   │   ├── users/init/route.ts     # POST getOrCreateUser
│   │   ├── users/preferences/route.ts
│   │   └── energy/route.ts         # GET + POST
│   ├── home/page.tsx
│   ├── tasks/page.tsx
│   ├── focus/page.tsx              # Mobile focus page
│   ├── new-task/page.tsx           # Mobile full page
│   ├── task-details/[id]/page.tsx  # Mobile full page
│   ├── perfil/page.tsx
│   └── database/
│       └── db.json
├── components/
│   ├── navigation/
│   │   ├── AppNav.tsx              # Wrapper CSS breakpoint
│   │   ├── MobileNav.tsx
│   │   └── DesktopSidebar.tsx
│   ├── foco/
│   │   ├── FocusPanel.tsx
│   │   ├── FocusPanelWrapper.tsx
│   │   ├── FocusFooter.tsx
│   │   └── CircularTimer.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskGroup.tsx
│   │   └── SubtaskList.tsx
│   ├── task-form.tsx
│   └── ui/
├── presentation/
│   ├── context/
│   │   ├── UserContext.tsx
│   │   ├── TaskContext.tsx
│   │   └── FocusContext.tsx
│   └── providers/
│       ├── index.tsx               # Server wrapper
│       └── ClientProviders.tsx     # Client providers estáveis entre navegações
├── hooks/
│   └── useIsMobile.ts
├── types/
│   ├── task.ts
│   ├── user.ts
│   ├── energy.ts
│   └── focus.ts
├── utils/
│   ├── db.ts
│   └── users.ts
└── public/
    └── sounds/                     # Áudios do Pomodoro
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Conta configurada na Stack Auth

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd mind-ease-web
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie `.env.local` na raiz:
```env
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...
```

### 4. Executar em desenvolvimento
```bash
npm run dev
# http://localhost:3000
```

### 5. Build de produção
```bash
npm run build
npm start
```

---

## 📋 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm start` | Servidor em modo produção |
