import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import MobileAppDock from '@/Components/MobileAppDock';

export default function PublicLayout({
    children,
    activeNav = '',
    containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    mainClassName = 'pt-24 sm:pt-28 pb-16 flex-1'
}) {
    const { auth } = usePage().props;
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
        }
        return 'dark';
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {}
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 font-sans antialiased flex flex-col justify-between pb-16 lg:pb-0 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#fafbfc] text-slate-900'
        }`}>
            {/* 1. Public Navigation Bar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all pt-safe ${
                scrolled
                    ? isDark
                        ? 'border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md'
                        : 'border-b border-slate-200 bg-white/95 backdrop-blur-md'
                    : isDark
                        ? 'border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md'
                        : 'border-b border-slate-200/80 bg-white/90 backdrop-blur-md'
            }`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10 py-3.5">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo dark={isDark} />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
                        <Link
                            href={typeof route === 'function' ? route('courses.index') : '/courses'}
                            className={activeNav === 'courses'
                                ? isDark ? 'text-white font-semibold' : 'text-blue-600 font-semibold'
                                : isDark ? 'text-slate-300 hover:text-white transition' : 'text-slate-600 hover:text-slate-950 transition'
                            }
                        >
                            Courses
                        </Link>
                        <a
                            href="/#live"
                            className={isDark ? 'text-slate-300 hover:text-white transition' : 'text-slate-600 hover:text-slate-950 transition'}
                        >
                            Live Classes
                        </a>
                        <a
                            href="/#projects"
                            className={isDark ? 'text-slate-300 hover:text-white transition' : 'text-slate-600 hover:text-slate-950 transition'}
                        >
                            Projects
                        </a>
                        <a
                            href="/#mentors"
                            className={isDark ? 'text-slate-300 hover:text-white transition' : 'text-slate-600 hover:text-slate-950 transition'}
                        >
                            Instructors
                        </a>
                        <Link
                            href={typeof route === 'function' ? route('certificates.verify') : '/verify-certificate'}
                            className={activeNav === 'verify'
                                ? isDark ? 'text-white font-semibold' : 'text-blue-600 font-semibold'
                                : isDark ? 'text-slate-300 hover:text-white transition' : 'text-slate-600 hover:text-slate-950 transition'
                            }
                        >
                            Verify Certificate
                        </Link>
                    </nav>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`rounded-lg border p-1.5 transition cursor-pointer ${
                                isDark
                                    ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2">
                            {auth?.user ? (
                                <Link
                                    href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-mono font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={typeof route === 'function' ? route('login') : '/login'}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={typeof route === 'function' ? route('register') : '/register'}
                                        className="rounded-lg bg-slate-900 dark:bg-white px-3.5 py-1.5 text-xs font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-2xs"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 lg:hidden cursor-pointer"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className={`border-b px-6 py-4 lg:hidden ${
                        isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
                    }`}>
                        <div className="flex flex-col space-y-3 text-sm">
                            <Link
                                href={typeof route === 'function' ? route('courses.index') : '/courses'}
                                onClick={() => setMobileMenuOpen(false)}
                                className={activeNav === 'courses' ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}
                            >
                                All Courses
                            </Link>
                            <a href="/#live" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Live Classes
                            </a>
                            <a href="/#projects" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Projects
                            </a>
                            <a href="/#mentors" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Instructors
                            </a>
                            <Link
                                href={typeof route === 'function' ? route('certificates.verify') : '/verify-certificate'}
                                onClick={() => setMobileMenuOpen(false)}
                                className={activeNav === 'verify' ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}
                            >
                                Verify Certificate
                            </Link>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                                {auth?.user ? (
                                    <Link
                                        href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                        className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 text-center text-xs font-semibold"
                                    >
                                        Dashboard →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={typeof route === 'function' ? route('login') : '/login'}
                                            className="rounded-lg border border-slate-300 dark:border-slate-700 text-center py-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={typeof route === 'function' ? route('register') : '/register'}
                                            className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 text-center text-xs font-semibold"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Page Content */}
            <main className={`${mainClassName} ${containerClassName}`}>
                {children}
            </main>

            {/* Public Footer */}
            <footer className={`border-t py-10 text-xs text-slate-500 ${
                isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
            }`}>
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo dark={isDark} imgClassName="h-7 w-auto" />
                        <span className="text-slate-400 hidden sm:inline">•</span>
                        <p>© 2026 Comestro Academy. All rights reserved.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href={typeof route === 'function' ? route('courses.index') : '/courses'} className="hover:text-slate-900 dark:hover:text-white transition">Courses</Link>
                        <a href="/#live" className="hover:text-slate-900 dark:hover:text-white transition">Live Classes</a>
                        <a href="/#projects" className="hover:text-slate-900 dark:hover:text-white transition">Projects</a>
                        <Link href={typeof route === 'function' ? route('certificates.verify') : '/verify-certificate'} className="hover:text-slate-900 dark:hover:text-white transition">Verify Certificate</Link>
                        <Link href={typeof route === 'function' ? route('login') : '/login'} className="hover:text-slate-900 dark:hover:text-white transition">Log in</Link>
                    </div>
                </div>
            </footer>

            {/* Mobile Dock */}
            <MobileAppDock
                auth={auth}
                activeTab=""
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        </div>
    );
}
