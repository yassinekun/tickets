import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', flag: '/flags/Morocco.webp' },
        { code: 'fr', name: 'Français', flag: '/flags/Morocco.webp' }
    ];

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem('language', langCode);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
            >
                <span className="uppercase font-bold">{currentLang.code}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[140px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 transition-colors ${currentLang.code === lang.code
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span className="uppercase font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                {lang.code}
                            </span>
                            <span>{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
