import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from fintrack.database import Base
from fintrack.api.app import app
from fintrack.api.dependencias import obter_sessao


@pytest.fixture
def sessao():
    """Cria um banco SQLite novo, em memória, para cada teste."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(bind=engine)
    sessao = SessionLocal()
    yield sessao
    sessao.close()


@pytest.fixture
def cliente(sessao):
    """Cliente de testes da API, usando o mesmo banco isolado da fixture 'sessao'."""
    app.dependency_overrides[obter_sessao] = lambda: sessao
    yield TestClient(app)
    app.dependency_overrides.clear()