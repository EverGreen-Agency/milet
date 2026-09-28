/**
 * MILET — ENGINE DO BACKLOG DE PRODUTO & MATRIZ SPIDER
 * Projetos de Engenharia da Computação I & II (Mackenzie - 2026.2 / 2027.1)
 */

(function () {
  'use strict';

  // Catálogo Oficial das 28 User Stories da Seção 3.2 do Relatório
  const userStoriesData = [
    {
      id: "US-001",
      epic: "EP-01 · Onboarding & Passaporte",
      feature: "F1.1 Cadastro e UCs",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero cadastrar minha empresa e uma unidade consumidora para iniciar uma análise sem precisar entender a estrutura interna do setor.",
      criteria: "Cadastro cria identificador único; campos mínimos validados; usuário pode editar dados antes do diagnóstico."
    },
    {
      id: "US-002",
      epic: "EP-01 · Onboarding & Passaporte",
      feature: "F1.2 Leitura de faturas",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero enviar uma fatura para que os dados relevantes sejam lidos automaticamente e eu não precise digitá-los manualmente.",
      criteria: "Aceita PDF/imagem definida pelo MVP; armazena arquivo e data; extrai campos mínimos; marca campos incertos."
    },
    {
      id: "US-003",
      epic: "EP-01 · Onboarding & Passaporte",
      feature: "F1.2 Leitura de faturas",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero revisar e corrigir os dados extraídos para ter confiança de que a análise usa informações corretas.",
      criteria: "Tela mostra valor extraído e origem; correção fica registrada; diagnóstico usa versão aprovada."
    },
    {
      id: "US-004",
      epic: "EP-01 · Onboarding & Passaporte",
      feature: "F1.3 Passaporte e consentimento",
      actor: "Consumidor PME",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero que meu histórico forme um Passaporte Energético para não recomeçar do zero em cada cotação.",
      criteria: "Passaporte agrega UCs, faturas e contratos; possui versionamento; mudanças não apagam histórico."
    },
    {
      id: "US-005",
      epic: "EP-01 · Onboarding & Passaporte",
      feature: "F1.3 Passaporte e consentimento",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P1",
      mvpCore: false,
      story: "Como usuário, quero controlar consentimentos e permissões de compartilhamento para saber quais dados serão usados e com quem serão compartilhados.",
      criteria: "Consentimento explícito; finalidade registrada; revogação possível; acesso respeita papel e escopo."
    },
    {
      id: "US-006",
      epic: "EP-02 · Diagnóstico & Decisão",
      feature: "F2.1 Elegibilidade",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero saber quais rotas energéticas são aplicáveis ao meu perfil e por que as demais foram excluídas.",
      criteria: "Motor avalia regras versionadas; apresenta elegível/não elegível; mostra justificativa e data da regra."
    },
    {
      id: "US-007",
      epic: "EP-02 · Diagnóstico & Decisão",
      feature: "F2.2 Baseline de Custo",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero visualizar uma linha de base do meu custo atual para comparar qualquer alternativa contra o mesmo ponto de partida.",
      criteria: "Baseline indica período; componentes considerados; premissas e dados faltantes; recalculável após correção."
    },
    {
      id: "US-008",
      epic: "EP-02 · Diagnóstico & Decisão",
      feature: "F2.3 Simulação e recomendação",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero simular alternativas aplicáveis para comparar economia, prazo, esforço e principais riscos.",
      criteria: "Cenários usam mesma baseline; exibem economia e premissas; permitem comparar ao menos dois cenários."
    },
    {
      id: "US-009",
      epic: "EP-02 · Diagnóstico & Decisão",
      feature: "F2.3 Simulação e recomendação",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero receber uma recomendação explicável para entender por que uma alternativa foi priorizada.",
      criteria: "Mostra critérios, pesos/regras relevantes, limitações e fonte; permite revisão humana quando necessário."
    },
    {
      id: "US-010",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.1 RFQ Reverso",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero abrir um RFQ a partir do meu Passaporte para solicitar ofertas sem redigitar as mesmas informações.",
      criteria: "RFQ reaproveita dados aprovados; usuário revisa o que será compartilhado; cria prazo/status."
    },
    {
      id: "US-011",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.1 RFQ Reverso",
      actor: "Gerador / Comercializadora",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como fornecedor, quero receber apenas RFQs compatíveis com meus produtos para concentrar esforço em oportunidades qualificadas.",
      criteria: "Matching usa critérios configuráveis; RFQ mostra dados necessários; incompatíveis não entram na fila padrão."
    },
    {
      id: "US-012",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.2 Propostas padronizadas",
      actor: "Gerador / Comercializadora",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como fornecedor, quero enviar proposta em formulário padronizado para responder rápido e facilitar análise do cliente.",
      criteria: "Campos obrigatórios por modalidade; validação de prazo/preço; anexos opcionais; versão da proposta registrada."
    },
    {
      id: "US-013",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.3 Comparação e neutralidade",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero comparar propostas lado a lado para entender economia líquida, prazo, riscos e condições no mesmo padrão.",
      criteria: "Tabela normalizada; destaca diferenças; não omite campos ausentes; cálculo usa baseline comum."
    },
    {
      id: "US-014",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.3 Comparação e neutralidade",
      actor: "Consumidor PME",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero selecionar uma oferta ou pedir esclarecimento para avançar sem sair do fluxo principal.",
      criteria: "Ação registrada; fornecedor recebe pedido; histórico permanece ligado à proposta."
    },
    {
      id: "US-015",
      epic: "EP-03 · Marketplace & RFQ",
      feature: "F3.3 Comparação e neutralidade",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero saber como a Milet é remunerada e se uma oferta é relacionada para confiar que o ranking não foi comprado.",
      criteria: "Remuneração/relacionamento sinalizados; regra de ranking documentada; oferta relacionada identificada."
    },
    {
      id: "US-016",
      epic: "EP-04 · Contratação & Execução",
      feature: "F4.1 Documentos/contratos",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero um checklist de documentos para saber exatamente o que falta para concluir a contratação.",
      criteria: "Checklist varia por rota; item possui status/responsável; documentos enviados ficam associados ao caso."
    },
    {
      id: "US-017",
      epic: "EP-04 · Contratação & Execução",
      feature: "F4.1 Documentos/contratos",
      actor: "Consumidor PME",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero um resumo dos principais pontos do contrato para localizar prazo, reajuste, garantias, multas e obrigações antes de assinar.",
      criteria: "Resumo referencia cláusulas/páginas; não se apresenta como parecer jurídico; incertezas pedem revisão humana."
    },
    {
      id: "US-018",
      epic: "EP-04 · Contratação & Execução",
      feature: "F4.1 Documentos/contratos",
      actor: "Consumidor PME",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero registrar aceite/assinatura e a versão final para que a plataforma saiba qual contrato entrou em execução.",
      criteria: "Versão final imutável ou hash/registro; data de aceite; vínculo à proposta selecionada."
    },
    {
      id: "US-019",
      epic: "EP-04 · Contratação & Execução",
      feature: "F4.2 Timeline e tarefas",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero acompanhar uma linha do tempo com status, responsáveis e próximos passos para não perder o controle após a escolha.",
      criteria: "Estados definidos; próximo passo visível; responsável e prazo; eventos externos podem ser registrados manualmente."
    },
    {
      id: "US-020",
      epic: "EP-04 · Contratação & Execução",
      feature: "F4.2 Timeline e tarefas",
      actor: "Operador Milet",
      priority: "Must",
      phase: "P1",
      mvpCore: false,
      story: "Como operador, quero alertas de pendências e exceções para agir antes que um SLA ou prazo crítico seja perdido.",
      criteria: "Fila priorizada; alerta com motivo; responsável; resolução registrada."
    },
    {
      id: "US-021",
      epic: "EP-05 · Economia & Autopilot",
      feature: "F5.1 Savings Ledger",
      actor: "Consumidor PME",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como decisor, quero comparar economia prevista e realizada para verificar se a decisão entregou o resultado prometido.",
      criteria: "Baseline preservada; faturas posteriores comparáveis; diferenças e limitações explicadas."
    },
    {
      id: "US-022",
      epic: "EP-05 · Economia & Autopilot",
      feature: "F5.2 Renovação/rebid",
      actor: "Consumidor PME",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como decisor, quero ser avisado antes de vencimentos e marcos contratuais para não renovar por inércia.",
      criteria: "Alertas configuráveis; antecedência; vínculo ao contrato e ação sugerida."
    },
    {
      id: "US-023",
      epic: "EP-05 · Economia & Autopilot",
      feature: "F5.2 Renovação/rebid",
      actor: "Consumidor PME",
      priority: "Could",
      phase: "P2",
      mvpCore: false,
      story: "Como decisor, quero que a Milet monitore sinais de uma alternativa economicamente superior para saber quando vale reavaliar.",
      criteria: "Regra de gatilho transparente; não promete execução automática; sinal gera análise/recomendação."
    },
    {
      id: "US-024",
      epic: "EP-05 · Economia & Autopilot",
      feature: "F5.2 Renovação/rebid",
      actor: "Consumidor PME",
      priority: "Could",
      phase: "P2",
      mvpCore: false,
      story: "Como decisor, quero autorizar uma nova rodada de comparação/RFQ quando houver motivo para reotimizar.",
      criteria: "Usuário confirma; dados são reutilizados; novo ciclo mantém ligação com decisão anterior."
    },
    {
      id: "US-025",
      epic: "EP-06 · Operação & Confiança",
      feature: "F6.1 Backoffice Operacional",
      actor: "Operador Milet",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como operador, quero visualizar casos, status, exceções e SLAs em um painel único para coordenar a operação.",
      criteria: "Filtros; fila por prioridade; status atualizado; trilha de ações."
    },
    {
      id: "US-026",
      epic: "EP-06 · Operação & Confiança",
      feature: "F6.2 Portal de Oferta",
      actor: "Gerador / Comercializadora",
      priority: "Should",
      phase: "P1",
      mvpCore: false,
      story: "Como fornecedor, quero acompanhar RFQs, propostas e resultados para gerir meu pipeline dentro da plataforma.",
      criteria: "Visão apenas do próprio escopo; estados; histórico; métricas básicas."
    },
    {
      id: "US-027",
      epic: "EP-06 · Operação & Confiança",
      feature: "F6.3 Auditoria e permissões",
      actor: "Auditor / Operador",
      priority: "Must",
      phase: "P0",
      mvpCore: true,
      story: "Como responsável pela confiança, quero rastrear origem dos dados, regras, versões e aprovações humanas para reconstruir uma decisão.",
      criteria: "Data lineage; timestamps; versão de regra/modelo; usuário responsável por revisão; logs não editáveis pelo fluxo comum."
    },
    {
      id: "US-028",
      epic: "EP-06 · Operação & Confiança",
      feature: "F6.3 Auditoria e permissões",
      actor: "Consumidor Multi-UC",
      priority: "Could",
      phase: "P2",
      mvpCore: false,
      story: "Como gestor de várias unidades, quero visualizar portfólio consolidado para priorizar onde existe maior oportunidade ou risco.",
      criteria: "Lista de UCs; métricas comparáveis; drill-down; permissões por portfólio."
    }
  ];

  // Elementos do DOM
  const storiesListContainer = document.getElementById('stories-list-container');
  const filterPriority = document.getElementById('filter-priority');
  const filterEpic = document.getElementById('filter-epic');
  const filterActor = document.getElementById('filter-actor');
  const searchInput = document.getElementById('search-stories');
  const storiesCountLabel = document.getElementById('stories-count-label');

  // Renderização das User Stories
  function renderStories(stories) {
    if (!storiesListContainer) return;
    storiesListContainer.innerHTML = '';

    if (stories.length === 0) {
      storiesListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--color-sand); background: var(--color-carbon-card); border-radius: 8px;">
          Nenhuma User Story encontrada com os filtros selecionados.
        </div>
      `;
      if (storiesCountLabel) storiesCountLabel.textContent = "0 histórias exibidas";
      return;
    }

    if (storiesCountLabel) {
      storiesCountLabel.textContent = `${stories.length} de ${userStoriesData.length} histórias exibidas`;
    }

    stories.forEach(story => {
      const card = document.createElement('div');
      card.className = `story-row-card ${story.mvpCore ? 'mvp-highlight' : ''}`;

      const priorityBadgeClass = 
        story.priority === 'Must' ? 'badge-must' :
        story.priority === 'Should' ? 'badge-should' : 'badge-could';

      card.innerHTML = `
        <div class="story-row-top">
          <div class="story-meta-left">
            <span class="story-row-id">${story.id}</span>
            <span class="story-row-epic">${story.epic} · <em>${story.feature}</em></span>
            <span class="story-row-actor">${story.actor}</span>
          </div>
          <div class="story-meta-right">
            ${story.mvpCore ? '<span class="badge-mvp-star">★ Destaque MVP</span>' : ''}
            <span class="badge-priority ${priorityBadgeClass}">${story.priority} (${story.phase})</span>
          </div>
        </div>
        <p class="story-text">"${story.story}"</p>
        <div class="story-criteria-box">
          <strong>Critérios de Aceite BDD:</strong> ${story.criteria}
        </div>
      `;

      storiesListContainer.appendChild(card);
    });
  }

  // Filtragem Dinâmica
  function applyFilters() {
    const priorityVal = filterPriority ? filterPriority.value : 'all';
    const epicVal = filterEpic ? filterEpic.value : 'all';
    const actorVal = filterActor ? filterActor.value : 'all';
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = userStoriesData.filter(item => {
      // Prioridade / Fase
      if (priorityVal === 'p0' && item.phase !== 'P0') return false;
      if (priorityVal === 'p1' && item.phase !== 'P1') return false;
      if (priorityVal === 'p2' && item.phase !== 'P2') return false;
      if (priorityVal === 'must' && item.priority !== 'Must') return false;
      if (priorityVal === 'mvp' && !item.mvpCore) return false;

      // Épico
      if (epicVal !== 'all' && !item.epic.startsWith(epicVal)) return false;

      // Ator
      if (actorVal !== 'all' && !item.actor.toLowerCase().includes(actorVal.toLowerCase())) return false;

      // Busca textual
      if (searchVal) {
        const matchId = item.id.toLowerCase().includes(searchVal);
        const matchStory = item.story.toLowerCase().includes(searchVal);
        const matchCriteria = item.criteria.toLowerCase().includes(searchVal);
        const matchFeature = item.feature.toLowerCase().includes(searchVal);
        if (!matchId && !matchStory && !matchCriteria && !matchFeature) return false;
      }

      return true;
    });

    renderStories(filtered);
  }

  // Controle de Abas da Matriz SPIDER
  function initSpiderTabs() {
    const tabBtns = document.querySelectorAll('.spider-tab-btn');
    const tabPanels = document.querySelectorAll('.spider-content-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(targetId);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  // Event Listeners
  if (filterPriority) filterPriority.addEventListener('change', applyFilters);
  if (filterEpic) filterEpic.addEventListener('change', applyFilters);
  if (filterActor) filterActor.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // Inicialização
  initSpiderTabs();
  renderStories(userStoriesData);
})();
