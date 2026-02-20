import React, { useState } from 'react';
import { fetchMyBookings } from '../api';
import { Search, Mail, Calendar, Clock, Loader2, AlertCircle, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const MyBookings = () => {
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            const { data } = await fetchMyBookings(email);
            setBookings(data.data);
            setSearched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'Pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'Completed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">My Bookings</h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Enter your email to view and manage all your scheduled expert sessions.
                </p>
            </div>

            <div className="glass-card p-2 mb-12 max-w-lg mx-auto">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            required
                            type="email"
                            placeholder="Enter your registered email"
                            className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-white font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {bookings.map((booking, index) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-slate-700 transition-all"
                                >
                                    <img
                                        src={booking.expertId?.avatar}
                                        alt={booking.expertId?.name}
                                        className="w-20 h-20 rounded-2xl object-cover border border-slate-800 shadow-lg"
                                    />

                                    <div className="flex-grow text-center md:text-left">
                                        <h3 className="text-xl font-bold text-white mb-1">{booking.expertId?.name}</h3>
                                        <p className="text-primary-400 text-sm font-semibold mb-3">{booking.expertId?.category}</p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{format(parseISO(booking.date), 'MMMM do, yyyy')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{booking.timeSlot}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            ID: {booking._id.slice(-8)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : searched ? (
                    <div className="text-center py-20 glass-card">
                        <Bookmark className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
                        <p className="text-slate-500">We couldn't find any sessions linked to this email.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                        <Search className="w-16 h-16 mb-4 opacity-20" />
                        <p>Your search results will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
