from fintrack.modelos.categoria import Categoria
from fintrack.repositorio import repositorio_categoria as repo
from fintrack.servicos.servico_autenticacao import registrar


def test_salvar_e_buscar_categoria(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    categoria = Categoria("Alimentação", "despesa", limite_mensal=800)
    categoria_id = repo.salvar(sessao, categoria, usuario_id)

    resultado = repo.buscar_por_id(sessao, categoria_id, usuario_id)

    assert resultado.nome == "Alimentação"
    assert resultado.limite_mensal == 800


def test_listar_categorias(sessao):
    usuario_id = registrar(sessao, "Ana", "ana@gmail.com", "senhaForte123")
    repo.salvar(sessao, Categoria("Lazer", "despesa"), usuario_id)
    repo.salvar(sessao, Categoria("Salário", "receita"), usuario_id)

    resultado = repo.listar_todas(sessao, usuario_id)

    assert len(resultado) == 2