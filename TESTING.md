# Testing Guide

This document outlines how to test the Coworking Space Booking application.

## Pre-Testing Checklist

- [ ] Database is set up and seeded
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] You can access `http://localhost:3000`

## Test Scenarios

### 1. Authentication Tests

#### Test 1.1: Admin Login
- **Steps**:
  1. Navigate to `http://localhost:3000`
  2. Enter username: `admin`
  3. Enter password: `admin123`
  4. Click "Login"
- **Expected**: Redirected to Admin Dashboard

#### Test 1.2: Member Login
- **Steps**:
  1. Navigate to `http://localhost:3000`
  2. Enter username: `member1`
  3. Enter password: `member123`
  4. Click "Login"
- **Expected**: Redirected to Member Dashboard

#### Test 1.3: Invalid Credentials
- **Steps**:
  1. Enter invalid username/password
  2. Click "Login"
- **Expected**: Error message displayed

#### Test 1.4: Logout
- **Steps**:
  1. Login as any user
  2. Click "Logout" button
- **Expected**: Redirected to login page, token cleared

### 2. Member Booking Tests

#### Test 2.1: Create Daily Booking
- **Steps**:
  1. Login as member
  2. Click "+ Book a Desk"
  3. Fill form:
     - Member Name: "Test User"
     - Membership Type: Daily
     - Desk Type: Hot Desk
     - Booking Date: Tomorrow
     - Time Slot: Morning
  4. Click "Confirm Booking"
- **Expected**: 
  - Booking created successfully
  - Shows in bookings table
  - Amount: ₹500

#### Test 2.2: Create Monthly Booking
- **Steps**:
  1. Login as member
  2. Click "+ Book a Desk"
  3. Fill form:
     - Member Name: "Test User"
     - Membership Type: Monthly
     - Desk Type: Dedicated Desk
     - Booking Date: Future date
     - (Time Slot should not be required)
  4. Click "Confirm Booking"
- **Expected**: 
  - Booking created successfully
  - Time Slot shows as "N/A"
  - Amount: ₹12,000

#### Test 2.3: Pricing Validation
- **Test Cases**:
  - Hot Desk Daily: ₹500
  - Dedicated Desk Daily: ₹800
  - Private Cabin Daily: ₹1,500
  - Hot Desk Monthly: ₹8,000
  - Dedicated Desk Monthly: ₹12,000
  - Private Cabin Monthly: ₹25,000

#### Test 2.4: Daily Booking Without Time Slot (Should Fail)
- **Steps**:
  1. Select Membership Type: Daily
  2. Leave Time Slot empty
  3. Try to submit
- **Expected**: Error message about time slot requirement

#### Test 2.5: Duplicate Booking Prevention
- **Steps**:
  1. Create a booking for Hot Desk, tomorrow, Morning
  2. Try to create another booking with same details
- **Expected**: Error message about desk already booked

#### Test 2.6: View Own Bookings
- **Steps**:
  1. Login as member
  2. Create multiple bookings
  3. View bookings table
- **Expected**: 
  - Only own bookings visible
  - All booking details displayed correctly
  - Status badges colored appropriately

### 3. Admin Dashboard Tests

#### Test 3.1: View All Bookings
- **Steps**:
  1. Login as admin
  2. View bookings table
- **Expected**: All bookings from all members visible

#### Test 3.2: Filter by Date
- **Steps**:
  1. Login as admin
  2. Select a date in filter
  3. View results
- **Expected**: Only bookings for selected date shown

#### Test 3.3: Filter by Desk Type
- **Steps**:
  1. Login as admin
  2. Select "Hot Desk" in filter
  3. View results
- **Expected**: Only Hot Desk bookings shown

#### Test 3.4: Filter by Membership Type
- **Steps**:
  1. Login as admin
  2. Select "Daily" in filter
  3. View results
- **Expected**: Only Daily bookings shown

#### Test 3.5: Filter by Status
- **Steps**:
  1. Login as admin
  2. Select "Pending" in filter
  3. View results
- **Expected**: Only Pending bookings shown

#### Test 3.6: Update Booking Status
- **Steps**:
  1. Login as admin
  2. Find a booking with "Pending" status
  3. Change status to "Confirmed" using dropdown
- **Expected**: 
  - Status updated immediately
  - Revenue summary updated
  - Status badge color changes

#### Test 3.7: Revenue Summary
- **Steps**:
  1. Login as admin
  2. View revenue summary cards
  3. Create some bookings
  4. Update some statuses
- **Expected**: 
  - Total Bookings count updates
  - Total Revenue updates
  - Confirmed Revenue updates
  - Pending Revenue updates

#### Test 3.8: Clear Filters
- **Steps**:
  1. Apply multiple filters
  2. Click "Clear Filters"
- **Expected**: All filters reset, all bookings shown

### 4. Edge Cases & Validation

#### Test 4.1: Past Date Booking
- **Steps**:
  1. Try to select a past date
- **Expected**: Date picker prevents past dates

#### Test 4.2: Empty Form Submission
- **Steps**:
  1. Try to submit booking form without filling fields
- **Expected**: Validation errors shown

#### Test 4.3: Cancel Booking (Admin)
- **Steps**:
  1. Admin changes booking status to "Cancelled"
  2. Check revenue summary
- **Expected**: Cancelled booking doesn't count in revenue

#### Test 4.4: Multiple Bookings Same Day Different Slots
- **Steps**:
  1. Book Hot Desk, tomorrow, Morning
  2. Book Hot Desk, tomorrow, Full Day
- **Expected**: Both bookings allowed (different time slots)

### 5. UI/UX Tests

#### Test 5.1: Mobile Responsiveness
- **Steps**:
  1. Open app on mobile device or resize browser
  2. Test all features
- **Expected**: 
  - Layout adapts to screen size
  - Tables scroll horizontally if needed
  - Forms remain usable

#### Test 5.2: Loading States
- **Steps**:
  1. Create booking
  2. Observe loading state
- **Expected**: Button shows "Booking..." during submission

#### Test 5.3: Error Messages
- **Steps**:
  1. Trigger various errors (duplicate booking, invalid login, etc.)
- **Expected**: Clear, user-friendly error messages displayed

#### Test 5.4: Success Feedback
- **Steps**:
  1. Create successful booking
- **Expected**: Booking appears in table immediately

## Performance Tests

### Test 6.1: Multiple Concurrent Bookings
- Create multiple bookings quickly
- **Expected**: All bookings processed correctly

### Test 6.2: Large Dataset
- Create 20+ bookings
- Filter and view
- **Expected**: No performance degradation

## Security Tests

### Test 7.1: Unauthorized Access
- Try to access `/api/bookings` without token
- **Expected**: 401 Unauthorized

### Test 7.2: Member Accessing Admin Routes
- Login as member
- Try to update booking status via API
- **Expected**: 403 Forbidden

### Test 7.3: Token Expiration
- Wait for token to expire (24 hours)
- Try to make API call
- **Expected**: 401 Unauthorized, redirect to login

## API Testing (Using Postman/curl)

### Test 8.1: Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test 8.2: Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "member_name": "Test User",
    "membership_type": "daily",
    "desk_type": "hot_desk",
    "booking_date": "2024-12-25",
    "time_slot": "morning"
  }'
```

### Test 8.3: Get Bookings
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Test Results Template

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| 1.1 | Admin Login | ✅/❌ | |
| 1.2 | Member Login | ✅/❌ | |
| 2.1 | Create Daily Booking | ✅/❌ | |
| 2.2 | Create Monthly Booking | ✅/❌ | |
| 3.1 | View All Bookings | ✅/❌ | |
| 3.6 | Update Status | ✅/❌ | |

## Known Issues / Limitations

1. **Password Security**: For prototype, plain text passwords accepted for test users
2. **No Email Notifications**: Bookings confirmed in UI only
3. **No Payment Processing**: Amount calculated but not charged
4. **No Booking Cancellation by Members**: Only admins can cancel

## Reporting Bugs

When reporting bugs, include:
- Test case ID
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information

