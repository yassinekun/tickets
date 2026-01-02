import { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, ArrowLeftRight, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const AlertModal = ({ isOpen, onClose, match, preSelectedMatchId, allMatches = [], userEmail = '' }) => {
    const { t } = useTranslation();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [email, setEmail] = useState(userEmail);
    const [alertType, setAlertType] = useState('SALE'); // 'SALE' or 'SWAP'
    const [selectedMatchId, setSelectedMatchId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setEmail(userEmail);
            if (match) {
                setSelectedMatchId(match.id);
            } else if (preSelectedMatchId) {
                setSelectedMatchId(preSelectedMatchId);
            } else {
                setSelectedMatchId('');
            }
        }
    }, [isOpen, match, preSelectedMatchId, userEmail]);

    const activeMatch = match || allMatches.find(m => m.id === selectedMatchId);

    if (!isOpen) return null;

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch('http://localhost:3000/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    match_id: activeMatch ? activeMatch.id : null,
                    alert_type: alertType,
                    email: email
                })
            });

            if (resp.ok) {
                onClose();
            } else {
                alert('Failed to create alert');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating alert');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Bell size={16} />
                        </div>
                        <div>
                            <h3 className="font-black text-base uppercase tracking-tight italic leading-none">Set Alert</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {!match && (
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Match</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary/20"
                                value={selectedMatchId}
                                onChange={(e) => setSelectedMatchId(e.target.value)}
                            >
                                <option value="">Select a match...</option>
                                {allMatches.map(m => (
                                    <option key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {activeMatch && (
                        <div className="bg-blue-50/50 border border-blue-100/50 text-blue-900 p-3 rounded-xl text-xs flex gap-2">
                            <div className="shrink-0 pt-0.5"><Bell size={14} className="text-blue-500" /></div>
                            <div>
                                Alerts for <strong className="font-black uppercase">{activeMatch.homeTeam} vs {activeMatch.awayTeam}</strong>.
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('dashboard.alertType')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all ${alertType === 'SALE' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input type="radio" name="alertType" value="SALE" checked={alertType === 'SALE'} onChange={() => setAlertType('SALE')} className="hidden" />
                                <Ticket className={alertType === 'SALE' ? 'text-primary' : 'text-gray-400'} size={20} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${alertType === 'SALE' ? 'text-primary' : 'text-gray-400'}`}>{t('dashboard.resaleAlert')}</span>
                            </label>
                            <label className={`flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all ${alertType === 'SWAP' ? 'border-secondary bg-secondary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input type="radio" name="alertType" value="SWAP" checked={alertType === 'SWAP'} onChange={() => setAlertType('SWAP')} className="hidden" />
                                <ArrowLeftRight className={alertType === 'SWAP' ? 'text-secondary' : 'text-gray-400'} size={20} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${alertType === 'SWAP' ? 'text-secondary' : 'text-gray-400'}`}>{t('dashboard.swapAlert')}</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categories</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(cat => (
                                <label key={cat} className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all text-xs font-bold border ${selectedCategories.includes(cat)
                                    ? 'border-slate-900 bg-slate-900 text-white'
                                    : 'border-gray-100 text-gray-400 hover:border-gray-300'
                                    }`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => handleCategoryChange(cat)}
                                    />
                                    <span>Cat {cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold border-none outline-none focus:ring-2 focus:ring-primary/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-primary transition-all shadow-lg uppercase tracking-widest text-[10px] mt-2"
                    >
                        Create Alert
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AlertModal;
