import { useState, useEffect } from 'react';
import { DollarSign, Euro, Coins } from 'lucide-react';

const CurrencyConverter = () => {
    const [currency, setCurrency] = useState('MAD');

    // In a real app, this would be in a context
    useEffect(() => {
        const savedCurrency = localStorage.getItem('app_currency') || 'MAD';
        setCurrency(savedCurrency);
        window.currentCurrency = savedCurrency; // Temporary global for price conversion
    }, []);

    const handleCurrencyChange = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('app_currency', newCurrency);
        window.currentCurrency = newCurrency;
        window.dispatchEvent(new Event('currencyChange'));
        window.location.reload(); // Quickest way to update all prices for now
    };

    const currencies = [
        { code: 'MAD', label: 'MAD', icon: Coins },
        { code: 'EUR', label: 'EUR', icon: Euro },
        { code: 'USD', label: 'USD', icon: DollarSign },
    ];

    return (
        <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold border border-white/10">
                {currency}
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
                {currencies.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => handleCurrencyChange(c.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 ${currency === c.code ? 'text-primary' : 'text-gray-600'
                            }`}
                    >
                        <span>{c.label}</span>
                        <c.icon size={14} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrencyConverter;

// Simple utility for price conversion
export const formatPrice = (priceInMad) => {
    const currentCurrency = localStorage.getItem('app_currency') || 'MAD';

    const rates = {
        MAD: 1,
        EUR: 0.091,
        USD: 0.098,
    };

    const symbols = {
        MAD: 'MAD',
        EUR: '€',
        USD: '$',
    };

    const converted = (priceInMad * rates[currentCurrency]).toFixed(currentCurrency === 'MAD' ? 0 : 2);

    if (currentCurrency === 'MAD') {
        return `${symbols[currentCurrency]} ${converted}`;
    }
    return `${symbols[currentCurrency]}${converted}`;
};
