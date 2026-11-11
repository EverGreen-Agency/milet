# PostHog — telemetria de validação da Milet

## Estado implementado

- SDK: `posthog-js` para o projeto PostHog hospedado em US Cloud.
- Inicialização: somente após o visitante escolher **Aceitar métricas**.
- Sem autocapture, session replay, pageview automático ou perfil identificado.
- O identificador local de variante é usado apenas no navegador; ele não é enviado ao PostHog.
- O cliente envia a variante do experimento, nunca dados de contato, fatura, proposta ou documento.

## Variáveis de ambiente

Defina no ambiente de produção (por exemplo, Vercel):

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_seu_token_publico_do_projeto
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Use somente o token público `phc_`. A chave secreta `phs_` não é usada neste frontend, não deve entrar em `NEXT_PUBLIC_*` e não deve ser versionada.

## Eventos e propriedades

| Evento | Quando ocorre | Propriedades próprias |
|---|---|---|
| `pme_landing_view` | página PME exibida após consentimento | `experiment_key`, `experiment_variant`, `journey`, `analytics_schema` |
| `pme_cta_clicked` | CTA de diagnóstico PME | mesmas propriedades |
| `pme_intake_submitted` | intake PME concluído | mesmas propriedades |
| `residential_coming_soon_clicked` | interesse residencial | `journey=residential`, `analytics_schema` |
| `supplier_loi_requested` | interesse em carta de intenção não vinculante | `journey=supplier`, `analytics_schema` |

O campo `experiment_variant` é `A` ou `B` somente nos eventos PME. Não trate cliques como conversões comerciais, nem use estes dados para decisão automatizada.

## Dashboard no PostHog

Crie o dashboard **Milet — validação inicial** com estes insights:

1. **Funil PME**: `pme_landing_view` → `pme_cta_clicked` → `pme_intake_submitted`; quebra por `experiment_variant`.
2. **Interesse fora da jornada PME**: tendência semanal de `residential_coming_soon_clicked` e `supplier_loi_requested`.
3. **Qualidade do experimento**: tendência de `pme_landing_view`, quebrada por `experiment_variant`, para conferir distribuição próxima de 50/50.

Mantenha o experimento como `collecting_data` até atingir o tamanho amostral pré-definido no protocolo acadêmico. O painel não deve declarar variante vencedora antes disso.

## Verificação antes de publicar

1. Publique `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST` no ambiente de produção.
2. Abra o site em janela anônima e recuse métricas: nenhum evento deve chegar ao Live Events.
3. Abra novamente, aceite métricas e visite a jornada PME: os três eventos devem aparecer no Live Events sem campos de formulário.
4. Confira que session replay e autocapture permanecem desligados no projeto PostHog.
