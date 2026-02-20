import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExpert, createBooking } from '../api';
import { useSocket } from '../context/SocketContext';
import {
    Calendar,
    Clock,
    User,
    Briefcase,
    Star,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Phone,
    Mail,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const ExpertDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        notes: ''
    });

    useEffect(() => {
        const loadExpert = async () => {
            try {
                const { data } = await fetchExpert(id);
                setExpert(data.data);
            } catch (err) {
                toast.error('Failed to load expert details');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        loadExpert();
    }, [id, navigate]);

    // Real-time slot update
    useEffect(() => {
        if (!socket) return;

        const handleSlotUpdate = ({ expertId, date, timeSlot }) => {
            if (expertId === id) {
                setExpert(prev => {
                    if (!prev) return prev;
                    const updatedSlots = prev.availableSlots.map(slot =>
                        (slot.date === date && slot.time === timeSlot)
                            ? { ...slot, isBooked: true }
                            : slot
                    );
                    return { ...prev, availableSlots: updatedSlots };
                });

                if (selectedSlot?.date === date && selectedSlot?.time === timeSlot) {
                    setSelectedSlot(null);
                    toast.error('This slot was just booked by someone else!');
                }
            }
        };

        socket.on('slotBooked', handleSlotUpdate);
        return () => socket.off('slotBooked', handleSlotUpdate);
    }, [id, socket, selectedSlot]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return;

        try {
            setBookingLoading(true);
            await createBooking({
                expertId: id,
                ...formData,
                date: selectedSlot.date,
                timeSlot: selectedSlot.time
            });

            toast.success('Booking Successful!');
            setShowModal(false);
            // Reset form
            setFormData({ userName: '', userEmail: '', userPhone: '', notes: '' });
            setSelectedSlot(null);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Booking failed. Try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-height flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
    );

    // Group slots by date
    const groupedSlots = expert.availableSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to listings</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-8 sticky top-24">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <img
                                    src={expert.avatar}
                                    alt={expert.name}
                                    className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-primary-600 rounded-xl px-3 py-1 flex items-center gap-1 border-2 border-slate-900 shadow-lg">
                                    <Star className="w-4 h-4 text-white fill-white" />
                                    <span className="text-sm font-bold text-white">{expert.rating}</span>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">{expert.name}</h1>
                            <span className="px-4 py-1 bg-primary-500/10 text-primary-400 text-sm font-semibold rounded-full border border-primary-500/20 mb-6">
                                {expert.category}
                            </span>

                            <div className="w-full space-y-4 mb-8">
                                <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                    <Briefcase className="w-5 h-5 text-primary-500" />
                                    <div className="text-left">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Experience</p>
                                        <p className="text-white font-medium">{expert.experience} Years</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white mb-3">About</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    {expert.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Slots */}
                <div className="lg:col-span-2">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Calendar className="w-6 h-6 text-primary-500" />
                            <h2 className="text-2xl font-bold text-white">Select a Time Slot</h2>
                        </div>

                        <div className="space-y-10">
                            {Object.entries(groupedSlots).map(([date, slots]) => (
                                <div key={date}>
                                    <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                        {format(parseISO(date), 'EEEE, MMMM do')}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3">
                                        {slots.map(slot => (
                                            <button
                                                key={`${slot.date}-${slot.time}`}
                                                disabled={slot.isBooked}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${slot.isBooked
                                                        ? 'bg-slate-900 border-slate-900 text-slate-700 cursor-not-allowed'
                                                        : selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                                                            ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/40'
                                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-primary-500/50 hover:text-white'
                                                    }`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-primary-600 rounded-xl">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-primary-400 font-bold uppercase tracking-wider">Selected Session</p>
                                    <p className="text-white text-lg font-bold">
                                        {selectedSlot
                                            ? `${format(parseISO(selectedSlot.date), 'MMM do')} at ${selectedSlot.time}`
                                            : 'None selected'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                disabled={!selectedSlot}
                                onClick={() => setShowModal(true)}
                                className="btn-primary w-full sm:w-auto"
                            >
                                Book Session Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg glass-card p-8 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Confirm Booking</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="input-field"
                                        placeholder="Enter your name"
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email Address
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="input-field"
                                            placeholder="you@example.com"
                                            value={formData.userEmail}
                                            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Phone Number
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="input-field"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.userPhone}
                                            onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Notes (Optional)
                                    </label>
                                    <textarea
                                        className="input-field min-h-[100px] resize-none"
                                        placeholder="Briefly describe what you'd like to discuss..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Expert</p>
                                            <p className="text-white font-bold">{expert.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Time Slot</p>
                                            <p className="text-primary-400 font-bold">{selectedSlot?.time} on {selectedSlot && format(parseISO(selectedSlot.date), 'MMM do')}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        {bookingLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Confirm and Book
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExpertDetail;
