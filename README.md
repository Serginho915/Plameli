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

Production runtime data is stored outside the containers in `/var/lib/plameli/`:
SQLite uses `/var/lib/plameli/db.sqlite3`, and uploaded media uses
`/var/lib/plameli/media/`. Create it before the first production start:

```bash
sudo mkdir -p /var/lib/plameli/media
sudo chown -R $USER:$USER /var/lib/plameli
```

If the old project-local data folder exists, migrate it once:

```bash
sudo cp -a backend/prod-data/. /var/lib/plameli/
```

Production nginx must allow large uploads, pass the original HTTPS scheme to
Django, and serve uploaded media from `/var/lib/plameli/media/`. A ready server
block is in `deploy/nginx/ledgerlab.tech.conf`; after installing it on the host,
run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
