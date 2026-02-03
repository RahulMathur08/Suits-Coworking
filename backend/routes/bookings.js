const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { authenticate, isAdmin } = require('../middleware/auth');
const { calculatePrice, validateBookingRules } = require('../utils/pricing');

/**
 * Create a new booking
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { member_name, membership_type, desk_type, booking_date, time_slot } = req.body;
    
    // Validate required fields
    if (!member_name || !membership_type || !desk_type || !booking_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate booking rules
    const ruleValidation = validateBookingRules(membership_type, time_slot);
    if (!ruleValidation.valid) {
      return res.status(400).json({ error: ruleValidation.error });
    }
    
    // For monthly bookings, set time_slot to null
    const finalTimeSlot = membership_type === 'monthly' ? null : time_slot;
    
    // Check for duplicate bookings (same desk + date + time slot)
    const duplicateCheck = await pool.query(
      `SELECT id FROM bookings 
       WHERE desk_type = $1 
       AND booking_date = $2 
       AND (time_slot = $3 OR ($3 IS NULL AND time_slot IS NULL))
       AND status != 'cancelled'`,
      [desk_type, booking_date, finalTimeSlot]
    );
    
    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'This desk is already booked for the selected date and time slot' 
      });
    }
    
    // Calculate price
    const amount = calculatePrice(membership_type, desk_type);
    
    // Create booking
    const result = await pool.query(
      `INSERT INTO bookings (user_id, member_name, membership_type, desk_type, booking_date, time_slot, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [req.user.id, member_name, membership_type, desk_type, booking_date, finalTimeSlot, amount]
    );
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ 
        error: 'This desk is already booked for the selected date and time slot' 
      });
    }
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get all bookings (Admin only) or user's own bookings (Member)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    let query;
    let params;
    
    if (req.user.role === 'admin') {
      // Admin can see all bookings with filters
      const { date, desk_type, membership_type, status } = req.query;
      
      let whereClauses = [];
      params = [];
      let paramIndex = 1;
      
      if (date) {
        whereClauses.push(`booking_date = $${paramIndex++}`);
        params.push(date);
      }
      
      if (desk_type) {
        whereClauses.push(`desk_type = $${paramIndex++}`);
        params.push(desk_type);
      }
      
      if (membership_type) {
        whereClauses.push(`membership_type = $${paramIndex++}`);
        params.push(membership_type);
      }
      
      if (status) {
        whereClauses.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      
      const whereClause = whereClauses.length > 0 
        ? `WHERE ${whereClauses.join(' AND ')}`
        : '';
      
      query = `SELECT b.*, u.name as user_name, u.username 
               FROM bookings b
               JOIN users u ON b.user_id = u.id
               ${whereClause}
               ORDER BY b.created_at DESC`;
    } else {
      // Members can only see their own bookings
      query = `SELECT * FROM bookings 
               WHERE user_id = $1 
               ORDER BY created_at DESC`;
      params = [req.user.id];
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      bookings: result.rows
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get booking by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    let query;
    let params;
    
    if (req.user.role === 'admin') {
      query = `SELECT b.*, u.name as user_name, u.username 
               FROM bookings b
               JOIN users u ON b.user_id = u.id
               WHERE b.id = $1`;
      params = [id];
    } else {
      query = `SELECT * FROM bookings WHERE id = $1 AND user_id = $2`;
      params = [id, req.user.id];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update booking status (Admin only)
 */
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      message: 'Booking status updated successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get revenue summary (Admin only)
 */
router.get('/revenue/summary', authenticate, isAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `SELECT 
      COUNT(*) as total_bookings,
      SUM(amount) as total_revenue,
      SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END) as confirmed_revenue,
      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_revenue
      FROM bookings
      WHERE status != 'cancelled'`;
    
    const params = [];
    let paramIndex = 1;
    
    if (start_date) {
      query += ` AND booking_date >= $${paramIndex++}`;
      params.push(start_date);
    }
    
    if (end_date) {
      query += ` AND booking_date <= $${paramIndex++}`;
      params.push(end_date);
    }
    
    const result = await pool.query(query, params);
    
    res.json({
      summary: result.rows[0]
    });
  } catch (error) {
    console.error('Revenue summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

