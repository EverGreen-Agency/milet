# Milet — primeira fatia de produto

Aplicação front-end independente que convive com o brandbook estático. A escolha por HTML, CSS e ES modules mantém o mesmo modelo de publicação do repositório, evita uma migração de stack antes de haver backend e cria fronteiras explícitas para trocar fixtures por APIs.

## Executar

Na raiz do repositório:

```powershell
npx.cmd --yes serve . -l 4173
```

Acesse `http://127.0.0.1:4173/app/`. O servidor é necessário porque a aplicação usa ES modules; abrir o arquivo diretamente por `file://` não é suportado.

## Verificar

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

## Arquitetura e limites

- `src/domain.js`: modelos, validação e cálculo all-in, independentes de UI.
- `src/fixtures.js`: um caso sintético consistente de ponta a ponta.
- `src/demo-adapter.js`: adapter que tenta a função sintética `/api` e faz fallback
  local explícito quando ela não existe ou falha.
- `src/app.js`: fluxo e renderização do protótipo.
- `styles.css`: layout desktop/mobile, foco visível e movimento reduzido.

É uma demonstração navegável, não um app nativo. Arquivos escolhidos não saem do navegador; a função `/api` serve apenas o caso sintético canônico e não persiste nada. A leitura, elegibilidade, propostas e regras são sintéticas. Não há autenticação, isolamento multiusuário real, OCR, backend persistente, auditoria imutável, integração regulatória, assinatura ou contratação. A preferência por oferta só vive na sessão atual.

## Cobertura de histórias

| História | Evidência nesta fatia | Estado honesto |
|---|---|---|
| US-001 | Triagem antes da fatura, com resultado preliminar | Parcial · regras sintéticas |
| US-002 | Entrada por arquivo, formato inválido, falha e fatura demo | Parcial · sem upload/OCR real |
| US-003 | Confiança por campo, dado ausente, correção e aprovação | Parcial · registro local |
| US-006 | Rotas elegível, em revisão e não priorizada com motivo | Parcial · regra demo v0.1 |
| US-007 | Baseline com período, componentes e premissas | Protótipo funcional |
| US-008 | Dois cenários na mesma baseline e horizonte | Protótipo funcional |
| US-009 | Recomendação, critérios e limites progressivos | Parcial · sem revisão operacional |
| US-013 | Comparação all-in; tabela desktop e cartões mobile | Protótipo funcional |

O fluxo também demonstra transparência de remuneração e seleção de preferência, sem declarar US-014/US-015 concluídas. O ranking usa custo total; não existe spread oculto nem pagamento por posição.
