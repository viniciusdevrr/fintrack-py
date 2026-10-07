from fintrack.modelos.categoria import Categoria
from fintrack.repositorio import repositorio_categoria as repo


def test_salvar_e_buscar_categoria(sessao):
    categoria = Categoria("Alimentação", "despesa", limite_mensal=800)
    categoria_id = repo.salvar(sessao, categoria)

    resultado = repo.buscar_por_id(sessao, categoria_id)

    assert resultado.nome == "Alimentação"
    assert resultado.limite_mensal == 800


def test_listar_categorias(sessao):
    repo.salvar(sessao, Categoria("Lazer", "despesa"))
    repo.salvar(sessao, Categoria("Salário", "receita"))

    resultado = repo.listar_todas(sessao)

    assert len(resultado) == 2