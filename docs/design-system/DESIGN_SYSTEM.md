# DESIGN SYSTEM: MILET
> **Arquitetura de Design Semântica para Interfaces Web & Mobile**  
> *Baseada nos padrões de High-End Visual Design e Stitch Design Taste.*

---

## 1. Atmosfera Visual & Filosofia de Design
A linguagem de interface da Milet personifica o conceito de **"Quiet Luxury Tecnológico"**:
- **Densidade:** *Airy to Balanced (Nível 4)* — Amplo respiro, margens generosas, ausência total de poluição visual.
- **Variância:** *Offset Asymmetric (Nível 7)* — Quebra de monotonia com grids modulares assimétricos inspirados em arquitetura e editorial contemporâneo.
- **Movimento:** *Fluid Spring Physics (Nível 7)* — Interações táteis com sensação de peso físico, inércia natural e pulsação suave em micro-estados ativos.

---

## 2. Calibração Cromática & Papéis Semânticos

### Paleta Principal
- **Carvão Base** (`#1A1A1A`): Superfície de imersão dark mode, texto primário em modo claro e botões de comando primário.
- **Marfim Editorial** (`#F7F3EA`): Fundo primário de leitura, cartões institucionais e áreas de respiração visual.
- **Areia Mineral** (`#C9B89F`): Superfície neutra para cards secundários, divisores táteis e fundos de badges.
- **Âmbar Luminescente** (`#D39B3D`): Acento único e singular para dados ativos, indicadores de economia, gráficos de consumo e estados selecionados.
- **Cobre Metálico** (`#B87333`): Detalhes de condução, realces sutis e transição energética.

### Restrições Críticas de Cor
- **PROIBIDO:** Luzes e brilhos de neon roxo/azul típicos de IA genérica.
- **PROIBIDO:** Preto absoluto (`#000000`). Utilize exclusivamente o Carvão `#1A1A1A` ou derivados profundos (`#141414`).
- **PROIBIDO:** Sombras cinzas escuras duras. Todas as sombras devem ser difusas, quentes e integradas ao matiz da superfície subjacente.

---

## 3. Arquitetura Tipográfica

```
Títulos (Display)    ──>  Playfair Display / Milet Serif Custom (400, 600)
Interface & Texto    ──>  Plus Jakarta Sans / Inter (400, 500, 600)
Dados & Métricas     ──>  JetBrains Mono (500, 600)
```

### Regras de Escala & Composição
- **Headlines Institucionais:** Eixo editorial com tracking sutilmente condensado (`-0.02em`), altura de linha controlada (`1.1` a `1.15`), máximo de 3 linhas por bloco de título.
- **Corpo de Texto:** Altura de linha relaxada (`1.6`), limite máximo de 65 caracteres por linha (`max-w-[65ch]`) para leitura confortável.
- **Dados & Telemetria:** Toda medição de consumo ($kWh$, $R\$, \pm\%$) deve renderizar com números tabulares alinhados (`font-mono font-semibold`).

---

## 4. Engenharia de Componentes (Haptic Micro-Aesthetics)

### A. Botões & CTAs (Nested Pill Architecture)
- **Estrutura Primária:** Formato pill integral (`rounded-full`) com padding generoso (`px-7 py-3.5`).
- **Padrão "Button-in-Button":** Quando o botão contém um ícone de seta (`→` ou `↗`), o ícone nunca fica desprotegido ao lado do texto; ele fica encapsulado em um círculo interno próprio com micro-deslocamento na interação `hover`.
- **Feedback Tátil:** Ao pressionar (`active`), o botão sofre uma ligeira compressão física (`scale-[0.98]`).

```css
/* Exemplo de Botão Primário Milet */
.milet-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background-color: var(--milet-color-carvao);
  color: var(--milet-color-marfim);
  padding: 14px 28px;
  border-radius: 9999px;
  font-family: var(--milet-font-sans);
  font-weight: 500;
  transition: transform var(--milet-duration-fast) var(--milet-ease-natural);
}
.milet-btn-primary:active {
  transform: scale(0.98);
}
```

### B. Cartões & Contêineres ("Double-Bezel" / Moldura Dupla)
Para evitar cartões planos e artificiais:
- **Moldura Externa (Outer Shell):** Borda ultrafina de 1px com tom areia/translúcido (`rgba(26,26,26,0.06)` ou `rgba(247,243,234,0.08)`), padding de respiro (`p-2` a `p-3`) e raio generoso (`rounded-[2rem]`).
- **Núcleo Interno (Inner Core):** Contêiner interno com preenchimento sólido de cor e raio matematicamente concêntrico (`rounded-[calc(2rem-0.5rem)]`), dotado de sombra difusa tênue.

### C. Visualização de Dados de Energia
- **Gráficos Senoidais:** Linha contínua âmbar (`stroke="#D39B3D"`, `stroke-width="3"`) com preenchimento em gradiente linear translúcido que desvanece suavemente para a base (`stop-opacity="0.25"` a `"0"`).
- **Indicadores de Status:** Pílula minimalista com ponto de luz pulsante (ex.: *"Sistema ativo"*, ponto verde-âmbar com keyframe de pulso luminoso).
- **Controles de Seleção (Toggles & Sliders):** Chaves comutadoras com trilho em carvão/areia e puxador tátil suave.

---

## 5. Princípios de Layout & Responsividade

1. **Grid Modular de 12 Colunas:**
   - Desktop: 12 colunas com gutters de 24px a 32px e largura máxima de 1440px centralizada.
   - Tablet: 8 colunas com gutters de 20px.
   - Mobile: 4 colunas com gutters de 16px e padding de borda `px-5`.
2. **Colapso Rigoroso Mobile (< 768px):**
   - Todas as composições assimétricas colapsam para fluxo vertical de 1 coluna sem overflow horizontal.
   - Viewports de abertura usam `min-h-[100dvh]` (nunca `h-screen`, prevenindo saltos no Safari iOS).
   - Dimensão mínima para alvos de toque interativos: `44px × 44px`.

---

## 6. Física de Animação & Movimento (Motion Specs)

- **Parâmetros Spring:** `stiffness: 100`, `damping: 20`, `mass: 1`.
- **Easing Padrão:** `cubic-bezier(0.32, 0.72, 0, 1)` para transições suaves e naturais.
- **Regra de Performance:**
  - Animações de interação executam exclusivamente via `transform` e `opacity`.
  - Proibido animar propriedades que forcem reflow contínuo (`top`, `left`, `width`, `height`).

---

## 7. Anti-Patterns Estritos (Lista de Proibições)
- ❌ **Sem emojis** em qualquer interface oficial ou documento.
- ❌ **Sem fontes genéricas não calibradas** (`Times New Roman`, `Arial`).
- ❌ **Sem gradientes multicoloridos estilo arco-íris**.
- ❌ **Sem caixas dentro de caixas empilhadas sem hierarquia**.
- ❌ **Sem textos genéricos de enchimento de IA** (*"Unleash next-gen seamless experience"*).
- ❌ **Sem setas quicando** com texto "Role para explorar".
- ❌ **Sem sombras pretas opacas e duras**.
