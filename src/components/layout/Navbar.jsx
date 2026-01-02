import { useState } from 'react';
import { Search, Menu, X, ArrowLeftRight, LogOut, User, Ticket, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import CurrencyConverter from '../common/CurrencyConverter';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logoutUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSellTicketsClick = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login?redirect=/dashboard');
        }
    };

    return (
        <nav className="sticky top-0 z-[60] border-b border-white/5 bg-slate-900/95 backdrop-blur-md px-4 py-4 lg:px-10 shadow-xl text-white">
            <div className="flex items-center justify-between gap-4 mx-auto max-w-7xl">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all group">
                    <div className="h-12 w-auto">
                        <img src="/macantik-logo.png" alt="macantik" className="h-full w-auto object-contain" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">macantik</h2>
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] leading-none">Official Marketplace</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-10">
                    <Link to="/matches" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors">{t('nav.matches')}</Link>
                    <Link to="/swap" className="text-[10px] font-black text-white/60 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                        <ArrowLeftRight size={14} />
                        {t('nav.ticketSwap')}
                    </Link>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden xl:flex items-center gap-2 pr-6 border-r border-white/10">
                        <LanguageSwitcher />
                        <CurrencyConverter />
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            onClick={handleSellTicketsClick}
                            className="hidden sm:flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-[10px] font-black text-slate-900 transition-all hover:bg-primary hover:text-white shadow-lg uppercase tracking-widest"
                        >
                            {t('nav.sellTickets')}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/5">
                                <Link to="/dashboard" className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-xl hover:bg-white/5 transition-all text-white group" title="Dashboard">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white hidden sm:block">{user?.name?.split(' ')[0] || 'My Account'}</span>
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                                        <User size={18} />
                                    </div>
                                </Link>
                                <button onClick={logoutUser} className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-white/40 hover:text-red-400" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 text-[10px] font-black text-white transition-all hover:bg-white/10 uppercase tracking-widest">
                                {t('nav.login')}
                            </Link>
                        )}

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white ml-2 bg-white/5 p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-6 pb-6 border-t border-white/5 pt-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-4 px-2">
                        <Link to="/matches" className="p-4 bg-white/5 rounded-2xl text-[10px] font-black text-white/80 uppercase tracking-widest border border-white/5 text-center">{t('nav.matches')}</Link>
                        <Link to="/swap" className="p-4 bg-white/5 rounded-2xl text-[10px] font-black text-white/80 uppercase tracking-widest border border-white/5 text-center">{t('nav.ticketSwap')}</Link>
                    </div>
                    <div className="flex flex-col gap-4 px-2">
                        <Link to="/dashboard" onClick={handleSellTicketsClick} className="bg-primary/20 text-primary p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/20 text-center">{t('nav.sellTickets')}</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
