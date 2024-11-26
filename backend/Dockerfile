FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

COPY req.txt /app/backend/

# Build psycopg2-binary from source -- add required dependencies
RUN apk add --virtual .build-deps --no-cache postgresql-dev gcc python3-dev musl-dev && \
    pip install --no-cache-dir -r req.txt && \
    apk --purge del .build-deps

COPY . /app/backend/

RUN apk add --no-cache dos2unix && \
    dos2unix /app/backend/entrypoint.sh
    
# Nadaj uprawnienia do wykonywania dla entrypoint.sh
RUN chmod +x /app/backend/entrypoint.sh

# Użyj skryptu entrypoint zamiast bezpośredniego uruchamiania serwera
ENTRYPOINT ["/app/backend/entrypoint.sh"]

EXPOSE 8000