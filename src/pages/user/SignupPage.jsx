import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { registerUser } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [whatsappSame, setWhatsappSame] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await registerUser(email, password, name, phone);

        setLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Visual */}
                <div className="hidden md:flex flex-col justify-center p-12 bg-primary text-white w-2/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-6">{t('auth.joinTitle')}</h2>
                        <p className="text-white/80 text-lg mb-8">{t('auth.joinSubtitle')}</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                                <span>{t('auth.verifiedCommunity')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Lock size={16} />
                                </div>
                                <span>{t('auth.secureTransactions')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 md:p-12">
                    <div className="flex justify-end mb-8">
                        <span className="text-sm text-gray-500">{t('auth.hasAccount')} <Link to="/login" className="font-bold text-primary hover:underline">{t('auth.loginButton')}</Link></span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">{t('auth.createAccount')}</h2>
                        <p className="text-gray-500 mt-2">{t('auth.signupSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">{t('auth.fullName')}</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder={t('auth.fullNamePlaceholder')}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder={t('auth.emailPlaceholder')}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder={t('auth.passwordPlaceholder')}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Phone & WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    required
                                    placeholder="+212 600 000 000"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="whatsapp"
                                    checked={whatsappSame}
                                    onChange={(e) => setWhatsappSame(e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="whatsapp" className="text-xs text-gray-500">Number available on WhatsApp</label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-transform hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70">
                            {loading ? 'Creating...' : t('auth.createButton')} {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        {t('auth.terms')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
