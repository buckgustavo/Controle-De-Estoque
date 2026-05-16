# EstoquePro

Sistema web de gestão e movimentação de estoque para pequenas empresas. Elimina planilhas manuais, previne divergências e mantém rastreabilidade completa de movimentações.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) + TailwindCSS |
| Backend | FastAPI (Python 3.11+) |
| Banco de dados | PostgreSQL |
| Autenticacao | JWT (HS256) com perfis Admin/Operador |
| Containerizacao | Docker + Docker Compose |

## Estrutura do projeto

```
.
├── my-app/
│   ├── app/              # Paginas Next.js (App Router)
│   │   ├── dashboard/    # Painel principal
│   │   ├── login/        # Autenticacao
│   │   ├── register/     # Cadastro de usuarios
│   │   └── privacidade/  # Politica de privacidade (LGPD)
│   └── backend/          # API FastAPI
│       ├── main.py       # Rotas e startup
│       ├── auth.py       # JWT e autenticacao
│       ├── database.py   # Modelos SQLAlchemy
│       └── .env.example  # Variaveis de ambiente (modelo)
└── docker-compose.yml    # PostgreSQL local
```

## Configuracao

### 1. Variaveis de ambiente (backend)

```bash
cp my-app/backend/.env.example my-app/backend/.env
```

Edite `.env` com suas credenciais:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
SECRET_KEY=<gere com: openssl rand -hex 32>
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 2. Backend (FastAPI)

```bash
cd my-app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API disponivel em `http://localhost:8000`. Documentacao interativa em `http://localhost:8000/docs`.

### 3. Frontend (Next.js)

```bash
cd my-app
npm install
npm run dev
```

Aplicacao disponivel em `http://localhost:3000`.

### 4. Banco de dados local (opcional)

```bash
docker-compose up -d
```

Sobe um PostgreSQL local na porta 5432. Use a `DATABASE_URL` correspondente no `.env`.

## Conformidade LGPD

Este projeto implementa os seguintes requisitos da Lei 13.709/2018:

- **Art. 7, I** — Consentimento explicito e informado no cadastro de usuarios
- **Art. 8** — Checkbox de consentimento com link para a Politica de Privacidade
- **Art. 17-22** — Direitos dos titulares documentados na pagina `/privacidade`
- **Art. 46** — Senhas armazenadas em hash (bcrypt), tokens JWT com expiracao
- Segredos (credenciais, SECRET_KEY) mantidos em variaveis de ambiente, nunca no codigo

## Seguranca

- Nenhuma credencial ou secret deve ser commitada. Use `.env` (ignorado pelo `.gitignore`)
- Em producao, gere um `SECRET_KEY` com `openssl rand -hex 32`
- Configure `CORS_ORIGINS` para o dominio real do frontend antes do deploy
- Habilite HTTPS no servidor de producao

## Deploy

- **Frontend:** Vercel (deploy automatico via push na branch `main`)
- **Backend:** Docker em qualquer provedor (AWS App Runner, Fly.io, Railway)
- **Banco:** PostgreSQL gerenciado (Neon, Supabase, AWS RDS)
