import re
from sqlalchemy.orm import Session

from fintrack.analise.relatorios import resumo_do_mes, gastos_por_categoria, comparativo_mensal

def _formatar_real(valor: float) -> str:
    """Formata um número no padrão brasileiro: R$ 1.234,56"""
    texto = f"{valor:,.2f}"
    texto = texto.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {texto}"

def _normalizar(texto: str) -> str:
    """Remove acentos simples e põe em minúsculo, para comparação mais tolerante."""
    texto = texto.lower().strip()
    substituicoes = str.maketrans("áàâãéêíóôõúç", "aaaaeeiooouc")
    return texto.translate(substituicoes)


def _extrair_categoria(pergunta: str, categorias_existentes: list[str]) -> str | None:
    """Procura, dentro da pergunta, o nome de alguma categoria que o usuário já tem cadastrada."""
    pergunta_normalizada = _normalizar(pergunta)
    for categoria in categorias_existentes:
        if _normalizar(categoria) in pergunta_normalizada:
            return categoria
    return None


def responder(sessao: Session, usuario_id: int, pergunta: str) -> str:
    """Interpreta uma pergunta em linguagem natural e devolve uma resposta,
    usando palavras-chave e os relatórios já existentes do sistema."""
    pergunta_normalizada = _normalizar(pergunta)

    gastos = gastos_por_categoria(sessao, usuario_id)
    categorias_existentes = list(gastos.keys())

    # --- Intenção 1: saldo / quanto sobrou ---
    if re.search(r"\b(saldo|sobrou|sobra)\b", pergunta_normalizada):
        resumo = resumo_do_mes(sessao, usuario_id)
        if resumo["saldo"] >= 0:
            return f"Seu saldo este mês está positivo: R$ {resumo['saldo']:,.2f}."
        return f"Atenção: seu saldo este mês está negativo em R$ {_formatar_real(resumo['saldo'])}."

    # --- Intenção 2: quanto gastei no total ---
    if re.search(r"\b(quanto gastei|total de gastos|total de despesas)\b", pergunta_normalizada) \
            and not _extrair_categoria(pergunta_normalizada, categorias_existentes):
        resumo = resumo_do_mes(sessao, usuario_id)
        return f"Você gastou R$ {resumo['despesas']:,.2f} este mês, de um total de R$ {resumo['receitas']:,.2f} em receitas."

    # --- Intenção 3: gasto por categoria específica ---
    categoria = _extrair_categoria(pergunta_normalizada, categorias_existentes)
    if categoria and re.search(r"\b(gastei|gasto|gastos)\b", pergunta_normalizada):
        valor = gastos.get(categoria, 0.0)
        if valor == 0:
            return f"Você ainda não registrou gastos em {categoria} este mês."
        return f"Você gastou R$ {valor:,.2f} em {categoria} este mês."

    # --- Intenção 4: qual categoria eu mais gasto ---
    if re.search(r"\b(mais gasto|maior gasto|onde gasto mais)\b", pergunta_normalizada):
        if not gastos:
            return "Você ainda não tem despesas registradas este mês."
        categoria_top = max(gastos, key=gastos.get)
        return f"Sua maior categoria de gasto este mês é {categoria_top}, com R$ {gastos[categoria_top]:,.2f}."

    # --- Intenção 5: comparação com mês anterior ---
    if re.search(r"\b(mes passado|mes anterior|comparado)\b", pergunta_normalizada):
        comparativo = comparativo_mensal(sessao, usuario_id, ultimos_n_meses=2)
        if len(comparativo) < 2:
            return "Ainda não tenho dados suficientes de meses anteriores para comparar."
        atual, anterior = comparativo[-1], comparativo[-2]
        diferenca = atual["despesas"] - anterior["despesas"]
        if diferenca > 0:
            return f"Você gastou R$ {diferenca:,.2f} a mais que no mês anterior."
        elif diferenca < 0:
            return f"Você gastou R$ {abs(diferenca):,.2f} a menos que no mês anterior."
        return "Seus gastos ficaram praticamente iguais ao mês anterior."

    # --- Nenhuma intenção reconhecida ---
    return (
        "Não entendi sua pergunta. Tente algo como: "
        "'qual meu saldo?', 'quanto gastei este mês?', "
        "'quanto gastei em Mercado?' ou 'onde eu mais gasto?'."
    )