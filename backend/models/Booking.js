const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expert',
        required: true
    },
    userName: {
        type: String,
        required: [true, 'Please add user name']
    },
    userEmail: {
        type: String,
        required: [true, 'Please add user email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    userPhone: {
        type: String,
        required: [true, 'Please add user phone number']
    },
    date: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Confirmed'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Ensure unique booking for expert, date, and timeSlot to prevent double booking
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
