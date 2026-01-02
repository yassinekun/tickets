import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Clock, Bell, Users, Tag, DollarSign, LogOut, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logoutAdmin } = useAuth();

    const handleLogout = () => {
        logoutAdmin();
        navigate('/');
    };

    // State
    const [stats, setStats] = useState({ users: 0, matches: 0, tickets: 0, alerts: 0, sales: '0' });
    const [users, setUsers] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('verification'); // Default to users tab, which I'll call 'users' or 'verification'

    // Fetch Admin Data
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:3000/api/admin/stats');
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }

                // Fetch Users
                const usersRes = await fetch('http://localhost:3000/api/admin/users');
                if (usersRes.ok) {
                    const data = await usersRes.json();
                    if (Array.isArray(data)) setUsers(data);
                }

                // Fetch Alerts
                const alertsRes = await fetch('http://localhost:3000/api/admin/alerts');
                if (alertsRes.ok) {
                    const data = await alertsRes.json();
                    if (Array.isArray(data)) setAlerts(data);
                }

                // Fetch Verifications (mock endpoint for now if not ready, but I added it)
                const verifyRes = await fetch('http://localhost:3000/api/admin/verifications');
                if (verifyRes.ok) {
                    const data = await verifyRes.json();
                    if (Array.isArray(data)) setVerifications(data);
                }
            } catch (error) {
                console.error("Failed to load admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleVerifyAction = async (userId, action) => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, action })
            });
            if (res.ok) {
                // Update local state
                setVerifications(verifications.map(v =>
                    v.user_id === userId ? { ...v, status: action === 'approve' ? 'approved' : 'rejected' } : v
                ));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAlertAction = async (alertId, status) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/alerts/${alertId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setAlerts(alerts.map(a => a.id === alertId ? { ...a, status } : a));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Admin Header */}
            <div className="bg-slate-800 border-b border-slate-700 py-4 px-10 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-secondary" />
                    <h1 className="font-bold text-lg">{t('admin.title') || 'Admin Portal'}</h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <LogOut size={16} />
                    {t('admin.logout') || 'Log Out'}
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-10 py-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: t('admin.totalSales') || 'Total Sales', value: stats.sales, color: 'bg-green-500', icon: DollarSign },
                        { label: t('admin.activeListings') || 'Active Listings', value: stats.tickets.toString(), color: 'bg-blue-500', icon: Tag },
                        { label: 'Total Users', value: stats.users.toString(), color: 'bg-orange-500', icon: Users },
                        { label: 'Active Alerts', value: stats.alerts.toString(), color: 'bg-purple-500', icon: Bell }
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-400 text-sm uppercase font-bold">{stat.label}</p>
                                <stat.icon className="text-gray-500" size={20} />
                            </div>
                            <p className="text-3xl font-black text-white">{stat.value}</p>
                            <div className={`h-1 w-full mt-4 rounded-full ${stat.color}`}></div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('verification')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'verification'
                            ? 'bg-secondary text-white shadow-md'
                            : 'bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
                            }`}
                    >
                        <Users size={18} />
                        Recent Users
                    </button>
                    <button
                        onClick={() => setActiveTab('verifications_requests')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'verifications_requests'
                            ? 'bg-secondary text-white shadow-md'
                            : 'bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
                            }`}
                    >
                        <CheckCircle size={18} />
                        Verification Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'alerts'
                            ? 'bg-secondary text-white shadow-md'
                            : 'bg-slate-800 text-gray-400 hover:text-white border border-slate-700'
                            }`}
                    >
                        <Bell size={18} />
                        Active Alerts
                    </button>
                </div>

                {/* User List Tab (Replaces Verification) */}
                {activeTab === 'verification' && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Latest Registered Users</h3>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{t('admin.realTimeUpdates') || 'Live'}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 pl-6">{t('admin.userName')}</th>
                                        <th className="p-4">{t('admin.email')}</th>
                                        <th className="p-4">{t('admin.joined')}</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4 pr-6 text-right">{t('admin.action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.length > 0 ? users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-4 pl-6 font-bold text-slate-900">{u.name}</td>
                                            <td className="p-4 text-gray-500">{u.email}</td>
                                            <td className="p-4 text-gray-500 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {u.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <button className="text-sm font-bold text-gray-400 hover:text-slate-900">Details</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="p-6 text-center text-gray-400">No users found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'verifications_requests' && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Verification Requests</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 pl-6">User</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 pr-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {verifications.length > 0 ? verifications.map(v => (
                                        <tr key={v.id} className="hover:bg-gray-50">
                                            <td className="p-4 pl-6 font-bold text-slate-900">{v.user_name || 'N/A'}</td>
                                            <td className="p-4 text-gray-500">{v.user_email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${v.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    v.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                {v.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleVerifyAction(v.user_id, 'approve')}
                                                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerifyAction(v.user_id, 'reject')}
                                                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="p-6 text-center text-gray-400">No pending verifications</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'alerts' && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Alerts</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 pl-6">Email</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Match ID</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {alerts.length > 0 ? alerts.map(a => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="p-4 pl-6 font-bold text-slate-900">{a.email}</td>
                                            <td className="p-4 text-gray-500 uppercase text-xs font-black">{a.alert_type}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${a.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {a.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {a.status !== 'Active' && (
                                                        <button
                                                            onClick={() => handleAlertAction(a.id, 'Active')}
                                                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                                            title="Activate"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    {a.status !== 'Expired' && (
                                                        <button
                                                            onClick={() => handleAlertAction(a.id, 'Expired')}
                                                            className="bg-slate-500 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors"
                                                            title="Deactivate"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="p-6 text-center text-gray-400">No alerts found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
