# Milet V2 — guia rápido

Este arquivo fica no workspace atual para substituir os links que apontavam ao worktree isolado. A V2 foi enviada para `origin/main` no commit `59e48b5`; este checkout permanece 28 commits atrás porque contém alterações de apresentação que não foram tocadas.

## Já entregue na V2

- Duas jornadas responsivas: empresa/PME e residencial.
- Formulário com consentimento, triagem Gemini no servidor e limites explícitos: sem promessa de economia, elegibilidade ou contratação.
- Notificação do time por Resend e confirmação automática para quem enviar o formulário.
- Endpoint Vercel `POST /v1/intakes`, para não depender de uma API local em produção.
- Sem upload de fatura/OCR: essa etapa só entra depois de armazenamento privado, retenção e revisão humana.

## Ainda não está ativado

- As chaves de Gemini e Resend **não foram cadastradas na Vercel**. A tentativa de listagem via CLI não retornou uma sessão autenticada utilizável; nenhum segredo foi lido ou alterado.
- Falta verificar `evergreenmkt.com.br` no Resend e criar o alias de recebimento `milet@evergreenmkt.com.br` no provedor de e-mail atual.
- Falta testar um envio real de ponta a ponta e fazer o redeploy após incluir as variáveis.
- Falta decidir e registrar o domínio de produto, após verificar disponibilidade e marca.

## Configuração recomendada

```text
INTAKE_ENABLED=true
DEMO_DATA_ONLY=false
GEMINI_API_KEY=<segredo>
GEMINI_MODEL=gemini-2.5-flash-lite
RESEND_API_KEY=<segredo>
RESEND_FROM=Milet <milet@evergreenmkt.com.br>
RESEND_REPLY_TO=milet@evergreenmkt.com.br
INTAKE_NOTIFICATION_TO=eduardo.fm@evergreenmkt.com.br
```

O endereço exibido para o lead será `milet@evergreenmkt.com.br`. O alias encaminha as respostas para `eduardo.fm@evergreenmkt.com.br`; os alertas internos já vão diretamente para Eduardo. Isso exige verificar o domínio no Resend e criar o alias/encaminhamento no host de e-mail — enviar como Milet, por si só, não cria uma caixa de entrada. Sem o alias, use temporariamente Eduardo no `RESEND_REPLY_TO`.

## Próximo ciclo enxuto

1. Validar domínio e remetente; criar o alias Milet.
2. Inserir as variáveis em Preview e Production, redeploy e testar com um e-mail controlado.
3. Publicar 3 conteúdos de descoberta e convidar 10 pessoas para testar cada jornada.
4. Medir: visitas, início do formulário, envio, confirmação recebida e conversas qualificadas.
