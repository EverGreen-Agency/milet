# Demo do `/diagnostico` para o vídeo · especificação

Para quem está ajustando o frontend Next.js (`src/app/diagnostico`, `src/components/diagnostic/*`). O vídeo usa essa jornada no **bloco 05** do [roteiro](roteiro.md): 34 segundos, quatro momentos. Cada requisito termina num critério verificável; a demo está pronta quando **todos** passam.

Leading word: **gravável** — cada tela precisa ser entendida por quem a vê por 6 segundos, a 1080p, sem narração.

## Os quatro momentos que o vídeo mostra

| Momento | Etapa do stepper | O que a banca precisa entender |
|---|---|---|
| M1 · Fatura entra | Fatura & OCR | A empresa só envia a conta que já recebe |
| M2 · Passaporte | Conferência Assistida | Os dados viram um perfil estruturado, conferido pelo cliente |
| M3 · Rotas | Diagnóstico & Baseline | A Milet compara rotas (mercado livre, solar, GD), não só fornecedores |
| M4 · Mesma régua | Propostas | Custo total lado a lado; nenhuma oferta compra posição |

## Requisitos

### R1 · Caminho de um clique
Da tela inicial até as propostas sem digitar nada: perfil Padaria Horizonte pré-preenchido, consentimento já marcado no modo demonstração.
**Pronto quando:** da carga da página até M4 em no máximo 5 cliques, sem teclado.

### R2 · Momento de leitura visível (M1)
O clique em "usar fatura de demonstração" mostra um estado de leitura de **1,5 a 2,5 s**, com três linhas que acendem em sequência:
1. Identificando distribuidora e unidade
2. Extraindo consumo, demanda e tarifa
3. Montando o Passaporte Energético

Barra de progresso âmbar; respeita `prefers-reduced-motion` (sem animação, mesma duração).
**Pronto quando:** um frame congelado no meio da leitura explica sozinho o que está acontecendo.

### R3 · Texto de cliente, não de bastidor
Tudo que aparece na tela fala com o cliente. Trocar:

| Hoje | Trocar por |
|---|---|
| "Extraindo campos da conta com Google Gemini 2.5 e arquivando no S3..." | Estado de leitura do R2 |
| Rótulo "SCR-01 Pitch Deck" | Remover da interface |
| "Carregar Fatura de Demonstração do Pitch (1 Clique)" | "Usar fatura de demonstração" |
| "OCR Multimodal Ativo" | "Leitura automática" |
| "Propostas All-In" | "Propostas com custo total" |
| Qualquer "API readiness" / "Google Solar" visível | "Potencial solar" |

Atalhos de gravação (teclas 1–5, H) continuam, mas sem nenhum indicador visível.
**Pronto quando:** nenhuma palavra de fornecedor de tecnologia, nome de arquivo interno ou código de cena aparece nas quatro telas.

### R4 · Números coerentes
Um avaliador de engenharia elétrica vai olhar os números. Cada um precisa fechar:

- **Bandeira:** a fatura cobra R$ 420 de adicional de bandeira, então `tariffFlag` não pode ser "Verde". Usar "Amarela" (ou zerar a cobrança).
- **Custo médio:** R$ 10.920 / 12.480 kWh = **R$ 0,88/kWh**. Exibir com 2 casas; nunca arredondar para "R$ 1/kWh".
- **Percentual em pt-BR:** "11,0%", com vírgula. `savingPercent.toFixed(1)` produz "11.0"; usar `Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })`. Preferir "11,0% menor" a "(-11.0%)".
- **Serviço Milet igual em todas as propostas.** Hoje a proposta mais bem colocada paga R$ 280 e a outra R$ 190; no vídeo isso parece a Milet ganhando mais com a oferta que ela mesma ranqueia em primeiro, o oposto do discurso de neutralidade. Usar R$ 190 nas duas e mover os R$ 90 para a energia da Alvorada (R$ 4.900 → R$ 4.990), assim o total continua R$ 9.720 e a ordem não muda.
- **Somas:** cada proposta fecha no centavo: Alvorada 2.940 + 4.990 + 190 + 1.600 + 0 = 9.720; Serra Clara 2.760 + 5.000 + 190 + 1.570 + 420 = 9.940; economia 1.200 (11,0%) e 980 (9,0%).

**Pronto quando:** todos os números das quatro telas batem entre si e com a fatura, e os testes de `src/domain/energy-engine.test.ts` passam com os valores novos.

### R5 · Selo de honestidade
Na etapa de propostas, um selo discreto e fixo: `Dados de demonstração · fornecedores fictícios`.
**Pronto quando:** em qualquer frame de M4 o selo está visível.

### R6 · Enquadramento de gravação
Gravação em navegador 1920×1080 com zoom de 125% (viewport efetiva 1536×864), tema claro.
**Pronto quando:** em cada momento, o conteúdo principal cabe sem rolar. Em M4, a linha de custo total e a frase "Nenhuma oferta compra posição" aparecem juntas na primeira dobra. Sem rolagem horizontal.

## Observações de ambiente

- **`next dev` local dá 404 em `/diagnostico`.** A pasta `app/` na raiz (o app estático legado) faz o Next.js ignorar `src/app`. Para rodar local, a pasta legada precisa sair da raiz ou o projeto precisa apontar para outro diretório.
- `next dev` cria `AGENTS.md` na raiz e reescreve `next-env.d.ts` (`.next/types` → `.next/dev/types`). Não commitar esses dois por engano.
- Quando R1–R6 passarem, as telas de referência em [shots/](shots/) e o slide 07 do [deck](deck.html) precisam ser recapturados a partir do `/diagnostico` (hoje mostram o app estático legado).
