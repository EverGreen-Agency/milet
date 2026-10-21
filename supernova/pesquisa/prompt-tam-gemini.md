# Pesquisa de TAM / SAM / SOM · instruções para o Gemini (Deep Research)

Cole o bloco abaixo inteiro no Gemini. O resultado substitui as estimativas do slide 09 do deck.

```
Você é um analista de mercado do setor elétrico brasileiro. Preciso dimensionar o mercado de uma
startup (Milet) para um pitch do Sebrae Supernova em 22/10/2026. Use apenas fontes oficiais ou
primárias (ANEEL, CCEE, EPE, MME, Abraceel) e cite o link e a data de cada número. Quando não houver
dado oficial, diga isso explicitamente e mostre a premissa usada. Não invente números.

O que a Milet faz: lê a fatura de energia de PMEs do Grupo A (média tensão, subgrupos A4/A3a),
compara rotas (mercado livre varejista, geração solar própria, geração compartilhada/GD) e coloca
propostas de comercializadoras na mesma régua de custo total; depois acompanha a economia.
Receita (hipóteses): (1) taxa por contrato fechado paga pela comercializadora; (2) mensalidade de
acompanhamento paga pela PME.

Responda, nesta ordem:

1. Base de clientes (contagem de unidades consumidoras):
   a. Total de unidades do Grupo A no Brasil e quantas já estão no mercado livre (ACL), dado mais recente.
   b. Quantas unidades do Grupo A seguem no mercado cativo, com o recorte de PME/pequeno porte
      (ex.: demanda contratada abaixo de 500 kW). Confirmar a estimativa da CCEE de ~72 mil empresas
      (2023), a da ANEEL de ~72,2 mil abaixo de 500 kW (2024) e um material da CCEE de 2024 que fala em
      ~106 mil aptas. Explique a diferença entre elas.
   c. Distribuição por estado (SP, MG, RS, SC, PR) e por setor (serviços, comércio), se houver.

2. Ticket de energia:
   a. Gasto médio mensal com energia de uma unidade A4 de pequeno porte (faixa típica em R$/mês).
   b. Gasto anual total com energia dessas unidades cativas (R$/ano), com o cálculo explícito.

3. Referências de preço para a receita da Milet (benchmarks públicos):
   a. Comissões pagas por comercializadoras/gestoras a parceiros por cliente fechado
      (ex.: Clarke Energia, programa de parceria abr/2025: R$ 5.000 a R$ 10.000 por cliente, conforme a conta).
   b. Mensalidades de gestão/consultoria cobradas da empresa (ex.: Clarke R$ 100/mês).
   c. Outras plataformas (Electy, UC Livre, Ynova, Energy Ogre nos EUA): quem paga e quanto, se público.

4. Fluxo anual (mercado em movimento):
   a. Migrações ao ACL por ano (2023, 2024, 2025, 1T2026) segundo a CCEE.
   b. Quantas renovações/recontratações de contratos varejistas ocorrem por ano (se houver dado).

5. Expansão regulatória (upside, não entra no TAM atual):
   a. Cronograma da abertura do mercado livre para a baixa tensão (Lei 15.269/2025 e Decreto 13.097/2026):
      datas para comercial/industrial e para residencial.
   b. Número de unidades de baixa tensão comercial (B3) que passariam a ser elegíveis.

6. Monte a tabela final, com a fórmula de cada linha:
   - TAM (receita potencial anual): PMEs do Grupo A com potencial × receita anual por cliente.
   - SAM (mercado que decide agora): migrações por ano × receita por nova contratação,
     ou o recorte geográfico SP+MG+Sul, o que for mais defensável. Justifique a escolha.
   - SOM (o que a Milet captura em 12–24 meses): 20–50 clientes na fase concierge e uma meta de
     3 anos (ex.: 1% do TAM). Mostre o valor em R$/ano.
   Em seguida, uma frase de até 20 palavras para o slide e as 3 premissas mais frágeis.

Formato: tabelas em markdown, cada número com [fonte, data]. Português do Brasil.
```

## Estimativa preliminar (para comparar com o que o Gemini trouxer)
Feita com os dados que já temos; substitua quando a pesquisa voltar.

| Camada | Cálculo | Ordem de grandeza |
|---|---|---|
| **Receita por cliente/ano** | Taxa de R$ 5.000 por contrato, paga em cerca de 2 anos (piso da tabela da Clarke) ≈ R$ 2.000/ano + mensalidade de R$ 100 a R$ 190 ≈ R$ 1.200 a R$ 2.300/ano | ~R$ 3.500/ano |
| **TAM** | 72 mil PMEs do Grupo A com potencial (CCEE, 2023) × R$ 3.500 | ~R$ 250 milhões/ano |
| **SAM** | ~21,7 mil migrações/ano (CCEE, 2025) × R$ 5.000 por nova contratação | ~R$ 110 milhões/ano |
| **SOM (fase 0)** | 20 a 50 PMEs × R$ 3.500 | ~R$ 70 a 175 mil/ano |
| **Meta de 3 anos** | 1% do TAM ≈ 720 PMEs × R$ 3.500 | ~R$ 2,5 milhões/ano |
| **Upside** | Abertura da baixa tensão: comercial/industrial em nov/2027, residencial em nov/2028 (Lei 15.269/2025) | fora do TAM atual |

Premissas mais frágeis: a taxa por contrato (vem de uma gestora, não de comercializadora), a duração média do contrato, e quantas das 72 mil PMEs ainda estão no cativo.
