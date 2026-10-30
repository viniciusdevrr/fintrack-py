from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func

from fintrack.modelos.alerta import Alerta
from fintrack.repositorio.modelos_orm import TransacaoORM, ContaORM, CategoriaORM
from fintrack.repositorio import repositorio_alerta as repo_alerta


def calcular_gasto_categoria_mes(sessao: Session, usuario_id: int, categoria_id: int, referencia_mes: str) -> float:
    """Soma todas as despesas de uma categoria, do usuário, dentro de um mês específico."""
    ano, mes = map(int, referencia_mes.split("-"))
    primeiro_dia = date(ano, mes, 1)
    ultimo_dia = date(ano + (mes == 12), (mes % 12) + 1, 1)  # primeiro dia do mês seguinte

    total = (
        sessao.query(func.sum(TransacaoORM.valor))
        .join(ContaORM, TransacaoORM.conta_id == ContaORM.id)
        .filter(
            ContaORM.usuario_id == usuario_id,
            TransacaoORM.categoria_id == categoria_id,
            TransacaoORM.tipo.in_(["despesa", "despesa_cartao"]),
            TransacaoORM.data >= primeiro_dia,
            TransacaoORM.data < ultimo_dia,
        )
        .scalar()
    )
    return total or 0.0


def verificar_orcamentos(sessao: Session, usuario_id: int) -> list[Alerta]:
    """Para cada categoria com limite definido, verifica se o gasto do mês
    atual já atingiu ou ultrapassou o limite. Gera e salva um Alerta novo
    só se ainda não existir um para essa categoria neste mês."""
    referencia_mes = date.today().strftime("%Y-%m")
    categorias_com_limite = (
        sessao.query(CategoriaORM)
        .filter(CategoriaORM.usuario_id == usuario_id, CategoriaORM.limite_mensal.isnot(None))
        .all()
    )

    alertas_novos: list[Alerta] = []

    for categoria in categorias_com_limite:
        gasto = calcular_gasto_categoria_mes(sessao, usuario_id, categoria.id, referencia_mes)

        if gasto < categoria.limite_mensal:
            continue  # dentro do orçamento, nada a fazer

        if repo_alerta.ja_existe_alerta_do_mes(sessao, usuario_id, categoria.id, referencia_mes):
            continue  # já avisamos sobre isso neste mês

        mensagem = (
            f"Você já gastou R$ {gasto:,.2f} em {categoria.nome}, "
            f"ultrapassando o limite de R$ {categoria.limite_mensal:,.2f} deste mês."
        )
        alerta = Alerta(tipo="limite_categoria", mensagem=mensagem)
        repo_alerta.salvar(sessao, alerta, usuario_id, categoria.id, referencia_mes)
        alertas_novos.append(alerta)

    return alertas_novos