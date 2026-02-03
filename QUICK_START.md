# 🚀 Quick Start Guide

Get the application running in 5 minutes!

## Prerequisites
- Node.js installed
- PostgreSQL installed and running
- Basic terminal knowledge

## Step 1: Database Setup (2 minutes)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE coworking_db;"

# Run schema
psql -U postgres -d coworking_db -f backend/db/schema.sql

# Seed data
psql -U postgres -d coworking_db -f backend/db/seed.sql
```

## Step 2: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 3: Configure Environment (1 minute)

Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coworking_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
```

## Step 4: Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 5: Access & Test

1. Open: http://localhost:3000
2. Login:
   - **Admin**: `admin` / `admin123`
   - **Member**: `member1` / `member123`

## ✅ Done!

You're all set! Check `README.md` for detailed documentation.

## Troubleshooting

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in `backend/.env`

**Port already in use?**
- Change `PORT` in `backend/.env`
- Or kill process using port 5000/3000

**Module not found?**
- Delete `node_modules` and run `npm install` again

