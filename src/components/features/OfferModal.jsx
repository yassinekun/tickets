import { useState } from 'react';
import { X, HandCoins } from 'lucide-react';

const OfferModal = ({ isOpen, onClose, ticket }) => {
    const [offerAmount, setOfferAmount] = useState('');
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Offer of MAD ${offerAmount} sent for Ticket #${ticket?.id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-slate-800">
                        <HandCoins className="text-secondary" size={20} />
                        <h3 className="font-bold">Make an Offer</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                        <div className="text-sm text-gray-500 mb-1">Listed Price</div>
                        <div className="text-2xl font-black text-slate-900">MAD {ticket?.price}</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Your Offer (MAD)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 250"
                            className="w-full rounded-lg border-gray-200 focus:border-secondary focus:ring-secondary text-lg font-mono font-bold"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Your Email</label>
                        <input
                            type="email"
                            required
                            placeholder="For notification about seller's decision"
                            className="w-full rounded-lg border-gray-200 focus:border-secondary focus:ring-secondary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-secondary text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-transform hover:scale-[1.02] shadow-md mt-2"
                    >
                        Send Offer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OfferModal;
