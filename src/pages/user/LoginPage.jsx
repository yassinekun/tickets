import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { loginUser, isAuthenticated, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const redirect = searchParams.get('redirect') || '/dashboard';

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate(redirect, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, redirect]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await loginUser(email, password);
        if (result.success) {
            if (result.is_admin) {
                // Redirect admin to admin dashboard or show message
                navigate('/admin/dashboard');
            } else {
                navigate(redirect);
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <div className="text-center mb-8">
                    <div className="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('auth.welcomeBack')}</h1>
                    <p className="text-gray-500 text-sm mt-2">{t('auth.loginSubtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-primary text-xs font-black uppercase tracking-tight">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">{t('auth.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                placeholder={t('auth.emailPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-slate-700">{t('auth.password')}</label>
                            <a href="#" className="text-xs text-primary font-bold hover:underline">{t('auth.forgot')}</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                placeholder={t('auth.passwordPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-primary outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-primary transition-all uppercase tracking-widest text-xs mt-2 shadow-lg">
                        {t('auth.loginButton')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    {t('auth.noAccount')} <Link to="/signup" className="text-primary font-bold hover:underline">{t('auth.signUp')}</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
