import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    Terminal,
    Code2,
    Play,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Users,
    Clock,
    Laptop,
    Layers,
    Server,
    Shield,
    Flame,
    GitBranch,
    Star,
    ExternalLink,
    ChevronRight,
    Send,
    Video,
    MessageSquare,
    BookOpen,
    Compass,
    Cpu,
    Database,
    Zap,
    HelpCircle,
    Check,
    Menu,
    X
} from 'lucide-react';

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTerminalTab, setActiveTerminalTab] = useState('terminal');
    const [selectedTech, setSelectedTech] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const LEARNING_PATHS = [
        {
            title: 'Java Backend Developer',
            level: 'Beginner to Advanced',
            duration: '14 Weeks',
            modules: 16,
            projects: 6,
            flow: ['Java', 'OOP', 'SQL', 'Spring Boot', 'REST API', 'Docker', 'AWS'],
            description: 'Master core Java, enterprise architectures with Spring Boot, microservices, relational databases, and cloud deployments.',
            badge: 'High Demand',
        },
        {
            title: 'Full Stack Developer',
            level: 'Beginner to Pro',
            duration: '18 Weeks',
            modules: 20,
            projects: 8,
            flow: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database', 'Deployment'],
            description: 'Build complete end-to-end web applications with React 19, modern state machines, resilient APIs, and CI/CD pipelines.',
            badge: 'Most Popular',
        },
        {
            title: 'Python Developer',
            level: 'Beginner Friendly',
            duration: '12 Weeks',
            modules: 14,
            projects: 5,
            flow: ['Python', 'OOP', 'SQL', 'Django/FastAPI', 'APIs', 'Projects'],
            description: 'Learn idiomatic Python, build asynchronous APIs with FastAPI, automate workflows, and write high-throughput web backends.',
            badge: 'Fast Track',
        },
        {
            title: 'AI / ML Developer',
            level: 'Intermediate',
            duration: '16 Weeks',
            modules: 18,
            projects: 6,
            flow: ['Python', 'NumPy', 'Pandas', 'ML', 'Deep Learning', 'AI Projects'],
            description: 'Develop intelligent systems, generative AI integrations, LLM pipelines with LangChain, and production vector search models.',
            badge: 'Cutting Edge',
        },
    ];

    const TECHNOLOGIES = [
        { name: 'Java', role: 'Backend & Enterprise', courses: 12, projects: 8, icon: '☕' },
        { name: 'Python', role: 'Backend, AI & Automation', courses: 14, projects: 9, icon: '🐍' },
        { name: 'JavaScript', role: 'Modern Web Engineering', courses: 16, projects: 12, icon: '⚡' },
        { name: 'React', role: 'Frontend & Reactive UI', courses: 10, projects: 7, icon: '⚛️' },
        { name: 'Node.js', role: 'Event-Driven Backends', courses: 8, projects: 6, icon: '🟢' },
        { name: 'Spring Boot', role: 'Enterprise Microservices', courses: 9, projects: 7, icon: '🍃' },
        { name: 'SQL', role: 'Relational Database Design', courses: 7, projects: 5, icon: '🗄️' },
        { name: 'Git', role: 'Version Control & Workflows', courses: 5, projects: 4, icon: '🌿' },
        { name: 'Docker', role: 'Containerization & DevOps', courses: 6, projects: 5, icon: '🐳' },
        { name: 'AWS', role: 'Cloud Infrastructure & SRE', courses: 8, projects: 6, icon: '☁️' },
        { name: 'AI / ML', role: 'Applied Models & LLMs', courses: 11, projects: 8, icon: '🧠' },
    ];

    const PROJECTS = [
        {
            title: 'E-Commerce Platform',
            stack: 'Java · Spring Boot · MySQL · React',
            difficulty: 'Production Level',
            skills: ['Microservices', 'Stripe Payments', 'Transactional Outbox', 'Distributed Cache'],
            stats: { commits: 48, prs: 14, stars: '1.2k' },
            snippet: `@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping("/checkout")
    public ResponseEntity<OrderReceipt> checkout(@RequestBody OrderPayload payload) {
        return ResponseEntity.ok(orderService.processIdempotentOrder(payload));
    }
}`,
        },
        {
            title: 'Real-Time Chat Application',
            stack: 'React · Node.js · WebSocket',
            difficulty: 'Intermediate',
            skills: ['WebSockets', 'Redis Pub/Sub', 'Presence Tracking', 'End-to-End Encryption'],
            stats: { commits: 36, prs: 9, stars: '890' },
            snippet: `const socket = new WebSocketServer({ port: 8080 });
socket.on('connection', (client, req) => {
    client.on('message', async (data) => {
        await redisPub.publish('chat_stream', data);
    });
});`,
        },
        {
            title: 'Banking Management System',
            stack: 'Java · Spring Boot · PostgreSQL',
            difficulty: 'Advanced',
            skills: ['ACID Transactions', 'Double-Entry Ledger', 'Audit Trail', 'JWT & OAuth2'],
            stats: { commits: 54, prs: 16, stars: '1.5k' },
            snippet: `@Transactional(isolation = Isolation.SERIALIZABLE)
public void transferFunds(Account from, Account to, BigDecimal amount) {
    ledger.recordDebit(from, amount);
    ledger.recordCredit(to, amount);
}`,
        },
        {
            title: 'AI-Powered Application',
            stack: 'Python · AI · FastAPI',
            difficulty: 'Cutting-Edge',
            skills: ['RAG Pipeline', 'Vector Embeddings', 'LLM Function Calling', 'Streaming SSE'],
            stats: { commits: 32, prs: 8, stars: '2.1k' },
            snippet: `@app.post("/v1/agent/query")
async def run_query(request: PromptRequest):
    docs = await vector_store.similarity_search(request.query, k=5)
    return StreamingResponse(llm.stream_answer(request.query, docs))`,
        },
    ];

    const PHILOSOPHY_STEPS = [
        {
            phase: 'LEARN',
            title: 'Live Classes & Structured Lessons',
            desc: 'Interactive lectures with staff engineers break down tough concepts from the ground up.',
            command: 'comestro learn --live',
        },
        {
            phase: 'CODE',
            title: 'Direct Code Practice',
            desc: 'Write code immediately following lessons. Solidify syntax and core logic without friction.',
            command: 'comestro sandbox --init',
        },
        {
            phase: 'PRACTICE',
            title: 'Algorithmic & Design Labs',
            desc: 'Solve edge cases, concurrency hurdles, and performance bottlenecks with automated testing.',
            command: 'comestro test --suite dsa',
        },
        {
            phase: 'BUILD',
            title: 'Real-World Production Projects',
            desc: 'Architect full applications that resemble real enterprise systems, not toy todo apps.',
            command: 'comestro project --create',
        },
        {
            phase: 'DEPLOY',
            title: 'Deploy to Cloud & Production',
            desc: 'Containerize, set up CI/CD, and push your work live with real domains and monitoring.',
            command: 'git push origin main && deploy --prod',
        },
    ];

    const INSTRUCTORS = [
        {
            name: 'Rahul Sharma',
            role: 'Senior Backend Engineer',
            experience: '8+ Years Experience',
            tech: 'Java · Spring Boot · AWS',
            students: '2,400+ Students',
            rating: '4.9',
            avatarText: 'RS',
        },
        {
            name: 'Ananya Verma',
            role: 'Staff Frontend Architect',
            experience: '7+ Years Experience',
            tech: 'React · TypeScript · Next.js',
            students: '1,900+ Students',
            rating: '4.95',
            avatarText: 'AV',
        },
        {
            name: 'Vikramaditya Das',
            role: 'Principal Cloud & DevOps',
            experience: '10+ Years Experience',
            tech: 'Kubernetes · Docker · AWS',
            students: '3,100+ Students',
            rating: '4.9',
            avatarText: 'VD',
        },
    ];

    const WHY_CARDS = [
        {
            icon: Laptop,
            title: 'Live Coding',
            desc: 'Learn directly from instructors writing code and resolving errors on screen in real time.',
        },
        {
            icon: Layers,
            title: 'Real Projects',
            desc: 'Build scalable applications with databases, authentication, and external APIs for your portfolio.',
        },
        {
            icon: HelpCircle,
            title: 'Doubt Support',
            desc: 'Get unstuck fast. Senior teaching assistants and mentors review your code and resolve roadblocks.',
        },
        {
            icon: Compass,
            title: 'Structured Paths',
            desc: 'Follow a clear roadmap from fundamental programming syntax to production-level architecture.',
        },
        {
            icon: Code2,
            title: 'Interactive Practice',
            desc: 'Turn theoretical concepts into muscle memory through hundreds of practical coding exercises.',
        },
        {
            icon: Clock,
            title: 'Learn at Your Pace',
            desc: 'Attend live classes or watch high-definition recordings with code timestamps at your convenience.',
        },
    ];

    const TESTIMONIALS = [
        {
            quote: 'Comestro changed the way I learned backend development. I stopped just watching tutorials and actually started building production systems.',
            author: 'Aman K.',
            role: 'Java Backend Student',
            stars: 5,
        },
        {
            quote: 'The live coding sessions with Rahul were a game changer. Seeing an experienced engineer debug distributed transactions in real time is invaluable.',
            author: 'Sneha Roy',
            role: 'Full Stack Engineer',
            stars: 5,
        },
        {
            quote: 'The projects I built here were the exact reason I stood out in technical rounds. The interviewers were impressed by the architecture depth.',
            author: 'Tanmay Patel',
            role: 'Software Developer',
            stars: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-900 font-sans antialiased">
            <Head title="Comestro Academy | From Hello World to Production" />

            {/* 1. Navigation Bar (Light Theme) */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
                    scrolled
                        ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm shadow-slate-200/50'
                        : 'border-b border-transparent bg-transparent'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <Link href="/" className="group flex items-center">
                        <ApplicationLogo />
                    </Link>

                    {/* Nav Links Desktop */}
                    <nav className="hidden items-center gap-7 lg:flex">
                        <Link href={route('courses.index')} className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
                            Courses
                        </Link>
                        <a href="#paths" className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            Learning Paths
                        </a>
                        <a href="#live" className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            Live Classes
                        </a>
                        <a href="#projects" className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            Projects
                        </a>
                        <a href="#tech" className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            Technologies
                        </a>
                        <a href="#instructors" className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600">
                            Instructors
                        </a>
                    </nav>

                    {/* Right CTAs */}
                    <div className="hidden items-center gap-3 sm:flex">
                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50 px-4 py-2 text-xs font-mono font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                            >
                                <Terminal className="h-3.5 w-3.5" />
                                <span>Dashboard →</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-3.5 py-2 text-xs font-mono font-medium text-slate-700 transition hover:text-slate-950"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 hover:border-emerald-700"
                                >
                                    <span>Get Started →</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden shadow-lg">
                        <div className="flex flex-col space-y-3 font-mono text-sm">
                            <Link
                                href={route('courses.index')}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-emerald-600 font-semibold hover:text-emerald-700"
                            >
                                // All Courses
                            </Link>
                            <a
                                href="#paths"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:text-emerald-600"
                            >
                                // Learning Paths
                            </a>
                            <a
                                href="#live"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:text-emerald-600"
                            >
                                // Live Classes
                            </a>
                            <a
                                href="#projects"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:text-emerald-600"
                            >
                                // Projects
                            </a>
                            <a
                                href="#tech"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:text-emerald-600"
                            >
                                // Technologies
                            </a>
                            <a
                                href="#instructors"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-700 hover:text-emerald-600"
                            >
                                // Instructors
                            </a>
                            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-xs font-mono font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-xs font-mono font-bold text-white shadow-sm hover:bg-emerald-700"
                                >
                                    Get Started →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* 2. Hero Section (Light Theme) */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-grid-pattern">
                {/* Glow backdrop */}
                <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
                        {/* Left column: Messaging */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-600/25 bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                                <span>Cohorts for 2026 Developer Careers Now Open</span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
                                From{' '}
                                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                    `Hello World`
                                </span>{' '}
                                to Production.
                            </h1>

                            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                Learn to code through <span className="text-slate-900 font-semibold">live classes</span>, hands-on practice, and <span className="text-slate-900 font-semibold">real-world projects</span>. Built by developers, for developers.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-sm font-mono font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30"
                                >
                                    <span>Start Coding →</span>
                                </Link>

                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-mono font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
                                >
                                    <span>Explore Courses</span>
                                </Link>
                            </div>

                            {/* Trust Statement */}
                            <div className="pt-3 flex items-center gap-3 text-xs font-mono text-slate-600">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>Live + Recorded · Hands-on Projects · Expert Mentorship</span>
                            </div>
                        </div>

                        {/* Right column: Hero Visual — High-contrast Code Editor / Terminal */}
                        <div className="lg:col-span-6">
                            <div className="relative rounded-xl border border-slate-700/60 bg-[#0d131f] shadow-2xl shadow-slate-900/20 ring-1 ring-black/5 overflow-hidden">
                                {/* Editor Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0a0f19] px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                        <span className="ml-2 font-mono text-xs text-slate-400">
                                            comestro-terminal
                                        </span>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex items-center gap-1 font-mono text-xs">
                                        <button
                                            onClick={() => setActiveTerminalTab('terminal')}
                                            className={`px-2.5 py-1 rounded transition ${
                                                activeTerminalTab === 'terminal'
                                                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                                                    : 'text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            terminal.sh
                                        </button>
                                        <button
                                            onClick={() => setActiveTerminalTab('code')}
                                            className={`px-2.5 py-1 rounded transition ${
                                                activeTerminalTab === 'code'
                                                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                                                    : 'text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            Course.java
                                        </button>
                                    </div>
                                </div>

                                {/* Editor Body */}
                                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed min-h-[320px] bg-[#070b14]/95 code-scrollbar overflow-x-auto text-slate-200">
                                    {activeTerminalTab === 'terminal' ? (
                                        <div className="space-y-2">
                                            <p className="text-slate-500"># Welcome to Comestro Academy Engine v2.6</p>
                                            <div className="flex items-center gap-2 text-slate-200">
                                                <span className="text-emerald-400 font-bold">$</span>
                                                <span className="text-emerald-300 font-semibold">whoami</span>
                                            </div>
                                            <p className="text-slate-300 pl-4">aspiring_developer</p>

                                            <div className="flex items-center gap-2 text-slate-200 pt-2">
                                                <span className="text-emerald-400 font-bold">$</span>
                                                <span className="text-emerald-300 font-semibold">comestro start</span>
                                            </div>
                                            <p className="text-slate-400 pl-4">Initializing learning environment...</p>

                                            <div className="space-y-1 pl-4 pt-1 text-slate-300">
                                                <p className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span> Programming fundamentals
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span> Data Structures & Algorithms
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span> Backend Development
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span> Full Stack Development
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span> Real-world Projects
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-200 pt-2">
                                                <span className="text-emerald-400 font-bold">$</span>
                                                <span className="text-emerald-300 font-semibold">build-future</span>
                                            </div>
                                            <div className="pl-4">
                                                <div className="text-emerald-400 tracking-tight">
                                                    ████████████████████ 100%
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 pt-2 text-emerald-400 font-bold">
                                                <span>&gt; Environment ready</span>
                                                <span className="inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1 text-slate-300">
                                            <p><span className="text-purple-400">package</span> com.comestro.academy;</p>
                                            <br />
                                            <p><span className="text-purple-400">public class</span> <span className="text-amber-300">Developer</span> &#123;</p>
                                            <p className="pl-4"><span className="text-purple-400">private final</span> String status = <span className="text-emerald-300">"Production Ready"</span>;</p>
                                            <p className="pl-4"><span className="text-purple-400">private int</span> projectsShipped = <span className="text-amber-300">8</span>;</p>
                                            <br />
                                            <p className="pl-4"><span className="text-purple-400">public void</span> <span className="text-blue-300">buildFuture</span>() &#123;</p>
                                            <p className="pl-8 text-slate-400">// Learn Live. Build Real Systems.</p>
                                            <p className="pl-8">System.out.println(<span className="text-emerald-300">"Hello, World! -&gt; Production"</span>);</p>
                                            <p className="pl-4">&#125;</p>
                                            <p>&#125;</p>
                                        </div>
                                    )}
                                </div>

                                {/* Status bar */}
                                <div className="flex items-center justify-between border-t border-slate-800 bg-[#080d17] px-4 py-1.5 font-mono text-[11px] text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <span className="text-slate-300">ONLINE</span>
                                        </span>
                                        <span>UTF-8</span>
                                    </div>
                                    <span className="text-emerald-400">ready for input_</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Learning Philosophy Section (Light Theme) */}
            <section className="py-20 border-t border-slate-200 bg-white relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Learning Philosophy</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Don't Just Watch Code. Build With It.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            The conventional tutorial cycle keeps developers stuck. Comestro Academy structures your journey like an engineering pipeline.
                        </p>
                    </div>

                    {/* Developer Pipeline Flow */}
                    <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {PHILOSOPHY_STEPS.map((step, idx) => (
                            <div
                                key={step.phase}
                                onClick={() => setActiveStep(idx)}
                                className={`cursor-pointer rounded-xl border p-5 transition-all ${
                                    activeStep === idx
                                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                        0{idx + 1}
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-500 uppercase">
                                        Step
                                    </span>
                                </div>

                                <h3 className="font-mono text-base font-bold text-slate-900 mb-2">
                                    {step.phase}
                                </h3>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                    {step.title}
                                </p>

                                <div className="rounded bg-slate-900 border border-slate-800 p-2 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                                    <code>$ {step.command}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Live Learning Section (Light Theme) */}
            <section id="live" className="py-20 border-t border-slate-200 bg-slate-50 relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span>Real-Time Interactive Engineering</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mt-2">
                                Learn Live. Build Together.
                            </h2>
                            <p className="text-slate-600 text-sm mt-1 max-w-xl">
                                Join interactive live coding masterclasses. Code along with senior engineers and ask questions in real time.
                            </p>
                        </div>

                        <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 shadow-sm rounded-lg p-3 max-w-sm">
                            <span className="text-emerald-700 font-bold">Can't attend live?</span> Every class is recorded in HD and available inside your course dashboard with code repositories.
                        </div>
                    </div>

                    {/* Realistic Mock Live Classroom Interface */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                        {/* Classroom Header */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 gap-3">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 font-mono text-xs font-bold text-red-700 border border-red-200">
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                    <span>LIVE CLASS</span>
                                </span>
                                <h3 className="font-mono text-sm font-semibold text-slate-900">
                                    Spring Boot REST API: Building a production-ready API
                                </h3>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>42:15</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>128 students learning</span>
                                </span>
                            </div>
                        </div>

                        {/* Classroom Body Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Main Stage: Video + Code Editor (8 cols) */}
                            <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
                                {/* Top: Instructor Screen */}
                                <div className="bg-slate-100/70 p-4 flex items-center justify-between border-b border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-mono text-emerald-800 font-bold text-sm">
                                            RS
                                        </div>
                                        <div>
                                            <div className="font-mono text-xs font-bold text-slate-900 flex items-center gap-2">
                                                <span>Rahul Sharma</span>
                                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                                    Instructor
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-mono">
                                                Ex-Staff Engineer · Sharing Screen & Terminal
                                            </p>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>Stream: 1080p 60fps</span>
                                    </div>
                                </div>

                                {/* Code Editor Area (High contrast dark code box) */}
                                <div className="p-5 font-mono text-xs sm:text-sm bg-[#090d16] code-scrollbar overflow-x-auto flex-1 min-h-[300px] text-slate-200">
                                    <div className="text-slate-500 mb-2">// Active Editor: OrderService.java</div>
                                    <div className="space-y-1">
                                        <p><span className="text-purple-400">@Service</span></p>
                                        <p><span className="text-purple-400">public class</span> <span className="text-amber-300">OrderService</span> &#123;</p>
                                        <p className="pl-4"><span className="text-purple-400">private final</span> OrderRepository orderRepo;</p>
                                        <p className="pl-4"><span className="text-purple-400">private final</span> KafkaTemplate&lt;String, OrderEvent&gt; kafkaTemplate;</p>
                                        <br />
                                        <p className="pl-4"><span className="text-purple-400">@Transactional</span></p>
                                        <p className="pl-4"><span className="text-purple-400">public</span> Order <span className="text-blue-300">createOrder</span>(OrderRequest req) &#123;</p>
                                        <p className="pl-8 text-slate-400">// Validating payload idempotency key...</p>
                                        <p className="pl-8">Order order = orderRepo.save(Order.from(req));</p>
                                        <p className="pl-8">kafkaTemplate.send(<span className="text-emerald-300">"orders.created"</span>, <span className="text-purple-400">new</span> OrderEvent(order.getId()));</p>
                                        <p className="pl-8"><span className="text-purple-400">return</span> order;</p>
                                        <p className="pl-4">&#125;</p>
                                        <p>&#125;</p>
                                    </div>
                                </div>

                                {/* Class Action bar */}
                                <div className="border-t border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                                    <span className="font-mono text-xs text-slate-600">
                                        Lesson 8 of 14 · Microservices Module
                                    </span>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                                    >
                                        <span>Join Live Class →</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Chat Panel (4 cols - Light Theme) */}
                            <div className="lg:col-span-4 bg-white flex flex-col justify-between">
                                <div className="border-b border-slate-200 p-3 font-mono text-xs font-bold text-slate-800 flex items-center justify-between bg-slate-50/50">
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Live Student Chat</span>
                                    </span>
                                    <span className="text-[11px] text-emerald-600 font-semibold">● Active</span>
                                </div>

                                {/* Chat Messages */}
                                <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[300px] lg:max-h-[360px] code-scrollbar bg-slate-50/40">
                                    <div className="rounded-lg bg-white border border-slate-200 p-2.5 shadow-xs">
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span className="text-emerald-700 font-bold">@aditya_m</span>
                                            <span>2m ago</span>
                                        </div>
                                        <p className="text-slate-700 mt-1">
                                            How do we handle JWT token expiration on the client during long sessions?
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-2.5 shadow-xs">
                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="text-emerald-800 font-bold">@rahul_instructor</span>
                                            <span>1m ago</span>
                                        </div>
                                        <p className="text-slate-800 mt-1">
                                            We use refresh token rotation with an HttpOnly cookie. We'll code that in the next 10 mins!
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-white border border-slate-200 p-2.5 shadow-xs">
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span className="text-blue-700 font-bold">@kavita_dev</span>
                                            <span>Just now</span>
                                        </div>
                                        <p className="text-slate-700 mt-1">
                                            Great explanation on the @Transactional rollback semantics!
                                        </p>
                                    </div>
                                </div>

                                {/* Chat Input mockup */}
                                <div className="p-3 border-t border-slate-200 bg-slate-50">
                                    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-400 shadow-xs">
                                        <input
                                            type="text"
                                            placeholder="Ask a technical question..."
                                            className="bg-transparent border-0 outline-none w-full text-xs text-slate-800"
                                            disabled
                                        />
                                        <Send className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Learning Paths Section (Light Theme) */}
            <section id="paths" className="py-20 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Career-Oriented Roadmaps</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Choose Your Developer Path.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Instead of disconnected tutorials, follow industry-vetted curriculums that take you from syntax to architecture.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {LEARNING_PATHS.map((path) => (
                            <div
                                key={path.title}
                                className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 shadow-sm transition hover:border-emerald-500/50 hover:bg-white hover:shadow-md flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono text-xs text-emerald-700 font-semibold">
                                            {path.level}
                                        </span>
                                        <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                                            {path.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 font-mono group-hover:text-emerald-600 transition">
                                        {path.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                        {path.description}
                                    </p>

                                    {/* Tech Flow Breadcrumb */}
                                    <div className="mt-5 p-3 rounded-lg bg-white border border-slate-200 font-mono text-xs overflow-x-auto code-scrollbar">
                                        <div className="flex items-center gap-1.5 text-slate-700 whitespace-nowrap">
                                            {path.flow.map((tech, idx) => (
                                                <span key={tech} className="flex items-center gap-1.5">
                                                    <span className="text-emerald-700 font-semibold">{tech}</span>
                                                    {idx < path.flow.length - 1 && (
                                                        <span className="text-slate-400">→</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-xs text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>{path.modules} Modules</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Layers className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>{path.projects} Projects</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-emerald-600" />
                                            <span>{path.duration}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-7 pt-4 border-t border-slate-200 flex items-center justify-between">
                                    <span className="font-mono text-xs text-slate-500">
                                        Live Classes + Recorded Access
                                    </span>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 group-hover:text-emerald-600 transition"
                                    >
                                        <span>Explore Path</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Technology Stack Section (Light Theme) */}
            <section id="tech" className="py-20 border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Modern Developer Tooling</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Learn the Technologies That Build the Web.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Hover over any stack badge to inspect curriculum depth, live courses, and real capstone projects.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {TECHNOLOGIES.map((tech) => (
                            <div
                                key={tech.name}
                                onMouseEnter={() => setSelectedTech(tech)}
                                onMouseLeave={() => setSelectedTech(null)}
                                className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md cursor-pointer text-center"
                            >
                                <div className="text-2xl mb-2">{tech.icon}</div>
                                <h3 className="font-mono text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
                                    {tech.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">
                                    {tech.role}
                                </p>

                                {/* Tooltip popover on hover */}
                                {selectedTech?.name === tech.name && (
                                    <div className="absolute left-1/2 -top-16 -translate-x-1/2 z-20 w-44 rounded-lg border border-slate-800 bg-slate-950 p-2.5 shadow-xl font-mono text-[11px] text-left text-white">
                                        <div className="font-bold text-emerald-400">{tech.name}</div>
                                        <div className="text-slate-400">{tech.role}</div>
                                        <div className="text-slate-300 mt-1">
                                            {tech.courses} Courses · {tech.projects} Projects
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Real-World Projects Section (Light Theme) */}
            <section id="projects" className="py-20 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Portfolio Proof</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Don't Finish With a Certificate.<br />
                            Finish With Something You Built.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Recruiters hire engineers who can demonstrate working software. Every student graduates with production-grade capstones.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {PROJECTS.map((proj) => (
                            <div
                                key={proj.title}
                                className="rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                {/* Top code preview window (high-contrast terminal look) */}
                                <div className="border-b border-slate-800 bg-[#080d17] p-3 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                                        <span className="font-mono text-xs text-slate-400 ml-1">
                                            {proj.title}.repo
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        {proj.difficulty}
                                    </span>
                                </div>

                                <div className="p-4 font-mono text-xs bg-[#090d16] code-scrollbar overflow-x-auto text-slate-200">
                                    <pre><code>{proj.snippet}</code></pre>
                                </div>

                                {/* Project details */}
                                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 font-mono">
                                            {proj.title}
                                        </h3>
                                        <p className="text-xs font-mono text-emerald-700 font-semibold mt-1">
                                            {proj.stack}
                                        </p>

                                        {/* Skills tags */}
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {proj.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="font-mono text-[11px] rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* GitHub-style indicators and button */}
                                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                                        <div className="flex items-center gap-4 font-mono text-xs text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <GitBranch className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>{proj.stats.commits} commits</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-amber-500" />
                                                <span>{proj.stats.stars}</span>
                                            </span>
                                        </div>

                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 hover:text-emerald-600 transition"
                                        >
                                            <span>View Project</span>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. "How Comestro Works" Section (Light Theme) */}
            <section className="py-20 border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Workflow</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            How Comestro Works
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { num: '01', title: 'Choose Your Path', desc: 'Select from Java, Full Stack, Python, or AI tracks based on your career ambitions.' },
                            { num: '02', title: 'Learn With Experts', desc: 'Attend interactive live coding sessions or catch up with indexed HD recordings.' },
                            { num: '03', title: 'Build Real Projects', desc: 'Write production code, solve architectural bugs, and get detailed PR reviews.' },
                            { num: '04', title: 'Become Job Ready', desc: 'Prepare with senior mock interviews, resume optimization, and referral networks.' },
                        ].map((step) => (
                            <div
                                key={step.num}
                                className="rounded-xl border border-slate-200 bg-white p-6 relative group hover:border-emerald-300 hover:shadow-sm transition"
                            >
                                <div className="text-3xl font-mono font-black text-emerald-600/30 group-hover:text-emerald-600 transition mb-3">
                                    {step.num}
                                </div>
                                <h3 className="font-mono text-base font-bold text-slate-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Instructor Section (Light Theme) */}
            <section id="instructors" className="py-20 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Practitioner-Led</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Learn From People Who Build.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Our instructors are active practitioners and tech leads who design and maintain production systems.
                        </p>
                    </div>

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {INSTRUCTORS.map((inst) => (
                            <div
                                key={inst.name}
                                className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 text-left shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center font-mono font-bold text-emerald-800">
                                        {inst.avatarText}
                                    </div>
                                    <div>
                                        <h3 className="font-mono text-base font-bold text-slate-900">
                                            {inst.name}
                                        </h3>
                                        <p className="text-xs text-emerald-700 font-mono font-semibold">
                                            {inst.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-2 font-mono text-xs text-slate-600 border-t border-slate-200 pt-4">
                                    <p className="text-slate-800 font-semibold">{inst.tech}</p>
                                    <p>{inst.experience}</p>
                                    <div className="flex items-center justify-between text-slate-600 pt-1">
                                        <span>{inst.students}</span>
                                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                                            <Star className="h-3 w-3 fill-current" />
                                            {inst.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                        >
                            <span>Meet Our Instructors →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 10. Student Progress Section (Dashboard Mockup - Light Theme) */}
            <section className="py-20 border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Learning Experience</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Designed Like a Modern Engineering Tool.
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            Track your coding streaks, module completion, code submissions, and live sessions in one integrated workspace.
                        </p>
                    </div>

                    {/* Dashboard Mockup */}
                    <div className="max-w-4xl mx-auto rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl font-mono">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span>Good evening</span>
                                    <span>👋</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Welcome back to your workspace.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                                    <Flame className="h-3.5 w-3.5 fill-current text-amber-500" />
                                    <span>12 Day Streak</span>
                                </span>
                                <span className="text-slate-600">24h Learning Time</span>
                                <span className="text-emerald-700 font-bold">18 Projects</span>
                            </div>
                        </div>

                        {/* Active Course Card */}
                        <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-5">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Continue Learning
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                <div>
                                    <h4 className="text-base font-bold text-slate-900">
                                        Java Backend Development
                                    </h4>
                                    <p className="text-xs text-emerald-700 font-semibold mt-1">
                                        Next: Spring Boot REST API (Module 13)
                                    </p>
                                </div>

                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                                >
                                    <span>Continue Learning →</span>
                                </Link>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-5">
                                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                                    <span>Progress: 78%</span>
                                    <span>12 / 15 modules completed</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                                    <div className="h-full rounded-full bg-emerald-600 w-[78%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 11. Why Comestro? (Light Theme) */}
            <section className="py-20 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Developer Value</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Why Comestro Academy?
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {WHY_CARDS.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <div
                                    key={card.title}
                                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 hover:border-slate-300 hover:bg-white hover:shadow-sm transition"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-mono text-base font-bold text-slate-900 mb-2">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 12. Student Testimonials (Light Theme) */}
            <section className="py-20 border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <span>// Student Feedback</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Trusted by Aspiring Engineers
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-slate-200 bg-white p-6 font-mono flex flex-col justify-between shadow-sm"
                            >
                                <div>
                                    <div className="flex gap-1 text-amber-400 mb-4">
                                        {[...Array(t.stars)].map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold text-slate-900">— {t.author}</p>
                                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 13. Statistics Section (Light Theme) */}
            <section className="py-16 border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
                        <div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">10K+</div>
                            <div className="text-xs text-emerald-700 font-semibold mt-1 uppercase tracking-wider">Students</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">50+</div>
                            <div className="text-xs text-emerald-700 font-semibold mt-1 uppercase tracking-wider">Courses</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">200+</div>
                            <div className="text-xs text-emerald-700 font-semibold mt-1 uppercase tracking-wider">Live Classes</div>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">100+</div>
                            <div className="text-xs text-emerald-700 font-semibold mt-1 uppercase tracking-wider">Projects</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 14. Final CTA (Light Theme) */}
            <section className="py-24 border-t border-slate-200 bg-gradient-to-b from-white to-emerald-50/50 relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 relative space-y-6">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Your IDE Is Waiting.
                    </h2>

                    <p className="text-lg text-slate-600 max-w-xl mx-auto font-sans">
                        Stop watching tutorials. Start building. Join live classes, receive expert code reviews, and ship portfolio-ready applications.
                    </p>

                    {/* High-contrast terminal block */}
                    <div className="max-w-sm mx-auto rounded-lg border border-slate-700/80 bg-[#090d16] p-4 font-mono text-xs text-left text-slate-300 shadow-xl">
                        <p className="text-slate-500">$ git init future</p>
                        <p className="text-slate-500">$ comestro learn</p>
                        <p className="text-slate-500">$ comestro build</p>
                        <p className="text-slate-500">$ comestro deploy</p>
                        <p className="text-emerald-400 pt-1">✓ Future initialized</p>
                    </div>

                    <div className="pt-2">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 font-mono text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg"
                        >
                            <span>Start Your Coding Journey →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 15. Footer (Light Theme) */}
            <footer className="border-t border-slate-200 bg-white py-14 font-mono text-xs text-slate-600">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Brand info */}
                        <div className="col-span-2 space-y-3">
                            <ApplicationLogo />
                            <p className="text-slate-600 mt-2 max-w-sm font-sans text-sm">
                                From `Hello World` to Production. Live coding, real projects, and career-ready developer skills.
                            </p>
                            <div className="pt-2 flex items-center gap-4 text-slate-600">
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
                                    GitHub
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
                                    LinkedIn
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
                                    YouTube
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition">
                                    Instagram
                                </a>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div className="space-y-2.5">
                            <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Platform</p>
                            <ul className="space-y-2">
                                <li><a href="#paths" className="hover:text-emerald-600 transition">Learning Paths</a></li>
                                <li><a href="#live" className="hover:text-emerald-600 transition">Live Classes</a></li>
                                <li><a href="#projects" className="hover:text-emerald-600 transition">Projects</a></li>
                                <li><a href="#tech" className="hover:text-emerald-600 transition">Technologies</a></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="space-y-2.5">
                            <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Company</p>
                            <ul className="space-y-2">
                                <li><a href="#instructors" className="hover:text-emerald-600 transition">Instructors</a></li>
                                <li><a href="#about" className="hover:text-emerald-600 transition">About</a></li>
                                <li><a href="#careers" className="hover:text-emerald-600 transition">Careers</a></li>
                                <li><a href="#contact" className="hover:text-emerald-600 transition">Contact</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-2.5">
                            <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Legal</p>
                            <ul className="space-y-2">
                                <li><a href="#privacy" className="hover:text-emerald-600 transition">Privacy Policy</a></li>
                                <li><a href="#terms" className="hover:text-emerald-600 transition">Terms & Conditions</a></li>
                                <li><a href="#refund" className="hover:text-emerald-600 transition">Refund Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
                        <p>© 2026 Comestro Academy. All rights reserved.</p>
                        <p className="text-slate-500">Built with Laravel, React & Inertia.js.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
