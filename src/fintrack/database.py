from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite salva tudo num arquivo local chamado fintrack.db, na raiz do projeto.
# Mais pra frente, na fase de deploy, só trocamos essa URL por uma do PostgreSQL
# — o resto do código nem precisa mudar, essa é a grande vantagem do ORM.
DATABASE_URL = "sqlite:///./fintrack.db"

engine = create_engine(DATABASE_URL, echo=False)

# SessionLocal é uma "fábrica" de sessões. Cada vez que chamamos SessionLocal(),
# ganhamos uma conversa nova e independente com o banco.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Toda classe-tabela (ORM) vai herdar de Base.
Base = declarative_base()


def criar_tabelas() -> None:
    """Cria todas as tabelas no banco, caso ainda não existam."""
    Base.metadata.create_all(bind=engine)