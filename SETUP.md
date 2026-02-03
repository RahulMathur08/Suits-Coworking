# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v18+) installed
- ✅ PostgreSQL (v12+) installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies (optional)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

#### Option A: Using psql (Recommended)

```bash
# Create database
psql -U postgres -c "CREATE DATABASE coworking_db;"

# Run schema
psql -U postgres -d coworking_db -f backend/db/schema.sql

# Seed data
psql -U postgres -d coworking_db -f backend/db/seed.sql
```

#### Option B: Using Node.js Script

```bash
# First, install backend dependencies
cd backend
npm install

# Then run setup script
node db/setup.js
```

### 3. Configure Environment Variables

#### Backend (.env file in backend/ directory)

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

#### Frontend (.env.local file in frontend/ directory)

Create `frontend/.env.local` (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 5. Access the Application

1. Open browser: `http://localhost:3000`
2. Login with test credentials:
   - **Admin**: username=`admin`, password=`admin123`
   - **Member**: username=`member1`, password=`member123`

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
   ```bash
   # Windows
   services.msc (look for PostgreSQL service)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Verify database exists**:
   ```bash
   psql -U postgres -l
   ```

3. **Check connection string** in `backend/.env`

### Port Already in Use

If port 5000 or 3000 is already in use:

1. **Backend**: Change `PORT` in `backend/.env`
2. **Frontend**: Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Schema Errors

If you get constraint errors, drop and recreate:

```bash
psql -U postgres -c "DROP DATABASE coworking_db;"
psql -U postgres -c "CREATE DATABASE coworking_db;"
psql -U postgres -d coworking_db -f backend/db/schema.sql
psql -U postgres -d coworking_db -f backend/db/seed.sql
```

## Testing the Application

### 1. Test Member Flow

1. Login as `member1` / `member123`
2. Click "+ Book a Desk"
3. Fill in booking form:
   - Member Name: Your name
   - Membership Type: Daily
   - Desk Type: Hot Desk
   - Booking Date: Future date
   - Time Slot: Morning
4. Click "Confirm Booking"
5. View your bookings in the table

### 2. Test Admin Flow

1. Login as `admin` / `admin123`
2. View all bookings
3. Use filters (Date, Desk Type, Membership Type, Status)
4. Update booking status using dropdown
5. Check revenue summary cards

### 3. Test Edge Cases

- Try booking same desk for same date/time (should fail)
- Create daily booking without time slot (should fail)
- Create monthly booking (time slot should be N/A)
- Filter bookings by different criteria

## Next Steps

- Review the main [README.md](./README.md) for detailed documentation
- Check API endpoints in `backend/routes/`
- Explore components in `frontend/components/`

## Need Help?

Check the main README.md for:
- Detailed feature list
- API documentation
- Project structure
- Deployment instructions

