import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import select

from fintrack.repositorio.modelos_orm import TransacaoORM, ContaORM, CategoriaORM


def _buscar_transacoes_df(sessao: Session, usuario_id: int) -> pd.DataFrame:
    """Busca todas as transações do usuário no banco e devolve como DataFrame."""
    consulta = (
        select(
            TransacaoORM.tipo,
            TransacaoORM.descricao,
            TransacaoORM.valor,
            TransacaoORM.data,
            CategoriaORM.nome.label("categoria"),
        )
        .join(ContaORM, TransacaoORM.conta_id == ContaORM.id)
        .outerjoin(CategoriaORM, TransacaoORM.categoria_id == CategoriaORM.id)
        .where(ContaORM.usuario_id == usuario_id)
    )

    resultado = sessao.execute(consulta).all()

    # pd.DataFrame aceita uma lista de "linhas" diretamente. Cada linha do
    # resultado já vem como uma tupla nomeada, então .mappings() -> dict
    # facilita a conversão com os nomes de coluna certos.
    df = pd.DataFrame(resultado, columns=["tipo", "descricao", "valor", "data", "categoria"])

    if df.empty:
        return df

    df["data"] = pd.to_datetime(df["data"])
    df["mes"] = df["data"].dt.to_period("M").astype(str)  # ex: "2026-10"
    df["categoria"] = df["categoria"].fillna("Sem categoria")
    return df


def resumo_do_mes(sessao: Session, usuario_id: int, referencia_mes: str | None = None) -> dict:
    """Total de receitas, despesas e saldo de um mês específico (padrão: mês atual)."""
    df = _buscar_transacoes_df(sessao, usuario_id)
    if df.empty:
        return {"receitas": 0.0, "despesas": 0.0, "saldo": 0.0}

    mes_alvo = referencia_mes or pd.Timestamp.today().strftime("%Y-%m")
    df_mes = df[df["mes"] == mes_alvo]

    receitas = df_mes.loc[df_mes["tipo"] == "receita", "valor"].sum()
    despesas = df_mes.loc[df_mes["tipo"].isin(["despesa", "despesa_cartao"]), "valor"].sum()

    return {
        "receitas": round(float(receitas), 2),
        "despesas": round(float(despesas), 2),
        "saldo": round(float(receitas - despesas), 2),
    }


def gastos_por_categoria(sessao: Session, usuario_id: int, referencia_mes: str | None = None) -> dict[str, float]:
    """Soma de despesas agrupadas por categoria, num mês específico."""
    df = _buscar_transacoes_df(sessao, usuario_id)
    if df.empty:
        return {}

    mes_alvo = referencia_mes or pd.Timestamp.today().strftime("%Y-%m")
    despesas_mes = df[(df["mes"] == mes_alvo) & (df["tipo"].isin(["despesa", "despesa_cartao"]))]

    agrupado = despesas_mes.groupby("categoria")["valor"].sum().sort_values(ascending=False)
    return {categoria: round(float(valor), 2) for categoria, valor in agrupado.items()}


def comparativo_mensal(sessao: Session, usuario_id: int, ultimos_n_meses: int = 6) -> list[dict]:
    """Receitas, despesas e saldo mês a mês, dos últimos N meses com movimentação."""
    df = _buscar_transacoes_df(sessao, usuario_id)
    if df.empty:
        return []

    # pivot_table: transforma linhas soltas numa tabela cruzada
    # (mês nas linhas, tipo de transação nas colunas, soma como valor).
    tabela = df.pivot_table(
        index="mes", columns="tipo", values="valor", aggfunc="sum", fill_value=0
    )

    if "receita" not in tabela.columns:
        tabela["receita"] = 0.0
    for coluna_despesa in ("despesa", "despesa_cartao"):
        if coluna_despesa not in tabela.columns:
            tabela[coluna_despesa] = 0.0

    tabela["despesas_total"] = tabela.get("despesa", 0) + tabela.get("despesa_cartao", 0)
    tabela["saldo"] = tabela["receita"] - tabela["despesas_total"]

    tabela = tabela.sort_index().tail(ultimos_n_meses)

    return [
        {
            "mes": mes,
            "receitas": round(float(linha["receita"]), 2),
            "despesas": round(float(linha["despesas_total"]), 2),
            "saldo": round(float(linha["saldo"]), 2),
        }
        for mes, linha in tabela.iterrows()
    ]