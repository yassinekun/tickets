import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Ticket,
    Bell,
    Settings,
    Plus,
    Edit2,
    Trash2,
    Eye,
    ArrowLeftRight,
    MapPin,
    Calendar,
    Group,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getFlagPath } from '../../utils/flagUtils';
import { formatPrice } from '../../components/common/CurrencyConverter';
import { fetchMatches } from '../../services/api';
import AlertModal from '../../components/features/AlertModal';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-slate-900 transition-colors">
                        <Plus size={24} className="rotate-45" />
                    </button>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');
    const { user } = useAuth();

    // API State
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await fetchMatches();
                const mapped = data.map(m => ({
                    id: m.id,
                    homeTeam: m.home_team,
                    awayTeam: m.away_team,
                    date: m.match_date ? m.match_date.split('T')[0] : '',
                    time: m.match_time ? m.match_time.slice(0, 5) : '',
                    stadium: m.stadium,
                    city: m.city,
                    group: m.group_name,
                    phase: m.phase,
                    image: m.image
                }));
                setMatches(mapped);
            } catch (err) {
                console.error("Failed to load matches", err);
            }
        };
        loadMatches();
    }, []);
    const [listings, setListings] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [todayMatches, setTodayMatches] = useState([]);

    // Modal states
    const [showListModal, setShowListModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        matchId: '',
        category: '1',
        quantity: '1',
        offeringMatchId: '',
        lookingForMatchId: '',
        email: user?.email || ''
    });

    const stats = {
        soldTickets: listings.length > 0 ? 0 : 0 // Placeholder
    };

    const [userVerified, setUserVerified] = useState(false);

    useEffect(() => {
        // Load persistent data from API
        if (user?.email) {
            // Fetch latest verification status
            fetch(`http://localhost:3000/api/users/profile/${user.email}`)
                .then(res => res.json())
                .then(profile => {
                    console.log("DASHBOARD PROFILE FETCH:", profile);
                    if (profile && !profile.error) {
                        setUserVerified(profile.is_seller_verified || false);
                    }
                })
                .catch(err => console.error("Failed to load user profile", err));

            fetch(`http://localhost:3000/api/users/${user.email}/tickets`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setListings(data.map(t => ({
                            id: t.id,
                            homeTeam: t.home_team,
                            awayTeam: t.away_team,
                            date: t.match_date ? t.match_date.split('T')[0] : '',
                            cat: t.category,
                            quantity: t.quantity,
                            status: t.status,
                            matchId: t.match_id
                        })));
                    }
                })
                .catch(err => console.error("Failed to load user listings", err));

            fetch(`http://localhost:3000/api/users/${user.email}/alerts`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setAlerts(data.map(a => ({
                            id: a.id,
                            match: a.home_team ? `${a.home_team} vs ${a.away_team}` : 'General Alert',
                            status: a.status,
                            type: a.alert_type
                        })));
                    }
                })
                .catch(err => console.error("Failed to load user alerts", err));

            fetch(`http://localhost:3000/api/users/${user.email}/swaps`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setSwaps(data.map(s => ({
                            id: s.id,
                            offering: { homeTeam: s.offering_home, awayTeam: s.offering_away, date: s.offering_date },
                            lookingFor: { homeTeam: s.looking_home, awayTeam: s.looking_away, date: s.looking_date },
                            status: s.status,
                            user: s.user_name,
                            isVerified: s.is_verified
                        })));
                    }
                })
                .catch(err => console.error("Failed to load user swaps", err));
        }

        // Check for redirect tab
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        const action = params.get('action');
        if (tab === 'swaps') {
            setActiveTab('swaps');
            if (action === 'create') setShowSwapModal(true);
        }

        // Filter today's matches (Mock current date to 2026-01-03 as per match data)
        const today = '2026-01-03';
        const filtered = matches.filter(m => m.date === today);
        setTodayMatches(filtered);
    }, [user?.email, window.location.search]);

    const handleSaveListing = (e) => {
        e.preventDefault();
        const match = matches.find(m => m.id === formData.matchId);
        if (!match) return;

        // API Call
        const payload = {
            matchId: match.id,
            sellerId: user.id, // Use real user ID from session
            sellerName: user.name,
            category: parseInt(formData.category),
            quantity: parseInt(formData.quantity),
            price: 50 // Default or form input
        };

        fetch('http://localhost:3000/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(savedTicket => {
                const newListing = {
                    id: savedTicket.id,
                    homeTeam: match.homeTeam,
                    awayTeam: match.awayTeam,
                    date: match.date,
                    cat: savedTicket.category,
                    quantity: savedTicket.quantity,
                    status: 'Active',
                    matchId: match.id
                };
                setListings([...listings, newListing]);
            })
            .catch(err => console.error(err));

        setShowListModal(false);
        setEditingItem(null);
        setShowListModal(false);
        setEditingItem(null);
        setFormData({ ...formData, matchId: '', quantity: '1' });
        setSearchQuery('');
    };

    const handleDeleteListing = async (id) => {
        if (!window.confirm(t('dashboard.confirmDelete'))) return;

        try {
            await fetch(`http://localhost:3000/api/tickets/${id}`, { method: 'DELETE' });
            setListings(listings.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAlert = (e) => {
        e.preventDefault();
        const match = matches.find(m => m.id === formData.matchId);

        const payload = {
            match_id: formData.matchId,
            alert_type: 'SALE',
            email: user.email
        };

        fetch('http://localhost:3000/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(saved => {
                const newAlert = {
                    id: saved.id,
                    match: match ? `${match.homeTeam} vs ${match.awayTeam}` : 'General Alert',
                    status: saved.status || 'Pending',
                    type: saved.alert_type
                };
                setAlerts([...alerts, newAlert]);
                setShowAlertModal(false);
            })
            .catch(err => console.error("Failed to save alert", err));
    };

    const handleSaveSwap = (e) => {
        e.preventDefault();
        const offMatch = matches.find(m => m.id === formData.offeringMatchId);
        const lookMatch = matches.find(m => m.id === formData.lookingForMatchId);
        if (!offMatch || !lookMatch) return;

        const payload = {
            user_email: user.email,
            user_name: user.name,
            offering_match_id: offMatch.id,
            looking_for_match_id: lookMatch.id,
            is_verified: userVerified
        };

        fetch('http://localhost:3000/api/swaps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(saved => {
                setSwaps(prev => [{
                    id: saved.id,
                    offering: { homeTeam: offMatch.homeTeam, awayTeam: offMatch.awayTeam, date: offMatch.date },
                    lookingFor: { homeTeam: lookMatch.homeTeam, awayTeam: lookMatch.awayTeam, date: lookMatch.date },
                    status: 'Open',
                    user: user.name,
                    isVerified: userVerified
                }, ...prev]);
                setShowSwapModal(false);
            })
            .catch(err => console.error(err));
    };

    const filteredMatches = matches.filter(m =>
        m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Dashboard Header */}
            <header className="bg-white border-b border-gray-200 pt-10 pb-6 px-4 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary text-xl italic shadow-inner">
                                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    {t('dashboard.title')}
                                </h1>
                                <p className="text-gray-500 font-medium overflow-hidden text-ellipsis max-w-[200px] md:max-w-none flex items-center gap-2">
                                    Welcome back, <span className="text-primary font-black uppercase italic tracking-tighter">{user?.name || 'User'}</span>
                                    {userVerified && (
                                        <CheckCircle2 size={18} className="text-secondary fill-secondary/10 shrink-0" title="Verified Seller" />
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setEditingItem(null); setShowListModal(true); }}
                                className="flex items-center gap-2 bg-primary text-white font-black px-8 py-3.5 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                            >
                                <Plus size={18} />
                                {t('dashboard.listTicket')}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 mt-12 border-b border-gray-100 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', label: t('dashboard.overview'), icon: LayoutDashboard },
                            { id: 'listings', label: t('dashboard.myListings'), icon: Ticket },
                            { id: 'swaps', label: 'Ticket Swaps', icon: ArrowLeftRight },
                            { id: 'alerts', label: t('dashboard.myAlerts'), icon: Bell },
                            { id: 'settings', label: t('dashboard.settings'), icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 pb-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: t('dashboard.activeListings'), val: listings.length, icon: Ticket, color: 'primary' },
                                { label: t('dashboard.mySwaps'), val: swaps.length, icon: ArrowLeftRight, color: 'secondary' },
                                { label: t('dashboard.myAlerts'), val: alerts.length, icon: Bell, color: 'primary' },
                                { label: t('dashboard.soldTickets'), val: stats.soldTickets, icon: CheckCircle2, color: 'secondary' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-4xl font-black text-slate-900 leading-none">{stat.val}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                                        <stat.icon size={28} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Verified Banner */}
                        {!userVerified && (
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 group">
                                <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/30 transition-colors duration-700"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10 italic">
                                            Identity Verification Required
                                        </div>
                                        <h3 className="text-4xl font-black mb-4 leading-[1.1] uppercase tracking-tight italic">Sell Faster with <br /><span className="text-primary italic">Verified Badge</span></h3>
                                        <p className="text-white/60 font-medium max-w-md leading-relaxed">Boost your credibility and sell your tickets up to 3x faster than non-verified sellers.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowVerifyModal(true)}
                                        className="bg-white text-slate-900 font-black px-12 py-5 rounded-2xl hover:bg-primary hover:text-white transition-all whitespace-nowrap shadow-xl uppercase tracking-widest text-xs"
                                    >
                                        Verify My Account
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Today's Matches</h3>
                                <div className="text-[10px] font-black text-primary bg-primary/5 px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">
                                    LIVE MATCH DAY
                                </div>
                            </div>

                            {todayMatches.length > 0 ? (
                                <div className="grid gap-6">
                                    {todayMatches.map(match => (
                                        <div key={match.id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:border-primary/20 transition-all group">
                                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                                <div className="p-10">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Match #{match.id}</span>
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{match.phase}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-center w-5/12">
                                                            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl border-2 border-gray-50 flex items-center justify-center bg-white shadow-lg overflow-hidden">
                                                                <img src={getFlagPath(match.homeTeam)} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight italic">{match.homeTeam}</p>
                                                        </div>
                                                        <div className="text-center w-2/12">
                                                            <div className="text-2xl font-black text-gray-200 italic">VS</div>
                                                            <div className="text-[8px] font-black text-secondary uppercase tracking-widest mt-1">{match.time}</div>
                                                        </div>
                                                        <div className="text-center w-5/12">
                                                            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl border-2 border-gray-50 flex items-center justify-center bg-white shadow-lg overflow-hidden">
                                                                <img src={getFlagPath(match.awayTeam)} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight italic">{match.awayTeam}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-10 bg-slate-900 text-white flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">{match.stadium}</p>
                                                        <div className="flex items-center gap-2 text-white/60 text-xs">
                                                            <MapPin size={14} />
                                                            <span className="font-bold uppercase tracking-tight">{match.city}</span>
                                                        </div>
                                                    </div>
                                                    <button className="bg-primary text-white font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                                                        Match Center
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 italic font-bold text-gray-400">
                                    No matches scheduled for today. Check back tomorrow!
                                </div>
                            )}

                            {/* Recent Activity */}
                            <div className="space-y-6 pt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{t('dashboard.recentActivity')}</h3>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{t('dashboard.viewAllActivity')}</button>
                                </div>
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                                    {[
                                        { action: 'Listed Ticket', match: 'Morocco vs Mali', time: '2 mins ago', icon: Ticket, color: 'primary' },
                                        { action: 'Alert Created', match: 'Senegal vs DR Congo', time: '5 hours ago', icon: Bell, color: 'secondary' },
                                        { action: 'Account Login', match: 'Safari Browser', time: '1 day ago', icon: LayoutDashboard, color: 'slate-900' }
                                    ].map((act, i) => (
                                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary`}>
                                                    <act.icon size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight italic">{act.action}</p>
                                                    <p className="text-[10px] font-medium text-gray-400">{act.match}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{act.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Listings Tab */}
                {activeTab === 'listings' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">{t('dashboard.myListings')}</h3>
                            <button
                                onClick={() => { setEditingItem(null); setShowListModal(true); }}
                                className="bg-primary text-white font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                            >
                                {t('dashboard.sellTicket')}
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {listings.length > 0 ? listings.map(listing => (
                                <div key={listing.id} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                                            <Ticket size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight italic">{listing.homeTeam} vs {listing.awayTeam}</h4>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${listing.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{listing.date} • Category {listing.cat}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-10">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tickets Available</p>
                                            <p className="text-2xl font-black text-primary italic leading-none">{listing.quantity || 1}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(listing);
                                                    setFormData({
                                                        ...formData,
                                                        matchId: listing.matchId,
                                                        category: listing.cat.toString(),
                                                        quantity: (listing.quantity || 1).toString()
                                                    });
                                                    setSearchQuery(`${listing.homeTeam} vs ${listing.awayTeam}`);
                                                    setShowListModal(true);
                                                }}
                                                className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteListing(listing.id)}
                                                className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white rounded-[3rem] p-16 text-center border-dashed border-2 border-gray-100 font-bold text-gray-400">
                                    {t('dashboard.noActiveListings')}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Swaps Tab */}
                {activeTab === 'swaps' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Ticket Swaps</h3>
                            <button
                                onClick={() => setShowSwapModal(true)}
                                className="bg-primary text-white font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                            >
                                Create New Offer
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {swaps.length > 0 ? swaps.map(swap => (
                                <div key={swap.id} className="bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-between group">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-2">My Ticket</p>
                                            <p className="font-black text-slate-900 uppercase italic whitespace-nowrap text-sm">{swap.offering.homeTeam} vs {swap.offering.awayTeam}</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <ArrowLeftRight className="text-primary/40" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Looking For</p>
                                            <p className="font-black text-slate-900 uppercase italic whitespace-nowrap text-sm">{swap.lookingFor.homeTeam} vs {swap.lookingFor.awayTeam}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            fetch(`http://localhost:3000/api/swaps/${swap.id}`, { method: 'DELETE' })
                                                .then(res => res.json())
                                                .then(() => setSwaps(swaps.filter(s => s.id !== swap.id)))
                                                .catch(err => console.error(err));
                                        }}
                                        className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )) : (
                                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-16 text-center border-dashed border-2">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <ArrowLeftRight className="text-gray-200" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic mb-3">No Active Swaps</h3>
                                    <p className="text-gray-500 font-medium max-w-xs mx-auto mb-10 leading-relaxed">Exchange your current tickets for a different match with fellow fans.</p>
                                    <button onClick={() => setShowSwapModal(true)} className="bg-slate-900 text-white font-black px-10 py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg">Create First Offer</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase leading-none">{t('dashboard.myAlerts')}</h3>
                            <button
                                onClick={() => setShowAlertModal(true)}
                                className="bg-primary text-white font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                            >
                                + {t('dashboard.createAlert')}
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {alerts.length > 0 ? alerts.map(alert => (
                                <div key={alert.id} className="bg-white rounded-[2rem] border border-gray-100 p-8 flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                                            <Bell size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight italic mb-1">{alert.match}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Match</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${alert.status?.toLowerCase() === 'active' ? 'bg-secondary' : 'bg-orange-400'}`}></div>
                                                    {alert.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                fetch(`http://localhost:3000/api/alerts/${alert.id}`, { method: 'DELETE' })
                                                    .then(res => res.json())
                                                    .then(() => setAlerts(alerts.filter(a => a.id !== alert.id)))
                                                    .catch(err => console.error(err));
                                            }}
                                            className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 font-bold text-gray-400 italic">
                                    {t('dashboard.noAlerts')}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
                                <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight uppercase italic flex items-center gap-3">
                                    Account Information
                                </h3>
                                <div className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                                            <input type="text" className="w-full px-8 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none focus:ring-8 focus:ring-primary/5 font-black text-slate-900 uppercase italic tracking-tight" defaultValue={user?.name} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Email Address</label>
                                            <input type="email" className="w-full px-8 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary transition-all outline-none focus:ring-8 focus:ring-primary/5 font-black text-slate-900 italic tracking-tight" defaultValue={user?.email} />
                                        </div>
                                    </div>
                                    <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary transition-all uppercase tracking-widest text-xs mt-4">
                                        Update Profile Securely
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic mb-6">Security Level</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <Check className="text-secondary" size={20} />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">2FA Enabled</span>
                                        </div>
                                        <div className="w-8 h-4 bg-secondary rounded-full relative">
                                            <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Clock size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">App Password</span>
                                        </div>
                                        <button className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline">Setup</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <AlertModal
                isOpen={showAlertModal}
                onClose={() => {
                    setShowAlertModal(false);
                    // Refresh alerts
                    if (user?.email) {
                        fetch(`http://localhost:3000/api/users/${user.email}/alerts`)
                            .then(res => res.json())
                            .then(data => {
                                if (Array.isArray(data)) {
                                    setAlerts(data.map(a => ({
                                        id: a.id,
                                        match: a.home_team ? `${a.home_team} vs ${a.away_team}` : 'General Alert',
                                        status: a.status,
                                        type: a.alert_type
                                    })));
                                }
                            });
                    }
                }}
                preSelectedMatchId={formData.matchId}
                allMatches={matches}
                userEmail={user?.email}
            />

            {/* Other Modals */}
            <Modal isOpen={showListModal} onClose={() => setShowListModal(false)} title={editingItem ? "Edit Listing" : "List a Ticket"}>
                <form onSubmit={handleSaveListing} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search Match</label>
                        <input
                            type="text"
                            placeholder="Type team name..."
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="mt-2 grid gap-1 border border-gray-100 rounded-xl overflow-hidden bg-white max-h-40 overflow-y-auto">
                            {filteredMatches.map(m => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, matchId: m.id }); setSearchQuery(`${m.homeTeam} vs ${m.awayTeam}`); }}
                                    className={`px-4 py-3 text-left text-xs font-bold hover:bg-primary/5 transition-colors ${formData.matchId === m.id ? 'bg-primary/10 text-primary' : 'text-slate-600'}`}
                                >
                                    {m.homeTeam} vs {m.awayTeam} ({m.date})
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
                            <select
                                className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 font-bold outline-none appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="1">CAT 1</option>
                                <option value="2">CAT 2</option>
                                <option value="3">CAT 3</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Number of Tickets</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 font-bold outline-none"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                        {editingItem ? "Update Listing" : "Create Listing"}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify My Account">
                <div className="space-y-6">
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                        <p className="text-sm font-black text-slate-900 uppercase italic mb-2">Verification Fee: 5 USD / Euro</p>
                        <p className="text-xs text-gray-500 font-medium">Your account will be verified after the payment is completed. We will contact you by email for the final steps.</p>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                const res = await fetch('http://localhost:3000/api/users/verify', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        user_id: user.id || 'u' + Date.now(),
                                        email: user.email,
                                        name: user.name
                                    })
                                });
                                const data = await res.json();
                                // Just close the modal and maybe the user will see a banner change later
                                // or we can show a toast. For now, just close it as requested.
                                setShowVerifyModal(false);
                            } catch (e) {
                                console.error(e);
                                alert('Failed to send verification request');
                            }
                        }}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs"
                    >
                        {t('dashboard.confirm')}
                    </button>
                    <button onClick={() => setShowVerifyModal(false)} className="w-full text-gray-400 font-black py-2 uppercase tracking-widest text-[10px]">
                        {t('dashboard.cancel')}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} title="Create Ticket Swap">
                <form onSubmit={handleSaveSwap} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offering (My Match)</label>
                        <select
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 font-bold outline-none"
                            value={formData.offeringMatchId}
                            onChange={(e) => setFormData({ ...formData, offeringMatchId: e.target.value })}
                            required
                        >
                            <option value="">Select a match...</option>
                            {matches.map(m => (
                                <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam} ({m.date})</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Looking For (Desired Match)</label>
                        <select
                            className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 font-bold outline-none"
                            value={formData.lookingForMatchId}
                            onChange={(e) => setFormData({ ...formData, lookingForMatchId: e.target.value })}
                            required
                        >
                            <option value="">Select a match...</option>
                            {matches.map(m => (
                                <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam} ({m.date})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-secondary/20 font-bold italic">
                        Create Swap Offer
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default DashboardPage;
