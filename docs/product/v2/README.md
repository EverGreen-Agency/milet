# Milet V2 — Intake real, não demonstrativo

## Objetivo

Transformar a fatia PWA sintética existente em dois fluxos reais de descoberta, sem misturar o produto com o portal ou a apresentação acadêmica:

| Fluxo | Hipótese | Saída do primeiro corte | Não faz ainda |
|---|---|---|---|
| Empresa/PME | Há dor e confiança suficientes para compartilhar o contexto energético e pedir análise | Passaporte rascunho, revisão de dados e pedido de análise | cotação, economia, RFQ ou contratação |
| Residência B/C | Linguagem simples e mobile-first revelam demanda distribuível | orientação de coleta de dados e pedido de análise | elegibilidade, preço, economia ou integração com distribuidora |

## Princípio de segurança

Não aceitar documentos ou dados pessoais reais enquanto os controles de privacidade, identidade, armazenamento e processamento estiverem ausentes. A IA pode **extrair, resumir e explicar** dados aprovados; não pode calcular economia, determinar regra regulatória, classificar elegibilidade ou gerar recomendação final sem motor determinístico versionado e revisão humana.

## P0 — recorte implementável

1. Autenticação/OIDC e consentimento granular antes de qualquer intake persistente.
2. Cadastro de pessoa/organização e UC com minimização de dados.
3. Entrada manual marcada como estimativa; upload de fatura só após storage privado, URL assinada curta, allowlist, limite, antivírus/quarentena e retenção aprovada.
4. Extração por adaptador server-side para schema JSON: campo, valor, confiança, evidência de página/região e versão do modelo.
5. Revisão campo a campo obrigatória antes de criar a versão do Passaporte.
6. Motor determinístico versionado para baseline/regras; resultados carregam fontes, premissas, RuleSet e data de vigência.
7. Fila de operação humana; sem RFQ/contratação neste corte.

## Campos por jornada

| Dados | Empresa/PME | Residência B/C |
|---|---|---|
| Identificação mínima | nome, e-mail/telefone, papel; CNPJ somente quando necessário | nome, e-mail/telefone; CPF nunca no primeiro contato |
| UC/localização | CEP/endereço, distribuidora, UC mascarada, grupo/modalidade | CEP, distribuidora, UC opcional/mascarada |
| Perfil | consumo/conta, demanda, contrato, múltiplas unidades | consumo/conta, tipo e posse do imóvel, interesse em GD/telhado |
| Evidência posterior | fatura e contrato com consentimento específico | fatura com consentimento específico |

## Definition of Done do piloto real

- [ ] Política de privacidade, base legal, finalidade, retenção e canal de revogação publicados.
- [ ] DPA e avaliação do provedor de IA/OCR aprovados; nenhum dado sensível sai sem autorização.
- [ ] OIDC, RBAC/tenant, auditoria append-only e redaction de logs ativos.
- [ ] Armazenamento privado, upload seguro, antivírus/quarentena e teste de exclusão realizados.
- [ ] Schema e validação de dados, revisão humana e versionamento de extração cobertos por testes.
- [ ] Regras/calculadora determinísticas têm fonte, vigência, testes e explicação.
- [ ] Cinco testes moderados por fluxo em celular e desktop, com problemas registrados.

## Ordem de entrega

1. Criar `apps/web-v2` no monorepo, reutilizando tokens e contratos.
2. Fechar os controles acima e escolher um ambiente de dados autorizado.
3. Implementar empresa primeiro como piloto de validação comercial.
4. Derivar a variante residencial do mesmo Intake/Passport/Decisioning; variar questionário e copy, não criar um segundo domínio.
5. Só então conectar parceiros, RFQ e contratação.
