import { Link } from '@inertiajs/react';
import { Home, BookOpen, Video, Layers, User, Terminal, Sun, Moon } from 'lucide-react';

export default function MobileAppDock({ auth, activeTab = 'home', theme = 'dark', onToggleTheme }) {
    const isDark = theme === 'dark';

    return (
        <aside
            aria-label="Mobile Navigation Dock"
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe"
        >
            <div className="mx-auto px-3 pb-2 pt-1">
                <nav className={`flex items-center justify-around rounded-2xl px-2 py-2 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
                    isDark
                        ? 'border border-white/10 bg-[#0a0f1d]/90 shadow-black/80 ring-1 ring-white/5'
                        : 'border border-slate-200/80 bg-white/90 shadow-slate-300/50 ring-1 ring-black/5'
                }`}>
                    {/* 1. Home */}
                    <a
                        href="#"
                        className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                            activeTab === 'home'
                                ? isDark ? 'text-cyan-400 font-semibold' : 'text-blue-600 font-semibold'
                                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <div className={`p-1 rounded-lg ${activeTab === 'home' ? (isDark ? 'bg-cyan-500/15' : 'bg-blue-50') : ''}`}>
                            <Home className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] tracking-tight">Home</span>
                    </a>

                    {/* 2. Courses */}
                    <Link
                        href={route('courses.index')}
                        className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                            activeTab === 'courses'
                                ? isDark ? 'text-cyan-400 font-semibold' : 'text-blue-600 font-semibold'
                                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <div className={`p-1 rounded-lg ${activeTab === 'courses' ? (isDark ? 'bg-cyan-500/15' : 'bg-blue-50') : ''}`}>
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] tracking-tight">Courses</span>
                    </Link>

                    {/* 3. Live */}
                    <a
                        href="#live"
                        className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition relative ${
                            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <div className="p-1 rounded-lg relative">
                            <Video className="h-4 w-4 text-fuchsia-500" />
                            <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-ping" />
                        </div>
                        <span className="font-mono text-[10px] tracking-tight">Live</span>
                    </a>

                    {/* 4. Projects */}
                    <a
                        href="#projects"
                        className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <div className="p-1 rounded-lg">
                            <Layers className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] tracking-tight">Projects</span>
                    </a>

                    {/* 5. Theme Toggle button on mobile dock */}
                    {onToggleTheme && (
                        <button
                            type="button"
                            onClick={onToggleTheme}
                            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                                isDark ? 'text-amber-400' : 'text-indigo-600'
                            }`}
                            title="Toggle Light / Dark theme"
                        >
                            <div className={`p-1 rounded-lg ${isDark ? 'bg-amber-400/15' : 'bg-indigo-50'}`}>
                                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </div>
                            <span className="font-mono text-[10px] tracking-tight">{isDark ? 'Light' : 'Dark'}</span>
                        </button>
                    )}

                    {/* 6. Dashboard or Login */}
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                                isDark ? 'text-emerald-400' : 'text-emerald-600'
                            }`}
                        >
                            <div className={`p-1 rounded-lg ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <Terminal className="h-4 w-4" />
                            </div>
                            <span className="font-mono text-[10px] tracking-tight font-semibold">Portal</span>
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 transition ${
                                isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <div className="p-1 rounded-lg">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="font-mono text-[10px] tracking-tight">Account</span>
                        </Link>
                    )}
                </nav>
            </div>
        </aside>
    );
}
