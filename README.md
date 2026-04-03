# FleetTrack - Geolocation Tracking Dashboard 🌍📡

![Project Status](https://img.shields.io/badge/Status-Production--Ready-success) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

FleetTrack is a production-ready Web Application meant to visualize, manage, and track Push-to-Talk over Cellular (POC) radios and devices in real-time. Built entirely with React 18, Vite, Node.js, Express, Socket.io, Prisma, and PostGIS.

## ✨ Features

- **🗺️ Real-time Geolocation tracking**: Leveraging Leaflet maps integrated with Socket.io pushing the latest coordinates directly to the frontend.
- **🛡️ Strict RBAC (Role Based Access Control)**: Admin, Supervisor, Operator, and Viewer roles strictly limit the actions the user can perform across frontend API boundaries.
- **🚨 Advanced Alerting & Geofencing**: Geofence polygonal and circular boundary creation that triggers backend system alerts whenever devices fall outside.
- **📈 Real-time Analytics**: Built-in visual statistics driven by `recharts`.
- **🐳 Docker Ready Architecture**: Integrated configurations to stand up Postgres + Postgis and the API using one command.
- **✅ CI/CD Workflows**: Simulated DevOps pipeline with Vitest integration tests embedded into `.github/workflows`.

---

## 🏗️ Architecture

1. **Frontend**: The UI is powered by `Vite`, `React`, and `Tailwind CSS`. We use `react-leaflet` to render OpenStreetMap tiles and `lucide-react` for dynamic SVG icons. Test automation using `vitest` ensures that Role Guards remain immutable.
2. **Backend**: Powered by `Node.js` & `Express`, connected to a `PostgreSQL/PostGIS` database using `Prisma ORM`. WebSockets (`Socket.io`) form the real-time tunnel.
3. **Docs**: Complete OpenAPI/Swagger schema dynamically compiled.

---

## 🚀 Quickstart & Usage

### ⚙️ Prerequisites
- Node.js > 18.x
- Docker Engine & Docker Compose

### 📦 Setup Guide

1. **Start the database and background services:**
   You can instantiate the PostgreSQL+PostGIS database and the backend API straight from docker.
   ```bash
   # Make sure you are in the root directory
   docker-compose up -d
   ```

2. **Migrate schemas and add seed data (10 devices, 6 users, 3 zones):**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   cd ..
   ```

3. **Start the API & The React Frontend:**
   The backend might already be handled by Docker, but you can run it manually and then start the `Vite` DEV server.
   ```bash
   # Root Directory to start Frontend
   npm run dev
   ```

4. **Navigate to the dashboard:**
   Open [http://localhost:5173](http://localhost:5173). Log in using:
   - **Email:** `admin@fleettrack.io`
   - **Password:** `admin123`

---

## 🤔 Troubleshooting

If you encounter `TypeError: render2 is not a function`, this is an occasional Vite node_modules cache error linked to `lucide-react` & `react-leaflet`. Run the following from the root to forcefully bust the module cache:
```bash
npm run dev -- --force
```

## 📜 Full Documentation
View the `/docs` folder for detailed architectural mappings and French user-guides:
- [🇫🇷 Architecture Globale](./docs/architecture.md)
- [🇫🇷 Guide d'Installation](./docs/installation.md)
- [🇫🇷 Guide Utilisateur](./docs/guide-utilisateur.md)

---
*Created automatically via our AI Agentic Workflow - Frontend, Backend, QA & Docs Agents.*