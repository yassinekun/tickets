import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Calendar, MapPin, Search, Plus, X, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/common/Pagination';
import { getFlagPath, getTeamInitials } from '../utils/flagUtils';

const TeamFlag = ({ teamName, size = 'small' }) => {
    const flagPath = getFlagPath(teamName);
    const sizeClass = size === 'small' ? 'w-5 h-5' : 'w-8 h-8';

    if (flagPath) {
        return (
            <img
                src={flagPath}
                alt={teamName}
                className={`${sizeClass} rounded-full object-cover border border-gray-100`}
            />
        );
    }

    return (
        <div className={`${sizeClass} rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-[8px] border border-gray-100 uppercase`}>
            {getTeamInitials(teamName)}
        </div>
    );
};

const TicketSwapPage = () => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('browse');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [contactSwap, setContactSwap] = useState(null);

    const [swapOffers, setSwapOffers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/swaps')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSwapOffers(data.map(s => ({
                        id: s.id,
                        user: s.user_name || 'Anonymous',
                        phone: '+212 6xx xxx xxx',
                        verified: s.verified,
                        offering: {
                            match: `${s.offering_home} vs ${s.offering_away}`,
                            team: s.offering_home,
                            date: s.offering_date,
                            category: 'N/A',
                            city: 'Rabat'
                        },
                        lookingFor: {
                            match: `${s.looking_home} vs ${s.looking_away}`,
                            team: s.looking_home,
                            date: s.looking_date,
                            category: 'N/A',
                            city: 'Casablanca'
                        },
                        createdAt: new Date(s.created_at).toLocaleDateString()
                    })));
                }
            })
            .catch(err => console.error(err));
    }, []);

    const itemsPerPage = 5;

    const filteredSwaps = useMemo(() => {
        return swapOffers.filter(swap =>
            swap.offering.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
            swap.lookingFor.match.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, swapOffers]);

    const totalPages = Math.ceil(filteredSwaps.length / itemsPerPage);
    const currentSwaps = filteredSwaps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleActionProtect = (callback) => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/swap');
            return;
        }
        callback();
    };

    const handleProposeSwap = (swap) => {
        handleActionProtect(() => setContactSwap(swap));
    };

    const handleCreateSwap = () => {
        handleActionProtect(() => {
            navigate('/dashboard?tab=swaps&action=create');
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-12 px-4 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <ArrowLeftRight className="text-primary" size={24} />
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Ticket Marketplace</h1>
                            </div>
                            <p className="text-gray-500 font-medium max-w-xl">Exchange your tickets with other fans safely. Find the match you're looking for by swapping your current tickets.</p>
                        </div>
                        <div className="w-24 h-24 hidden md:block">
                            <img src="/logo.png" alt="macantik" className="w-full h-full object-contain opacity-20" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-12 bg-gray-100 p-1.5 rounded-2xl w-fit">
                        <button
                            onClick={() => { setActiveTab('browse'); setCurrentPage(1); }}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'browse'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('ticketSwap.browseSwaps')}
                        </button>

                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                {/* Search and Create */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by match name, team or city..."
                            className="w-full pl-14 pr-6 py-5 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none bg-white shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <button
                        onClick={handleCreateSwap}
                        className="flex items-center justify-center gap-3 bg-primary text-white font-black px-10 py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                    >
                        <Plus size={20} />
                        {t('ticketSwap.createSwap')}
                    </button>
                </div>

                {activeTab === 'browse' && (
                    <>
                        {filteredSwaps.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ArrowLeftRight className="text-gray-200" size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('ticketSwap.noSwaps')}</h3>
                                <p className="text-gray-500 mt-2 mb-10 max-w-xs mx-auto font-medium">{t('ticketSwap.noSwapsDesc')}</p>
                                <button onClick={handleCreateSwap} className="bg-primary text-white font-black px-10 py-4 rounded-xl hover:bg-primary-dark transition-all uppercase tracking-widest text-xs">
                                    {t('ticketSwap.createFirst')}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {currentSwaps.map((swap) => (
                                    <div key={swap.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors"></div>

                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-lg italic tracking-tighter shadow-lg">
                                                    {swap.user.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{swap.user}</p>
                                                        {swap.verified && <CheckCircle2 size={16} className="text-secondary" />}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{swap.createdAt}</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid md:grid-cols-2 gap-6 lg:mx-8">
                                                {/* Offering */}
                                                <div className="bg-green-50/50 border border-green-100 rounded-[1.5rem] p-5">
                                                    <div className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                                        {t('ticketSwap.offering')}
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="flex -space-x-2">
                                                            <TeamFlag teamName={swap.offering.match.split(' vs ')[0]} />
                                                            <TeamFlag teamName={swap.offering.match.split(' vs ')[1]} />
                                                        </div>
                                                        <h4 className="font-black text-slate-900 uppercase tracking-tight leading-tight text-sm italic">{swap.offering.match}</h4>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-secondary" /> {swap.offering.date}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                                                            {swap.offering.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Looking For */}
                                                <div className="bg-blue-50/50 border border-blue-100 rounded-[1.5rem] p-5">
                                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                        {t('ticketSwap.lookingFor')}
                                                    </div>

                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="flex -space-x-2">
                                                            <TeamFlag teamName={swap.lookingFor.match.split(' vs ')[0]} />
                                                            <TeamFlag teamName={swap.lookingFor.match.split(' vs ')[1]} />
                                                        </div>
                                                        <h4 className="font-black text-slate-900 uppercase tracking-tight leading-tight text-sm italic">{swap.lookingFor.match}</h4>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-blue-600" /> {swap.lookingFor.date}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 font-bold text-blue-600 bg-blue-600/10 px-2 py-0.5 rounded-full">
                                                            {swap.lookingFor.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleProposeSwap(swap)}
                                                className="bg-slate-900 text-white font-black px-8 py-4 rounded-xl hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-[10px]"
                                            >
                                                Propose Swap
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}


            </div>

            {/* Contact Swap Modal */}
            {contactSwap && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setContactSwap(null)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-6 right-6">
                            <button onClick={() => setContactSwap(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-10">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
                                    <ArrowLeftRight size={32} className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Propose Swap</h3>
                                <p className="text-gray-500 font-medium">Get in touch with {contactSwap.user} to discuss the ticket exchange details.</p>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900">{contactSwap.user}</span>
                                        {contactSwap.verified && <CheckCircle2 size={14} className="text-secondary" />}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                                        <Phone size={18} className="text-secondary" />
                                        <span className="font-black text-slate-900 tracking-wider font-mono">{contactSwap.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <a href={`tel:${contactSwap.phone}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">
                                    <Phone size={16} /> Call Now
                                </a>
                                <a href={`https://wa.me/${contactSwap.phone.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 rounded-2xl shadow-lg hover:bg-secondary-dark transition-all uppercase tracking-widest text-xs">
                                    <MessageCircle size={16} /> WhatsApp
                                </a>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest leading-relaxed">
                                Meet in person to verify ticket authenticity before swapping. <br />macantik facilitates connections only.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketSwapPage;
