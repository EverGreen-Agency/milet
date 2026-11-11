# Verificação de Segurança do Intake Milet

## Objetivo e limite

Este documento define uma verificação acadêmica, incremental e rastreável do
intake público da Milet. A referência é **OWASP ASVS 5.0.0, nível 1**, com o
OWASP Top 10:2025 usado para comunicar riscos. Não representa certificação da
OWASP nem autorização para tratar dados reais sem as decisões legais,
operacionais e de privacidade correspondentes.

O escopo cobre o caminho atual:

`visitante -> POST /v1/intakes -> validação/rate limit -> Gemini -> Resend -> equipe Milet`

O envio só pode ser habilitado quando `INTAKE_ENABLED=true` e
`DEMO_DATA_ONLY=false`; as credenciais de Gemini e Resend permanecem no
servidor. A orientação da IA não decide elegibilidade, preço, contratação ou
conformidade.

## Método de verificação

1. Revisar o requisito ASVS e o risco associado ao fluxo.
2. Registrar o controle, a evidência de código/teste e o status.
3. Executar a suíte indicada em cada alteração relevante.
4. Marcar como concluído somente o que foi verificado no ambiente declarado.
   Itens pendentes não podem ser apresentados como controles ativos em produção.

## Matriz ASVS L1 do recorte

| Referência | Risco tratado | Controle e evidência atual | Status |
| --- | --- | --- | --- |
| V1 Arquitetura e modelagem de ameaça | Fluxo de fatura/IA/e-mail sem fronteiras claras | Este fluxo, `docs/product/v2/README.md` e a regra de revisão humana registram dados, terceiros e limites. | Parcial: revisar antes de adicionar upload ou ferramenta à IA. |
| V2 Autenticação | Acesso a dados persistidos por identidade fraca | O intake é deliberadamente público e não deve expor dados persistidos. OIDC/MFA não está implementado para portais. | Pendente para portais e qualquer dado persistente. |
| V4 Controle de acesso | Acesso cruzado entre organizações/casos | A fundação API possui leitura tenant-scoped e testes; cabeçalhos sintéticos não equivalem a autenticação. | Parcial, somente fundação/demonstração. |
| V5 Validação, sanitização e codificação | Entrada inválida e XSS em e-mail | Campos têm tipo, tamanho, formato, consentimento e limpeza; o HTML de e-mail escapa entrada e saída do LLM. `api/v1/intakes.test.js` cobre saída maliciosa do modelo. | Implementado localmente para o intake Vercel. |
| V7 Tratamento de erros e logging | Vazamento de detalhes e ausência de rastreio | Falha sem flags/segredos fecha com 503; API de fundação registra correlação sem corpo, query ou cabeçalhos do usuário. | Parcial: definir retenção e alertas operacionais. |
| V8 Proteção de dados | Envio excessivo de PII e retenção indefinida | Consentimento e mínimo de campos são exigidos; segredos ficam no servidor. Gemini e Resend são destinatários externos declarados no fluxo. | Pendente: política, base legal, retenção, exclusão e DPA. |
| V9 Comunicações | Exposição em trânsito | O deploy público usa HTTPS; a API de fundação define cabeçalhos de segurança e CORS com allowlist. | Parcial: revalidar em produção a cada deploy. |
| V10 Código malicioso | Dependência ou artefato comprometido | `package-lock.json`, CI e `npm audit --omit=dev --audit-level=high` são a evidência mínima. | Pendente de execução no CI atual e política de atualização. |
| V11 Lógica de negócio | IA tomar decisão regulatória/comercial | Prompt, schema e UX proíbem promessas e exigem dados verificáveis/revisão humana. | Implementado como limite de produto; revisão humana real ainda depende da operação. |
| V13 API e serviços web | Abuso de endpoint público | POST apenas, limite de 3 tentativas/15 min por origem, consentimentos obrigatórios e idempotency keys para e-mail. | Parcial: rate limit em memória não suporta múltiplas instâncias. |
| V14 Configuração | Segredos no cliente e ambiente habilitado por engano | Flags e variáveis obrigatórias são validadas no servidor; testes asseguram falha fechada quando não configurado. | Implementado localmente; exige revisão de variáveis na Vercel. |

## OWASP Top 10 e LLM aplicáveis

| Risco | Aplicação na Milet | Controle verificável |
| --- | --- | --- |
| A01:2025 Broken Access Control | Portais, RFQs e faturas futuras | OIDC, RBAC/RLS e teste negativo por organização antes de persistir dados reais. |
| A02:2025 Security Misconfiguration | Flags, CORS, headers e Vercel | Validar configuração no boot, negar por padrão e checar headers públicos. |
| A03:2025 Software Supply Chain Failures | Dependências npm e provedores | Lockfile, audit em CI e atualização revisada. |
| A05:2025 Injection | Texto do formulário, documento e retorno do modelo | Validar limites/formato, codificar HTML e nunca executar saída do modelo. |
| A09:2025 Security Logging and Alerting Failures | Abuse, erros de provedor e acesso indevido | Correlation ID, logs sem PII e alerta operacional a definir. |
| LLM01:2025 Prompt Injection | Texto ou documento tenta alterar a tarefa da IA | Tratar todo conteúdo como dado; não dar ferramentas, credenciais ou poder de decisão ao modelo. |
| LLM02:2025 Sensitive Information Disclosure | Fatura e contexto enviados a provedores | Minimização, consentimento específico, retenção e contrato com provedores antes do uso real. |
| LLM05:2025 Improper Output Handling | Resposta do modelo entra em e-mail/interface | Schema JSON, limites e encoding HTML; teste de regressão para tags maliciosas. |
| LLM06:2025 Excessive Agency | Modelo acionar contratação ou fornecedor | Sem ferramentas de execução; decisão, contato e contratação permanecem humanos. |
| LLM10:2025 Unbounded Consumption | Abuso/custo de IA e e-mail | Rate limit e quota por ambiente; substituir mapa em memória por store compartilhado antes de escalar. |

## Evidências executáveis

```powershell
npm.cmd run test:vercel
npm.cmd run check
npm.cmd run typecheck
npm.cmd audit --omit=dev --audit-level=high
```

Antes de declarar o intake real ativo, registrar o resultado desses comandos,
uma chamada de teste sem segredos expostos e a verificação da política de
retenção/atendimento a revogação. Um HTTP 200 ou a presença de uma página não
é evidência de configuração de Gemini, Resend, banco, autenticação ou LGPD.

## Próxima iteração obrigatória antes de dados reais

- Implementar OIDC, RBAC e RLS para qualquer portal que leia dados de pessoa,
  organização, UC, proposta ou documento.
- Transferir o rate limit para armazenamento compartilhado e definir alertas.
- Implementar retenção, exclusão/revogação e redaction de logs com responsável.
- Executar teste de autorização por objeto e por função em cada novo endpoint.
- Fazer revisão humana das respostas de IA e registrar a evidência dessa revisão.
