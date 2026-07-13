#!/bin/sh
set -eu

mkdir -p /data/media

if [ ! -f /data/db.sqlite3 ] && [ -f /app/db.sqlite3 ]; then
  cp /app/db.sqlite3 /data/db.sqlite3
fi

if [ -d /app/media ] && [ -z "$(find /data/media -mindepth 1 -print -quit)" ]; then
  cp -a /app/media/. /data/media/
fi

python manage.py migrate
python manage.py ensure_admin
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
