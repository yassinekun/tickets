import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Info, Phone, MessageCircle, X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SeatMap from '../components/features/SeatMap';
import TicketList from '../components/features/TicketList';
import { getFlagPath, getTeamInitials } from '../utils/flagUtils';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/common/CurrencyConverter';

const TicketDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactTicket, setContactTicket] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [allTickets, setAllTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Match
                const matchRes = await fetch('http://localhost:3000/api/matches');
                if (matchRes.ok) {
                    const matches = await matchRes.json();
                    const foundMatch = matches.find(m => m.id === id || m.id === parseInt(id));
                    if (foundMatch) {
                        setMatch({
                            ...foundMatch,
                            homeTeam: foundMatch.home_team,
                            awayTeam: foundMatch.away_team,
                            date: new Date(foundMatch.match_date).toLocaleDateString(),
                            time: foundMatch.match_time,
                            stadium: foundMatch.stadium
                        });
                    }
                }

                // Fetch Tickets
                const ticketsRes = await fetch(`http://localhost:3000/api/matches/${id}/tickets`);
                if (ticketsRes.ok) {
                    const tickets = await ticketsRes.json();
                    // Map DB tickets to frontend format
                    const mappedTickets = tickets.map(t => ({
                        id: t.id,
                        category: parseInt(t.category),
                        section: `cat${t.category}`,
                        row: t.row || 'N/A',
                        seats: t.seats || 'N/A',
                        quantity: t.quantity,
                        seller_name: t.seller_name || 'Anonymous',
                        is_seller_verified: t.is_seller_verified || false,
                        phone: t.seller_phone || '+212 600 000 000'
                    }));
                    setAllTickets(mappedTickets);
                }
            } catch (error) {
                console.error("Failed to fetch details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredTickets = selectedCategory
        ? allTickets.filter(t => t.category === selectedCategory)
        : allTickets;

    if (loading) return <div className="p-20 text-center font-bold text-xl">Loading Match Details...</div>;
    if (!match) return <div className="p-20 text-center font-bold text-xl">Match not found</div>;

    const handleContact = (ticket) => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/tickets/${id}`);
            return;
        }
        setContactTicket(ticket);
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(selectedCategory === cat ? null : cat);
    };

    // Team Flag Component
    const TeamFlag = ({ teamName, size = 'normal' }) => {
        const flagPath = getFlagPath(teamName);
        const sizeClass = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';

        if (flagPath) {
            return (
                <img
                    src={flagPath}
                    alt={teamName}
                    className={`${sizeClass} rounded-full object-cover border border-gray-200`}
                />
            );
        }

        return (
            <div className={`${sizeClass} rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs border border-gray-200`}>
                {getTeamInitials(teamName)}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Enhanced Header with Flags */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-10 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/matches" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="flex items-center gap-4">
                                {/* Home Team with Flag */}
                                <div className="flex items-center gap-2">
                                    <TeamFlag teamName={match.homeTeam} />
                                    <span className="font-black text-slate-900 uppercase tracking-tight">{match.homeTeam}</span>
                                </div>

                                <span className="text-gray-200 font-black italic">VS</span>

                                {/* Away Team with Flag */}
                                <div className="flex items-center gap-2">
                                    <TeamFlag teamName={match.awayTeam} />
                                    <span className="font-black text-slate-900 uppercase tracking-tight">{match.awayTeam}</span>
                                </div>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-secondary" />
                                <span>{match.date} • {match.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-secondary" />
                                <span>{match.stadium}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Interactive Map */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight text-xl italic">
                                Stadium Venue Map
                            </h2>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('ticketDetails.clickToFilter')}</span>
                        </div>

                        <SeatMap
                            onSelectCategory={handleCategorySelect}
                            selectedCategory={selectedCategory}
                            hoveredCategory={hoveredCategory}
                        />

                        <div className="mt-10 grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategorySelect(cat)}
                                    onMouseEnter={() => setHoveredCategory(cat)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    className={`p-4 rounded-2xl border text-xs font-black transition-all uppercase tracking-widest ${selectedCategory === cat
                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                        }`}
                                >
                                    {t('ticketDetails.cat')} {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl flex gap-4 text-white/80 text-sm border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
                        <span className="shrink-0 text-secondary mt-1"><Info size={24} /></span>
                        <p className="relative z-10 font-medium leading-relaxed">Tickets are verified. Contact the seller to arrange the transfer.</p>
                    </div>
                </div>

                {/* Right Column: Ticket List */}
                <div className="lg:col-span-5 h-fit sticky top-24">
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight italic">{t('ticketDetails.availableListings')}</h3>
                            <div className="text-[10px] font-black bg-white border border-gray-100 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest">
                                {filteredTickets.length} {t('ticketDetails.found')}
                            </div>
                        </div>

                        <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
                            {filteredTickets.length > 0 ? (
                                <TicketList
                                    tickets={filteredTickets}
                                    onBuy={handleContact}
                                    onHoverCategory={setHoveredCategory}
                                />
                            ) : (
                                <div className="text-center py-10 text-gray-400 italic">
                                    No tickets listed for this match yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Contact Seller Modal */}
            {contactTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setContactTicket(null)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-6 right-6">
                            <button onClick={() => setContactTicket(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-10">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
                                    <Phone size={32} className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Contact Seller</h3>
                                <p className="text-gray-500 font-medium">Verify details and complete your purchase directly with the seller.</p>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900">{contactTicket.seller}</span>
                                        {contactTicket.verified && <CheckCircle2 size={14} className="text-secondary" />}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tickets Available</span>
                                    <span className="font-black text-primary text-lg">{contactTicket.quantity || 1}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                                        <Phone size={18} className="text-secondary" />
                                        <span className="font-black text-slate-900 tracking-wider font-mono">{contactTicket.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <a href={`tel:${contactTicket.phone}`} className="flex items-center justify-center gap-2 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">
                                    <Phone size={16} /> Call Now
                                </a>
                                <a href={`https://wa.me/${contactTicket.phone.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 rounded-2xl shadow-lg hover:bg-secondary-dark transition-all uppercase tracking-widest text-xs">
                                    <MessageCircle size={16} /> WhatsApp
                                </a>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest leading-relaxed">
                                Always meet in public places for exchange. <br />macantik does not handle payments directly.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetailsPage;
