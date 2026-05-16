# Python png
FROM python:3.11-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os requisitos e instala (FastAPI, Uvicorn, SQLAlchemy, Psycopg2, etc)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY . .

# Expõe a porta do FastAPI
EXPOSE 8000

# Subir o Conteiner
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]