import StudentLayout from '@/Layouts/StudentLayout';
import SearchBar from '@/Components/SearchBar';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    BookOpen,
    Clock,
    User,
    CheckCircle2,
    Calendar,
    Compass,
    ArrowRight,
    Play,
    Terminal,
    FileText,
    Award,
    Sparkles,
    Layers,
    Video
} from 'lucide-react';

export default function EnrolledCourses({ enrollments }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // 'all', 'in-progress', 'completed', 'live'

    const allData = useMemo(() => {
        return enrollments?.data || [];
    }, [enrollments]);

    // Derived metric counts
    const metrics = useMemo(() => {
        const total = allData.length;
        const inProgress = allData.filter((e) => {
            const progress = e.course?.progress;
            return !progress?.is_completed && (progress?.completed_lessons || 0) > 0;
        }).length;
        const completed = allData.filter((e) => e.course?.progress?.is_completed).length;
        const live = allData.filter((e) => e.course?.type === 'live' || e.batch).length;
        return { total, inProgress, completed, live };
    }, [allData]);

    // Filtered courses based on search & tab
    const filteredEnrollments = useMemo(() => {
        return allData.filter((enrollment) => {
            const course = enrollment.course;
            if (!course) return false;

            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = course.title?.toLowerCase().includes(q);
                const matchCat = course.category?.name?.toLowerCase().includes(q);
                const matchMentor = course.instructor?.user?.name?.toLowerCase().includes(q);
                if (!matchTitle && !matchCat && !matchMentor) return false;
            }

            // Tab filter
            if (filterTab === 'in-progress') {
                return !course.progress?.is_completed;
            }
            if (filterTab === 'completed') {
                return Boolean(course.progress?.is_completed);
            }
            if (filterTab === 'live') {
                return course.type === 'live' || Boolean(enrollment.batch);
            }

            return true;
        });
    }, [allData, searchQuery, filterTab]);

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                My Enrolled Courses
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 font-mono">
                                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                                {metrics.total} {metrics.total === 1 ? 'Track' : 'Tracks'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Track your learning milestones, resume lectures, and access curriculum projects
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('courses.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs transition"
                        >
                            <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Browse Catalog</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="My Enrolled Courses - Comestro Academy" />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Metric Quick-Stats Ribbon */}
                    {allData.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                                        Enrolled Tracks
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                                        {metrics.total}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                                    <Play className="h-5 w-5 fill-current ml-0.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                                        In Progress
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                                        {metrics.inProgress}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                                        Completed
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                                        {metrics.completed}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-[#0c101c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                                <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/40 flex items-center justify-center shrink-0">
                                    <Video className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                                        Live Cohorts
                                    </p>
                                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                                        {metrics.live}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Tabs & Search Bar */}
                    {allData.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0c101c] p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                            {/* Filter Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                                {[
                                    { key: 'all', label: 'All Tracks', count: metrics.total },
                                    { key: 'in-progress', label: 'In Progress', count: metrics.inProgress },
                                    { key: 'completed', label: 'Completed', count: metrics.completed },
                                    { key: 'live', label: 'Live Cohorts', count: metrics.live },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setFilterTab(tab.key)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                                            filterTab === tab.key
                                                ? 'bg-indigo-600 text-white shadow-2xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                                            filterTab === tab.key
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <SearchBar
                                containerClassName="relative sm:w-64"
                                inputClassName="rounded-xl"
                                placeholder="Filter courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClear={() => setSearchQuery('')}
                            />
                        </div>
                    )}

                    {/* Course Cards Grid */}
                    {filteredEnrollments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEnrollments.map((enrollment) => {
                                const course = enrollment.course;
                                if (!course) return null;
                                const instructorUser = course.instructor?.user;
                                const enrolledDate = enrollment.enrolled_at
                                    ? new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })
                                    : 'Recently';

                                const isCompleted = Boolean(course.progress?.is_completed);
                                const progressPct = course.progress?.progress_percentage || 0;
                                const completedLessons = course.progress?.completed_lessons || 0;
                                const totalLessons = course.progress?.total_lessons || 0;

                                return (
                                    <div
                                        key={enrollment.id}
                                        className="bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                                    >
                                        <div>
                                            {/* Thumbnail Header with Floating Badges */}
                                            <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-center space-y-1 p-4">
                                                        <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20 backdrop-blur-md shadow-xs">
                                                            <Terminal className="h-7 w-7 text-indigo-400" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase font-mono mt-1">
                                                            {course.category?.name || 'Comestro Academy'}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Gradient Shadow Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

                                                {/* Floating Badges */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase font-mono rounded-lg bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-xs">
                                                        {course.category?.name || 'Engineering'}
                                                    </span>
                                                </div>

                                                <div className="absolute top-3 right-3 z-10">
                                                    {isCompleted ? (
                                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-emerald-500/90 backdrop-blur-md text-white border border-emerald-400/40 shadow-xs flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-lg bg-indigo-600/90 backdrop-blur-md text-white border border-indigo-400/40 shadow-xs flex items-center gap-1">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            Active
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Type Indicator Pill on Bottom Left of Image */}
                                                <div className="absolute bottom-3 left-3 z-10">
                                                    <span className="text-[10px] font-semibold text-slate-200 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                                                        {course.type === 'live' ? 'Live Interactive Cohort' : 'Self-Paced Recorded'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body Information */}
                                            <div className="p-5 space-y-3.5">
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                        {course.title}
                                                    </h3>
                                                    {course.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                            {course.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Enrolled Live Batch Timing Banner */}
                                                {enrollment.batch && (
                                                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300">
                                                            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                                            <span>Batch: {enrollment.batch.time_slot}</span>
                                                        </span>
                                                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                                                            {enrollment.batch.batch_name}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Meta details strip */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[65%]">
                                                        <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                                            {instructorUser?.name ? instructorUser.name.charAt(0).toUpperCase() : 'M'}
                                                        </div>
                                                        <span className="truncate">
                                                            {instructorUser?.name || 'Lead Mentor'}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>{course.duration || '8 Weeks'}</span>
                                                    </span>
                                                </div>

                                                {/* Progress Bar Container */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <Play className="h-3 w-3 text-indigo-600 dark:text-indigo-400 fill-current" />
                                                            <span>Track Progress</span>
                                                        </span>
                                                        <span className={`font-bold font-mono text-xs ${
                                                            isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                                                        }`}>
                                                            {progressPct}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                                isCompleted
                                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                                                            }`}
                                                            style={{ width: `${progressPct}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                                        <span>
                                                            {totalLessons > 0
                                                                ? `${completedLessons} of ${totalLessons} lessons`
                                                                : 'Enrollment active'}
                                                        </span>
                                                        <span className="text-slate-400 dark:text-slate-500">
                                                            Enrolled {enrolledDate}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="p-4 pt-0 bg-white dark:bg-[#0c101c]">
                                            <div className="p-2 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={route('courses.show', course.slug || course.id)}
                                                        className="px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
                                                        title="Course Syllabus"
                                                    >
                                                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="hidden sm:inline">Syllabus</span>
                                                    </Link>

                                                    <Link
                                                        href={route('student.invoices.show', enrollment.id)}
                                                        className="px-2 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                                                        title="View Tax Invoice & Receipt"
                                                    >
                                                        <FileText className="h-3.5 w-3.5 text-indigo-500" />
                                                        <span>Invoice</span>
                                                    </Link>
                                                </div>

                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className={`px-3.5 py-1.5 font-semibold text-xs rounded-xl shadow-2xs transition inline-flex items-center gap-1.5 text-white ${
                                                        isCompleted
                                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                                                            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'
                                                    }`}
                                                >
                                                    <Play className="h-3 w-3 fill-current" />
                                                    <span>
                                                        {isCompleted
                                                            ? 'Review'
                                                            : completedLessons > 0
                                                            ? 'Continue'
                                                            : 'Start Learning'}
                                                    </span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Modern Empty State */
                        <div className="bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-12 text-center space-y-4 shadow-2xs">
                            <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                                <Terminal className="h-6 w-6" />
                            </div>
                            <div className="space-y-1 max-w-sm mx-auto">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    {searchQuery ? 'No Matching Courses Found' : 'No Enrolled Courses Yet'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {searchQuery
                                        ? `No enrolled courses matched your search "${searchQuery}". Try clearing your search query.`
                                        : 'You have not enrolled in any cohorts yet. Explore our published courses catalog to start learning.'}
                                </p>
                            </div>
                            <div>
                                {searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilterTab('all');
                                        }}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-2xs transition inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Reset Filters</span>
                                    </button>
                                ) : (
                                    <Link
                                        href={route('courses.index')}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl shadow-2xs transition inline-flex items-center gap-1.5"
                                    >
                                        <Compass className="h-4 w-4" />
                                        <span>Explore Courses Catalog</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pagination Links */}
                    {enrollments.links && enrollments.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-2">
                            {enrollments.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow-2xs'
                                            : !link.url
                                            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                            : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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
