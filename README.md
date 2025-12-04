🚀 TaskFlow – MERN + Full CI/CD Pipeline
📌 Overview

TaskFlow is a full-stack MERN application delivered through a fully automated CI/CD pipeline using GitHub Actions and Docker. The workflow builds, tests, and deploys both the frontend and backend services to a remote server using Docker Compose. The project follows production-ready DevOps practices with a clean deployment process triggered on every push to the main branch.

🏗️ Tech Stack (MERN + DevOps)
Frontend

React (Vite)

TailwindCSS

TypeScript

Backend

Node.js / Express

MongoDB

DevOps / Infrastructure

Docker & Docker Compose

GitHub Actions (CI/CD)

Remote Linux server (Ubuntu)

Environment-based deployments

Nginx (serving optimized frontend build)

🔄 CI/CD Pipeline

The repository includes a production-grade GitHub Actions workflow that:

Builds Docker images for both frontend and backend.

Copies environment variables and configuration securely.

Pushes code to server via SSH using GitHub Secrets.

Rebuilds containers on the server using docker-compose.

Deploys without downtime, ensuring predictable releases.

This pipeline ensures complete automation — zero manual server setup after initial configuration.

🐳 Dockerized Architecture

Both services run in isolated containers:

Frontend container (Nginx) serves the optimized build from /usr/share/nginx/html.

Backend container runs Node.js with production dependencies only.

No node_modules or build files exist on the host — everything lives inside the containers.

Docker Compose orchestrates networking, restarts, ports, and runtime configuration.

/taskflow
├── frontend/
├── backend/
├── docker-compose.yml
├── .github/workflows/deploy.yml
├── .gitignore
└── README.md

SSH keys handled through GitHub Secrets

Env variables stored outside the repo

Containers run as unprivileged users where applicable
