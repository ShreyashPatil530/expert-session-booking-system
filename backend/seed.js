require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const Booking = require('./models/Booking');

const experts = [
    {
        name: 'Dr. Sarah Johnson',
        category: 'Technology',
        experience: 12,
        rating: 4.8,
        description: 'Cloud Architect and AI Strategy Consultant with over a decade of experience in building scalable systems.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
        name: 'Mark Thompson',
        category: 'Finance',
        experience: 15,
        rating: 4.9,
        description: 'Expert Financial Advisor specializing in investment strategies and wealth management for tech professionals.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    },
    {
        name: 'Emily Chen',
        category: 'Health',
        experience: 8,
        rating: 4.7,
        description: 'Holistic wellness coach and nutritionist focused on sustainable lifestyle changes and mental well-being.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    {
        name: 'James Wilson',
        category: 'Legal',
        experience: 10,
        rating: 4.6,
        description: 'Corporate lawyer specializing in startup law, intellectual property, and venture capital negotiations.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
    {
        name: 'Professor David Miller',
        category: 'Education',
        experience: 20,
        rating: 4.9,
        description: 'Academic consultant and career coach helping students and professionals navigate higher education and career pivots.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    {
        name: 'Aria Rodriguez',
        category: 'Lifestyle',
        experience: 7,
        rating: 4.5,
        description: 'Interior designer and lifestyle consultant helping you create spaces that inspire productivity and relaxation.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
    }
];

const generateSlots = () => {
    const slots = [];
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const today = new Date();

    for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        times.forEach(time => {
            slots.push({
                date: dateStr,
                time: time,
                isBooked: false
            });
        });
    }
    return slots;
};

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Expert.deleteMany();
        await Booking.deleteMany();

        const expertsWithSlots = experts.map(e => ({
            ...e,
            availableSlots: generateSlots()
        }));

        await Expert.insertMany(expertsWithSlots);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
