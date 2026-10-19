from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from fintrack.api.dependencias import obter_sessao, obter_usuario_atual
from fintrack.analise import relatorios, graficos

roteador = APIRouter(prefix="/relatorios", tags=["Relatórios"])


@roteador.get("/resumo-mes")
def resumo_mes(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    return relatorios.resumo_do_mes(sessao, usuario_id)


@roteador.get("/gastos-por-categoria")
def gastos_por_categoria(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    return relatorios.gastos_por_categoria(sessao, usuario_id)


@roteador.get("/comparativo-mensal")
def comparativo_mensal(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    return relatorios.comparativo_mensal(sessao, usuario_id)


@roteador.get("/grafico/categorias")
def grafico_categorias(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    dados = relatorios.gastos_por_categoria(sessao, usuario_id)
    imagem = graficos.grafico_pizza_categorias(dados)
    return Response(content=imagem, media_type="image/png")


@roteador.get("/grafico/comparativo")
def grafico_comparativo(
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    dados = relatorios.comparativo_mensal(sessao, usuario_id)
    imagem = graficos.grafico_comparativo_mensal(dados)
    return Response(content=imagem, media_type="image/png")


@roteador.get("/gastos-por-categoria-periodo")
def gastos_por_categoria_periodo(
    meses: int = 6,
    sessao: Session = Depends(obter_sessao),
    autenticado=Depends(obter_usuario_atual),
):
    _, usuario_id = autenticado
    return relatorios.gastos_por_categoria_periodo(sessao, usuario_id, meses)