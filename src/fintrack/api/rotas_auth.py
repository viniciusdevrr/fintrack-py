from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from fintrack.api.schemas import UsuarioCriar, UsuarioSaida, LoginEntrada, TokenSaida
from fintrack.api.dependencias import obter_sessao
from fintrack.servicos import servico_autenticacao as servico
from fintrack.repositorio.repositorio_usuario import EmailJaCadastradoError
from fintrack.servicos.servico_autenticacao import CredenciaisInvalidasError
from fintrack.excecoes import FinTrackError

roteador = APIRouter(prefix="/auth", tags=["Autenticação"])


@roteador.post("/registrar", response_model=UsuarioSaida, status_code=status.HTTP_201_CREATED)
def registrar(dados: UsuarioCriar, sessao: Session = Depends(obter_sessao)):
    try:
        usuario_id = servico.registrar(sessao, dados.nome, dados.email, dados.senha)
    except EmailJaCadastradoError as erro:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(erro))
    except FinTrackError as erro:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(erro))

    return UsuarioSaida(id=usuario_id, nome=dados.nome, email=dados.email)


@roteador.post("/login", response_model=TokenSaida)
def login(dados: LoginEntrada, sessao: Session = Depends(obter_sessao)):
    try:
        token = servico.login(sessao, dados.email, dados.senha)
    except CredenciaisInvalidasError as erro:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(erro))

    return TokenSaida(access_token=token)