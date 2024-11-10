#!/bin/sh

# Czekaj na dostępność bazy danych
echo "Waiting for database..."
while ! nc -z -w1 db 5432; do
    sleep 1
    echo "Waiting for database connection..."
done
echo "Database started"

# Wykonaj migracje
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Uruchom serwer
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000