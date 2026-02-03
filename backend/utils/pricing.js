/**
 * Pricing Rules for Coworking Space Booking
 * 
 * Daily Pricing:
 * - Hot Desk: ₹500/day
 * - Dedicated Desk: ₹800/day
 * - Private Cabin: ₹1500/day
 * 
 * Monthly Pricing:
 * - Hot Desk: ₹8,000
 * - Dedicated Desk: ₹12,000
 * - Private Cabin: ₹25,000
 * 
 * Rules:
 * - Monthly bookings ignore time slots
 * - Daily bookings require a time slot
 */

const PRICING = {
  daily: {
    hot_desk: 500,
    dedicated_desk: 800,
    private_cabin: 1500
  },
  monthly: {
    hot_desk: 8000,
    dedicated_desk: 12000,
    private_cabin: 25000
  }
};

/**
 * Calculate booking amount based on membership type and desk type
 * @param {string} membershipType - 'daily' or 'monthly'
 * @param {string} deskType - 'hot_desk', 'dedicated_desk', or 'private_cabin'
 * @returns {number} - Calculated amount
 */
function calculatePrice(membershipType, deskType) {
  if (!PRICING[membershipType] || !PRICING[membershipType][deskType]) {
    throw new Error('Invalid membership type or desk type');
  }
  
  return PRICING[membershipType][deskType];
}

/**
 * Validate booking rules
 * @param {string} membershipType - 'daily' or 'monthly'
 * @param {string} timeSlot - 'morning' or 'full_day' or null
 * @returns {object} - { valid: boolean, error: string }
 */
function validateBookingRules(membershipType, timeSlot) {
  // Monthly bookings ignore time slots (but we still allow null)
  if (membershipType === 'monthly') {
    return { valid: true };
  }
  
  // Daily bookings require a time slot
  if (membershipType === 'daily' && !timeSlot) {
    return { 
      valid: false, 
      error: 'Time slot is required for daily bookings' 
    };
  }
  
  return { valid: true };
}

module.exports = {
  calculatePrice,
  validateBookingRules,
  PRICING
};

