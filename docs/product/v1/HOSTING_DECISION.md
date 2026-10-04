# Decisão de hosting por fase

**Atualizado em:** 2026-10-04
**Estado:** recomendação reversível; nenhum recurso, conta ou cobrança foi criado.

## Decisão

1. **Demo sintética pública:** Railway, mantendo frontend na Vercel.
2. **Primeiro piloto com dados reais:** Fly.io em `gru` (São Paulo), sujeito a
   revisão de segurança, DPA, backup/restore e custo.
3. **Operação com requisitos corporativos:** Google Cloud Run + Worker Pools +
   Cloud SQL em `southamerica-east1` (São Paulo).
4. **Alternativa corporativa:** AWS ECS Fargate + RDS em `sa-east-1` quando a
   capacidade operacional da equipe ou a integração com o ecossistema AWS justificar.

O contrato OCI/PostgreSQL existente preserva a saída: a aplicação não deve depender
de APIs proprietárias de hosting para executar seu domínio.

## Por que Railway na demo

O objetivo imediato é provar a conexão entre `/app/`, API, worker e PostgreSQL com
dados exclusivamente sintéticos. Railway oferece deploy por GitHub, Dockerfile,
variáveis/segredos, healthcheck, rollback, rede privada, banco e backups no mesmo
projeto. O plano Hobby publica mínimo de US$ 5/mês com o mesmo valor em créditos de
uso; o Pro publica mínimo de US$ 20/mês. O consumo é medido por CPU, memória, volume
e egress. Fonte: [Railway Pricing](https://railway.com/pricing).

Limite decisivo: as regiões públicas atuais são Califórnia, Virgínia, Amsterdã e
Singapura — não há Brasil. Fonte: [Railway Regions](https://docs.railway.com/deployments/regions).
Por isso essa escolha vale somente enquanto o ambiente não recebe faturas ou dados
pessoais reais.

Backups de volume e PITR existem, mas precisam ser habilitados, testados e orçados;
restauração não pode ser presumida. Fontes: [backups](https://docs.railway.com/volumes/backups)
e [PITR](https://docs.railway.com/volumes/point-in-time-recovery).

## Comparação

| Opção | API + worker | PostgreSQL | Brasil | Melhor uso agora | Limite principal |
| --- | --- | --- | --- | --- | --- |
| Railway | serviços contínuos/Docker, GitHub e rede privada | template com volume, backup e PITR configuráveis | não | demo sintética de baixo atrito | dados fora do Brasil e controles corporativos dependem do plano |
| Render | web service e background worker nativo | managed Postgres; pagos têm backup contínuo/PITR | não; regiões incluem EUA, Frankfurt e Singapura | alternativa simples à Railway | sem região brasileira; Postgres gratuito expira em 30 dias |
| Fly.io | Machines para API e worker | Managed Postgres em `gru` | sim, São Paulo | primeiro piloto regional | operação mais manual e MPG Basic publicado a US$ 38/mês + storage |
| Google Cloud | Cloud Run para API; Worker Pools para trabalho contínuo | Cloud SQL com backup, PITR e HA opcional | sim, São Paulo | operação corporativa/regulada | configuração e custo maiores; worker não escala automaticamente sem integração |
| AWS | ECS Fargate para ambos; não usar App Runner como worker | RDS PostgreSQL, Single/Multi-AZ | sim, São Paulo | alternativa enterprise | maior carga de IAM, rede, observabilidade e estimativa de custo |

Fontes oficiais:

- Render: [tipos de serviço](https://render.com/docs/service-types),
  [background workers](https://render.com/docs/background-workers),
  [regiões](https://render.com/docs/regions) e [preços](https://render.com/pricing).
- Fly.io: [regiões](https://fly.io/docs/reference/regions/) e
  [preços vigentes desde 01/10/2026](https://fly.io/pricing-update/). O plano Basic
  do Managed Postgres é publicado a US$ 38/mês e inclui HA, backups automáticos e
  pooling; storage é cobrado separadamente.
- Google Cloud: [Worker Pools](https://docs.cloud.google.com/run/docs/deploy-worker-pools),
  [preços e regiões do Cloud Run](https://cloud.google.com/run/pricing),
  [backup do Cloud SQL](https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backup-options)
  e [HA](https://docs.cloud.google.com/sql/docs/postgres/high-availability).
- AWS: [regiões do ECS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate-Regions.html),
  [preços Fargate](https://aws.amazon.com/fargate/pricing/) e
  [preços RDS PostgreSQL](https://aws.amazon.com/rds/postgresql/pricing/).

## Topologia da demo sintética

```text
Vercel /app/
    │ HTTPS + CORS allowlist
    ▼
Railway API (imagem apps/api/Dockerfile)
    │ rede privada / role milet_app
    ├──────────────► PostgreSQL
    │                    ▲
    ▼                    │
Railway worker ──────────┘
(imagem apps/worker/Dockerfile; tenant sintético explícito)
```

Não publicar o owner do banco em API ou worker. Migrações usam credencial separada;
runtime usa `milet_app`, sem superuser e sem `BYPASSRLS`.

## Gates antes de criar recursos

- orçamento mensal e alerta/limite de gasto aprovados;
- conta organizacional, 2FA, proprietários e recuperação documentados;
- domínio da API e CORS de produção decididos;
- secrets fora do Git e rotação ensaiada;
- migration job separado do runtime;
- health/readiness e shutdown confirmados na plataforma;
- backup, restore e perda máxima aceitável testados;
- logs sem fatura, payload ou identificador pessoal;
- para dados reais: OIDC, autorização, consentimento, DPA, região e RIPD/LGPD.

## Sequência de ativação

1. criar ambiente `demo-synthetic` com orçamento mínimo;
2. provisionar PostgreSQL e executar migrations com owner temporário;
3. implantar API e validar `/health/live`, `/health/ready` e `/metrics` internamente;
4. implantar um worker com `WORKER_TENANT_ID=ORG-0007` e usuário sintético;
5. validar retry, DLQ, lost lease e SIGTERM;
6. configurar `CORS_ORIGINS=https://milet.vercel.app`;
7. alterar `app/runtime-config.js` para a URL da API somente após os passos anteriores;
8. executar smoke ponta a ponta e publicar evidência, custo observado e rollback;
9. remover/pausar o ambiente se não houver dono operacional.

## Critério de migração de fase

Railway deixa de ser suficiente quando entrar qualquer dado real, quando residência
regional for requisito, quando o SLO exigir HA/restore comprovados ou quando logs,
RBAC e auditoria do plano escolhido não satisfizerem o risco. Nesse ponto, comparar
Fly.io e GCP com uma carga de teste idêntica e custo observado, não apenas calculadora.
