import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
    Compass
} from 'lucide-react';

export default function CoursesIndex({ courses, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [enrollingId, setEnrollingId] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('student.courses.index'),
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
            route('student.courses.index'),
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
        router.get(route('student.courses.index'));
    };

    const handleEnroll = (courseId) => {
        setEnrollingId(courseId);
        router.post(
            route('student.courses.enroll', courseId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setEnrollingId(null),
            }
        );
    };

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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Filter & Search Bar */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-5 space-y-4">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by course title, instructor, or topic..."
                                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-400"
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
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                            >
                                <Search className="h-3.5 w-3.5" />
                                <span>Search</span>
                            </button>

                            {(search || categoryId) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1 shrink-0"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Clear</span>
                                </button>
                            )}
                        </form>

                        {/* Category Pills */}
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
                                            ? 'bg-indigo-600 text-white'
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
                                                ? 'bg-indigo-600 text-white'
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
                                        className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                                    >
                                        <div>
                                            {/* Thumbnail / Header Banner */}
                                            <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="absolute inset-0 w-full h-full object-cover"
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
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-600 text-white shadow-xs">
                                                        {course.category?.name || 'Tech'}
                                                    </span>
                                                    {course.is_featured && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500 text-white shadow-xs flex items-center gap-0.5">
                                                            <Sparkles className="h-2.5 w-2.5" />
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Enrolled Badge on Image */}
                                                {isEnrolled && (
                                                    <div className="absolute bottom-3 right-3 z-20">
                                                        <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Enrolled
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Body Information */}
                                            <div className="p-5 space-y-3">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
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
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] uppercase font-semibold text-gray-400">Course Fee</div>
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
                        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-12 text-center space-y-4">
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
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-1.5"
                            >
                                <span>View All Courses</span>
                            </button>
                        </div>
                    )}

                    {/* Pagination Links */}
                    {courses.links && courses.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-2">
                            {courses.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white'
                                            : !link.url
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
