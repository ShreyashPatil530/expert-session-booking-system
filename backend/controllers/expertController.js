const Expert = require('../models/Expert');
const mongoose = require('mongoose');

// @desc    Get all experts
// @route   GET /api/experts
// @access  Public
exports.getExperts = async (req, res) => {
    console.log('GET /api/experts request received');

    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            error: 'Database is still connecting or disconnected. Please try again in a moment.'
        });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let query = {};

        // Search by name
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        // Filter by category
        if (req.query.category && req.query.category !== 'All') {
            query.category = req.query.category;
        }

        const total = await Expert.countDocuments(query);
        const experts = await Expert.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: experts.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: experts
        });
    } catch (error) {
        console.error('getExperts Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single expert
// @route   GET /api/experts/:id
// @access  Public
exports.getExpert = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, error: 'Database is not connected.' });
    }

    try {
        const expert = await Expert.findById(req.params.id);

        if (!expert) {
            return res.status(404).json({ success: false, error: 'Expert not found' });
        }

        res.status(200).json({
            success: true,
            data: expert
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
