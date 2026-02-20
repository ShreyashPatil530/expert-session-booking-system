const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    createBooking,
    getBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

// Validation middleware
const validateBooking = [
    check('expertId', 'Expert ID is required').not().isEmpty(),
    check('userName', 'Name is required').not().isEmpty(),
    check('userEmail', 'Please include a valid email').isEmail(),
    check('userPhone', 'Phone number is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('timeSlot', 'Time slot is required').not().isEmpty(),
];

router.post('/', validateBooking, createBooking);
router.get('/', getBookings);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
