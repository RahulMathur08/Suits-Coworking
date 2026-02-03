# Coworking Space Booking & Management Module

A complete web application for managing seat and desk bookings in a coworking space with role-based access control for members and administrators.

## 🚀 Features

### Member Features
- **Desk Booking**: Book desks with different types (Hot Desk, Dedicated Desk, Private Cabin)
- **Membership Types**: Choose between Daily or Monthly memberships
- **Time Slots**: Select Morning or Full Day slots for daily bookings
- **View Bookings**: See all your bookings with status and amount paid
- **Real-time Pricing**: See calculated pricing before confirming booking

### Admin Features
- **View All Bookings**: See all bookings from all members
- **Advanced Filtering**: Filter by date, desk type, membership type, and status
- **Status Management**: Update booking status (Pending, Confirmed, Cancelled)
- **Revenue Dashboard**: View total revenue, confirmed revenue, and pending revenue
- **Revenue Summary**: Get insights on booking statistics

## 📋 Tech Stack

### Frontend
- **Next.js 14** (React framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. **Create PostgreSQL Database**:
   ```sql
   CREATE DATABASE coworking_db;
   ```

2. **Run Schema**:
   ```bash
   psql -U postgres -d coworking_db -f backend/db/schema.sql
   ```

3. **Seed Initial Data**:
   ```bash
   psql -U postgres -d coworking_db -f backend/db/seed.sql
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=coworking_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env.local` file** (optional, defaults to localhost:5000):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## 🔐 Test Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Member
- **Username**: `member1` or `member2`
- **Password**: `member123`

## 💰 Pricing Structure

### Daily Pricing
- **Hot Desk**: ₹500/day
- **Dedicated Desk**: ₹800/day
- **Private Cabin**: ₹1,500/day

### Monthly Pricing
- **Hot Desk**: ₹8,000/month
- **Dedicated Desk**: ₹12,000/month
- **Private Cabin**: ₹25,000/month

## 📐 Business Rules

1. **Monthly Bookings**: Time slots are ignored for monthly memberships
2. **Daily Bookings**: Time slot (Morning/Full Day) is required
3. **Duplicate Prevention**: Same desk cannot be booked for the same date and time slot
4. **Status Management**: Only admins can update booking status
5. **Revenue Calculation**: Only includes non-cancelled bookings

## 📁 Project Structure

```
Management_module/
├── backend/
│   ├── db/
│   │   ├── schema.sql          # Database schema
│   │   ├── seed.sql            # Seed data
│   │   └── connection.js       # DB connection
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   └── bookings.js         # Booking routes
│   ├── utils/
│   │   └── pricing.js          # Pricing logic
│   ├── server.js               # Express server
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home/login page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   ├── MemberDashboard.tsx # Member dashboard
│   │   ├── BookingForm.tsx     # Booking form
│   │   └── LoginPage.tsx       # Login component
│   ├── context/
│   │   └── AuthContext.tsx     # Auth context
│   ├── lib/
│   │   └── api.ts              # API client
│   └── package.json
└── README.md
```

## 🧪 Testing the Application

### 1. Login as Member
- Use `member1` / `member123`
- Create a booking
- View your bookings

### 2. Login as Admin
- Use `admin` / `admin123`
- View all bookings
- Filter bookings
- Update booking status
- View revenue summary

### 3. Test Edge Cases
- Try booking the same desk for the same date/time (should fail)
- Create daily booking without time slot (should fail)
- Create monthly booking (time slot should be ignored)
- Filter bookings by different criteria

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (for testing)

### Bookings
- `POST /api/bookings` - Create booking (Member)
- `GET /api/bookings` - Get bookings (filtered for Admin)
- `GET /api/bookings/:id` - Get booking by ID
- `PATCH /api/bookings/:id/status` - Update status (Admin only)
- `GET /api/bookings/revenue/summary` - Revenue summary (Admin only)

## 📝 Assumptions Made

1. **Authentication**: Using JWT tokens stored in localStorage for prototype
2. **Password Security**: For prototype, accepting plain text passwords for test users
3. **Date Validation**: Only future dates allowed for bookings
4. **Duplicate Prevention**: Based on desk_type + booking_date + time_slot combination
5. **Status Default**: New bookings default to "pending" status
6. **Revenue Calculation**: Only non-cancelled bookings count towards revenue

## ⚠️ Trade-offs Due to Time Constraints

1. **No Email Notifications**: Booking confirmations are shown in UI only
2. **No Payment Integration**: Amount is calculated but not processed
3. **Simple Authentication**: No password reset, email verification
4. **Basic Validation**: Some edge cases may need additional validation
5. **No Booking Cancellation by Members**: Only admins can cancel
6. **No Calendar View**: Bookings shown in table format only
7. **Limited Error Handling**: Basic error messages, no detailed logging

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or AWS
- Update database connection string in `.env`
- Set `JWT_SECRET` to a secure random string

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Build command: `npm run build`
- Start command: `npm start`

## 📄 License

This project is created for evaluation purposes.

## 👤 Author

Created as a prototype for Coworking Space Booking & Management Module evaluation.

---

**Note**: This is a prototype application. For production use, implement additional security measures, proper error handling, logging, and comprehensive testing.

