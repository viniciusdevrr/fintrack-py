import io
import matplotlib
matplotlib.use("Agg")  # backend sem interface gráfica — necessário rodando num servidor
import matplotlib.pyplot as plt


def grafico_pizza_categorias(dados: dict[str, float]) -> bytes:
    """Recebe {categoria: valor} e devolve os bytes de uma imagem PNG com gráfico de pizza."""
    if not dados:
        dados = {"Sem dados": 1}

    fig, eixo = plt.subplots(figsize=(6, 6))
    eixo.pie(dados.values(), labels=dados.keys(), autopct="%1.1f%%", startangle=90)
    eixo.set_title("Gastos por categoria")
    eixo.axis("equal")  # garante que o círculo não fique "ovalado"

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight")
    plt.close(fig)  # libera a memória — importante num servidor que gera vários gráficos
    buffer.seek(0)
    return buffer.getvalue()


def grafico_comparativo_mensal(dados: list[dict]) -> bytes:
    """Recebe a lista de comparativo_mensal() e devolve um gráfico de barras receita x despesa."""
    if not dados:
        meses, receitas, despesas = ["Sem dados"], [0], [0]
    else:
        meses = [d["mes"] for d in dados]
        receitas = [d["receitas"] for d in dados]
        despesas = [d["despesas"] for d in dados]

    fig, eixo = plt.subplots(figsize=(8, 5))
    posicoes = range(len(meses))
    largura = 0.35

    eixo.bar([p - largura / 2 for p in posicoes], receitas, largura, label="Receitas", color="#2e7d32")
    eixo.bar([p + largura / 2 for p in posicoes], despesas, largura, label="Despesas", color="#c62828")

    eixo.set_xticks(list(posicoes))
    eixo.set_xticklabels(meses, rotation=45)
    eixo.set_ylabel("R$")
    eixo.set_title("Receitas x Despesas por mês")
    eixo.legend()
    fig.tight_layout()

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png")
    plt.close(fig)
    buffer.seek(0)
    return buffer.getvalue()