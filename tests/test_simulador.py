import pytest
from datetime import date
from fintrack.servicos.servico_autenticacao import registrar
from fintrack.repositorio.modelos_orm import ContaORM, ReceitaORM, DespesaORM
from fintrack.analise import simulador


def _preparar_dados(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    conta = ContaORM(titular="Ana", saldo_inicial=0, usuario_id=usuario_id)
    sessao.add(conta)
    sessao.commit()
    sessao.refresh(conta)

    hoje = date.today()
    sessao.add_all([
        ReceitaORM(descricao="Salário", valor=3000, data=hoje, conta_id=conta.id),
        DespesaORM(descricao="Mercado", valor=800, data=hoje, conta_id=conta.id),
    ])
    sessao.commit()
    return usuario_id


def test_simulacao_simples(sessao):
    usuario_id = _preparar_dados(sessao)
    resultado = simulador.simular_gasto(sessao, usuario_id, valor_hipotetico=500)

    assert resultado["saldo_atual"] == 2200  # 3000 - 800
    assert resultado["saldo_projetado"] == 1700
    assert resultado["ficaria_negativo"] is False


def test_simulacao_que_fica_negativa(sessao):
    usuario_id = _preparar_dados(sessao)
    resultado = simulador.simular_gasto(sessao, usuario_id, valor_hipotetico=3000)

    assert resultado["ficaria_negativo"] is True


def test_simulacao_valor_invalido_levanta_erro(sessao):
    usuario_id = _preparar_dados(sessao)
    with pytest.raises(ValueError):
        simulador.simular_gasto(sessao, usuario_id, valor_hipotetico=-100)


def test_simulacao_nao_grava_nada_no_banco(sessao):
    """Prova o conceito central da fase: simular não persiste nada."""
    from fintrack.analise.relatorios import resumo_do_mes

    usuario_id = _preparar_dados(sessao)
    simulador.simular_gasto(sessao, usuario_id, valor_hipotetico=500)

    resumo_real = resumo_do_mes(sessao, usuario_id)
    assert resumo_real["saldo"] == 2200  # continua igual, a simulação não alterou nada

def test_simular_cenarios(sessao):
    usuario_id = _preparar_dados(sessao)
    resultados = simulador.simular_cenarios(sessao, usuario_id, valores=[100, 300, 500])

    assert len(resultados) == 3
    assert resultados[0]["saldo_projetado"] == 2100
    assert resultados[2]["saldo_projetado"] == 1700