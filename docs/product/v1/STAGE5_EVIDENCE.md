# Stage 5 — mobile web instalável

**Data:** 2026-10-04  
**Classificação:** PWA implementada e testada; instalação pública e operação do
service worker dependem do deploy HTTPS do commit desta etapa.

## Entregue

- manifest em `/app/manifest.webmanifest` com escopo e início em `/app/`;
- ícones oficiais Milet de 192 e 512 px e Apple touch icon já existentes no projeto;
- registro progressivo do service worker e botão de instalação somente quando o
  navegador expõe `beforeinstallprompt`;
- app shell versionado para abrir a jornada sintética sem rede;
- bypass obrigatório de `/api/`, que nunca é lida ou gravada pelo cache;
- navegação offline volta ao shell e o adapter existente mostra
  `fixture_fallback` quando a função sintética não responde;
- `sw.js` servido com `no-cache, no-store, must-revalidate` para facilitar
  atualização segura do worker.

## Validação reproduzível

```powershell
npm.cmd run ci
git diff --check
```

Os testes verificam manifest, escopo, modo standalone, presença física dos ícones,
shell mínimo e a exclusão explícita de `/api`. O build deve conter
`app/manifest.webmanifest` e `app/sw.js`.

Após o merge, a prova hospedada exige:

1. `200` e JSON válido no manifest;
2. `200` e `Cache-Control: no-cache, no-store, must-revalidate` em `sw.js`;
3. registro do service worker sob `/app/` em HTTPS;
4. recarga offline do shell após uma primeira visita online;
5. fallback sintético visível quando `/api` não puder ser alcançada.

## Limites

- é uma PWA/mobile web, não binário nativo nem publicação em App Store/Google Play;
- não há push, background sync, biometria, pagamentos ou armazenamento de dados reais;
- o botão depende do critério e do evento de instalação do navegador; no iOS a
  instalação continua pelo comando Adicionar à Tela de Início;
- a preferência marcada pelo usuário continua limitada à sessão;
- o cache contém apenas código, identidade visual e fixtures sintéticas públicas.
