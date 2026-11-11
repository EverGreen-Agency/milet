# Validação de Produto para Projetos de Engenharia da Computação

**Status:** protocolo proposto. Este arquivo não registra resultados executados, não autoriza oferta comercial nem tratamento de dados além do consentido.

## Recorte da entrega

A PME é o público comercial prioritário. A jornada residencial é um experimento de interesse e distribuição, e não um A/B comparável com PMEs. A Milet permanece plataforma de decisão e workflow: não promete economia, elegibilidade, contratação ou parecer regulatório.

| Experimento | Hipótese | Evidência esperada | Decisão habilitada |
| --- | --- | --- | --- |
| EXP-01 A/B PME | Uma mensagem de entrada, isolada como única variável, melhora a triagem consentida. | Conversão e qualidade por variante. | Manter, reformular ou encerrar o texto. |
| EXP-02 Coming Soon residencial | Há interesse mensurável antes de construir a jornada completa. | Cadastros consentidos e entrevistas. | Priorizar, pausar ou pesquisar. |
| EXP-03 LOI fornecedor | Fornecedores aceitam discutir um piloto de RFQ estruturado. | LOIs não vinculantes e reuniões qualificadas. | Definir segmento e oferta do piloto. |

## EXP-01 A/B de entrada PME

### Hipótese pré-registrada

> Porque a PME busca clareza antes de falar com fornecedores, acreditamos que uma mensagem de entrada específica elevará a conclusão da triagem consentida. O resultado é promissor se uma variante aumentar `pme_intake_submitted` sem piorar a qualidade dos contatos.

| Campo | Definição |
| --- | --- |
| Público | Visitantes do perfil `company`; excluir equipe e tráfego de teste. |
| Controle A | CTA: `Fazer diagnóstico PME`. |
| Variante B | CTA: `Criar Passaporte Energético`. |
| Variável isolada | Mensagem e CTA. Não alterar fluxo, campos, preço, público ou visual enquanto o teste estiver ativo. |
| Alocação | 50/50, aleatória e persistente para o visitante. |
| Duração | Pré-definida antes do lançamento; mínimo de 14 dias. Nunca encerrar pela primeira vantagem aparente. |
| Métrica primária | `pme_intake_submitted / experiment_assigned`. |
| Métricas secundárias | Início de intake, conclusão de consentimento e pedido de conversa. |
| Guardrails | Erro técnico, abandono pós-consentimento, contato inválido, reclamação e revogação. |

Sem baseline e amostra suficientes, o resultado deve ser descrito como **exploratório**. Não declarar vencedor estatístico sem período, tamanho de amostra, intervalo de confiança e regra de decisão registrados antes da análise.

| Evento | Propriedades permitidas | Gatilho |
| --- | --- | --- |
| `experiment_assigned` | `experiment_key`, `variant`, `profile`, `release` | Variante fixada. |
| `pme_intake_started` | `experiment_key`, `variant`, `profile` | Primeiro campo da triagem. |
| `pme_intake_submitted` | `experiment_key`, `variant`, `profile`, `consent_version` | Envio válido. |
| `pme_conversation_requested` | `experiment_key`, `variant`, `profile` | Pedido explícito de conversa. |

Telemetria não recebe nome, e-mail, empresa, valor de conta, IP, texto livre ou identificador de documento. O registro operacional do intake é separado da medição do experimento.

## EXP-02 Coming Soon residencial

A entrada residencial deve declarar que a jornada completa ainda não está disponível. O botão não pode simular diagnóstico, economia ou elegibilidade. A experiência mínima é `Em breve`, explicação da investigação, cadastro de interesse e confirmação de que não existe oferta ativa.

| Campo | Definição |
| --- | --- |
| Público | Visitantes do perfil `home`. |
| CTA | `Quero receber novidades da orientação residencial`. |
| Dados mínimos | Nome, e-mail, cidade/UF e objetivo, somente se necessários ao contato. |
| Consentimento | Finalidade de contato separada, texto versionado, data registrada e opção de não receber contato. |
| Métrica primária | `residential_waitlist_submitted / residential_waitlist_viewed`. |
| Métricas secundárias | Início do formulário e respostas de qualificação. |
| Critério de saída | Meta pré-definida e entrevistas com inscritos; sem meta, reportar apenas contagem observada. |

Eventos: `residential_waitlist_viewed`, `residential_waitlist_started`, `residential_waitlist_submitted` e `residential_waitlist_consent_declined`. Todos carregam somente contexto técnico e versão de consentimento, nunca dados pessoais.

## EXP-03 carta de intenção de fornecedor

A LOI mede compromisso preliminar de comercializadoras, geradores e EPCs para conversar sobre um piloto de RFQ estruturado. Não é contrato de compra de energia, não garante volume, não cria exclusividade, não representa nenhuma parte e não autoriza compartilhar dados de consumidores.

### Roteiro

1. Fazer entrevista de descoberta e registrar modalidade e segmento atendido.
2. Demonstrar RFQ sintético ou anonimizados; nunca compartilhar fatura real.
3. Apresentar a LOI não vinculante e permitir revisão interna.
4. Registrar aceite, recusa ou pedido de alteração como resultado válido.
5. Agendar desenho do piloto somente após aceite e revisão jurídica.

### Modelo de LOI não vinculante

> **Carta de intenção para conversa de piloto Milet**
>
> A [fornecedor], por meio de [nome e cargo], manifesta interesse não vinculante em avaliar conversas para um possível piloto de RFQs estruturados da Milet, limitado a oportunidades aprovadas futuramente por ambas as partes.
>
> Esta carta não constitui proposta, contrato, exclusividade, obrigação de compra ou venda, mandato, representação perante distribuidora ou CCEE, promessa de volume, obrigação de compartilhar dados nem compromisso financeiro. Cada oportunidade, dado pessoal, condição comercial e contrato dependerá de consentimento, análise jurídica, requisitos regulatórios e instrumento específico posterior.
>
> Contato: [nome, cargo, e-mail].
> [Cidade], [data].
> [nome, cargo e assinatura ou aceite eletrônico].

Eventos operacionais: `supplier_loi_presented`, `supplier_loi_sent`, `supplier_loi_signed`, `supplier_loi_declined` e `supplier_pilot_meeting_booked`. Documento assinado fica em repositório restrito; o dashboard analítico recebe apenas status, modalidade e data.

## Ledger de evidências

Cada experimento registra: identificador, hipótese, responsável, início/fim, versão, público, critérios pré-definidos, amostra, métricas, resultados, limitações, decisão e link para screenshot ou exportação. Capturas ocultam PII e segredos.

| Resultado | Decisão documentada |
| --- | --- |
| Vencedor com guardrails saudáveis | Promover variante e registrar aprendizagem. |
| Diferença insuficiente ou amostra pequena | Declarar inconclusivo e formular próximo teste. |
| Guardrail negativo | Pausar e abrir ajuste. |
| LOI recusada | Registrar motivo; nunca contar como interesse. |

## Checklist para o relatório final

| Capítulo | Evidência necessária |
| --- | --- |
| 5 Desenvolvimento | Arquitetura, fluxos implementados, commits e screenshots em desktop pequeno, desktop amplo e mobile; limites entre demo, integração e produção. |
| 5.6 Segurança | Escopo OWASP, ameaças, controles implementados, pendências e testes negativos. |
| 6 Testes | Ambiente, comandos, unitários, integração, aceitação, resultados e falhas conhecidas. Timeout de infraestrutura não é teste reprovado. |
| 7 Resultados | O que funciona, métricas observadas, limitações e critérios de aceite. |
| 8 Funcionamento | Roteiro reproduzível, dados sintéticos e comportamento de falha. |
| 9 Validação | Este protocolo, amostra real, consentimentos, eventos, resultados, decisão e vieses. |
| 10 Conclusão | Hipóteses confirmadas, refutadas ou inconclusivas; próximos passos e não validados. |
| Apêndices | Matriz de eventos, LOIs sem dados sensíveis, roteiro de entrevistas, evidências e versões de consentimento. |

## Próxima reunião do grupo

O responsável pela agenda confirma donos, versão dos textos A/B, período, amostra ou limiar exploratório, canal de captação de fornecedores, revisão jurídica da LOI, repositório seguro de documentos e data de análise. Nenhum evento ou formulário deve ser publicado antes dessas decisões.
