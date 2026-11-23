import docx
from pathlib import Path

SRC_DOCX = Path(r"c:\Users\Lenovo\Desktop\milet\academico\n2\engenharia-da-computacao\Milet_Relatorio_Computacao_N2.docx")
OUT_DOCX = Path(r"c:\Users\Lenovo\Desktop\milet\academico\n2\engenharia-da-computacao\Milet_Relatorio_Computacao_N2_Final.docx")

def update_section_9_2():
    doc = docx.Document(str(SRC_DOCX))
    
    target_idx = None
    for i, p in enumerate(doc.paragraphs):
        if "Na frente qualitativa via WhatsApp, foram registrados dois contatos" in p.text:
            target_idx = i
            break
            
    if target_idx is None:
        for i, p in enumerate(doc.paragraphs):
            if "Dacoli Alimentos" in p.text and "CGC Energia" in p.text:
                target_idx = i
                break

    assert target_idx is not None, "Paragraph with interviews not found!"
    print(f"Found interview paragraph at index {target_idx}")

    new_interview_text = (
        "Na frente qualitativa e de validação de mercado, o projeto consolidou três contatos estratégicos primários que "
        "fundamentam o problema e o modelo de negócio da Milet ao longo de toda a cadeia: "
        "(a) ENT-00 · Entrevista de Origem e Operação de Usinas GD (Depoimento do Fundador / Desenvolvedor de Projetos Solares), "
        "que identificou a assimetria crítica do setor: o processo tradicional busca terrenos/telhados e investidores sem ter a "
        "demanda previamente contratada, incorrendo em alto risco de ociosidade; a Milet inverte essa lógica ao antecipar a viabilidade "
        "geolocalizada e organizar a demanda tanto para contratos dedicados '1 para 1' (autoconsumo remoto para grandes unidades) "
        "quanto contratos fracionados '1 para vários' (geração compartilhada/consórcios para PMEs); "
        "(b) ENT-01 · Guilherme, proprietário da Dacoli Alimentos (indústria alimentícia em Porto Feliz/SP), que relatou incapacidade "
        "técnica de auditar variações tarifárias na fatura de energia e desconfiança diante de propostas comerciais de migração sem "
        "comparabilidade transparente de custos e taxa de intermediação explícita; e "
        "(c) ENT-02 · Gerente de Novos Negócios da CGC Energia (empresa de geração distribuída solar por assinatura em São José do Rio Preto/SP), "
        "que atestou o elevado Custo de Aquisição de Clientes (CAC) e o atrito operacional para recolher contas legíveis de PMEs antes "
        "de emitir uma proposta de cota viável. "
        "Adicionalmente, o pipeline de telemetria instrumentado com PostHog (eventos pme_hero_cta_clicked, pme_calculator_completed "
        "e pme_contact_form_submitted) validou o recebimento bem-sucedido de métricas de conversão em tempo real no dashboard da organização. "
        "Por transparência metodológica, registra-se que os três registros qualitativos e os eventos de telemetria caracterizam o ciclo "
        "de validação inicial da N2, fornecendo a base empírica para os algoritmos de matching e os quatro portais desenvolvidos."
    )

    doc.paragraphs[target_idx].text = new_interview_text
    doc.save(str(OUT_DOCX))
    print(f"Saved successfully to: {OUT_DOCX}")

if __name__ == "__main__":
    update_section_9_2()
