import ApplicationLogo from '@/Components/ApplicationLogo';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    Search,
    BookOpen,
    Clock,
    User,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Filter,
    X,
    GraduationCap,
    Compass,
    LogIn,
    LayoutDashboard,
    Terminal,
    Menu,
    Video,
    Sun,
    Moon,
    Star,
    ExternalLink,
    CodeXml,
    ShieldCheck
} from 'lucide-react';

export default function CoursesIndex({ courses, categories, filters }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

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
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('courses.index'),
            {
                search: search || undefined,
                category_id: categoryId || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleCategoryClick = (id) => {
        const newCat = categoryId === String(id) ? '' : String(id);
        setCategoryId(newCat);
        router.get(
            route('courses.index'),
            {
                search: search || undefined,
                category_id: newCat || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryId('');
        router.get(route('courses.index'));
    };

    const getThumbnailUrl = (item) => {
        if (!item?.thumbnail) return '/images/courses/laravel.png';
        if (item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://') || item.thumbnail.startsWith('/')) {
            return item.thumbnail;
        }
        return `/storage/${item.thumbnail}`;
    };

    const getInstructorPhoto = (instUser) => {
        if (!instUser) return '/images/instructor.jpg';
        if (instUser.profile_pic) return instUser.profile_pic;
        const name = (instUser.name || '').toLowerCase();
        if (name.includes('sadique') || name.includes('hussain') || instUser.id === 1) {
            return '/images/instructor.jpg';
        }
        return null;
    };

    const getInstructorName = (instUser) => {
        return instUser?.name || 'Sadique Hussain';
    };

    const isInstructorLaravelContributor = (instUser) => {
        const name = (instUser?.name || '').toLowerCase();
        return name.includes('sadique') || name.includes('hussain') || instUser?.id === 1 || !instUser;
    };

    // Shared Catalog Content (Search, Categories, Course Cards, Pagination)
    const catalogContent = (
        <div className="space-y-8">
            {/* Filter & Search Bar */}
            <div className={`rounded-2xl border p-4 sm:p-6 transition-all ${
                isDark ? 'bg-[#0c101c] border-slate-800/80 shadow-xl' : 'bg-white border-slate-200/90 shadow-2xs'
            } space-y-4`}>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses by technology, title, or architecture..."
                            className={`w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border transition ${
                                isDark
                                    ? 'bg-[#080c14] border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    : 'bg-slate-50/70 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                            }`}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                        <Search className="h-4 w-4" />
                        <span>Filter Tracks</span>
                    </button>

                    {(search || categoryId) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className={`px-4 py-2.5 font-semibold text-xs rounded-xl border transition flex items-center justify-center gap-1.5 shrink-0 ${
                                isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            <X className="h-3.5 w-3.5" />
                            <span>Clear Filters</span>
                        </button>
                    )}
                </form>

                {/* Category Filter Pills */}
                {categories && categories.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 font-mono">
                            <Filter className="h-3 w-3" />
                            Category:
                        </span>
                        <button
                            onClick={() => handleCategoryClick('')}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
                                !categoryId
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : isDark
                                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                        >
                            All Cohorts
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition shrink-0 cursor-pointer ${
                                    categoryId === String(category.id)
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : isDark
                                            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Courses Grid */}
            {courses.data && courses.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.data.map((course) => {
                        const instructorUser = course.instructor?.user;
                        const isEnrolled = course.is_enrolled;
                        const isLaravel = isInstructorLaravelContributor(instructorUser);
                        const instructorPhoto = getInstructorPhoto(instructorUser);

                        return (
                            <div
                                key={course.id}
                                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                                    isDark
                                        ? 'bg-[#0c101c] border-slate-800/80 hover:border-slate-700 hover:bg-[#0f1526]'
                                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                                }`}
                            >
                                <div>
                                    {/* Thumbnail Banner */}
                                    <Link
                                        href={route('courses.show', course.slug || course.id)}
                                        className="relative h-48 bg-slate-950 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-center overflow-hidden block group"
                                    >
                                        <img
                                            src={getThumbnailUrl(course)}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

                                        {/* Badges Over Thumbnail */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                            <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-blue-600 text-white shadow-xs">
                                                {course.category?.name || 'Engineering'}
                                            </span>
                                            {course.type === 'live' ? (
                                                <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-rose-500/90 text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                    </span>
                                                    Live Cohort
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-900/90 text-slate-200 backdrop-blur-xs border border-slate-700/60 flex items-center gap-1.5 shadow-xs">
                                                    <Video className="h-3 w-3" />
                                                    Self-Paced
                                                </span>
                                            )}
                                        </div>

                                        {/* Enrolled Badge */}
                                        {isEnrolled && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-emerald-500 text-white shadow-md flex items-center gap-1">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Enrolled
                                                </span>
                                            </div>
                                        )}

                                        {/* Bottom duration & rating strip over thumbnail */}
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
                                            <span className="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                                                <Clock className="h-3.5 w-3.5 text-blue-400" />
                                                <span>{course.duration || '10 Weeks'}</span>
                                            </span>
                                            <span className="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs text-amber-400">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                <span className="text-white font-semibold font-mono">4.99</span>
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Course Details */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                                            <Link href={route('courses.show', course.slug || course.id)}>
                                                {course.title}
                                            </Link>
                                        </h3>

                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {course.subtitle || course.description || 'Comprehensive curriculum covering architecture, clean domain patterns, and enterprise deployments.'}
                                        </p>

                                        {/* Faculty row */}
                                        <div className="pt-3 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/80">
                                            {instructorPhoto ? (
                                                <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-blue-500/40 shrink-0 bg-slate-900">
                                                    <img
                                                        src={instructorPhoto}
                                                        alt={getInstructorName(instructorUser)}
                                                        className="w-full h-full object-cover object-top"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                                                    {getInstructorName(instructorUser).split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                                    {getInstructorName(instructorUser)}
                                                </div>
                                                <div className="text-[11px] text-blue-600 dark:text-sky-400 truncate">
                                                    {isLaravel ? 'Laravel Framework Contributor (530M+)' : (course.instructor?.designation || 'Senior Faculty Lead')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Pricing & Action Button */}
                                <div className="p-5 pt-0">
                                    <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                        isDark ? 'bg-[#080c14] border-slate-800' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                        <div>
                                            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                                                Tuition
                                            </div>
                                            <div className="flex items-baseline gap-1.5">
                                                {Number(course.price) === 0 ? (
                                                    <span className="text-base font-bold text-emerald-500 font-mono">Free</span>
                                                ) : course.discount_price ? (
                                                    <>
                                                        <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                                            ₹{Number(course.discount_price).toLocaleString('en-IN')}
                                                        </span>
                                                        <span className="text-xs text-slate-400 line-through font-mono">
                                                            ₹{Number(course.price).toLocaleString('en-IN')}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                                        ₹{Number(course.price).toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isEnrolled ? (
                                            <Link
                                                href={route('student.courses.learn', course.id)}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
                                            >
                                                <span>Classroom</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        ) : (
                                            <Link
                                                href={route('courses.show', course.slug || course.id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span>View Syllabus</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className={`rounded-2xl border p-12 text-center space-y-4 ${
                    isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                    <div className="mx-auto h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Compass className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Tracks Found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            We could not find any active cohorts matching your criteria. Try resetting your search filters or browse all tracks.
                        </p>
                    </div>
                    <button
                        onClick={clearFilters}
                        className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-500 transition inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                        <span>View All Cohorts</span>
                    </button>
                </div>
            )}

            {/* Pagination Links */}
            {courses.links && courses.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-6 pb-2">
                    {courses.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                                link.active
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : !link.url
                                        ? 'text-slate-500 opacity-40 cursor-not-allowed'
                                        : isDark
                                            ? 'text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800'
                                            : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    // If visiting specifically under the student portal route (/student/courses) and student is logged in
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/student') && user && user.role === 'student') {
        return (
            <StudentLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                Explore Courses
                            </h1>
                            <p className="text-xs text-gray-500">
                                Discover industry-standard courses taught by official framework contributors
                            </p>
                        </div>
                        <Link
                            href={route('student.courses.enrolled')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition shrink-0"
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>My Enrolled Courses</span>
                        </Link>
                    </div>
                }
            >
                <Head title="Explore Courses - Student Portal" />

                <div className="py-6 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {catalogContent}
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // Public Course Catalog Page (Matching Welcome.jsx and Show.jsx styling)
    return (
        <div className={`min-h-screen transition-colors duration-200 font-sans antialiased flex flex-col pb-16 lg:pb-0 ${
            isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#fafbfc] text-slate-900'
        }`}>
            <Head title="Explore Engineering Courses | Comestro Academy" />
            <Toaster position="top-right" />

            {/* 1. Header / Navigation Bar Matching Homepage */}
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
                                href="/"
                                className={isDark ? 'text-slate-400 hover:text-white transition' : 'text-slate-600 hover:text-slate-900 transition'}
                            >
                                Home
                            </Link>
                            <Link
                                href={route('courses.index')}
                                className={isDark ? 'text-white font-semibold' : 'text-blue-600 font-semibold'}
                            >
                                All Courses
                            </Link>
                            <a
                                href="/#mentors"
                                className={isDark ? 'text-slate-400 hover:text-white transition' : 'text-slate-600 hover:text-slate-900 transition'}
                            >
                                Mentors
                            </a>
                        </nav>
                    </div>

                    {/* Right Controls: Theme Switcher & Auth */}
                    <div className="flex items-center gap-3">
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

                        {/* Mobile Toggle */}
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

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className={`border-b px-4 py-4 lg:hidden shadow-lg space-y-2.5 ${
                        isDark ? 'border-slate-800 bg-[#0c101c]' : 'border-slate-200 bg-white'
                    }`}>
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm py-1 text-slate-700 dark:text-slate-300">
                            Home
                        </Link>
                        <Link href={route('courses.index')} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1 text-blue-600 dark:text-sky-400">
                            All Courses
                        </Link>
                        <a href="/#mentors" onClick={() => setMobileMenuOpen(false)} className="block text-sm py-1 text-slate-700 dark:text-slate-300">
                            Mentors
                        </a>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                            {user ? (
                                <Link href={route('dashboard')} className="rounded-lg bg-blue-600 text-white text-center py-2 text-xs font-medium">
                                    Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="rounded-lg border border-slate-300 dark:border-slate-700 text-center py-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="rounded-lg bg-blue-600 text-white text-center py-2 text-xs font-medium">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* 2. Hero Section with Faculty Leadership Spotlight */}
            <section className="relative pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-100/50 dark:from-[#090d16] dark:to-[#0c101c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header Text */}
                    <div className="max-w-3xl space-y-3">
                        <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400">
                            Curated Engineering Tracks
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Industry-Standard Engineering Cohorts
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            Master distributed backend systems, mobile architectures, and cloud infrastructures. Every cohort delivers real portfolio codebases and direct 1-on-1 pull request reviews.
                        </p>
                    </div>

                    {/* Faculty Leadership Spotlight Banner */}
                    <div className={`rounded-2xl border p-6 sm:p-7 transition-all ${
                        isDark ? 'bg-[#0c101c] border-blue-500/30 ring-1 ring-blue-500/20 shadow-xl' : 'bg-white border-blue-200 shadow-sm'
                    }`}>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Photo */}
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-md shrink-0 bg-slate-900">
                                <img
                                    src="/images/instructor.jpg"
                                    alt="Sadique Hussain"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                        Faculty Leadership
                                    </span>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        Official Contributor to Laravel Framework (530M+ Downloads)
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-2">
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                        Sadique Hussain
                                    </h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Lead Software Engineer & Official Framework Contributor
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                                    Learn from engineers who build production systems and contribute to the core frameworks powering hundreds of millions of applications. Direct weekly 1-on-1 code reviews, queue deadlock resolution, and high-concurrency microservices.
                                </p>

                                {/* Mini stats */}
                                <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-mono text-slate-600 dark:text-slate-400">
                                    <span><strong>530M+</strong> Downloads</span>
                                    <span>•</span>
                                    <span><strong>220+</strong> Repos</span>
                                    <span>•</span>
                                    <span><strong>8+ Yrs</strong> Production Exp</span>
                                    <span>•</span>
                                    <span className="text-amber-500 font-bold">★ 4.99 Faculty Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Catalog & Courses Section */}
            <main className="flex-1 py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {catalogContent}
                </div>
            </main>

            {/* 4. Footer Matching Homepage and Show */}
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
                        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition">Home</Link>
                        <Link href={route('courses.index')} className="hover:text-slate-900 dark:hover:text-white transition font-medium">Courses</Link>
                        <a href="/#mentors" className="hover:text-slate-900 dark:hover:text-white transition">Mentors</a>
                        <Link href={route('login')} className="hover:text-slate-900 dark:hover:text-white transition">Log in</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
