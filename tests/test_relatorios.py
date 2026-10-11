from datetime import date
from fintrack.servicos.servico_autenticacao import registrar
from fintrack.repositorio.modelos_orm import ContaORM, ReceitaORM, DespesaORM
from fintrack.analise import relatorios


def _preparar_dados(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    conta = ContaORM(titular="Ana", saldo_inicial=0, usuario_id=usuario_id)
    sessao.add(conta)
    sessao.commit()
    sessao.refresh(conta)

    hoje = date.today()
    sessao.add_all([
        ReceitaORM(descricao="Salário", valor=3000, data=hoje, conta_id=conta.id),
        DespesaORM(descricao="Mercado", valor=400, data=hoje, conta_id=conta.id),
        DespesaORM(descricao="Uber", valor=100, data=hoje, conta_id=conta.id),
    ])
    sessao.commit()
    return usuario_id


def test_resumo_do_mes(sessao):
    usuario_id = _preparar_dados(sessao)
    resumo = relatorios.resumo_do_mes(sessao, usuario_id)

    assert resumo["receitas"] == 3000
    assert resumo["despesas"] == 500
    assert resumo["saldo"] == 2500


def test_resumo_sem_dados(sessao):
    usuario_id = registrar(sessao, "Bruno", "bruno@gmail.com", "senhaForte123")
    resumo = relatorios.resumo_do_mes(sessao, usuario_id)

    assert resumo == {"receitas": 0.0, "despesas": 0.0, "saldo": 0.0}


def test_gastos_por_categoria_sem_categoria_definida(sessao):
    usuario_id = _preparar_dados(sessao)
    gastos = relatorios.gastos_por_categoria(sessao, usuario_id)

    assert gastos == {"Sem categoria": 500.0}


def test_comparativo_mensal(sessao):
    usuario_id = _preparar_dados(sessao)
    comparativo = relatorios.comparativo_mensal(sessao, usuario_id)

    assert len(comparativo) == 1
    assert comparativo[0]["receitas"] == 3000
    assert comparativo[0]["saldo"] == 2500