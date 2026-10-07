from fintrack.modelos.conta import Conta
from fintrack.modelos.receita import Receita
from fintrack.modelos.despesa import Despesa
from fintrack.repositorio import repositorio_conta as repo
from fintrack.servicos.servico_autenticacao import registrar


def test_salvar_e_carregar_conta_com_transacoes(sessao):
    usuario_id = registrar(sessao, "Ana Silva", "ana@gmail.com", "senhaForte123")

    conta = Conta("Ana", saldo_inicial=100)
    conta.registrar(Receita("Salário", 2000))
    conta.registrar(Despesa("Aluguel", 800))

    conta_id = repo.salvar_conta(sessao, conta, usuario_id)
    conta_carregada = repo.carregar_conta(sessao, conta_id)

    assert conta_carregada.titular == "Ana"
    assert conta_carregada.saldo == 1300
    assert len(conta_carregada.transacoes) == 2