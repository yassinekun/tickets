import { HandCoins, UserCheck, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../common/CurrencyConverter';

const TicketList = ({ tickets, onOffer, onBuy, onHoverCategory }) => {
    const { t } = useTranslation();

    if (!tickets || tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p>{t('ticketDetails.noTickets')}</p>
            </div>
        );
    }

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 1: return 'bg-purple-100 text-purple-700';
            case 2: return 'bg-blue-100 text-blue-700';
            case 3: return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-4">
            {tickets.map(ticket => (
                <div
                    key={ticket.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group"
                    onMouseEnter={() => onHoverCategory && onHoverCategory(ticket.category)}
                    onMouseLeave={() => onHoverCategory && onHoverCategory(null)}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getCategoryColor(ticket.category)}`}>
                                    {t('ticketDetails.cat')} {ticket.category}
                                </span>
                                {ticket.is_seller_verified && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-secondary bg-secondary/5 px-2 py-0.5 rounded-full border border-secondary/10 uppercase tracking-widest italic">
                                        <UserCheck size={12} className="fill-secondary/10" /> Verified
                                    </span>
                                )}
                            </div>
                            <h4 className="font-bold text-slate-900 mt-2">{t('ticketDetails.row')} {ticket.row}, {t('ticketDetails.seats')} {ticket.seats}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                {t('ticketDetails.listedBy')} <span className="text-primary italic font-black">{ticket.seller_name || 'Anonymous'}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-gray-400">{t('ticketDetails.available')}</span>
                            <span className="text-xl font-black text-primary italic leading-none">{ticket.quantity || 1}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onBuy(ticket)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-sm font-black text-white hover:bg-primary-dark shadow-md transition-all uppercase tracking-widest"
                        >
                            <ShoppingCart size={18} /> Contact Seller
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TicketList;
