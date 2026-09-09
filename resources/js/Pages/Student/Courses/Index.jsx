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
    Menu
} from 'lucide-react';

export default function CoursesIndex({ courses, categories, filters }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [enrollingId, setEnrollingId] = useState(null);
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

    const handleEnroll = (courseId) => {
        if (!user) {
            toast.error('Please log in or create an account to enroll in this course.');
            router.visit(route('login'));
            return;
        }

        setEnrollingId(courseId);
        router.post(
            route('courses.enroll', courseId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setEnrollingId(null),
            }
        );
    };

    // Shared Catalog Content (Search, Categories, Course Cards, Pagination)
    const catalogContent = (
        <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs p-4 sm:p-5 space-y-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search courses by title, mentor, or technology..."
                            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-400 shadow-xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                    >
                        <Search className="h-3.5 w-3.5" />
                        <span>Search</span>
                    </button>

                    {(search || categoryId) && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1 shrink-0"
                        >
                            <X className="h-3.5 w-3.5" />
                            <span>Clear</span>
                        </button>
                    )}
                </form>

                {/* Category Filter Pills */}
                {categories && categories.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <Filter className="h-3 w-3" />
                            Categories:
                        </span>
                        <button
                            onClick={() => handleCategoryClick('')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition shrink-0 ${
                                !categoryId
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition shrink-0 ${
                                    categoryId === String(category.id)
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        const isProcessing = enrollingId === course.id;

                        return (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl border border-gray-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                            >
                                <div>
                                    {/* Thumbnail Banner */}
                                    <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback Graphic */}
                                        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
                                            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl text-white">
                                                <GraduationCap className="h-8 w-8" />
                                            </div>
                                            <span className="text-[11px] font-bold text-indigo-200 tracking-wider uppercase">
                                                {course.category?.name || 'Comestro Academy'}
                                            </span>
                                        </div>

                                        {/* Badges Over Thumbnail */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
                                            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-600/95 text-white shadow-xs backdrop-blur-xs">
                                                {course.category?.name || 'Tech'}
                                            </span>
                                            {course.is_featured && (
                                                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500 text-white shadow-xs flex items-center gap-0.5">
                                                    <Sparkles className="h-2.5 w-2.5" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Enrolled Badge */}
                                        {isEnrolled && (
                                            <div className="absolute bottom-3 right-3 z-20">
                                                <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Enrolled
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Details */}
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                                            {course.title}
                                        </h3>

                                        {course.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {course.description}
                                            </p>
                                        )}

                                        <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{course.duration || 'Self-paced'}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-gray-700 font-medium truncate max-w-[50%]">
                                                <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                <span className="truncate">
                                                    {instructorUser?.name ? instructorUser.name : 'Academy Mentor'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Pricing & Action Button */}
                                <div className="p-5 pt-0">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Course Fee</div>
                                            <div className="flex items-baseline gap-1.5">
                                                {Number(course.price) === 0 ? (
                                                    <span className="text-sm font-bold text-emerald-600">Free</span>
                                                ) : course.discount_price ? (
                                                    <>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            ₹{Number(course.discount_price).toLocaleString('en-IN')}
                                                        </span>
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{Number(course.price).toLocaleString('en-IN')}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-900">
                                                        ₹{Number(course.price).toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isEnrolled ? (
                                            <Link
                                                href={route('student.courses.enrolled')}
                                                className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition flex items-center gap-1"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Enrolled</span>
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() => handleEnroll(course.id)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <span>Enrolling...</span>
                                                ) : (
                                                    <>
                                                        <span>Enroll Now</span>
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs p-12 text-center space-y-4">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Compass className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-900">No Courses Found</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            We could not find any active courses matching your criteria. Try resetting filters or searching with different keywords.
                        </p>
                    </div>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                        <span>View All Courses</span>
                    </button>
                </div>
            )}

            {/* Pagination Links */}
            {courses.links && courses.links.length > 3 && (
                <div className="flex items-center justify-center gap-1 pt-4 pb-2">
                    {courses.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                link.active
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : !link.url
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    // If student is logged in, use the Student Portal Layout
    if (user && user.role === 'student') {
        return (
            <StudentLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">
                                Explore Courses
                            </h1>
                            <p className="text-xs text-gray-500">
                                Discover industry-standard courses taught by seasoned professionals
                            </p>
                        </div>
                        <Link
                            href={route('student.courses.enrolled')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition shrink-0"
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

    // Public Layout for Guests, Visitors, and Non-Student users (with or without login)
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
            <Head title="All Courses - Comestro Academy" />
            <Toaster position="top-right" />

            {/* Public Header / Navigation */}
            <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="group flex items-center">
                            <ApplicationLogo />
                        </Link>

                        <nav className="hidden sm:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-xs font-mono font-medium text-slate-600 hover:text-indigo-600 transition"
                            >
                                Home
                            </Link>
                            <Link
                                href={route('courses.index')}
                                className="text-xs font-mono font-semibold text-indigo-600 transition"
                            >
                                All Courses
                            </Link>
                        </nav>
                    </div>

                    {/* Auth CTAs */}
                    <div className="hidden sm:flex items-center gap-3">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                <span>Go to Dashboard →</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-4 py-2 text-xs font-mono font-medium text-slate-700 hover:text-slate-950 transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                                >
                                    <span>Get Started →</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:hidden shadow-lg space-y-3 font-mono text-sm">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-slate-700 hover:text-indigo-600"
                        >
                            // Home
                        </Link>
                        <Link
                            href={route('courses.index')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-indigo-600 font-semibold"
                        >
                            // All Courses
                        </Link>
                        <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-xs font-mono font-bold text-white shadow-sm"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-slate-300 px-4 py-2 text-center text-xs font-mono font-medium text-slate-700"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-xs font-mono font-bold text-white shadow-sm"
                                    >
                                        Get Started →
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Public Course Catalog Hero Banner */}
            <div className="bg-gradient-to-b from-white to-slate-100/60 border-b border-slate-200/80 py-10 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                        <span>OPEN COURSE CATALOG · ACCESS ANYTIME</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Explore Industry-Ready Courses
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Learn full-stack web development, software engineering, databases, and DevOps from experienced engineers with hands-on projects and mentorship.
                    </p>
                </div>
            </div>

            {/* Main Catalog Section */}
            <main className="flex-1 py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {catalogContent}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
                <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                        © {new Date().getFullYear()} Comestro Academy. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <Link href={route('courses.index')} className="hover:text-indigo-600">Courses</Link>
                        <Link href={route('login')} className="hover:text-indigo-600">Login</Link>
                        <Link href={route('register')} className="hover:text-indigo-600">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
