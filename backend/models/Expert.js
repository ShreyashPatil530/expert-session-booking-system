const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Technology', 'Health', 'Finance', 'Legal', 'Education', 'Lifestyle']
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    rating: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert'
    },
    availableSlots: [{
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        time: { type: String, required: true }, // Format: HH:mm
        isBooked: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

// Expert Search index
expertSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
