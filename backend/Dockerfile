#Usar python
FROM python:3.12

#Variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

#carpeta de trabajo 
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

#copiar dependencias
COPY requirements.txt .

#Instalar 
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#copiar proyecto
COPY . .

#Exponer puerto
EXPOSE 8000

#Comando 
CMD ["python", "manage.py", "runserver","0.0.0.0:8000"]