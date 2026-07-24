# Plameli

Website for the accounting company Plameli.

## Project Structure

- `frontend/` - Frontend application
- `backend//` - Backend API and services

## Run

### Dev

```bash
docker compose up --build
```

### Prod

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Production runtime data is stored outside the containers in `backend/prod-data/`:
SQLite uses `backend/prod-data/db.sqlite3`, and uploaded media uses
`backend/prod-data/media/`. Create it before the first production start:

```bash
mkdir -p backend/prod-data/media
```

Production `.env` should explicitly keep Django and Docker pointed at that
project-local data directory:

```bash
PLAMELI_DATA_DIR=./backend/prod-data
DJANGO_DATABASE_NAME=/data/db.sqlite3
DJANGO_MEDIA_ROOT=/data/media
DJANGO_SERVE_MEDIA=true
```

If the old host-level data folder exists, migrate it once from the server:

```bash
sudo cp -a /var/lib/plameli/. backend/prod-data/
sudo chown -R $USER:$USER backend/prod-data
```

Production nginx must allow large uploads, pass the original HTTPS scheme to
Django, and serve uploaded media from the project `backend/prod-data/media/`
directory. In `deploy/nginx/ledgerlab.tech.conf`, replace `/path/to/Plameli`
with the absolute project path on the server. After installing the server block,
run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
