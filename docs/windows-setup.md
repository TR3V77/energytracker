# Windows Setup — Energy Tracker

## 1. Install Git (if not already installed)
- Download from https://git-scm.com/download/win
- Run the installer, use all default settings
- Restart your terminal after installing

## 2. Install Docker Desktop
- Download from https://www.docker.com/products/docker-desktop/
- Run the installer
- If it asks to enable **WSL 2**, say yes
- If it says "WSL 2 kernel update required":
  1. Open PowerShell **as Administrator**
  2. Run: `wsl --install`
  3. Restart your computer
  4. Open Docker Desktop again
- Wait for Docker Desktop to fully start (whale icon in system tray is steady, not animating)
- Verify by opening PowerShell and running: `docker info`

## 3. Clone the repo (or pull latest)

If you don't have the repo yet:
```bash
git clone https://bitbucket.org/cs3398-rodians-s26/energytracker.git
cd energytracker
```

If you already have it:
```bash
cd energytracker
git checkout main
git pull origin main
```

## 4. Build and run the project
```bash
docker compose up --build
```

Wait until all 3 services are running. Then open http://localhost:3000 in your browser.

## 5. Create your feature branch
```bash
git checkout -b feature/PROJ-XX-short-description
```

## 6. Useful commands

| What | Command |
|------|---------|
| Start project | `docker compose up --build` |
| Start in background | `docker compose up --build -d` |
| Stop project | `docker compose down` |
| View logs | `docker compose logs -f` |
| Reset database | `docker compose down -v` |
| Open DB shell | `docker compose exec db psql -U energytracker -d energytracker` |

## 7. Database setup (first time only)

After `docker compose up --build` is running, open a new terminal:

```bash
docker compose exec backend flask db init
docker compose exec backend flask db migrate -m "create initial tables"
docker compose exec backend flask db upgrade
```

## 8. Committing and pushing your work
```bash
git add <files>
git commit -m "PROJ-XX category: description of change"
git push origin feature/PROJ-XX-short-description
```

Then create a pull request on Bitbucket to merge into `main`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "docker: command not found" | Close and reopen terminal after installing Docker Desktop |
| "Cannot connect to Docker daemon" | Open Docker Desktop and wait for it to fully start |
| "WSL 2 not installed" | Open PowerShell as Admin, run `wsl --install`, restart |
| Port already in use | Run `docker compose down` or close whatever is using port 3000/5000 |
| Build fails | Make sure Docker Desktop is running, then try `docker compose down` and `docker compose up --build` again |
