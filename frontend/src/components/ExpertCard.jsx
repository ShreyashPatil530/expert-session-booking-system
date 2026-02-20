import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ExpertCard = ({ expert }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-card group flex flex-col h-full overflow-hidden"
        >
            <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                        <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-primary-500 transition-colors"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 flex items-center gap-1 shadow-xl">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-white">{expert.rating}</span>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold rounded-full border border-primary-500/20">
                        {expert.category}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {expert.name}
                </h3>

                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                    <Briefcase className="w-4 h-4" />
                    <span>{expert.experience} years experience</span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">
                    {expert.description}
                </p>

                <Link
                    to={`/experts/${expert._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all group/btn"
                >
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ExpertCard;
