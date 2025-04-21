# Telegram Viewer Application

A full-stack application built with FastAPI backend, React frontend, and PostgreSQL database, all containerized with Docker.

## Prerequisites

- Docker
- Docker Compose

## Project Structure

```
├── backend/           # FastAPI backend
├── frontend/          # React frontend
├── docker-compose.yml # Docker services configuration
└── start_dev.sh      # Development startup script
└── .env.db      # Database configuration
```

## Quick Start

1. Clone the repository

2. Configure environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Copy `.env.db.example` to `.env.db` in the root directory
   - Modify the environment variables as needed

3. Start the application:
   ```bash
   # Make the startup script executable
   chmod +x start_dev.sh
   
   # Start all services
   ./start_dev.sh
   ```

## Services

After starting the application, you can access:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- PostgreSQL Database: localhost:5450
  - Configure database credentials in `.env.db` file in the root directory

## API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs

## Stopping the Application

To stop all services:
```bash
docker-compose down
```

To stop and remove all data (including database):
```bash
docker-compose down -v
```