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

Production nginx must allow webinar video uploads and pass the original HTTPS
scheme to Django. A ready server block is in `deploy/nginx/ledgerlab.tech.conf`;
after installing it on the host, run:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
