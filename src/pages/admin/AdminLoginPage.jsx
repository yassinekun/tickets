import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { loginAdmin, isAdminAuthenticated, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && isAdminAuthenticated) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [isAdminAuthenticated, loading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await loginAdmin(email, password);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Admin Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-white mb-4">
                        <ShieldCheck className="text-secondary" size={32} />
                        <span className="text-2xl font-bold">macantik</span>
                    </div>
                    <p className="text-gray-400 text-sm">Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-700">
                    <div className="text-center mb-8">
                        <div className="size-14 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn size={28} />
                        </div>
                        <h1 className="text-xl font-bold text-white">Admin Login</h1>
                        <p className="text-gray-400 text-sm mt-2">Access the admin dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@macantik.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white placeholder-gray-500 focus:border-secondary focus:ring-secondary outline-none"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white placeholder-gray-500 focus:border-secondary focus:ring-secondary outline-none"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-secondary text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-transform hover:scale-[1.02] shadow-md mt-4"
                        >
                            Access Dashboard
                        </button>
                    </form>



                    <div className="mt-8 text-center">
                        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                            ← Back to main site
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6 font-bold uppercase tracking-widest">
                    Authorized personnel only. All access is monitored.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
