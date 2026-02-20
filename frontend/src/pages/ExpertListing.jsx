import React, { useState, useEffect } from 'react';
import { fetchExperts } from '../api';
import ExpertCard from '../components/ExpertCard';
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Health', 'Finance', 'Legal', 'Education', 'Lifestyle'];

const ExpertListing = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadExperts = async () => {
            try {
                setLoading(true);
                const { data } = await fetchExperts({
                    search: searchTerm,
                    category: selectedCategory,
                    page,
                    limit: 8
                });
                setExperts(data.data);
                setTotalPages(data.pagination.pages);
                setError(null);
            } catch (err) {
                console.error('Expert Fetch Error:', err);
                setError('Failed to fetch experts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(loadExperts, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory, page]);

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header & Filters */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Find Your Expert</h1>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl">
                    Connect with top-tier professionals for personalized 1-on-1 sessions.
                </p>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="input-field pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setPage(1);
                                }}
                                className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${selectedCategory === category
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40'
                                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                    <p className="text-slate-400 animate-pulse">Finding the best experts for you...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 bg-red-500/10 rounded-full mb-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                    <p className="text-slate-400">{error}</p>
                </div>
            ) : experts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-400 text-lg">No experts found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experts.map(expert => (
                            <ExpertCard key={expert._id} expert={expert} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-50 border border-slate-800"
                            >
                                Previous
                            </button>
                            <span className="flex items-center text-slate-400">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg disabled:opacity-50 border border-slate-800"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExpertListing;
