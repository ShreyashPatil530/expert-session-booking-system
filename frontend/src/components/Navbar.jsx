import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Calendar } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary-600 rounded-lg group-hover:rotate-12 transition-transform">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            ExpertConnect
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors font-medium">
                            Find Experts
                        </Link>
                        <Link to="/my-bookings" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-all text-slate-300 hover:text-white">
                            <Calendar className="w-4 h-4" />
                            <span>My Bookings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
