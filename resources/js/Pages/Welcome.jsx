import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThreeLaptopCanvas from '@/Components/Three/ThreeLaptopCanvas';
import ThreeDynamicBackground from '@/Components/Three/ThreeDynamicBackground';
import MobileAppDock from '@/Components/MobileAppDock';
import SwappableCourseCards, { COURSES_DATA } from '@/Components/SwappableCourseCards';
import {
    Terminal,
    ArrowRight,
    Users,
    Clock,
    Layers,
    GitBranch,
    Star,
    BookOpen,
    Compass,
    Video,
    MessageSquare,
    Sparkles,
    Menu,
    X,
    Sun,
    Moon
} from 'lucide-react';

export default function Welcome({ auth }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
        }
        return 'dark';
    });
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('java');
    const [activeCourse, setActiveCourse] = useState(COURSES_DATA[0]);
    const [activeCourseIndex, setActiveCourseIndex] = useState(0);

    const handleCourseSelect = (course, idx) => {
        setActiveCourse(course);
        setActiveCourseIndex(idx);
    };

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

    const PROJECTS = [
        {
            title: 'Distributed E-Commerce Engine',
            stack: 'Java 21 · Spring Boot 3 · Kafka · React',
            type: 'Enterprise Microservices',
            commits: 64,
            stars: '1.4k',
            code: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping("/checkout")
    public ResponseEntity<Receipt> checkout(@RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderSaga.process(req));
    }
}`,
        },
        {
            title: 'Real-Time Collaboration IDE',
            stack: 'React 19 · Node.js · WebSockets · Redis',
            type: 'High Concurrency',
            commits: 48,
            stars: '1.1k',
            code: `wss.on('connection', (client) => {
    client.on('message', async (delta) => {
        await redisPub.publish('editor_events', delta);
    });
});`,
        },
    ];

    const INSTRUCTORS = [
        {
            name: 'Rahul Sharma',
            role: 'Senior Backend Engineer',
            exp: '8+ Years Exp · Ex-Tech Lead',
            tech: 'Java, Spring Boot, Kafka',
            rating: '4.95',
        },
        {
            name: 'Ananya Verma',
            role: 'Staff Frontend Architect',
            exp: '7+ Years Exp · UI Architect',
            tech: 'React, TypeScript, Next.js',
            rating: '4.98',
        },
        {
            name: 'Vikramaditya Das',
            role: 'Principal Cloud & AI Architect',
            exp: '11+ Years Exp · Principal SRE',
            tech: 'Kubernetes, Python, LLMs',
            rating: '4.94',
        },
    ];

    return (
        <div className={`min-h-screen transition-colors duration-200 pb-16 lg:pb-0 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'
        }`}>
            <Head title="Comestro Academy | From Hello World to Production" />

            {/* Subtle Minimal Background */}
            <ThreeDynamicBackground theme={theme} />

            {/* 1. Clean Minimal Navigation Bar */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all pt-safe ${
                scrolled
                    ? isDark
                        ? 'border-b border-slate-800 bg-[#090d16]/90 backdrop-blur-md'
                        : 'border-b border-slate-200 bg-white/95 backdrop-blur-md'
                    : 'border-b border-transparent bg-transparent'
            }`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10 py-3.5">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo dark={isDark} />
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
                        <Link
                            href={route('courses.index')}
                            className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}
                        >
                            Courses
                        </Link>
                        <a
                            href="#live"
                            className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}
                        >
                            Live Classes
                        </a>
                        <a
                            href="#projects"
                            className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}
                        >
                            Projects
                        </a>
                        <a
                            href="#mentors"
                            className={isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}
                        >
                            Instructors
                        </a>
                    </nav>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Clean Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`rounded-lg border p-1.5 transition ${
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
                                    href={route('dashboard')}
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 text-xs font-mono font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-slate-900 dark:bg-white px-3.5 py-1.5 text-xs font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition"
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
                            className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 lg:hidden"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className={`border-b px-4 py-4 lg:hidden ${
                        isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
                    }`}>
                        <div className="flex flex-col space-y-3 text-sm">
                            <Link
                                href={route('courses.index')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="font-medium text-blue-600 dark:text-blue-400"
                            >
                                All Courses
                            </Link>
                            <a href="#live" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Live Classes
                            </a>
                            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Projects
                            </a>
                            <a href="#mentors" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300">
                                Instructors
                            </a>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 text-center text-xs font-semibold"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* 2. Hero Section */}
            <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-visible">
                <div className="mx-auto max-w-5xl px-6 sm:px-8 text-center space-y-6">
                   

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        From Hello World <br className="hidden sm:inline" />
                        to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">Production</span>.
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Learn enterprise backend microservices, full-stack architectures, cloud DevOps, and AI engineering through structured curriculums, interactive live classes, and real capstone projects.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <a
                            href="#courses"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 py-3 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-lg shadow-blue-500/10"
                        >
                            <span>Explore Top Engineering Courses</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>

                        <Link
                            href={route('courses.index')}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            <span>All Courses</span>
                        </Link>
                    </div>

                    {/* Trust metrics */}
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-10 sm:gap-16 text-xs font-mono text-slate-500">
                        <div>
                            <span className="font-bold text-slate-900 dark:text-white text-lg">10,000+</span>
                            <span className="block text-[11px] text-slate-500">Learners</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:border-slate-800" />
                        <div>
                            <span className="font-bold text-slate-900 dark:text-white text-lg">50+</span>
                            <span className="block text-[11px] text-slate-500">Courses</span>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:border-slate-800" />
                        <div>
                            <span className="font-bold text-slate-900 dark:text-white text-lg">4.9/5</span>
                            <span className="block text-[11px] text-slate-500">Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Section: Top Engineering Courses (Small Laptop Opposite of Title, Full Width Cards) */}
            <section id="courses" className="relative pt-16 pb-24 border-t border-slate-200 dark:border-slate-800">
                {/* Header Row: Title on Left, Prominent Laptop Opposite on Right */}
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Title Column */}
                        <div className="lg:col-span-6 space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>// OUR COURSES</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Top Engineering Courses
                            </h2>

                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                                Production-grade engineering curriculums designed by industry veterans. Click any card below to swap courses and inspect live architecture on the workstation opposite.
                            </p>

                            {/* Active Workstation Indicator */}
                            <div className="pt-1 flex items-center gap-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 text-xs font-mono">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-slate-500 dark:text-slate-400">Workstation:</span>
                                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[240px] sm:max-w-md">
                                        {activeCourse?.title}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Opposite of Title: Prominent 3D MacBook Air Workstation */}
                        <div className="lg:col-span-6 flex items-center justify-center lg:justify-end w-full">
                            <div className="w-full max-w-xl lg:max-w-2xl h-[300px] sm:h-[350px] lg:h-[390px] xl:h-[420px] relative overflow-hidden">
                                <ThreeLaptopCanvas
                                    theme={theme}
                                    activeCourse={activeCourse}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width of Screen: 5 Course Cards in ONE Row */}
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <SwappableCourseCards
                        onSelectCourse={handleCourseSelect}
                        activeCourseIndex={activeCourseIndex}
                        theme={theme}
                    />
                </div>
            </section>

            {/* 4. Live Masterclasses */}
            <section id="live" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-4">
                            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-600">
                                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                <span>LIVE MASTERCLASSES</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                Learn Directly in Real Time.
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                Watch senior practitioners write code, debug production errors, and answer questions on screen. Every session is archived in 1080p with source code repositories.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-medium hover:bg-slate-800 transition"
                                >
                                    <span>Join Upcoming Cohort →</span>
                                </Link>
                            </div>
                        </div>

                        {/* Minimal Classroom Preview */}
                        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden text-xs font-mono">
                            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                                    <span className="font-semibold text-slate-900 dark:text-white">Spring Boot 3 & Kafka Session</span>
                                </div>
                                <span className="text-slate-500">128 engineers learning</span>
                            </div>
                            <div className="p-4 bg-slate-950 text-slate-300 leading-relaxed overflow-x-auto">
                                <p className="text-slate-500">// Live Stream Code Snippet</p>
                                <p><span className="text-purple-400">@Service</span></p>
                                <p><span className="text-purple-400">public class</span> <span className="text-amber-300">PaymentService</span> &#123;</p>
                                <p className="pl-4">@Transactional</p>
                                <p className="pl-4">public Receipt process(PaymentPayload p) &#123;</p>
                                <p className="pl-8 text-slate-400">return ledger.recordTransaction(p);</p>
                                <p className="pl-4">&#125;</p>
                                <p>&#125;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Production Capstone Projects */}
            <section id="projects" className="py-20 border-t border-slate-200 dark:border-slate-800">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                    <div className="mb-10 max-w-xl">
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mb-1">
                            // PORTFOLIO
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            Production Capstones
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Graduate with working, deployed software systems for your engineering portfolio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROJECTS.map((proj) => (
                            <div
                                key={proj.title}
                                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
                            >
                                <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{proj.title}</span>
                                    <span className="text-[11px] text-slate-500">{proj.type}</span>
                                </div>

                                <div className="p-4 bg-slate-950 text-slate-300 font-mono text-xs code-scrollbar overflow-x-auto">
                                    <pre><code>{proj.code}</code></pre>
                                </div>

                                <div className="p-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                                    <span className="text-slate-500">{proj.stack}</span>
                                    <Link
                                        href={route('register')}
                                        className="font-medium text-slate-900 dark:text-white hover:underline"
                                    >
                                        Inspect →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Instructors */}
            <section id="mentors" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                    <div className="mb-10 max-w-xl">
                        <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mb-1">
                            // PRACTITIONERS
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            Senior Mentors
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Learn from practitioners who design enterprise systems daily.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {INSTRUCTORS.map((inst) => (
                            <div
                                key={inst.name}
                                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm"
                            >
                                <h3 className="font-bold text-slate-900 dark:text-white">{inst.name}</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{inst.role}</p>
                                <p className="text-xs text-slate-500 mt-2">{inst.exp}</p>
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                                    <span>{inst.tech}</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{inst.rating} ★</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Clean Minimal CTA */}
            <section className="py-20 border-t border-slate-200 dark:border-slate-800 text-center">
                <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-10 space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Start Building Today.
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Join cohorts designed for real software engineering careers.
                    </p>
                    <div className="pt-2">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                        >
                            <span>Enroll in Next Cohort →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 8. Minimalist Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-10 text-xs text-slate-500">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ApplicationLogo dark={isDark} imgClassName="h-7 w-auto" />
                        <span className="text-slate-400 hidden sm:inline">•</span>
                        <p>© 2026 Comestro Academy. All rights reserved.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href={route('courses.index')} className="hover:text-slate-900 dark:hover:text-white">Courses</Link>
                        <a href="#live" className="hover:text-slate-900 dark:hover:text-white">Live Classes</a>
                        <a href="#projects" className="hover:text-slate-900 dark:hover:text-white">Projects</a>
                        <Link href={route('login')} className="hover:text-slate-900 dark:hover:text-white">Log in</Link>
                    </div>
                </div>
            </footer>

            {/* Mobile Dock */}
            <MobileAppDock
                auth={auth}
                activeTab="home"
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        </div>
    );
}
