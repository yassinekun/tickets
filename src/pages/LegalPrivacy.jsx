import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalPrivacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-slate-900 py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-6 hover:gap-4 transition-all">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">Privacy Policy</h1>
                    <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-xs">Protecting our global fan community</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto -mt-10 px-4 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100">
                    <div className="prose prose-slate max-w-none">
                        <div className="flex items-center gap-4 mb-10 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <Lock className="text-blue-600 shrink-0" size={32} />
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic m-0">
                                Your privacy is paramount. We only display what is necessary to connect you with other fans.
                            </p>
                        </div>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">1. Data Collected</h2>
                            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                                macantik collects minimal information to provide its services:
                            </p>
                            <ul className="list-none space-y-3">
                                {[
                                    "Account Information: Name and email for dashboard access.",
                                    "Seller Contact Details: Phone number or WhatsApp link, provided voluntarily by sellers for listings.",
                                    "Ticket Details: Match, section, row, and price for listing purposes."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-gray-600 font-bold text-sm">
                                        <span className="text-primary">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">2. Contact Interaction</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                When a buyer clicks "Contact Seller," the platform provides the seller's contact information directly.
                                <strong>We do not track or record the contents of private communications</strong> initiated via call or WhatsApp.
                                We do not store buyer contact information during this interaction unless they have an account on the platform.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">3. Data Sharing</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                We do not sell, rent, or trade your personal information to third parties.
                                Information provided in ticket listings (including seller contact details) is public to registered users of the platform for the purpose of facilitating the exchange.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">4. Data Security</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                We implement industry-standard security measures to protect your account data.
                                However, since transactions happen off-platform, we cannot guarantee security for interactions outside of our digital environment.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-gray-100 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                Stay safe and enjoy the tournament.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPrivacy;
