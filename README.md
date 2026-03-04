# TESS Command Center

> Interface de orquestração de agentes de IA em tempo real.

---

## Como rodar

```bash
# 1. Instale dependências
npm install

# 2. Suba o servidor de desenvolvimento
npm run dev

# 3. Acesse
open http://localhost:5173
```

**Requisito mínimo:** Node.js 18+

---

## Stack

| Lib | Uso |
|-----|-----|
| React 18 + Vite | Framework e bundler |
| Framer Motion | Todas as animações e micro-interações |
| Lucide React | Ícones |
| DM Mono + Unbounded + DM Sans | Tipografia (Google Fonts) |

Sem Tailwind — todo o CSS foi escrito à mão em `styles.css` para controle total da estética.

---

## O que foi entregue

### ✅ Feed de agentes ativos
8 agentes simulados com status `thinking / executing / done / idle`, barra de progresso animada, sparkline de atividade, tag colorida do modelo LLM em uso, e última ação do agente.

### ✅ Log de atividade em tempo real
Terminal no painel direito com scroll automático, timestamps precisos, color-coding por tipo (agente, sistema `[SYS]`, usuário `[YOU]`). Nova linha a cada ~1.25s via `setInterval`. Cursor piscante ao final.

### ✅ Prompt rápido
Select de agente + input com envio via `Enter` ou botão. A instrução aparece no log como `[YOU] → AGENTNAME: "..."` e o agente recebe status `executing`.

### ✅ Indicador de modelo
Cada card exibe um badge com o LLM: GPT-4o (verde), Claude 3.5 (âmbar), Gemini 1.5 (azul), Llama 3.3 (roxo), Mistral Large (vermelho), Grok 2 (cinza), Command R+ (teal), DeepSeek R1 (dourado).

---

## Ferramentas de IA usadas

| Ferramenta | Como foi usada |
|------------|----------------|
| **Claude (Anthropic)** | Geração completa do código — arquitetura de componentes, lógica de simulação, sistema CSS, animações, dados mockados e README |
| **Cursor** | Editor usado para iterar, revisar e ajustar o código gerado |

O processo: primeiro definir a direção estética (NASA Mission Control × luxury product dashboard), depois gerar os componentes com Claude, depois refinar no Cursor ajustando detalhes visuais, tempos de animação e comportamentos de borda.

---

## Decisão de UX principal: layout fixo de sala de controle

A decisão mais importante foi **não rolar a página** — tudo está em `height: 100vh` com overflow interno por seção.

**Por quê:** Um Command Center é uma ferramenta de monitoramento contínuo. Quem usa precisa ver o estado do sistema *o tempo todo*, sem perder contexto ao rolar. Separar o painel esquerdo (agentes, estado persistente) do painel direito (fluxo de eventos em tempo real) cria dois ritmos de leitura diferentes na mesma tela — exatamente como dashboards reais de operações.

---

## Micro-interação surpreendente: o scan shimmer

Cada card com status `executing` tem uma linha fina de luz varrendo o topo — da esquerda para a direita, em loop — como um scanner ou leitura de radar ativa.

É CSS puro (`::after` + `@keyframes`). A luz aparece com fade-in, varre e some com fade-out na outra extremidade. Nenhum JS envolvido.

O efeito comunica *atividade contínua* sem ser ruidoso. Quem notar vai entender que aquele agente está processando agora — não só "executando" como texto.

Outros detalhes intencional:
- **Ponto pulsante na ponta da barra de progresso** — cresce e encolhe, indica que o progresso está vivo
- **Status dot com animação de ritmo diferente** — thinking bate mais devagar que executing
- **Cards entram com `y: 14 → 0 + scale 0.96 → 1`** — sensação de "coisa surgindo do sistema"
- **Toast de conclusão** — quando um agente termina, uma notificação discreta aparece no canto

---

## O que faria diferente com mais tempo

1. **Grafo de dependências entre agentes** — uma visualização D3/Canvas mostrando quais agentes dependem de output de outros. Transformaria o "feed" num verdadeiro mapa de orquestração.

2. **Painel de detalhe expandível por agente** — ao clicar num card, um drawer lateral com histório completo de logs filtrado, consumo de tokens ao longo do tempo e configuração do agente.

3. **Alertas configuráveis** — "notifique-me se o token count ultrapassar 50k" ou "se o progresso travar por mais de 2 minutos".

4. **Animação de entrada escalonada no carregamento inicial** — os 8 cards entrariam em sequência com stagger de ~60ms, criando uma sensação de "sistema inicializando".

5. **Modo de densidade** — toggle entre visualização compacta (mais agentes visíveis) e expandida (mais detalhe por agente).

---

## Estrutura de arquivos

```
tess-command-center/
├── src/
│   ├── App.jsx                 ← componente raiz + toda a lógica de simulação
│   ├── data.js                 ← dados mockados, helpers de tempo, templates de log
│   ├── styles.css              ← design system completo (CSS custom properties)
│   ├── main.jsx                ← entry point
│   └── components/
│       ├── AgentCard.jsx       ← card individual do agente
│       ├── ActivityLog.jsx     ← terminal de logs
│       ├── PromptInput.jsx     ← input de instrução
│       ├── Sparkline.jsx       ← mini gráfico SVG
│       └── Toasts.jsx          ← notificações
├── index.html
├── vite.config.js
└── package.json
```
