# Checklist de Validação e Pendências Finais (TODO) — Milet

Este arquivo lista apenas as pendências reais e itens que dependem de confirmação pessoal ou do orientador para a entrega final de Projetos I.

---

## 1. Dados Acadêmicos & Confirmações Institucionais
- [x] Nome do autor confirmado: **Eduardo Ferreira de Mattos** (trabalho individual)
- [x] Orientador confirmado: **Prof. Dr. Rodrigo Juliani**
- [x] Instituição e turma: **Mackenzie · Engenharia da Computação · Turma 6 (2026.2)**
- [ ] Confirmar data e horário exatos da banca presencial de Projetos I
- [ ] Confirmar número do RA institucional do aluno para o relatório final impresso

---

## 2. Validação da Apresentação Web (`presentation.html`)
- [x] Resolução 16:9 estrita (1920x1080) sem cortes ou overflow vertical
- [x] 13 slides cobrindo rigorosamente a rubrica oficial de avaliação do Mackenzie (10 Pontos)
- [x] Identidade visual Milet (Cormorant Garamond + Inter, paleta Carbon/Ivory/Sand/Amber/Copper)
- [x] Cronograma Gantt cobrindo de Ago/2026 a Jun/2027 com separação forte entre semestres (Slide 10)
- [x] Slide 10 e 11 dividindo o escopo acadêmico, métodos ágeis BDD, SPIDER e mitigação de riscos
- [x] HUD interativo com navegação, contador `01 / 13`, timer de 10 min e gaveta de Speaker Notes (tecla N)
- [x] Modo de impressão / export PDF configurado via `@media print`
- [x] Duração de fala calibrada para 9 minutos e 40 segundos em `speaker-notes.md` (≤ 10 min)
- [x] Badges visuais em cada slide indicando o critério e peso da banca avaliadora

---

## 3. Artefatos Visuais Opcionais (Checklist de Imagens)
- [x] Canvas BMC v0.1 renderizado no Slide 11 com `assets/bmc.png`
- [x] Símbolo oficial da marca Milet renderizado em SVG/PNG transparente
- [ ] (Opcional) Capturar print de alta resolução do Fibery se desejar substituir o diagrama no relatório impresso:
  - *Discovery · User Profiles · Whiteboard*
  - *Business · BMC · Whiteboard*
  - *Milet · Deliverables · Board*

---

## 4. Próximos Passos de Engenharia (Início de Projetos II · 2027.1)
- [ ] Início da codificação do parser de faturas em Python/TypeScript (US-002)
- [ ] Implementação das funções de cálculo de economia e regras tarifárias ANEEL (US-006 / US-013)
- [ ] Configuração do ambiente de integração contínua (CI/CD) com testes automatizados BDD
- [ ] Preparação da base de dados e conformidade com a LGPD (US-027)
