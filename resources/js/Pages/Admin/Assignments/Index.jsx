import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ClipboardList,
    Search,
    BookOpen,
    Clock,
    Award,
    CheckCircle2,
    AlertCircle,
    User,
    ArrowRight,
    FileText
} from 'lucide-react';

export default function AdminAssignmentsIndex({ assignments = { data: [] }, courses = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || '');

    const handleFilter = (newSearch, newCourseId) => {
        router.get(
            route('admin.assignments.index'),
            {
                search: newSearch !== undefined ? newSearch : search,
                course_id: newCourseId !== undefined ? newCourseId : courseId,
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Course Assignments Directory
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Review Queue
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Track practical assignments, evaluate PDF/GitHub submissions, and provide qualitative feedback
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Course Assignments - Admin Portal" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Top Metrics Cards - Flat, Clean */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
                                    <ClipboardList className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Assignments</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.total_assignments || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 shrink-0">
                                    <AlertCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pending Evaluation</p>
                                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{stats.pending_reviews || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 shrink-0">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Evaluated Submissions</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{stats.graded_submissions || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    handleFilter(e.target.value, courseId);
                                }}
                                placeholder="Search by assignment or course title..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={courseId}
                                onChange={(e) => {
                                    setCourseId(e.target.value);
                                    handleFilter(search, e.target.value);
                                }}
                                className="text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-1.5 px-3 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">All Courses</option>
                                {courses.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Assignments List */}
                    {assignments.data && assignments.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assignments.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-700"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                                                {item.course?.title || 'Course'}
                                            </span>

                                            {item.pending_count > 0 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    {item.pending_count} Pending Review
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                                                    All Reviewed
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                                                {item.creator && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span>Created by {item.creator.name}</span>
                                                    </span>
                                                )}
                                                {item.due_date && (
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Clock className="h-3 w-3 text-slate-400" />
                                                        <span>Due {new Date(item.due_date).toLocaleDateString()}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {item.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center text-xs font-mono">
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Total Marks</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.total_marks}M</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Passing</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.passing_marks}M</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Submissions</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{item.submissions_count || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <span className="text-[11px] text-slate-400 font-mono">
                                            {item.graded_count || 0} Graded
                                        </span>

                                        <Link
                                            href={route('admin.courses.assignments.index', item.course_id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                                        >
                                            <span>Manage & Grade</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    No course assignments found
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Open a course in the course catalog to create its first practical assignment.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={route('admin.courses.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                                >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>Go to Course Catalog</span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
}
