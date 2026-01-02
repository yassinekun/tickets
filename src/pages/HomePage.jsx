import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ArrowRight, ShieldCheck, Zap, Lock, Ticket, Smartphone, CreditCard, Plus, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchMatches } from '../services/api';
import { getFlagPath } from '../utils/flagUtils';

const HomePage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');
    const [mode, setMode] = useState('buy');
    const [knockoutMatches, setKnockoutMatches] = useState([]);

    useEffect(() => {
        const loadMatches = async () => {
            const data = await fetchMatches();
            const r16 = data.filter(m => m.phase === 'Round of Sixteen').slice(0, 8);
            setKnockoutMatches(r16);
        };
        loadMatches();
    }, []);

    const groups = [
        { name: 'Group A', teams: 'Morocco, Mali, Zambia, Comoros', letter: 'A', img: '/groups/group-01.png' },
        { name: 'Group B', teams: 'Egypt, South Africa, Angola, Zimbabwe', letter: 'B', img: '/groups/group-02.png' },
        { name: 'Group C', teams: 'Nigeria, Tunisia, Uganda, Tanzania', letter: 'C', img: '/groups/group-03.png' },
        { name: 'Group D', teams: 'Senegal, DR Congo, Benin, Botswana', letter: 'D', img: '/groups/group-04.png' },
        { name: 'Group E', teams: 'Algeria, Burkina Faso, Eq. Guinea, Sudan', letter: 'E', img: '/groups/group-05.png' },
        { name: 'Group F', teams: 'Ivory Coast, Cameroon, Gabon, Mozambique', letter: 'F', img: '/groups/group-06.png' },
    ];

    const cities = [
        { name: 'Rabat', matches: 9, img: '/cities/rabat.webp', desc: 'The Capital City' },
        { name: 'Casablanca', matches: 6, img: '/cities/casablanca.jpeg', desc: 'Economic Hub' },
        { name: 'Fes', matches: 3, img: '/cities/Fes.jpg', desc: 'Spiritual Center' },
        { name: 'Agadir', matches: 6, img: '/cities/agadir.jpg', desc: 'Coastal Gem' },
        { name: 'Tangier', matches: 3, img: '/cities/tangier.jpg', desc: 'Gateway to Africa' },
        { name: 'Marrakech', matches: 9, img: '/cities/marrakech.jpeg', desc: 'The Red City' },
    ];

    // All 9 stadiums for AFCON 2025
    // All 9 stadiums for AFCON 2025
    const stadiums = [
        { name: 'Prince Moulay Abdellah', city: 'Rabat', img: '/stadiums/Morocco_Moulay-Abdallah-Stadium.jpg' },
        { name: 'Mohammed V Stadium', city: 'Casablanca', img: '/stadiums/casablanca.jpg' },
        { name: 'Marrakesh Stadium', city: 'Marrakech', img: '/stadiums/Marrakech.jpg' },
        { name: 'Adrar Stadium', city: 'Agadir', img: '/stadiums/adrar_agadir.jpg' },
        { name: 'Fez Stadium', city: 'Fes', img: '/stadiums/fes.jpg' },
        { name: 'Tangier Grand Stadium', city: 'Tangier', img: '/stadiums/tangier.jpg' },
        { name: 'Moulay Hassan Stadium', city: 'Rabat', img: '/stadiums/moulay_el_hassan.png' },
        { name: 'Rabat Olympic Stadium', city: 'Rabat', img: '/stadiums/olympic.jpg' },
        { name: 'Al Medina Stadium', city: 'Rabat', img: '/stadiums/Al_Barid_Stadium.jpg' },
    ];

    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center justify-center text-center p-6 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%), url("/stadium3.jpg")' }}>
                {/* اسد image */}
                <img
                    src="/اسد.png"
                    alt="Lion"
                    className="absolute bottom-0 right-0 w-[250px] md:w-[350px] opacity-80 z-20 pointer-events-none hidden md:block"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
                />
                <div className="max-w-4xl z-10 flex flex-col gap-6 items-center text-white">
                    <span className="bg-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg animate-in fade-in slide-in-from-bottom-4">
                        {t('hero.tagline')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {t('hero.title')} <span className="text-secondary">{t('hero.titleHighlight')}</span> {t('hero.titleEnd')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {t('hero.subtitle')}
                    </p>

                    {/* Search Form */}
                    <div className="w-full max-w-2xl bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 mt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="flex flex-1 items-center px-4 gap-2 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                            <Calendar className="text-secondary" size={20} />
                            <input
                                type="text"
                                placeholder="Match, Team or Venue"
                                className="w-full outline-none text-slate-900 placeholder-gray-400 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-1 items-center px-4 gap-2 py-2 md:py-0">
                            <MapPin className="text-secondary" size={20} />
                            <select
                                className="w-full outline-none text-slate-900 bg-transparent cursor-pointer font-medium"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <Link
                            to={`/matches?search=${searchTerm}&city=${city}`}
                            className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center"
                        >
                            {t('hero.searchButton')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat bg-[length:200px]" style={{ backgroundImage: 'url("/pattern-05.png")' }}></div>
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="text-center mb-12">
                        <span className="text-secondary font-bold uppercase tracking-wide text-sm">Simple Process</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-2">{t('howItWorks.title')}</h2>

                        {/* Buy/Sell Switch */}
                        <div className="flex items-center justify-center mt-8">
                            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex">
                                <button
                                    onClick={() => setMode('buy')}
                                    className={`px-8 py-2.5 rounded-lg text-sm font-black transition-all ${mode === 'buy' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    BUY TICKET
                                </button>
                                <button
                                    onClick={() => setMode('sell')}
                                    className={`px-8 py-2.5 rounded-lg text-sm font-black transition-all ${mode === 'sell' ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    RESALE TICKET
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                        {mode === 'buy' ? (
                            <>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Choose Match</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Browse all AFCON 2025 matches and find the one you want to attend in any of the 6 host cities.</p>
                                </div>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <Ticket size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Browse Tickets</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Check available listings from verified sellers. Compare categories and prices to find your perfect seat.</p>
                                </div>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Contact Privately</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Contact the seller privately to arrange the exchange or purchase through our secure platform info.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                                        <Plus size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">List Tickets</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Enter your ticket details, set your price, and provide your contact information to reach potential buyers.</p>
                                </div>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                                        <ArrowLeftRight size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Receive Offers</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Manage incoming swap or purchase offers in your dashboard. Accept the one that fits you best.</p>
                                </div>
                                <div className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Contact Buyer</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Connect with the buyer privately to complete the transaction secure and fast.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>            {/* Round of 16 Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <span className="text-secondary font-bold uppercase tracking-wide text-sm">Knockout Phase</span>
                            <h2 className="text-4xl font-black text-slate-900 mt-2">Round of Sixteen</h2>
                        </div>
                        <Link to="/matches" className="text-primary font-bold hover:underline flex items-center gap-1">
                            View Full Bracket <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {knockoutMatches.map((match) => (
                            <Link
                                key={match.id}
                                to={`/tickets/${match.id}`}
                                className="group bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-500"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full inline-block">Match #{match.id}</span>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{match.phase}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                                            <img src={getFlagPath(match.home_team)} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-black text-slate-900 uppercase italic text-sm truncate">{match.home_team}</span>
                                    </div>
                                    <div className="flex flex-col items-center px-4">
                                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full mb-1">VS</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{match.match_time?.slice(0, 5)}</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-end gap-4">
                                        <span className="font-black text-slate-900 uppercase italic text-sm truncate text-right">{match.away_team}</span>
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                                            <img src={getFlagPath(match.away_team)} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-secondary" />
                                        <span>{match.match_date?.split('T')[0]}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-secondary" />
                                        <span className="truncate max-w-[150px]">{match.stadium}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            {/* Stadiums Section - 3x3 Grid */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="text-center mb-16">
                        <span className="text-secondary font-bold uppercase tracking-wide text-sm">{t('stadiums.subtitle')}</span>
                        <h2 className="text-4xl font-black mt-2">{t('stadiums.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stadiums.map((stadium, i) => (
                            <div key={i} className="group relative rounded-xl overflow-hidden aspect-[4/3]">
                                <img src={stadium.img} alt={stadium.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <p className="text-secondary font-bold text-xs uppercase mb-1">{stadium.city}</p>
                                    <h3 className="text-lg font-bold leading-tight">{stadium.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section id="cities" className="py-16 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="text-center mb-10">
                        <span className="text-secondary font-bold uppercase tracking-wide text-sm">{t('cities.subtitle')}</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">{t('cities.title')}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {cities.map((city) => (
                            <Link to={`/matches?city=${city.name}`} key={city.name} className="group relative flex flex-col gap-3">
                                <div className={`w-full aspect-square rounded-xl overflow-hidden relative shadow-md`}>
                                    <img src={city.img} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-2xl uppercase opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
                                        {city.name.substring(0, 3)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-900 font-bold group-hover:text-primary transition-colors">{city.name}</p>
                                    <p className="text-xs text-gray-500">{city.matches} Matches</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 md:px-10">
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white">{t('cta.title')}</h2>
                        <p className="text-white/80 text-lg mt-2 font-medium max-w-md">{t('cta.subtitle')}</p>
                    </div>
                    <Link to="/dashboard" className="relative z-10 bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl">
                        {t('cta.button')}
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
