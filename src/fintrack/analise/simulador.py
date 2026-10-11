from sqlalchemy.orm import Session
from fintrack.analise.relatorios import resumo_do_mes, gastos_por_categoria


def simular_gasto(sessao: Session, usuario_id: int, valor_hipotetico: float,
                   categoria: str | None = None) -> dict:
    """Mostra como ficaria o orçamento do mês SE o usuário gastasse mais
    'valor_hipotetico' agora. Não grava nada no banco — é só uma projeção."""

    if valor_hipotetico <= 0:
        raise ValueError("O valor simulado deve ser maior que zero.")

    resumo_atual = resumo_do_mes(sessao, usuario_id)
    saldo_projetado = resumo_atual["saldo"] - valor_hipotetico

    resultado = {
        "saldo_atual": resumo_atual["saldo"],
        "valor_simulado": valor_hipotetico,
        "saldo_projetado": round(saldo_projetado, 2),
        "ficaria_negativo": saldo_projetado < 0,
    }

    if categoria:
        gastos_atuais = gastos_por_categoria(sessao, usuario_id)
        gasto_atual_categoria = gastos_atuais.get(categoria, 0.0)
        gasto_projetado_categoria = gasto_atual_categoria + valor_hipotetico

        resultado["categoria"] = categoria
        resultado["gasto_atual_categoria"] = round(gasto_atual_categoria, 2)
        resultado["gasto_projetado_categoria"] = round(gasto_projetado_categoria, 2)

    return resultado


def simular_cenarios(sessao: Session, usuario_id: int, valores: list[float]) -> list[dict]:
    """Roda a simulação para vários valores de uma vez — útil para mostrar
    'e se eu gastar 100? e se for 300? e se for 500?' numa tabela só."""
    return [simular_gasto(sessao, usuario_id, valor) for valor in valores]