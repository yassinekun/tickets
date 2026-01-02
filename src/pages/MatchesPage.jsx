import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Bell, Filter, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchMatches } from '../services/api';
import AlertModal from '../components/features/AlertModal';
import Pagination from '../components/common/Pagination';
import { getFlagPath, getTeamInitials } from '../utils/flagUtils';
import { formatPrice } from '../components/common/CurrencyConverter';
import { useAuth } from '../context/AuthContext';

const MatchesPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMatches = async () => {
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
            setLoading(false);
        };
        loadMatches();
    }, []);

    // Filter logic needs to use 'matches' state instead of 'matchesData'
    // I will replace 'matchesData' usage in the useMemo hook below this block.

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
    const [selectedGroup, setSelectedGroup] = useState(searchParams.get('group') || '');
    const [selectedPhase, setSelectedPhase] = useState('Round of Sixteen');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [activeMatchForAlert, setActiveMatchForAlert] = useState(null);

    // ... (rest of filtering and logic)
    const filteredMatches = useMemo(() => {
        return matches.filter(match => {
            const matchesSearch =
                match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                match.stadium.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCity = selectedCity ? match.city === selectedCity : true;
            const matchesGroup = selectedGroup ? match.group === selectedGroup : true;
            const matchesPhase = selectedPhase ? match.phase === selectedPhase : true;

            return matchesSearch && matchesCity && matchesGroup && matchesPhase;
        });
    }, [searchTerm, selectedCity, selectedGroup, selectedPhase]);

    const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
    const currentMatches = filteredMatches.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAlertClick = (e, match) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login?redirect=/matches');
            return;
        }
        setActiveMatchForAlert(match);
        setIsAlertOpen(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const TeamFlag = ({ teamName }) => {
        const flagPath = getFlagPath(teamName);
        if (flagPath) {
            return (
                <img
                    src={flagPath}
                    alt={teamName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm group-hover:scale-110 transition-transform"
                />
            );
        }
        return (
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-400 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                {getTeamInitials(teamName)}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-12 px-4 md:px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('matches.title')}</h1>
                        <p className="text-gray-500 mt-2 font-medium">{t('matches.subtitle')}</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-10">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 bg-gray-100 p-5 rounded-3xl border border-gray-200">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder={t('matches.searchPlaceholder')}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all bg-white shadow-sm"
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none cursor-pointer bg-white shadow-sm font-bold text-slate-700 min-w-[160px]"
                                value={selectedCity}
                                onChange={e => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="">{t('matches.allCities')}</option>
                                <option value="Rabat">Rabat</option>
                                <option value="Casablanca">Casablanca</option>
                                <option value="Fes">Fes</option>
                                <option value="Agadir">Agadir</option>
                                <option value="Tangier">Tangier</option>
                                <option value="Marrakech">Marrakech</option>
                            </select>
                        </div>
                    </div>

                    {/* Phase Filters */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        {['Round of Sixteen', 'Quarter-Finals', 'Semi-Finals', 'Third-Place Match', 'Final'].map((phase) => (
                            <button
                                key={phase}
                                onClick={() => { setSelectedPhase(phase); setCurrentPage(1); }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedPhase === phase
                                    ? 'bg-primary border-primary text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary'
                                    }`}
                            >
                                {phase}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                {filteredMatches.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        <Filter size={64} className="mx-auto mb-6 text-gray-200" />
                        <h3 className="text-xl font-bold text-slate-800">{t('matches.noMatches')}</h3>
                        <p className="text-gray-500 mt-2 mb-8">Try adjusting your filters or search terms.</p>
                        <button onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedGroup('') }} className="bg-primary text-white font-black px-8 py-3 rounded-xl shadow-md hover:bg-primary-dark transition-all">{t('matches.clearFilters')}</button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('matches.showing')} {currentMatches.length} {t('matches.of')} {filteredMatches.length} {t('matches.matchesText')}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentMatches.map(match => {
                                // Date check logic
                                const matchDate = new Date(match.date);
                                const now = new Date();
                                const isPast = matchDate < now;

                                const CardContent = (
                                    <div className={`group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-500 ${isPast ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-2xl hover:translate-y-[-4px]'}`}>
                                        {/* Match Header */}
                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-8">
                                                <div className="text-center w-1/3">
                                                    <div className="mx-auto mb-3">
                                                        <TeamFlag teamName={match.homeTeam} />
                                                    </div>
                                                    <p className="font-black text-slate-900 text-xs uppercase tracking-tight truncate px-1" title={match.homeTeam}>{match.homeTeam}</p>
                                                </div>
                                                <div className="text-center w-1/3 flex flex-col items-center">
                                                    <div className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full mb-3 border border-primary/10 tracking-widest uppercase">
                                                        {match.group ? `${t('matches.group')} ${match.group} | Match #${match.id}` : `Match #${match.id}`}
                                                    </div>
                                                    <div className="text-3xl font-black text-gray-100 italic leading-none">VS</div>
                                                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{match.time}</div>
                                                </div>
                                                <div className="text-center w-1/3">
                                                    <div className="mx-auto mb-3">
                                                        <TeamFlag teamName={match.awayTeam} />
                                                    </div>
                                                    <p className="font-black text-slate-900 text-xs uppercase tracking-tight truncate px-1" title={match.awayTeam}>{match.awayTeam}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-xs font-bold text-gray-500 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="text-secondary shrink-0" size={16} />
                                                    <span>{match.date}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="text-secondary shrink-0" size={16} />
                                                    <span className="truncate" title={`${match.stadium}, ${match.city}`}>{match.stadium}, {match.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className={`mt-auto border-t border-gray-100 p-6 flex items-center justify-between transition-colors ${isPast ? 'bg-gray-100/50' : 'bg-gray-50/30 group-hover:bg-red-50/50'}`}>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{isPast ? 'Status' : t('matches.startingFrom')}</p>
                                                <p className={`font-black text-xl leading-none ${isPast ? 'text-gray-400' : 'text-primary'}`}>{isPast ? 'Expired' : formatPrice(200)}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!isPast && (
                                                    <button
                                                        onClick={(e) => handleAlertClick(e, match)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-primary hover:border-primary transition-all hover:shadow-lg shadow-sm"
                                                        title="Set Alert"
                                                    >
                                                        <Bell size={18} />
                                                    </button>
                                                )}
                                                <div className={`${isPast ? 'bg-gray-300' : 'bg-primary group-hover:bg-primary-dark'} text-white font-black px-5 h-10 flex items-center justify-center rounded-xl text-[10px] uppercase tracking-widest shadow-lg transition-all transform active:scale-95 leading-none text-center min-w-[120px]`}>
                                                    {isPast ? 'Not Available' : 'Find Ticket'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );

                                if (isPast) {
                                    return <div key={match.id}>{CardContent}</div>;
                                }

                                return (
                                    <Link to={`/tickets/${match.id}`} key={match.id}>
                                        {CardContent}
                                    </Link>
                                );
                            })}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>

            <AlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                match={activeMatchForAlert}
                allMatches={matches}
            />
        </div>
    );
};

export default MatchesPage;
