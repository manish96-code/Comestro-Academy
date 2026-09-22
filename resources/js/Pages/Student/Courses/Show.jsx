import axios from 'axios';
import ApplicationLogo from '@/Components/ApplicationLogo';
import StudentLayout from '@/Layouts/StudentLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    Clock,
    BookOpen,
    User,
    Check,
    ArrowRight,
    Star,
    Share2,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    Play,
    Globe,
    Sun,
    Moon,
    Menu,
    X,
    LayoutDashboard,
    Terminal,
    Code2,
    Layers,
    Smartphone,
    Award,
    Sparkles,
    CheckCircle2,
    Compass,
    FileText,
    Radio,
    Calendar,
    Ticket
} from 'lucide-react';

const getCourseImage = (c) => {
    if (c?.thumbnail && typeof c.thumbnail === 'string' && (c.thumbnail.startsWith('http') || c.thumbnail.startsWith('/'))) {
        return c.thumbnail;
    }
    if (c?.image) return c.image;
    const cat = (c?.category?.name || c?.category_slug || c?.category || '').toLowerCase();
    if (cat.includes('cloud') || cat.includes('devops')) return '/images/courses/course-devops.svg';
    if (cat.includes('ai') || cat.includes('python')) return '/images/courses/course-ai.svg';
    if (cat.includes('laravel') || cat.includes('web')) return '/images/courses/course-nextjs.svg';
    if (cat.includes('mobile') || cat.includes('flutter') || cat.includes('dart') || cat.includes('java')) return '/images/courses/course-java.svg';
    return '/images/courses/course-system-design.svg';
};

export default function CourseShow({ course, relatedCourses = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const isLiveCourse = course?.type === 'live';
    const availableBatches = useMemo(() => {
        if (Array.isArray(course?.batches) && course.batches.length > 0) {
            return course.batches.filter((b) => b.is_active !== false);
        }
        if (Array.isArray(course?.active_batches) && course.active_batches.length > 0) {
            return course.active_batches;
        }
        return [];
    }, [course]);

    const [selectedBatchId, setSelectedBatchId] = useState(
        availableBatches.length > 0 ? availableBatches[0].id : null
    );

    useEffect(() => {
        if (availableBatches.length > 0 && !selectedBatchId) {
            setSelectedBatchId(availableBatches[0].id);
        }
    }, [availableBatches, selectedBatchId]);

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    const isDark = !user && theme === 'dark';

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        if (!user) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
            }
            localStorage.setItem('theme', theme);
        }
    }, [theme, user]);

    const [enrolling, setEnrolling] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [openModules, setOpenModules] = useState({ 0: true, 1: true });
    const [openFaq, setOpenFaq] = useState({ 0: true });

    // Coupon states
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');

    const handleApplyCoupon = async (e) => {
        e?.preventDefault();
        if (!user) {
            toast.error('Please log in or create an account to apply discount coupons.');
            router.visit(route('login'));
            return;
        }

        const trimmed = couponCodeInput.trim().toUpperCase();
        if (!trimmed) {
            setCouponError('Please enter a coupon code.');
            return;
        }

        setApplyingCoupon(true);
        setCouponError('');

        try {
            const { data } = await axios.post(route('courses.apply-coupon', course.id), {
                code: trimmed,
            });

            if (data && data.valid) {
                setAppliedCoupon(data);
                toast.success(`Coupon '${data.coupon?.code || trimmed}' applied!`);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid or inapplicable coupon code.';
            setCouponError(msg);
            setAppliedCoupon(null);
            toast.error(msg);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCodeInput('');
        setCouponError('');
        toast('Coupon removed.', { icon: 'ℹ️' });
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const toggleModule = (index) => {
        setOpenModules((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const expandAllModules = (expand = true) => {
        const newMap = {};
        curriculumModules.forEach((_, idx) => {
            newMap[idx] = expand;
        });
        setOpenModules(newMap);
    };

    const toggleFaq = (idx) => {
        setOpenFaq((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    // Load Razorpay SDK
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleEnroll = async () => {
        if (!user) {
            toast.error('Please log in or create an account to enroll.');
            router.visit(route('login'));
            return;
        }

        if (isLiveCourse && availableBatches.length > 0 && !selectedBatchId) {
            toast.error('Please select your preferred live batch timing to proceed.');
            const batchEl = document.getElementById('batch-selection-section');
            if (batchEl) {
                batchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setEnrolling(true);

        try {
            const { data } = await axios.post(route('courses.payment.create-order', course.id), {
                batch_id: selectedBatchId,
                coupon_code: appliedCoupon ? appliedCoupon.coupon?.code : undefined,
            });

            if (data.free) {
                router.visit(data.redirect_url || route('student.courses.enrolled'));
                return;
            }

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error('Failed to load payment gateway. Please check your internet connection.');
                setEnrolling(false);
                return;
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: 'Comestro Academy',
                description: `Enrollment: ${data.course.title}`,
                image: data.course.thumbnail || '/favicon.ico',
                order_id: data.order_id,
                prefill: {
                    name: data.user.name || '',
                    email: data.user.email || '',
                    contact: data.user.phone || '',
                },
                notes: {
                    course_id: String(data.course.id),
                    user_id: String(user.id),
                    batch_id: String(selectedBatchId || ''),
                    coupon_code: String(appliedCoupon ? appliedCoupon.coupon?.code : ''),
                },
                theme: {
                    color: '#2563eb',
                },
                modal: {
                    ondismiss: () => {
                        setEnrolling(false);
                        toast('Payment cancelled.', { icon: 'ℹ️' });
                    },
                },
                handler: function (response) {
                    router.post(
                        route('courses.payment.verify', course.id),
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            batch_id: selectedBatchId,
                            coupon_code: appliedCoupon ? appliedCoupon.coupon?.code : undefined,
                        },
                        {
                            preserveScroll: true,
                            onStart: () => setEnrolling(true),
                            onFinish: () => setEnrolling(false),
                        }
                    );
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setEnrolling(false);
                toast.error(response.error?.description || 'Payment transaction failed.');
            });
            rzp.open();
        } catch (error) {
            setEnrolling(false);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to initialize enrollment.';
            toast.error(errorMsg);
        }
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Course link copied to clipboard');
        } else {
            toast.success('Course link: ' + window.location.href);
        }
    };

    const instructor = course.instructor;
    const instructorUser = instructor?.user;
    const isEnrolled = course.is_enrolled;
    const instructorName = instructorUser?.name || 'Sadique Hussain';
    const isSadique = (instructorName || '').toLowerCase().includes('sadique');
    const instructorPhoto = instructorUser?.profile_pic || (isSadique ? '/images/instructor.jpg' : null);
    const instructorInitials = instructorName
        ? instructorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'FA';

    const discountPercent =
        course.price && course.discount_price && Number(course.price) > Number(course.discount_price)
            ? Math.round(((Number(course.price) - Number(course.discount_price)) / Number(course.price)) * 100)
            : null;

    const formattedPrice = Number(course.price) === 0
        ? 'Free'
        : course.discount_price && Number(course.discount_price) > 0
        ? `₹${Number(course.discount_price).toLocaleString('en-IN')}`
        : `₹${Number(course.price).toLocaleString('en-IN')}`;

    const formattedOriginalPrice =
        course.discount_price && Number(course.discount_price) > 0 && Number(course.price) > Number(course.discount_price)
            ? `₹${Number(course.price).toLocaleString('en-IN')}`
            : null;

    const curriculumModules = useMemo(() => {
        if (Array.isArray(course.curriculum) && course.curriculum.length > 0) {
            return course.curriculum;
        }
        if (Array.isArray(course.modules) && course.modules.length > 0) {
            return course.modules;
        }
        return [];
    }, [course]);

    const parseTopics = (moduleOrSubtitle) => {
        if (!moduleOrSubtitle) return [];
        if (typeof moduleOrSubtitle === 'object' && !Array.isArray(moduleOrSubtitle)) {
            if (Array.isArray(moduleOrSubtitle.lessons) && moduleOrSubtitle.lessons.length > 0) {
                return moduleOrSubtitle.lessons.map((l) => l.title);
            }
            if (Array.isArray(moduleOrSubtitle.topics) && moduleOrSubtitle.topics.length > 0) {
                return moduleOrSubtitle.topics.map((s) => String(s).trim()).filter(Boolean);
            }
            if (Array.isArray(moduleOrSubtitle.subtitles) && moduleOrSubtitle.subtitles.length > 0) {
                return moduleOrSubtitle.subtitles.map((s) => String(s).trim()).filter(Boolean);
            }
            if (Array.isArray(moduleOrSubtitle.subtitle) && moduleOrSubtitle.subtitle.length > 0) {
                return moduleOrSubtitle.subtitle.map((s) => String(s).trim()).filter(Boolean);
            }
            return parseTopics(moduleOrSubtitle.subtitle);
        }
        if (Array.isArray(moduleOrSubtitle)) {
            return moduleOrSubtitle.map((s) => String(s).trim()).filter(Boolean);
        }
        if (typeof moduleOrSubtitle !== 'string') return [];
        if (moduleOrSubtitle.includes('\n')) {
            return moduleOrSubtitle.split('\n').map((s) => s.trim()).filter(Boolean);
        }
        if (moduleOrSubtitle.includes(',')) {
            return moduleOrSubtitle.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [moduleOrSubtitle.trim()];
    };

    const techDetails = useMemo(() => {
        const title = (course.title || '').toLowerCase();

        if (title.includes('laravel') || title.includes('php')) {
            return {
                command: 'php artisan serve',
                badge: 'Laravel 12 & Inertia',
                snippet: "Route::get('/courses', [CourseController::class, 'index']);",
                fps: '2.4ms latency'
            };
        }
        if (title.includes('flutter') || title.includes('mobile') || title.includes('dart')) {
            return {
                command: 'flutter run -d ios',
                badge: 'Flutter 3 & Riverpod',
                snippet: 'final authState = ref.watch(authNotifierProvider);',
                fps: '60 FPS'
            };
        }
        if (title.includes('react') || title.includes('next') || title.includes('typescript')) {
            return {
                command: 'npm run dev',
                badge: 'Next.js 15 & React 19',
                snippet: 'export default async function Page() { const data = await fetch(); }',
                fps: 'Fast Refresh'
            };
        }
        if (title.includes('docker') || title.includes('devops') || title.includes('kubernetes') || title.includes('cloud') || title.includes('aws')) {
            return {
                command: 'docker compose up -d --build',
                badge: 'Kubernetes & AWS',
                snippet: 'kubectl apply -f k8s/production-cluster.yaml',
                fps: 'Zero Downtime'
            };
        }
        if (title.includes('python') || title.includes('django') || title.includes('ai') || title.includes('fastapi')) {
            return {
                command: 'python manage.py runserver',
                badge: 'Python & Django REST',
                snippet: 'class CourseViewSet(viewsets.ModelViewSet): queryset = Course.objects.all()',
                fps: 'Async I/O'
            };
        }
        if (title.includes('design') || title.includes('ui/ux') || title.includes('figma')) {
            return {
                command: 'figma --open design-tokens',
                badge: 'Design Systems & UI',
                snippet: 'export const tokens = { primary: "#2563eb", surface: "#0c101c" };',
                fps: 'Vector 120Hz'
            };
        }
        if (title.includes('go') || title.includes('golang')) {
            return {
                command: 'go run cmd/api/main.go',
                badge: 'Golang & gRPC',
                snippet: 'func (s *Server) GetCourse(ctx context.Context, req *pb.Request) (*pb.Response, error)',
                fps: 'Sub-millisecond'
            };
        }
        return {
            command: 'npm run dev',
            badge: course.category?.name || 'Production Stack',
            snippet: 'export default function App() { return <CourseCohort />; }',
            fps: 'Production Ready'
        };
    }, [course]);

    // Capstone projects loaded dynamically from course.capstones
    const capstoneProjects = useMemo(() => {
        if (course.capstones && Array.isArray(course.capstones) && course.capstones.length > 0) {
            return course.capstones.filter((c) => c && (c.title || c.desc));
        }
        return [];
    }, [course.capstones]);

    const faqs = useMemo(() => {
        const title = (course.title || '').toLowerCase();
        const isMobile = title.includes('flutter') || title.includes('mobile');
        const isCloud = title.includes('docker') || title.includes('kubernetes') || title.includes('devops') || title.includes('aws');
        const isDesign = title.includes('ui/ux') || title.includes('figma') || title.includes('design');

        return [
            {
                q: `What prerequisites are required before joining this ${course.title} track?`,
                a: 'Basic familiarity with computer science fundamentals or modern programming concepts. We start from clean architectural foundations and progressively guide you through advanced production patterns.'
            },
            {
                q: isMobile
                    ? 'Do I need a MacBook to build iOS applications in this course?'
                    : isCloud
                    ? 'Do I need a paid cloud account (AWS/GCP) to follow the labs?'
                    : isDesign
                    ? 'Do I need a paid Figma subscription for this course?'
                    : 'What hardware or operating system environment is needed?',
                a: isMobile
                    ? 'You can write and test all course code on Windows, Linux, or macOS. For compiling signed iOS binaries, we teach automated cloud CI/CD pipelines (GitHub Actions) without needing a physical Mac.'
                    : isCloud
                    ? 'All labs are engineered to run within the AWS Free Tier and local Docker environments so you will not incur unexpected cloud expenses.'
                    : isDesign
                    ? 'All exercises and UI libraries work seamlessly with free Figma starter accounts. We provide complete downloadable component kits and design tokens.'
                    : 'A standard laptop running Windows, macOS, or Linux with at least 8GB RAM is completely sufficient. All tools and packages used are free and open-source.'
            },
            {
                q: 'Are live lectures and modules recorded for lifetime review?',
                a: 'Yes. Every lecture, module, and architecture debug session is recorded and uploaded to your student portal alongside downloadable slide decks, starter boilerplates, and Git commits.'
            },
            {
                q: 'How does the 7-day money-back guarantee work?',
                a: 'If within 7 days of enrolling you feel this track is not the right fit for your career, send us a one-line request for an immediate, full refund with zero questions asked.'
            }
        ];
    }, [course]);

    const publicHeader = (
        <header className={`sticky top-0 left-0 right-0 z-50 transition-all ${
            isDark
                ? 'border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md'
                : 'border-b border-slate-200/80 bg-white/95 backdrop-blur-md'
        }`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
                {/* Brand */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center">
                        <ApplicationLogo dark={isDark} />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href={route('courses.index')}
                            className={isDark ? 'text-white' : 'text-blue-600 font-semibold'}
                        >
                            All Courses
                        </Link>
                        <a
                            href="#curriculum"
                            className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                        >
                            Curriculum
                        </a>
                        {capstoneProjects.length > 0 && (
                            <a
                                href="#capstones"
                                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                            >
                                Capstones
                            </a>
                        )}
                        <a
                            href="#instructor"
                            className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                        >
                            Mentor
                        </a>
                        <a
                            href="#faq"
                            className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                        >
                            FAQ
                        </a>
                    </nav>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    {/* Clean Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`rounded-lg border p-1.5 transition cursor-pointer ${
                            isDark
                                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-medium transition ${
                                    isDark
                                        ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs'
                                }`}
                            >
                                <LayoutDashboard className="h-3.5 w-3.5 text-blue-500" />
                                <span>Dashboard →</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className={`px-3 py-1.5 text-xs font-medium transition ${
                                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
                                    }`}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
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
                        className="rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 lg:hidden text-slate-600 dark:text-slate-400"
                        aria-label="Toggle Navigation"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div className={`border-b px-4 py-4 lg:hidden shadow-lg space-y-2.5 ${
                    isDark ? 'border-slate-800 bg-[#0c101c]' : 'border-slate-200 bg-white'
                }`}>
                    <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm py-1 text-slate-700 dark:text-slate-300"
                    >
                        Home
                    </Link>
                    <Link
                        href={route('courses.index')}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm font-medium py-1 text-blue-600 dark:text-sky-400"
                    >
                        All Courses
                    </Link>
                    <a
                        href="#curriculum"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm py-1 text-slate-700 dark:text-slate-300"
                    >
                        Curriculum
                    </a>
                    {capstoneProjects.length > 0 && (
                        <a
                            href="#capstones"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm py-1 text-slate-700 dark:text-slate-300"
                        >
                            Capstones
                        </a>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-blue-600 text-white text-center py-2 text-xs font-medium"
                            >
                                Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 text-center py-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-blue-600 text-white text-center py-2 text-xs font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );

    const publicFooter = (
        <footer className={`border-t py-10 text-xs text-slate-500 ${
            isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
        }`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <ApplicationLogo dark={isDark} imgClassName="h-7 w-auto" />
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <p>© 2026 Comestro Academy. All rights reserved.</p>
                </div>
                <div className="flex items-center gap-6">
                    <Link href={route('courses.index')} className="hover:text-slate-900 dark:hover:text-white transition">
                        Courses
                    </Link>
                    <a href="#curriculum" className="hover:text-slate-900 dark:hover:text-white transition">
                        Curriculum
                    </a>
                    {capstoneProjects.length > 0 && (
                        <a href="#capstones" className="hover:text-slate-900 dark:hover:text-white transition">
                            Capstones
                        </a>
                    )}
                    <Link href={route('login')} className="hover:text-slate-900 dark:hover:text-white transition">
                        Log in
                    </Link>
                </div>
            </div>
        </footer>
    );

    const courseDetailContent = (
        <>

            {/* 2. Compact Hero Section: Narrative Left + Workstation Right */}
            <section className={`relative py-6 sm:py-8 border-b overflow-hidden transition-colors ${
                isDark
                    ? 'border-slate-800 bg-[#090d16] text-white'
                    : 'border-slate-200 bg-white text-slate-900'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        {/* Left Column: Course Identity, Value Prop, Pricing & CTA */}
                        <div className="lg:col-span-7 space-y-3.5">
                            {/* Breadcrumbs */}
                            <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <Link href="/" className={isDark ? 'hover:text-white transition' : 'hover:text-slate-900 transition'}>Home</Link>
                                <ChevronRight className={`h-3 w-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                                <Link href={route('courses.index')} className={isDark ? 'hover:text-white transition' : 'hover:text-slate-900 transition'}>Courses</Link>
                                {course.category && (
                                    <>
                                        <ChevronRight className={`h-3 w-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                                        <span className={isDark ? 'text-blue-400' : 'text-blue-600 font-medium'}>{course.category.name}</span>
                                    </>
                                )}
                            </div>

                            {/* Clean Category Kicker */}
                            <div className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                <span>{course.category?.name || 'Mobile App Development'}</span>
                                <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
                                <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'} font-normal normal-case tracking-normal`}>
                                    {course.type === 'live' ? 'Live Interactive Cohort' : 'Self-Paced Recorded'}
                                </span>
                                {isEnrolled && (
                                    <>
                                        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
                                        <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-semibold normal-case tracking-normal`}>Enrolled</span>
                                    </>
                                )}
                            </div>

                            {/* Headline */}
                            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                {course.title}
                            </h1>

                            {/* Subtitle */}
                            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl font-normal ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                                {course.subtitle || course.description}
                            </p>

                            {/* Linear Metadata */}
                            <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-2.5 text-xs pt-0.5 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>4.9</span>
                                    <span className={`font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>({course.enrollments_count ? course.enrollments_count + 120 : '180+'} reviews)</span>
                                </div>
                                <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>•</span>
                                <span>{course.enrollments_count ? course.enrollments_count + 450 : '840+'} Engineers</span>
                                <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>•</span>
                                <span>
                                    Faculty: <strong className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{instructorName}</strong>
                                    {instructor?.designation && <span className={isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}> ({instructor.designation})</span>}
                                </span>
                                {course.duration && (
                                    <>
                                        <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>•</span>
                                        <span>{course.duration}</span>
                                    </>
                                )}
                            </div>

                            {/* Inline Checkout & Action Block */}
                            <div className={`pt-3 border-t space-y-3 ${
                                isDark ? 'border-slate-800' : 'border-slate-200'
                            }`}>
                                <div>
                                    <div className={`text-[10px] uppercase tracking-wider font-semibold ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        Cohort Tuition
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        {appliedCoupon ? (
                                            <>
                                                <span className={`text-2xl font-bold tracking-tight ${
                                                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                                                }`}>
                                                    {appliedCoupon.payable_amount <= 0 ? 'FREE' : appliedCoupon.formatted_payable}
                                                </span>
                                                <span className={`text-xs line-through ${
                                                    isDark ? 'text-slate-500' : 'text-slate-400'
                                                }`}>
                                                    {formattedPrice}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className={`text-2xl font-bold tracking-tight ${
                                                    isDark ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                    {formattedPrice}
                                                </span>
                                                {formattedOriginalPrice && (
                                                    <span className={`text-xs line-through ${
                                                        isDark ? 'text-slate-500' : 'text-slate-400'
                                                    }`}>
                                                        {formattedOriginalPrice}
                                                    </span>
                                                )}
                                                {discountPercent && (
                                                    <span className={`text-xs font-semibold ${
                                                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                                                    }`}>
                                                        {discountPercent}% off
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Coupon Code Application Area */}
                                {!isEnrolled && (
                                    <div className="space-y-1.5 max-w-sm">
                                        {appliedCoupon ? (
                                            <div className="flex items-center justify-between p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                                                <div className="flex items-center gap-1.5 font-mono text-emerald-800 dark:text-emerald-300">
                                                    <Ticket className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <span className="font-bold tracking-wider">{appliedCoupon.coupon?.code}</span>
                                                    <span className="text-[11px] font-sans font-semibold">(-{appliedCoupon.formatted_discount})</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5">
                                                    <input
                                                        type="text"
                                                        value={couponCodeInput}
                                                        onChange={(e) => {
                                                            setCouponCodeInput(e.target.value.toUpperCase());
                                                            if (couponError) setCouponError('');
                                                        }}
                                                        placeholder="Have a coupon code?"
                                                        className={`w-full py-1.5 px-3 text-xs font-mono uppercase font-medium rounded-md border transition shadow-2xs ${
                                                            couponError
                                                                ? 'border-rose-400 focus:border-rose-500'
                                                                : isDark
                                                                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500'
                                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
                                                        }`}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={applyingCoupon || !couponCodeInput.trim()}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 disabled:opacity-50 transition shrink-0 cursor-pointer"
                                                    >
                                                        {applyingCoupon ? 'Checking...' : 'Apply'}
                                                    </button>
                                                </form>
                                                {couponError && (
                                                    <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium mt-1">
                                                        {couponError}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Enrolled Batch Info (if already enrolled) */}
                                {isEnrolled && course.enrolled_batch && (
                                    <div className={`p-2.5 rounded-lg border flex items-center gap-2 max-w-md ${
                                        isDark ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    }`}>
                                        <Clock className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-semibold block">Enrolled Live Batch: {course.enrolled_batch.time_slot}</span>
                                            <span className="text-[11px] opacity-80">{course.enrolled_batch.batch_name} {course.enrolled_batch.days ? `• ${course.enrolled_batch.days}` : ''}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Live Cohort Batch Selection */}
                                {!isEnrolled && isLiveCourse && availableBatches.length > 0 && (
                                    <div id="batch-selection-section" className="space-y-1 max-w-sm">
                                        <label
                                            htmlFor="batch-select"
                                            className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                                isDark ? 'text-sky-400' : 'text-slate-700'
                                            }`}
                                        >
                                            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
                                            Select Batch Timing *
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="batch-select"
                                                value={selectedBatchId || ''}
                                                onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                                                className={`w-full text-xs font-semibold rounded-lg border py-2 pl-3 pr-8 transition cursor-pointer appearance-none ${
                                                    isDark
                                                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                                                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                                                }`}
                                            >
                                                {availableBatches.map((b) => (
                                                    <option
                                                        key={b.id}
                                                        value={b.id}
                                                        className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white py-1"
                                                    >
                                                        {b.batch_name ? `${b.batch_name}: ` : ''}{b.time_slot}{b.days ? ` (${b.days})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2.5 pt-0.5">
                                    {isEnrolled ? (
                                        <Link
                                            href={route('student.courses.learn', course.id)}
                                            className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" />
                                            <span>Enter Classroom →</span>
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleEnroll}
                                            disabled={enrolling}
                                            className="px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
                                        >
                                            <span>{enrolling ? 'Connecting Gateway...' : 'Enroll in This Cohort'}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className={`p-2.5 rounded-md border transition ${
                                            isDark
                                                ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                                                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                        title="Share course link"
                                    >
                                        <Share2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Quiet Guarantee Text */}
                            <div className={`flex items-center gap-1.5 text-[11px] pt-0.5 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>7-Day money-back guarantee • Certificate included • Lifetime access</span>
                            </div>
                        </div>

                        {/* Right Column: Workstation Video Preview Card */}
                        <div className="lg:col-span-5">
                            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950">
                                {/* Window Header Bar */}
                                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-rose-500/80" />
                                        <div className="h-2 w-2 rounded-full bg-amber-500/80" />
                                        <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                                        <Terminal className="h-3 w-3 text-blue-400" />
                                        <span>{techDetails.command}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                        {techDetails.fps}
                                    </div>
                                </div>

                                {/* Preview Media Box */}
                                <div className="relative h-44 sm:h-52 bg-slate-950 flex items-center justify-center overflow-hidden group">
                                    <img
                                        src={getCourseImage(course)}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/15 transition" />

                                    {/* Play Button Trigger */}
                                    <button
                                        type="button"
                                        onClick={() => setPreviewModalOpen(true)}
                                        className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer focus:outline-hidden"
                                    >
                                        <div className="h-11 w-11 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition duration-150">
                                            <Play className="h-5 w-5 fill-current ml-0.5" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-white tracking-wider uppercase drop-shadow-sm">
                                            Watch Preview
                                        </span>
                                    </button>
                                </div>

                                {/* Code Snippet Bar */}
                                <div className="px-3.5 py-2 bg-slate-950 border-t border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                                    <span className="text-sky-400 truncate">
                                        {techDetails.snippet}
                                    </span>
                                    <span className="text-slate-500 shrink-0 ml-2">
                                        {techDetails.badge}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Unified Lower Content Canvas (Clean light surface in portal/light mode) */}
            <div className={`transition-colors ${isDark ? 'bg-[#090d16]' : 'bg-slate-50/70'}`}>
                {/* 3. Core Outcomes Section */}
                <section className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mb-4">
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-1">
                            Core Highlights
                        </div>
                        <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            Engineered for Real-World Production
                        </h2>
                        <p className={`text-xs mt-1 leading-relaxed ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            {course.subtitle || 'Master the exact patterns, architecture, and production practices used by leading engineering teams.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {(course.course_includes && course.course_includes.length > 0
                            ? course.course_includes
                            : [
                                'Production-ready architecture & design patterns',
                                'Interactive cohort workshops & real-time debug sessions',
                                'Downloadable starter boilerplates & slide decks',
                                '1-on-1 mentor code reviews & feedback',
                                'Official Certificate of Completion',
                                'Full lifetime access to classroom recordings'
                            ]
                        ).map((item, idx) => {
                            const iconMap = [Code2, Layers, Globe, Award, Sparkles, CheckCircle2];
                            const IconComp = iconMap[idx % iconMap.length];
                            return (
                                <div
                                    key={idx}
                                    className={`p-3.5 rounded-lg border ${
                                        isDark
                                            ? 'bg-[#131929] border-slate-800 text-white'
                                            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                                    } space-y-1.5`}
                                >
                                    <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                        <IconComp className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-semibold">
                                        {item}
                                    </h3>
                                    <p className={`text-[11px] leading-relaxed ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        Comprehensive training module designed to deliver hands-on, portfolio-ready capabilities.
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. Curriculum Roadmap Section */}
            <section id="curriculum" className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
                        <div>
                            <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-0.5">
                                Step-by-Step Curriculum
                            </div>
                            <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                Engineering Roadmap
                            </h2>
                            <p className={`text-xs mt-0.5 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                {curriculumModules.length} Modules · Progressive depth from core fundamentals to production deployment
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => expandAllModules(true)}
                                className="text-xs font-medium text-slate-500 hover:text-blue-500 transition"
                            >
                                Expand all
                            </button>
                            <span className="text-slate-400 text-xs">•</span>
                            <button
                                type="button"
                                onClick={() => expandAllModules(false)}
                                className="text-xs font-medium text-slate-500 hover:text-blue-500 transition"
                            >
                                Collapse all
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-w-3xl">
                        {curriculumModules.map((module, mIdx) => {
                            const isOpen = Boolean(openModules[mIdx]);
                            const rawTitle = typeof module === 'string' ? module : module.title || `Module ${mIdx + 1}`;
                            const cleanTitle = rawTitle.replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim();
                            const topics = parseTopics(module);

                            return (
                                <div
                                    key={mIdx}
                                    className={`rounded-lg border transition-all overflow-hidden ${
                                        isDark
                                            ? 'border-slate-800 bg-[#0c101c]'
                                            : 'border-slate-200 bg-white shadow-2xs'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleModule(mIdx)}
                                        className={`w-full flex items-center justify-between p-3 sm:p-3.5 text-left transition ${
                                            isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                                            <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
                                                0{mIdx + 1}.
                                            </span>
                                            <h3 className={`text-xs sm:text-sm font-semibold truncate ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {cleanTitle}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2.5 shrink-0">
                                            <span className="text-xs text-slate-400 hidden sm:inline">
                                                {topics.length > 0 ? `${topics.length} Lessons` : 'Live Workshop'}
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                                    isOpen ? 'rotate-180 text-blue-500' : ''
                                                }`}
                                            />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className={`p-3 sm:p-3.5 pt-0 border-t space-y-1 mt-1 ${
                                            isDark ? 'border-slate-800/60' : 'border-slate-100'
                                        }`}>
                                            {topics.length > 0 ? (
                                                topics.map((topic, tIdx) => (
                                                    <div
                                                        key={tIdx}
                                                        className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md text-xs ${
                                                            isDark
                                                                ? 'text-slate-300 hover:bg-slate-800/40'
                                                                : 'text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                                                        <span className="truncate">{topic}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-slate-500 italic py-1 px-2.5">
                                                    Interactive live coding, repository architecture, and code review assignments.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Production Capstones */}
            {capstoneProjects.length > 0 && (
                <section id="capstones" className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mb-4">
                            <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-0.5">
                                Portfolio Capstones
                            </div>
                            <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                {capstoneProjects.length} Production {capstoneProjects.length === 1 ? 'App' : 'Apps'} You Will Build & Deploy
                            </h2>
                            <p className={`text-xs mt-0.5 ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                                Real codebase deliverables you can proudly showcase to engineering managers and hiring teams.
                            </p>
                        </div>

                        <div className={`grid grid-cols-1 ${capstoneProjects.length === 1 ? 'max-w-xl' : capstoneProjects.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3.5`}>
                            {capstoneProjects.map((p, pIdx) => (
                                <div
                                    key={pIdx}
                                    className={`rounded-lg border p-4 flex flex-col justify-between space-y-3 min-w-0 overflow-hidden ${
                                        isDark
                                            ? 'bg-[#131929] border-slate-800 text-white'
                                            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                                    }`}
                                >
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="text-[10px] font-mono text-blue-500 font-semibold uppercase tracking-wider">
                                            Capstone 0{pIdx + 1}
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-bold break-words [overflow-wrap:anywhere]">
                                            {p.title}
                                        </h3>
                                        {p.desc && (
                                            <p className={`text-xs leading-relaxed break-words [overflow-wrap:anywhere] ${
                                                isDark ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                                {p.desc}
                                            </p>
                                        )}
                                    </div>

                                    {p.stack && (
                                        <div className={`pt-2.5 border-t min-w-0 ${
                                            isDark ? 'border-slate-800' : 'border-slate-100'
                                        }`}>
                                            <span className="block text-[11px] font-mono text-slate-500 break-words [overflow-wrap:anywhere]">
                                                {p.stack}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6. Senior Faculty & Mentorship Section */}
            <section id="instructor" className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-0.5">
                            Faculty Leadership
                        </div>
                        <h2 className={`text-lg sm:text-xl font-bold tracking-tight mb-4 ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            Meet Your Instructor
                        </h2>

                        <div className={`rounded-lg border p-4 sm:p-5 ${
                            isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                        }`}>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                {/* Instructor Photo */}
                                <div className={`relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border shrink-0 flex items-center justify-center ${
                                    isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
                                }`}>
                                    {instructorPhoto ? (
                                        <img
                                            src={instructorPhoto}
                                            alt={instructorName}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-bold font-mono text-xl">
                                            {instructorInitials}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 flex-1">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-mono text-blue-500 font-semibold tracking-wider uppercase">
                                                {isSadique ? 'Official Open Source Contributor' : (instructor?.qualification || 'Senior Faculty Mentor')}
                                            </span>
                                            <span className="text-slate-400 hidden sm:inline">•</span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {isSadique ? 'Laravel Framework (530M+ Downloads)' : (instructor?.expertise || 'Production Engineering Expert')}
                                            </span>
                                        </div>
                                        <h3 className={`text-base sm:text-lg font-bold ${
                                            isDark ? 'text-white' : 'text-slate-900'
                                        }`}>
                                            {instructorName}
                                        </h3>
                                        <p className="text-xs font-medium text-blue-600 dark:text-sky-400">
                                            {instructor?.designation || 'Lead Engineering Faculty & Technical Architect'}
                                            {instructor?.experience_years ? ` · ${instructor.experience_years}+ Years Experience` : ''}
                                        </p>
                                    </div>

                                    {/* Credibility Stats Strip */}
                                    <div className={`grid grid-cols-3 gap-2 py-2 border-y ${
                                        isDark ? 'border-slate-800' : 'border-slate-200'
                                    }`}>
                                        <div>
                                            <div className={`text-sm sm:text-base font-bold font-mono ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {instructor?.experience_years ? `${instructor.experience_years}+ Yrs` : '7+ Yrs'}
                                            </div>
                                            <div className="text-[10px] text-slate-500">Industry Exp</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm sm:text-base font-bold font-mono ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {instructor?.courses_count ? `${instructor.courses_count} Tracks` : '4+ Tracks'}
                                            </div>
                                            <div className="text-[10px] text-slate-500">Courses</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm sm:text-base font-bold font-mono ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                4.99 ★
                                            </div>
                                            <div className="text-[10px] text-slate-500">Faculty Rating</div>
                                        </div>
                                    </div>

                                    {/* About Instructor */}
                                    <div className={`text-xs leading-relaxed font-normal ${
                                        isDark ? 'text-slate-300' : 'text-slate-600'
                                    }`}>
                                        {instructor?.bio ? (
                                            <p>{instructor.bio}</p>
                                        ) : (
                                            <p>
                                                Experienced technology lead and educator dedicated to bridging the gap between computer science theory and production-scale engineering through hands-on mentorship.
                                            </p>
                                        )}
                                    </div>

                                    {/* Mentorship Highlights */}
                                    <div className={`pt-1 text-[11px] flex flex-wrap items-center gap-x-3 gap-y-1 ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                            <span>Weekly code reviews</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                            <span>Real production repos</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                            <span>Direct mentorship</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ Section */}
            <section id="faq" className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-0.5">
                            Got Questions?
                        </div>
                        <h2 className={`text-lg sm:text-xl font-bold tracking-tight mb-4 ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-2">
                            {faqs.map((f, fIdx) => {
                                const isOpen = Boolean(openFaq[fIdx]);
                                return (
                                    <div
                                        key={fIdx}
                                        className={`rounded-lg border transition overflow-hidden ${
                                            isDark ? 'border-slate-800 bg-[#0c101c]' : 'border-slate-200 bg-white shadow-2xs'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(fIdx)}
                                            className={`w-full flex items-center justify-between p-3 sm:p-3.5 text-left transition ${
                                                isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className={`text-xs sm:text-sm font-semibold pr-4 ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {f.q}
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                                                    isOpen ? 'rotate-180 text-blue-500' : ''
                                                }`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className={`px-3.5 pb-3 pt-1 border-t text-xs leading-relaxed ${
                                                isDark
                                                    ? 'border-slate-800/60 text-slate-300'
                                                    : 'border-slate-100 text-slate-600'
                                            }`}>
                                                {f.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. Conversion CTA Section */}
            <section className="py-6 sm:py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className={`rounded-lg border p-6 sm:p-8 text-center space-y-3 ${
                        isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                    }`}>
                        <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400">
                            Enrollment Open
                        </div>
                        <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                            Ready to Master Production Engineering?
                        </h2>
                        <p className={`text-xs sm:text-sm max-w-lg mx-auto leading-relaxed ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            Join cohorts designed for real software engineering careers with hands-on capstones, verified certificates, and mentorship.
                        </p>

                        {!isEnrolled && isLiveCourse && availableBatches.length > 0 && (
                            <div className="flex items-center justify-center gap-2 text-xs pt-0.5">
                                <span className="text-slate-500">Selected Live Batch:</span>
                                <span className="font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
                                    {availableBatches.find((b) => b.id === selectedBatchId)?.time_slot || availableBatches[0]?.time_slot}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-2.5 pt-1">
                            {isEnrolled ? (
                                <Link
                                    href={route('student.courses.learn', course.id)}
                                    className="px-6 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Go to Classroom →</span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="px-6 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
                                >
                                    <span>{enrolling ? 'Connecting Gateway...' : `Enroll Now for ${formattedPrice}`}</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span>7-Day 100% money-back guarantee • No questions asked</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Related Courses Section */}
            {relatedCourses && relatedCourses.length > 0 && (
                <section className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400 mb-0.5">
                                    Complementary Tracks
                                </div>
                                <h2 className={`text-base sm:text-lg font-bold tracking-tight ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                    Related Engineering Courses
                                </h2>
                            </div>
                            <Link
                                href={route('courses.index')}
                                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <span>View all tracks</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                            {relatedCourses.map((relCourse) => (
                                <Link
                                    key={relCourse.id}
                                    href={route('courses.show', relCourse.slug || relCourse.id)}
                                    className={`group rounded-lg border transition duration-150 flex flex-col justify-between overflow-hidden ${
                                        isDark
                                            ? 'border-slate-800 bg-[#131929] hover:border-slate-700'
                                            : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                                    }`}
                                >
                                    <div className="relative w-full h-32 overflow-hidden bg-slate-950 border-b border-slate-100">
                                        <img
                                            src={getCourseImage(relCourse)}
                                            alt={relCourse.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2.5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                                                {relCourse.category?.name || 'Engineering'}
                                            </p>
                                            <h3 className={`text-xs sm:text-sm font-bold line-clamp-2 transition-colors leading-snug ${
                                                isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
                                            }`}>
                                                {relCourse.title}
                                            </h3>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                            <span>{relCourse.duration || '8 Weeks'}</span>
                                            <div className={`flex items-center gap-1 font-semibold ${
                                                isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                <span>
                                                    {Number(relCourse.price) === 0
                                                        ? 'Free'
                                                        : relCourse.discount_price
                                                        ? `₹${Number(relCourse.discount_price).toLocaleString('en-IN')}`
                                                        : `₹${Number(relCourse.price).toLocaleString('en-IN')}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            </div>


            {/* 10. Floating Mobile Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t px-4 py-3 flex items-center justify-between shadow-2xl backdrop-blur-md ${
                isDark ? 'border-slate-800 bg-[#090d16]/95' : 'border-slate-200 bg-white/95'
            }`}>
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tuition</span>
                        {!isEnrolled && isLiveCourse && availableBatches.length > 0 && (
                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {availableBatches.find((b) => b.id === selectedBatchId)?.time_slot || availableBatches[0]?.time_slot}
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {formattedPrice}
                        </span>
                        {formattedOriginalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                                {formattedOriginalPrice}
                            </span>
                        )}
                    </div>
                </div>

                {isEnrolled ? (
                    <Link
                        href={route('student.courses.learn', course.id)}
                        className="px-5 py-2.5 rounded-md bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
                    >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Classroom</span>
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60"
                    >
                        <span>{enrolling ? 'Connecting...' : 'Enroll Now'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>



            {/* Video Preview Modal */}
            {previewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className={`relative w-full max-w-2xl rounded-lg border shadow-2xl p-6 space-y-4 ${
                        isDark ? 'bg-[#0c101c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                        <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                                    Curriculum Preview
                                </span>
                                <h3 className="text-base font-bold truncate max-w-md">
                                    {course.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewModalOpen(false)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="aspect-video w-full rounded-md bg-slate-950 overflow-hidden relative flex items-center justify-center">
                            <img
                                src={getCourseImage(course)}
                                alt={course.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">
                                    <Play className="h-6 w-6 fill-current ml-0.5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        {curriculumModules[0]?.title || `Module 1: Foundations of ${course.title}`}
                                    </h4>
                                    <p className="text-xs text-slate-300 mt-1 max-w-sm">
                                        {curriculumModules[0]?.subtitle || course.subtitle || 'Introductory deep-dive into production engineering foundations.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-400">
                                {curriculumModules.length} Modules · {course.duration || '8 Weeks'}
                            </span>
                            {isEnrolled ? (
                                <Link
                                    href={route('student.courses.learn', course.id)}
                                    className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    <span>Go to Classroom →</span>
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreviewModalOpen(false);
                                        handleEnroll();
                                    }}
                                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Enroll in Cohort</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    // 1. Logged-in Student: Render within StudentLayout
    if (user && user.role === 'student') {
        return (
            <StudentLayout
                header={
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Link href={route('courses.index')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 font-medium">
                            <Compass className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Browse Courses</span>
                        </Link>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-600">/</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-slate-800 dark:text-slate-200 font-semibold">{course.title}</span>
                    </div>
                }
            >
                <Head title={`${course.title} - Comestro Academy`} />
                <div className="pb-16 lg:pb-0">
                    {courseDetailContent}
                </div>
            </StudentLayout>
        );
    }

    // 2. Logged-in Admin / Instructor: Render within AdminLayout
    if (user && (user.role === 'admin' || user.role === 'instructor')) {
        return (
            <AdminLayout
                header={
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Link href={route('admin.courses.index')} className="hover:text-indigo-600 transition font-medium">
                            Courses
                        </Link>
                        <span>/</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-sm text-gray-800 font-semibold">{course.title}</span>
                    </div>
                }
            >
                <Head title={`${course.title} - Admin Preview | Comestro Academy`} />
                <div className="pb-16 lg:pb-0">
                    {courseDetailContent}
                </div>
            </AdminLayout>
        );
    }

    // 3. Public View
    return (
        <div className={`min-h-screen transition-colors duration-200 font-sans antialiased flex flex-col pb-16 lg:pb-0 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#fafbfc] text-slate-900'
        }`}>
            <Head title={`${course.title} | Comestro Academy`} />
            <Toaster position="top-right" />
            {publicHeader}
            {courseDetailContent}
            {publicFooter}
        </div>
    );
}
