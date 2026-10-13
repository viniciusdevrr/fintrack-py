from datetime import date
from fintrack.servicos.servico_autenticacao import registrar
from fintrack.modelos.categoria import Categoria
from fintrack.repositorio import repositorio_categoria as repo_categoria
from fintrack.repositorio.modelos_orm import ContaORM, ReceitaORM, DespesaORM
from fintrack.analise.assistente import responder


def _preparar_dados(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    categoria_id = repo_categoria.salvar(sessao, Categoria("Mercado", "despesa"), usuario_id)

    conta = ContaORM(titular="Ana", saldo_inicial=0, usuario_id=usuario_id)
    sessao.add(conta)
    sessao.commit()
    sessao.refresh(conta)

    hoje = date.today()
    sessao.add_all([
        ReceitaORM(descricao="Salário", valor=3000, data=hoje, conta_id=conta.id),
        DespesaORM(descricao="Compras do mês", valor=450, data=hoje, conta_id=conta.id, categoria_id=categoria_id),
    ])
    sessao.commit()
    return usuario_id


def test_pergunta_sobre_saldo(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "qual meu saldo?")
    assert "2.550" in resposta  # formato brasileiro: R$ 2.550,00


def test_pergunta_sobre_gasto_total(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "quanto eu gastei esse mês?")
    assert "450" in resposta


def test_pergunta_sobre_categoria_especifica(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "quanto gastei em Mercado?")
    assert "450" in resposta
    assert "Mercado" in resposta


def test_pergunta_categoria_com_acento_e_minusculo(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "gastei quanto em mercado")
    assert "450" in resposta


def test_pergunta_sobre_maior_gasto(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "onde eu mais gasto?")
    assert "Mercado" in resposta


def test_pergunta_nao_reconhecida(sessao):
    usuario_id = _preparar_dados(sessao)
    resposta = responder(sessao, usuario_id, "qual a previsão do tempo amanhã?")
    assert "não entendi" in resposta.lower()