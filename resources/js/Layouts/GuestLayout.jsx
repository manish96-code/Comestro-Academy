import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Code2,
    Shield,
    Sparkles,
    Star,
    Terminal,
    Users
} from 'lucide-react';

export default function GuestLayout({ children, activeTab = 'auth' }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-12 bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
            
            {/* Left Showcase Panel (Visible on lg+ screens) */}
            <aside className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col justify-between p-10 xl:p-14 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/70 border-r border-slate-800/80">
                {/* Background Glow Lights */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

                {/* Top Nav Brand */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link href="/" className="group flex items-center">
                        <ApplicationLogo dark={true} />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition shadow-sm"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Website</span>
                    </Link>
                </div>

                {/* Main Middle Pitch */}
                <div className="relative z-10 my-auto py-8 space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Industry-Grade Engineering Education</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-3">
                        <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Build Real Systems. <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                                Level Up Your Tech Career.
                            </span>
                        </h2>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                            Master Java, Spring Boot, React 19, Python, and cloud architecture with direct guidance from seasoned engineering leads.
                        </p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">50+ Production Capstone Projects</h4>
                                <p className="text-[11px] text-slate-400">Microservices, real-time WebSockets, idempotency, and OAuth2 security.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                                <Code2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white">1-on-1 Code Reviews & Mentorship</h4>
                                <p className="text-[11px] text-slate-400">Personalized PR feedback from senior engineering leads.</p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Code Snippet Card */}
                    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl font-mono text-[11px] text-slate-300 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <span className="text-[10px] text-slate-500">engineer-journey.ts</span>
                        </div>
                        <div className="leading-relaxed">
                            <span className="text-purple-400">const</span> <span className="text-blue-300">career</span> = <span className="text-purple-400">await</span> Comestro.<span className="text-emerald-400">enroll</span>&#40;&#123;<br />
                            &nbsp;&nbsp;skills: [<span className="text-amber-300">'Spring Boot'</span>, <span className="text-amber-300">'React 19'</span>, <span className="text-amber-300">'Docker'</span>],<br />
                            &nbsp;&nbsp;outcome: <span className="text-emerald-400">'Senior Full Stack Engineer'</span><br />
                            &#125;&#41;;
                        </div>
                    </div>
                </div>

                {/* Bottom Social Proof */}
                <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="h-7 w-7 rounded-full bg-emerald-600 border-2 border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">R</div>
                            <div className="h-7 w-7 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">M</div>
                            <div className="h-7 w-7 rounded-full bg-teal-600 border-2 border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">S</div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-300">12,000+ Enrolled Learners</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>4.9 / 5.0 Rating</span>
                    </div>
                </div>
            </aside>

            {/* Right Form Panel (Universal) */}
            <main className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between bg-white min-h-screen p-6 sm:p-10 lg:p-12 xl:p-16 relative">
                
                {/* Mobile Top Header (Visible on screens < lg) */}
                <div className="lg:hidden flex items-center justify-between pb-6 border-b border-gray-100">
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-emerald-600 transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Home</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="w-full max-w-md mx-auto my-auto py-6 sm:py-8">
                    {children}
                </div>

                {/* Trust Footer */}
                <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <Shield className="h-3.5 w-3.5 text-emerald-600" />
                        <span>256-bit SSL Encrypted • Fast & Secure</span>
                    </div>
                    <div className="text-[11px]">
                        © {new Date().getFullYear()} Comestro Academy
                    </div>
                </div>

            </main>

        </div>
    );
}
