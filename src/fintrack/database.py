import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Em produção (Render), DATABASE_URL vem como variável de ambiente, apontando
# para o Postgres do Neon. Localmente, se essa variável não existir, caímos
# de volta no SQLite de sempre — nenhuma mudança no seu fluxo de desenvolvimento.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fintrack.db")

# SQLite precisa dessa opção para funcionar bem com múltiplas threads;
# Postgres não usa (nem aceita) esse parâmetro.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def criar_tabelas() -> None:
    """Cria todas as tabelas no banco, caso ainda não existam."""
    Base.metadata.create_all(bind=engine)