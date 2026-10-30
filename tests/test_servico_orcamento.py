from datetime import date
from fintrack.modelos.categoria import Categoria
from fintrack.repositorio import repositorio_categoria as repo_categoria
from fintrack.repositorio.modelos_orm import ContaORM, DespesaORM
from fintrack.servicos.servico_autenticacao import registrar
from fintrack.servicos import servico_orcamento


def _criar_conta_com_despesa(sessao, usuario_id, categoria_id, valor):
    conta = ContaORM(titular="Ana", saldo_inicial=1000, usuario_id=usuario_id)
    sessao.add(conta)
    sessao.commit()
    sessao.refresh(conta)

    despesa = DespesaORM(
        descricao="Supermercado", valor=valor, data=date.today(),
        conta_id=conta.id, categoria_id=categoria_id,
    )
    sessao.add(despesa)
    sessao.commit()


def test_gera_alerta_quando_ultrapassa_limite(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    categoria_id = repo_categoria.salvar(
        sessao, Categoria("Alimentação", "despesa", limite_mensal=500), usuario_id
    )
    _criar_conta_com_despesa(sessao, usuario_id, categoria_id, valor=600)

    alertas = servico_orcamento.verificar_orcamentos(sessao, usuario_id)

    assert len(alertas) == 1
    assert "Alimentação" in alertas[0].mensagem


def test_nao_gera_alerta_dentro_do_limite(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    categoria_id = repo_categoria.salvar(
        sessao, Categoria("Lazer", "despesa", limite_mensal=500), usuario_id
    )
    _criar_conta_com_despesa(sessao, usuario_id, categoria_id, valor=200)

    alertas = servico_orcamento.verificar_orcamentos(sessao, usuario_id)

    assert alertas == []


def test_nao_duplica_alerta_no_mesmo_mes(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    categoria_id = repo_categoria.salvar(
        sessao, Categoria("Transporte", "despesa", limite_mensal=300), usuario_id
    )
    _criar_conta_com_despesa(sessao, usuario_id, categoria_id, valor=400)

    primeira_checagem = servico_orcamento.verificar_orcamentos(sessao, usuario_id)
    segunda_checagem = servico_orcamento.verificar_orcamentos(sessao, usuario_id)

    assert len(primeira_checagem) == 1
    assert len(segunda_checagem) == 0  # já foi alertado, não repete