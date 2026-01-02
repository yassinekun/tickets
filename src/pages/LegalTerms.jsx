import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalTerms = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-slate-900 py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-6 hover:gap-4 transition-all">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">Terms of Service</h1>
                    <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-xs">Last Updated: December 28, 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto -mt-10 px-4 relative z-20">
                <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 border border-gray-100">
                    <div className="prose prose-slate max-w-none">
                        <div className="flex items-center gap-4 mb-10 p-6 bg-red-50 rounded-3xl border border-red-100">
                            <Shield className="text-primary shrink-0" size={32} />
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic m-0">
                                IMPORTANT: macantik is an intermediary platform connecting football fans. We are not a ticket vendor.
                            </p>
                        </div>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">1. Platform Nature</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                macantik (the "Platform") serves exclusively as a digital bulletin board and connector for fans wishing to find or exchange tickets for AFCON 2025.
                                We act as a <strong>Linker</strong>, not a Direct Seller or Reseller.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">2. No Direct Transactions</h2>
                            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                                The Platform <strong>does not</strong>:
                            </p>
                            <ul className="list-none space-y-3">
                                {[
                                    "Handle payments or process financial transactions for tickets.",
                                    "Provide ticket purchase services directly to users.",
                                    "Provide ticket transfer or delivery services.",
                                    "Hold or verify physical or electronic tickets in escrow."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-gray-600 font-bold text-sm">
                                        <span className="text-primary">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">3. Fair Pricing Policy</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                While macantik does not technically enforce price caps, the platform is built on a "Fan-to-Fan" social contract.
                                We strongly encourage sellers to list tickets at <strong>Face Value</strong> plus a reasonable service fee.
                                We reserve the right to remove listings that are clearly exploitative or harmful to the community spirit.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic tracking-tight underline decoration-primary decoration-4 underline-offset-8">4. User Responsibility</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                Users are solely responsible for verifying the authenticity of tickets and the identity of the person they are communicating with.
                                We recommend meeting in public, well-lit places for physical exchanges and verifying ticket validity through official CAF channels where possible.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-gray-100 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                Thank you for being part of the AFCON 2025 community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalTerms;
