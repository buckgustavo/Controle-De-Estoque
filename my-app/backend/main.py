from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging
import os

from database import engine, Base, get_db, Usuario, ItemEstoque, Fornecedor
from auth import verificar_senha, criar_token_acesso, pwd_context

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EstoquePro API",
    description="API de gestão de estoque em conformidade com a LGPD.",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# --- Schemas ---

class ItemBase(BaseModel):
    nome: str
    quantidade: int
    categoria: str
    fornecedor_id: Optional[int] = None


class ItemUpdate(BaseModel):
    nome: Optional[str] = None
    quantidade: Optional[int] = None
    categoria: Optional[str] = None
    fornecedor_id: Optional[int] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class FornecedorBase(BaseModel):
    nome: str
    contato: str
    categoria: str


# --- Autenticacao ---

@app.post("/api/register", status_code=201)
def registrar_usuario(user: UserCreate, db: Session = Depends(get_db)):
    if len(user.password) < 8:
        raise HTTPException(status_code=400, detail="A senha deve ter no mínimo 8 caracteres.")
    if len(user.password) > 128:
        raise HTTPException(status_code=400, detail="A senha deve ter no máximo 128 caracteres.")

    if db.query(Usuario).filter(Usuario.email == user.email).first():
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado.")

    novo_usuario = Usuario(
        email=user.email,
        senha_hash=pwd_context.hash(user.password),
        perfil="operador",
    )
    db.add(novo_usuario)
    db.commit()
    logger.info(f"Novo usuário registrado: {user.email}")
    return {"msg": "Conta criada com sucesso."}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()

    if not usuario or not verificar_senha(form_data.password, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_acesso = criar_token_acesso(data={"sub": usuario.email})
    return {"access_token": token_acesso, "token_type": "bearer"}


# --- Estoque ---

@app.post("/api/items/", status_code=201)
def criar_item(item: ItemBase, db: Session = Depends(get_db)):
    novo_item = ItemEstoque(
        nome=item.nome,
        quantidade=item.quantidade,
        categoria=item.categoria,
        fornecedor_id=item.fornecedor_id,
    )
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    logger.info(f"Item criado: {item.nome}")
    return novo_item


@app.get("/api/items/")
def listar_items(db: Session = Depends(get_db)):
    return db.query(ItemEstoque).all()


@app.put("/api/items/{item_id}")
def editar_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    item_db = db.query(ItemEstoque).filter(ItemEstoque.id == item_id).first()
    if not item_db:
        raise HTTPException(status_code=404, detail="Item não encontrado.")

    if item.nome is not None:
        item_db.nome = item.nome
    if item.quantidade is not None:
        item_db.quantidade = item.quantidade
    if item.categoria is not None:
        item_db.categoria = item.categoria
    if item.fornecedor_id is not None:
        item_db.fornecedor_id = item.fornecedor_id

    db.commit()
    db.refresh(item_db)
    logger.info(f"Item atualizado: {item_db.nome} (id={item_id})")
    return item_db


@app.put("/api/items/{item_id}/movimentar")
def movimentar_estoque(item_id: int, quantidade_alterada: int, db: Session = Depends(get_db)):
    item = db.query(ItemEstoque).filter(ItemEstoque.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")

    item.quantidade += quantidade_alterada
    db.commit()
    logger.info(f"Movimentação: item_id={item_id}, delta={quantidade_alterada}, saldo={item.quantidade}")
    return {"message": "Estoque atualizado.", "novo_saldo": item.quantidade}


@app.post("/api/upload/")
async def upload_foto_produto(file: UploadFile = File(...)):
    return {"filename": file.filename, "status": "simulado"}


@app.delete("/api/items/{item_id}", status_code=204)
def deletar_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemEstoque).filter(ItemEstoque.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado.")
    db.delete(item)
    db.commit()
    logger.info(f"Item removido: id={item_id}")


# --- Fornecedores ---

@app.post("/api/fornecedores/", status_code=201)
def criar_fornecedor(fornecedor: FornecedorBase, db: Session = Depends(get_db)):
    novo = Fornecedor(
        nome=fornecedor.nome,
        contato=fornecedor.contato,
        categoria=fornecedor.categoria,
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    logger.info(f"Fornecedor criado: {fornecedor.nome}")
    return novo


@app.get("/api/fornecedores/")
def listar_fornecedores(db: Session = Depends(get_db)):
    return db.query(Fornecedor).all()


@app.delete("/api/fornecedores/{fornecedor_id}", status_code=204)
def deletar_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    fornecedor = db.query(Fornecedor).filter(Fornecedor.id == fornecedor_id).first()
    if not fornecedor:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")

    db.query(ItemEstoque).filter(ItemEstoque.fornecedor_id == fornecedor_id).update(
        {"fornecedor_id": None}
    )
    db.delete(fornecedor)
    db.commit()
    logger.info(f"Fornecedor removido: id={fornecedor_id}")
