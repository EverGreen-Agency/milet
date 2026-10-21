# Milet V2 — intake com Gemini e Resend

## O que é real neste corte

- Formulário responsivo para empresa e residência.
- Opt-in separado para tratamento de dados e contato.
- `POST /v1/intakes` no backend Nest: valida dados, chama Gemini com saída JSON estruturada e encaminha o pedido para a caixa configurada no Resend.
- Não há fallback sintético: se as credenciais não existirem ou um provedor falhar, a interface mostra erro e não inventa uma orientação.

## Limites intencionais

- Não envia fatura, CPF/CNPJ completo, senha, credencial de distribuidora ou dados bancários.
- Não persiste o intake no banco neste corte; a caixa Resend configurada é a fila operacional inicial.
- Não calcula economia, confirma elegibilidade ou envia RFQ/contratação.
- Upload e leitura de fatura só serão ativados após storage privado, malware scan/quarentena, retenção e revisão humana.

## Configuração local

Crie `.env` na raiz a partir de `.env.example` e configure:

```text
DEMO_DATA_ONLY=false
INTAKE_ENABLED=true
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash-lite
RESEND_API_KEY=...
RESEND_FROM=Milet <seu-remetente-verificado@dominio.com>
INTAKE_NOTIFICATION_TO=seu-email@dominio.com
```

Depois, suba a API em uma sessão e o estático em outra:

```powershell
npm.cmd run api:dev
python -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173/v2/`. Para deploy, altere `v2/runtime-config.js` para uma origem HTTPS permitida em `CORS_ORIGINS`.
