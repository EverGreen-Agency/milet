# V2 na Vercel — checklist de ativação

O site V2 usa `POST /v1/intakes` no próprio domínio. Na Vercel, a rota é atendida por `api/v1/intakes.js`; Gemini e Resend são chamados apenas no servidor. Nenhuma chave é enviada ao navegador.

## Variáveis de Production e Preview

Configure estas variáveis no projeto **milet**; não as coloque no Git nem em `runtime-config.js`.

```text
INTAKE_ENABLED=true
DEMO_DATA_ONLY=false
GEMINI_API_KEY=<chave do projeto Gemini>
GEMINI_MODEL=gemini-2.5-flash-lite
RESEND_API_KEY=<chave Resend>
RESEND_FROM=Milet <milet@evergreenmkt.com.br>
RESEND_REPLY_TO=milet@evergreenmkt.com.br
INTAKE_NOTIFICATION_TO=eduardo.fm@evergreenmkt.com.br
```

`RESEND_FROM` só funcionará depois que `evergreenmkt.com.br` for verificado no Resend com os registros DNS solicitados. O e-mail interno vai para Eduardo; a confirmação vai ao endereço informado no formulário. Respostas do lead vão para `milet@evergreenmkt.com.br`, que deve ser encaminhado para Eduardo pelo provedor da caixa de e-mail.

## Caixa de entrada Milet

Criar um remetente não cria uma caixa de entrada. No provedor de e-mail que hospeda `evergreenmkt.com.br`, crie o alias `milet@evergreenmkt.com.br` com encaminhamento para `eduardo.fm@evergreenmkt.com.br`. Assim, os leads veem Milet no envio e na resposta, enquanto as mensagens chegam a Eduardo. Não altere registros MX existentes sem checar o impacto no e-mail atual. Se o alias ainda não existir, use temporariamente `RESEND_REPLY_TO=eduardo.fm@evergreenmkt.com.br`.

## Antes de abrir ao público

1. Verificar domínio do remetente no Resend e testar SPF/DKIM.
2. Cadastrar as variáveis em Preview e Production e fazer um novo deploy; a Vercel aplica variáveis novas apenas em deploys novos.
3. Enviar um intake de teste para uma caixa controlada, validar: orientação, aviso interno, confirmação e Reply-To.
4. Só então trocar o CTA público. Não habilitar upload de fatura nesta fase.

O endpoint falha fechado se as flags ou as quatro credenciais obrigatórias estiverem ausentes. O limite atual é de 3 solicitações por IP a cada 15 minutos por instância; isso é uma proteção básica de beta, não um WAF distribuído.
