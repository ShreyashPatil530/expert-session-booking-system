const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

        // 1. Atomic check and update in Expert model to prevent race condition
        const updatedExpert = await Expert.findOneAndUpdate(
            {
                _id: expertId,
                "availableSlots": {
                    $elemMatch: { date, time: timeSlot, isBooked: false }
                }
            },
            {
                $set: { "availableSlots.$.isBooked": true }
            },
            { new: true }
        );

        if (!updatedExpert) {
            return res.status(400).json({
                success: false,
                error: 'Slot is already booked or does not exist'
            });
        }

        // 2. Create the booking record
        // The unique index on Booking (expertId, date, timeSlot) acts as a second layer of protection
        const booking = await Booking.create({
            expertId,
            userName,
            userEmail,
            userPhone,
            date,
            timeSlot,
            notes
        });

        // 3. Emit socket event for real-time update
        const io = req.app.get('socketio');
        io.emit('slotBooked', { expertId, date, timeSlot });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        // If booking creation fails after expert slot was updated, we should ideally rollback
        // but the unique index catch should happen before creation logic usually.
        // If it's a duplication error:
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Double booking detected' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get bookings by email
// @route   GET /api/bookings?email=
// @access  Public
exports.getBookings = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const bookings = await Booking.find({ userEmail: email })
            .populate('expertId', 'name category avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Public (In a real app, this would be admin/expert only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
