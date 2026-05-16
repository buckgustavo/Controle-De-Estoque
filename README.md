# EstoquePro

> Sistema web de gestão e movimentação de estoque para pequenas empresas. Elimina planilhas manuais, previne divergências e mantém rastreabilidade completa de movimentações.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.11+-009688?style=flat&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-green?style=flat)

---

## Visão Geral

O EstoquePro é uma aplicação fullstack com frontend em **Next.js (App Router)** e backend em **FastAPI**, conectados a um **PostgreSQL 16**. A autenticação é baseada em JWT (HS256) com dois perfis de acesso — Admin e Operador — e o projeto inclui página de política de privacidade em conformidade com a **LGPD (Lei nº 13.709/2018)**.

Todo o ambiente de desenvolvimento pode ser levantado com um único comando via Docker Compose, que orquestra os três serviços (`db`, `api`, `web`) com healthcheck e restart automático.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) + TailwindCSS |
| Backend | FastAPI (Python 3.11+) |
| Banco de dados | PostgreSQL 16 |
| Autenticação | JWT (HS256) com perfis Admin/Operador |
| ORM | SQLAlchemy |
| Containerização | Docker + Docker Compose |

---

## Estrutura do Projeto

```
.
├── my-app/
│   ├── app/                  # Páginas Next.js (App Router)
│   │   ├── dashboard/        # Painel principal
│   │   ├── login/            # Autenticação
│   │   ├── register/         # Cadastro de usuários
│   │   └── privacidade/      # Política de privacidade (LGPD)
│   └── backend/              # API FastAPI
│       ├── main.py           # Rotas e startup da aplicação
│       ├── auth.py           # JWT, hashing de senha e autenticação
│       ├── database.py       # Modelos SQLAlchemy e conexão
│       └── .env.example      # Referência das variáveis de ambiente
└── docker-compose.yml        # Orquestração dos serviços (db, api, web)
```

---

## Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (apenas para desenvolvimento local sem Docker)
- Python 3.11+ (apenas para desenvolvimento local sem Docker)

### Com Docker (recomendado)

**1. Configure as variáveis de ambiente**

```bash
cp my-app/backend/.env.example my-app/backend/.env
# Edite o .env com suas credenciais
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | String de conexão PostgreSQL (`postgresql://user:pass@host:5432/db?sslmode=require`) |
| `SECRET_KEY` | ✅ | Chave HMAC para assinatura JWT — gere com `openssl rand -hex 32` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | Expiração do token em minutos (padrão: `60`) |
| `NEXT_PUBLIC_API_URL` | ❌ | URL pública da API consumida pelo frontend (padrão: `http://localhost:8000`) |

**2. Subir todos os serviços**

```bash
docker-compose up -d
```

Os serviços sobem na seguinte ordem: `db` (com healthcheck) → `api` → `web`.

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8000 |
| Documentação interativa | http://localhost:8000/docs |

---

### Sem Docker (desenvolvimento local)

**Backend**

```bash
cd my-app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**

```bash
cd my-app
npm install
npm run dev
```

---

## Privacidade e Conformidade LGPD

| Artigo | Implementação |
|---|---|
| Art. 7, I | Consentimento explícito e informado no cadastro de usuários |
| Art. 8 | Checkbox de consentimento com link para a Política de Privacidade |
| Art. 17-22 | Direitos dos titulares documentados na página `/privacidade` |
| Art. 46 | Senhas em hash bcrypt, tokens JWT com expiração definida |

---

## Segurança

- Nunca versione o arquivo `.env` — ele está listado no `.gitignore`.
- Gere o `SECRET_KEY` com uma fonte criptograficamente segura: `openssl rand -hex 32`.
- Configure `CORS_ORIGINS` para o domínio real do frontend antes do deploy em produção.
- Habilite HTTPS no servidor de produção.

---

## Deploy

| Serviço | Plataforma sugerida |
|---|---|
| Frontend | Vercel (deploy automático via push na `main`) |
| Backend | Docker em AWS App Runner, Fly.io ou Railway |
| Banco de dados | PostgreSQL gerenciado: Neon, Supabase ou AWS RDS |

---

## Contribuindo

1. Faça um fork e crie uma branch de feature (`git checkout -b feat/minha-feature`).
2. Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
3. Abra um Pull Request com descrição clara da mudança e sua motivação.

---

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.
