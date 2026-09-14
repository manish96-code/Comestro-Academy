import axios from 'axios';
import ApplicationLogo from '@/Components/ApplicationLogo';
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
    LayoutDashboard
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

    // Synchronize theme with homepage
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
        }
        return 'dark';
    });
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

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (['about', 'curriculum', 'instructor', 'faq'].includes(tabParam)) {
                return tabParam;
            }
            if (window.location.hash === '#curriculum') return 'curriculum';
            if (window.location.hash === '#instructor') return 'instructor';
            if (window.location.hash === '#faq') return 'faq';
        }
        return 'about';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [enrolling, setEnrolling] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [openModules, setOpenModules] = useState({ 0: true, 1: true });

    const changeTab = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            window.history.replaceState({}, '', url.toString());
        }
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

        setEnrolling(true);

        try {
            const { data } = await axios.post(route('courses.payment.create-order', course.id));

            if (data.free) {
                toast.success(data.message || 'Enrolled successfully!');
                router.visit(data.redirect_url || route('student.courses.enrolled'));
                return;
            }

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error('Failed to load payment gateway. Please check your connection.');
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
                        },
                        {
                            preserveScroll: true,
                            onStart: () => setEnrolling(true),
                            onFinish: () => setEnrolling(false),
                            onSuccess: () => {
                                toast.success('Payment verified! Welcome to the course.');
                            },
                            onError: (errs) => {
                                toast.error(errs.message || 'Payment verification failed.');
                            },
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

    const instructorInitials = instructorUser?.name
        ? instructorUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'CA';

    const courseIncludesList = Array.isArray(course.course_includes) && course.course_includes.length > 0
        ? course.course_includes.filter(Boolean)
        : [
            `${course.duration || '8 Weeks'} structured engineering curriculum`,
            'Production-grade capstone projects with full source code',
            'Architecture design patterns & code review feedback',
            'Official verified certificate of completion',
            'Direct access to faculty discussion channels',
            'Full lifetime access to lecture materials & updates'
        ];

    return (
        <div className={`min-h-screen transition-colors duration-200 font-sans antialiased flex flex-col pb-20 lg:pb-0 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#fafbfc] text-slate-900'
        }`}>
            <Head title={`${course.title} | Comestro Academy`} />
            <Toaster position="top-right" />

            {/* 1. Header / Navigation Bar */}
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
                                Courses
                            </Link>
                            <Link
                                href="/#courses"
                                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                            >
                                Tracks
                            </Link>
                            <Link
                                href="/#projects"
                                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                            >
                                Capstones
                            </Link>
                            <Link
                                href="/#mentors"
                                className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                            >
                                Mentors
                            </Link>
                        </nav>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`rounded-lg border p-1.5 transition ${
                                isDark
                                    ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                                    : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                        isDark
                                            ? 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                                            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
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

            {/* 2. Hero Section - Clean, Confident, Calmer (No Badge Clutter) */}
            <div className="relative bg-[#090d16] text-white overflow-hidden py-10 sm:py-12 border-b border-slate-800/80">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs & Category Line */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto pb-1 scrollbar-none">
                        <Link href="/" className="hover:text-white transition shrink-0">Home</Link>
                        <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                        <Link href={route('courses.index')} className="hover:text-white transition shrink-0">Courses</Link>
                        {course.category && (
                            <>
                                <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
                                <Link
                                    href={`${route('courses.index')}?category_id=${course.category.id}`}
                                    className="hover:text-white transition shrink-0 text-blue-400"
                                >
                                    {course.category.name}
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="max-w-3xl space-y-3.5">
                        {/* Eyebrow Label (Clean quiet text, NOT a bubbly badge) */}
                        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-400">
                            <span className="text-blue-400 font-semibold uppercase tracking-wider">
                                {course.category?.name || 'Mobile Engineering'}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span>{course.type === 'live' ? 'Live Interactive Cohort' : 'Self-Paced Recorded'}</span>
                            {isEnrolled && (
                                <>
                                    <span className="text-slate-600">•</span>
                                    <span className="text-emerald-400 font-semibold">Enrolled</span>
                                </>
                            )}
                        </div>

                        {/* Title - Refined Roboto typography with natural balance */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                            {course.title}
                        </h1>

                        {/* Subtitle */}
                        {(course.subtitle || course.description) && (
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                                {course.subtitle || course.description}
                            </p>
                        )}

                        {/* Meta strip - Subtle quiet text row */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5 text-amber-400">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="font-semibold text-slate-200">4.9</span>
                                <span className="text-slate-500 font-normal">({course.enrollments_count ? course.enrollments_count + 120 : '180+'} reviews)</span>
                            </div>
                            <span className="text-slate-700 hidden sm:inline">•</span>
                            <span>{course.enrollments_count ? course.enrollments_count + 450 : '840+'} engineers enrolled</span>
                            <span className="text-slate-700 hidden sm:inline">•</span>
                            <span>Instructor: <strong className="text-slate-200 font-medium">{instructorUser?.name || 'Comestro Faculty'}</strong></span>
                            {course.duration && (
                                <>
                                    <span className="text-slate-700 hidden sm:inline">•</span>
                                    <span>{course.duration}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content & Clean Sidebar */}
            <main className="flex-1 py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: 8 Cols (Tabs, Overview, Syllabus, Mentor) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Tab Bar - Clean, quiet, without pill badge counter */}
                            <div className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                                <div className="flex gap-7 overflow-x-auto pb-px scrollbar-none">
                                    <button
                                        type="button"
                                        onClick={() => changeTab('about')}
                                        className={`pb-3 text-sm font-medium transition-colors relative shrink-0 ${
                                            activeTab === 'about'
                                                ? isDark
                                                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                                                    : 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                                : isDark
                                                ? 'text-slate-400 hover:text-slate-200'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        About
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changeTab('curriculum')}
                                        className={`pb-3 text-sm font-medium transition-colors relative shrink-0 ${
                                            activeTab === 'curriculum'
                                                ? isDark
                                                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                                                    : 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                                : isDark
                                                ? 'text-slate-400 hover:text-slate-200'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        Curriculum
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changeTab('instructor')}
                                        className={`pb-3 text-sm font-medium transition-colors relative shrink-0 ${
                                            activeTab === 'instructor'
                                                ? isDark
                                                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                                                    : 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                                : isDark
                                                ? 'text-slate-400 hover:text-slate-200'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        Mentor
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => changeTab('faq')}
                                        className={`pb-3 text-sm font-medium transition-colors relative shrink-0 ${
                                            activeTab === 'faq'
                                                ? isDark
                                                    ? 'text-white border-b-2 border-blue-500 font-semibold'
                                                    : 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                                : isDark
                                                ? 'text-slate-400 hover:text-slate-200'
                                                : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        FAQ
                                    </button>
                                </div>
                            </div>

                            {/* TAB 1: About */}
                            {activeTab === 'about' && (
                                <div className={`rounded-xl border p-6 sm:p-7 space-y-6 ${
                                    isDark ? 'bg-[#0c101c] border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
                                }`}>
                                    <div className="space-y-3">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                            About This Course
                                        </h2>
                                        <div className="text-sm leading-relaxed space-y-3.5 text-slate-600 dark:text-slate-300 font-normal">
                                            {course.description ? (
                                                course.description.split('\n\n').map((para, idx) => (
                                                    <p key={idx}>{para}</p>
                                                ))
                                            ) : (
                                                <p>
                                                    Build high-performance, production-ready applications with hands-on architectural guidance. Learn how professional engineering teams design scalable systems from foundational concepts to store deployment.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* What you'll learn - Clean checklist without artificial boxes */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Key Engineering Outcomes
                                        </h3>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Clean domain architecture with separated data & UI layers</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Reactive state management & immutable data flows</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Offline caching, SQLite/local storage & background sync</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                                <span>Production release pipelines, code signing & store audits</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Curriculum */}
                            {activeTab === 'curriculum' && (
                                <div className={`rounded-xl border p-6 sm:p-7 space-y-5 ${
                                    isDark ? 'bg-[#0c101c] border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
                                }`}>
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                                Syllabus Breakdown
                                            </h2>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {curriculumModules.length} Modules · Step-by-step roadmap
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => expandAllModules(true)}
                                                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition"
                                            >
                                                Expand all
                                            </button>
                                            <span className="text-slate-600 text-xs">•</span>
                                            <button
                                                type="button"
                                                onClick={() => expandAllModules(false)}
                                                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition"
                                            >
                                                Collapse all
                                            </button>
                                        </div>
                                    </div>

                                    {/* Accordion Modules - Clean text numbering, no colored block badges */}
                                    <div className="space-y-2.5">
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
                                                            ? 'border-slate-800 bg-[#090d16]/50'
                                                            : 'border-slate-200 bg-slate-50/50'
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleModule(mIdx)}
                                                        className="w-full flex items-center justify-between p-3.5 text-left transition hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                            <span className="text-xs font-medium text-slate-400 shrink-0">
                                                                {mIdx + 1}.
                                                            </span>
                                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                {cleanTitle}
                                                            </h3>
                                                        </div>

                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className="text-xs text-slate-400 hidden sm:inline">
                                                                {topics.length > 0 ? `${topics.length} lessons` : 'Hands-on'}
                                                            </span>
                                                            <ChevronDown
                                                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                                                    isOpen ? 'rotate-180 text-blue-500' : ''
                                                                }`}
                                                            />
                                                        </div>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="p-3 pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5">
                                                            {topics.length > 0 ? (
                                                                topics.map((topic, tIdx) => (
                                                                    <div
                                                                        key={tIdx}
                                                                        className="flex items-center justify-between py-1.5 px-2.5 rounded text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                                                                    >
                                                                        <div className="flex items-center gap-2 truncate">
                                                                            <Play className="h-3 w-3 text-slate-400 shrink-0" />
                                                                            <span className="truncate">{topic}</span>
                                                                        </div>
                                                                        <span className="text-slate-400 text-[11px] shrink-0">
                                                                            {tIdx === 0 ? 'Preview' : '15-25m'}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-slate-500 italic py-1 px-2.5">
                                                                    Comprehensive lecture sessions, code walkthroughs, and repository commits.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Instructor - Calm, editorial, no pill badge clutter */}
                            {activeTab === 'instructor' && (
                                <div className={`rounded-xl border p-6 sm:p-7 space-y-5 ${
                                    isDark ? 'bg-[#0c101c] border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
                                }`}>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Faculty Leadership
                                    </h2>

                                    <div className="flex flex-col sm:flex-row items-start gap-5">
                                        <div className="h-16 w-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
                                            {instructorInitials}
                                        </div>

                                        <div className="space-y-2 flex-1">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                    {instructorUser?.name || 'Ananya Gupta'}
                                                </h3>
                                                <p className="text-xs text-blue-600 dark:text-sky-400 font-medium">
                                                    {instructor?.designation || 'Staff Mobile Architect & Ex-Tech Lead'} · {instructor?.experience_years ? `${instructor.experience_years}+ years experience` : '8+ years experience'}
                                                </p>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Specialization: {(instructor?.expertise ? instructor.expertise.split(',') : ['Flutter', 'Dart', 'Riverpod', 'iOS', 'Android']).map((s) => s.trim()).join(' · ')}
                                            </p>

                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 font-normal">
                                                {instructor?.bio || 'Experienced engineering lead with extensive background architecting consumer-scale mobile applications. Focuses on pragmatic architecture, performance optimization, and helping developers master production-grade code.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: FAQ */}
                            {activeTab === 'faq' && (
                                <div className={`rounded-xl border p-6 sm:p-7 space-y-4 ${
                                    isDark ? 'bg-[#0c101c] border-slate-800/80 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
                                }`}>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Frequently Asked Questions
                                    </h2>

                                    <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                What prerequisites are recommended?
                                            </h4>
                                            <p>
                                                Basic familiarity with any programming language (JavaScript, Python, Java, or C++). All specific framework concepts and patterns are built from the ground up.
                                            </p>
                                        </div>

                                        <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                Are recordings and lecture notes available?
                                            </h4>
                                            <p>
                                                Yes. Every lecture includes full HD recordings, starter code repositories, and cheat sheets available with lifetime access.
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                How does the refund guarantee work?
                                            </h4>
                                            <p>
                                                If within 7 days of enrollment you feel the course is not right for you, contact us for a full refund without questions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Related Courses Section */}
                            {relatedCourses && relatedCourses.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                            Related Courses
                                        </h2>
                                        <Link
                                            href={route('courses.index')}
                                            className="text-xs font-medium text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>View all</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {relatedCourses.map((relCourse) => (
                                            <Link
                                                key={relCourse.id}
                                                href={route('courses.show', relCourse.slug || relCourse.id)}
                                                className={`group rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                                                    isDark
                                                        ? 'border-slate-800/80 bg-[#0c101c] hover:border-slate-700'
                                                        : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                                                }`}
                                            >
                                                <div className="relative w-full h-28 overflow-hidden bg-slate-950 border-b border-slate-100 dark:border-slate-800/60">
                                                    <img
                                                        src={getCourseImage(relCourse)}
                                                        alt={relCourse.title}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2.5">
                                                    <div>
                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                                                            {relCourse.category?.name || 'Engineering'}
                                                        </p>
                                                        <h3 className="text-xs font-semibold line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors mt-0.5">
                                                            {relCourse.title}
                                                        </h3>
                                                    </div>

                                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{relCourse.duration || '8 Weeks'}</span>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {Number(relCourse.price) === 0
                                                                ? 'Free'
                                                                : relCourse.discount_price
                                                                ? `₹${Number(relCourse.discount_price).toLocaleString('en-IN')}`
                                                                : `₹${Number(relCourse.price).toLocaleString('en-IN')}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: 4 Cols - Clean, Quiet Sticky Card (No loud badge stickers) */}
                        <div className="lg:col-span-4">
                            <div className="lg:sticky lg:top-24 space-y-5">
                                <div className={`rounded-xl border shadow-lg overflow-hidden transition-all ${
                                    isDark ? 'bg-[#0c101c] border-slate-800/80' : 'bg-white border-slate-200/90'
                                }`}>
                                    {/* Preview Thumbnail Box - Clean artwork without loud stickers */}
                                    <div className="relative h-44 sm:h-48 bg-slate-950 flex items-center justify-center overflow-hidden group">
                                        <img
                                            src={getCourseImage(course)}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/30 transition" />

                                        {/* Play Preview Icon */}
                                        <button
                                            type="button"
                                            onClick={() => setPreviewModalOpen(true)}
                                            className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer focus:outline-hidden"
                                        >
                                            <div className="h-11 w-11 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-200">
                                                <Play className="h-4 w-4 fill-current ml-0.5" />
                                            </div>
                                            <span className="text-[11px] font-medium text-white tracking-wider uppercase drop-shadow-sm">
                                                Preview Course
                                            </span>
                                        </button>
                                    </div>

                                    {/* Content & Action CTAs */}
                                    <div className="p-5 sm:p-6 space-y-5">
                                        {/* Price block - Clean numbers, no neon flashing badge */}
                                        <div className="space-y-0.5">
                                            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                                                Tuition
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                                    {formattedPrice}
                                                </span>
                                                {formattedOriginalPrice && (
                                                    <span className="text-sm text-slate-400 line-through">
                                                        {formattedOriginalPrice}
                                                    </span>
                                                )}
                                                {discountPercent && (
                                                    <span className="text-xs font-semibold text-emerald-500">
                                                        {discountPercent}% off
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="space-y-2.5">
                                            {isEnrolled ? (
                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition text-xs"
                                                >
                                                    <Play className="h-3.5 w-3.5 fill-current" />
                                                    <span>Go to Classroom</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleEnroll}
                                                    disabled={enrolling}
                                                    className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition text-xs disabled:opacity-60 cursor-pointer"
                                                >
                                                    {enrolling ? (
                                                        <>
                                                            <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>Connecting Gateway...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Enroll in Course</span>
                                                            <ArrowRight className="h-3.5 w-3.5" />
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            {user && (user.role === 'admin' || user.role === 'instructor') && (
                                                <Link
                                                    href={route('admin.courses.show', course.id)}
                                                    className={`w-full py-2 px-3 text-center text-xs font-medium rounded-lg border transition block ${
                                                        isDark
                                                            ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    Edit in Admin Panel
                                                </Link>
                                            )}
                                        </div>

                                        {/* Trust text - Simple quiet line */}
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 text-center">
                                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            <span>7-day money-back guarantee</span>
                                        </div>

                                        {/* What's included */}
                                        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                                                Course Includes:
                                            </h4>
                                            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                                {courseIncludesList.map((feature, fIdx) => (
                                                    <div key={fIdx} className="flex items-start gap-2">
                                                        <Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                                                        <span className="leading-tight">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Share Course */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={handleShare}
                                                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                                            >
                                                <Share2 className="h-3 w-3" />
                                                <span>Share course</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Floating Mobile Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-md ${
                isDark ? 'border-slate-800 bg-[#090d16]/95' : 'border-slate-200 bg-white/95'
            }`}>
                <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Fee</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
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
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs"
                    >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Classroom</span>
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
                    >
                        <span>{enrolling ? 'Connecting...' : 'Enroll Now'}</span>
                        <ArrowRight className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* 5. Minimalist Footer */}
            <footer className={`border-t py-8 text-xs text-slate-500 mt-10 ${
                isDark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-white'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <ApplicationLogo dark={isDark} imgClassName="h-6 w-auto" />
                        <span className="text-slate-400 hidden sm:inline">•</span>
                        <p>© 2026 Comestro Academy. All rights reserved.</p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link href={route('courses.index')} className="hover:text-slate-900 dark:hover:text-white transition">
                            Courses
                        </Link>
                        <Link href="/#courses" className="hover:text-slate-900 dark:hover:text-white transition">
                            Tracks
                        </Link>
                        <Link href="/#projects" className="hover:text-slate-900 dark:hover:text-white transition">
                            Capstones
                        </Link>
                        <Link href={route('login')} className="hover:text-slate-900 dark:hover:text-white transition">
                            Log in
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Preview Modal */}
            {previewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className={`relative w-full max-w-xl rounded-xl border shadow-xl p-5 space-y-3.5 ${
                        isDark ? 'bg-[#0c101c] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                        <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
                            <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
                                    Preview
                                </span>
                                <h3 className="text-sm font-bold truncate max-w-sm">
                                    {course.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="aspect-video w-full rounded-lg bg-slate-950 overflow-hidden relative flex items-center justify-center">
                            <img
                                src={getCourseImage(course)}
                                alt={course.title}
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                                    <Play className="h-4 w-4 fill-current ml-0.5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white">
                                        Module 1: Architectural Foundations
                                    </h4>
                                    <p className="text-[11px] text-slate-300 mt-0.5">
                                        Introductory deep-dive into curriculum concepts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-slate-400">
                                {curriculumModules.length} Modules · {course.duration || '8 Weeks'}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewModalOpen(false);
                                    handleEnroll();
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1"
                            >
                                <span>Enroll Now</span>
                                <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
