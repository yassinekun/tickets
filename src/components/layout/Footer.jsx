import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-gray-800 bg-[#111] py-16 px-4 md:px-10 text-gray-400">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">

                {/* Brand Column */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all group">
                        <div className="h-12 w-auto">
                            <img src="/macantik-logo.png" alt="macantik" className="h-full w-auto object-contain" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none">macantik</h2>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs">{t('footer.tagline')}</p>
                </div>

                {/* Marketplace Column */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.marketplace')}</h4>
                    <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-[10px]">
                        <li><Link to="/matches" className="hover:text-primary transition-colors">{t('footer.browseMatches')}</Link></li>
                        <li><Link to="/dashboard" className="hover:text-primary transition-colors">{t('footer.sellTickets')}</Link></li>
                        <li><Link to="/swap" className="hover:text-primary transition-colors">{t('nav.ticketSwap')}</Link></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.legal')}</h4>
                    <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-[10px]">
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition-colors">{t('footer.termsOfService')}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <p>{t('footer.copyright')}</p>
            </div>
        </footer>
    );
};

export default Footer;
