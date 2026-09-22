import StudentLayout from '@/Layouts/StudentLayout';
import SearchBar from '@/Components/SearchBar';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    ClipboardList,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    BookOpen,
    User,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function StudentAssignmentsIndex({ assignments = [], stats = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'review', 'graded'

    const filteredAssignments = useMemo(() => {
        return assignments.filter((item) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = item.title?.toLowerCase().includes(q);
                const matchCourse = item.course?.title?.toLowerCase().includes(q);
                if (!matchTitle && !matchCourse) return false;
            }

            if (activeTab === 'pending') {
                return ['pending', 'overdue', 'resubmit'].includes(item.status);
            }
            if (activeTab === 'review') {
                return item.status === 'submitted';
            }
            if (activeTab === 'graded') {
                return item.status === 'reviewed';
            }

            return true;
        });
    }, [assignments, searchQuery, activeTab]);

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Course Assignments & Projects
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Practical Work
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Submit your solution PDF and GitHub repository links for instructor review and evaluation
                        </p>
                    </div>

                    <Link
                        href={route('student.courses.enrolled')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-md shadow-2xs transition shrink-0"
                    >
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        <span>Enrolled Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Assignments - Student Portal" />

            <div className="py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Overview Header Banner - Flat & Clean */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="space-y-1.5 max-w-2xl">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold font-mono uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5" />
                                Hands-On Learning
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Practical Tasks & Real-World Projects
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Complete assignments given by your mentors, upload your solution PDF and GitHub project link, and receive personalized feedback.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center min-w-[95px]">
                                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{stats.graded || 0}</p>
                                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">Evaluated</p>
                            </div>
                            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center min-w-[95px]">
                                <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{stats.pending || 0}</p>
                                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">Action Needed</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setActiveTab('all')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>All Tasks</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {assignments.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('pending')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === 'pending'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Action Required</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'pending' ? 'bg-indigo-700 text-white' : 'bg-amber-50 dark:bg-amber-950 text-amber-600'}`}>
                                    {stats.pending || 0}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('review')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === 'review'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Under Review</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'review' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {stats.under_review || 0}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('graded')}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === 'graded'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Evaluated</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${activeTab === 'graded' ? 'bg-indigo-700 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'}`}>
                                    {stats.graded || 0}
                                </span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <SearchBar
                            containerClassName="relative w-full md:w-72"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClear={() => setSearchQuery('')}
                        />
                    </div>

                    {/* Assignments List Grid */}
                    {filteredAssignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {filteredAssignments.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs transition hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between gap-5 relative"
                                >
                                    <div className="space-y-3.5">
                                        {/* Top Tag & Status */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {item.course?.title}
                                            </span>

                                            {item.status === 'reviewed' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    Score: {item.submission?.marks_obtained}/{item.total_marks}
                                                </span>
                                            )}

                                            {item.status === 'submitted' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                                    <Clock className="h-3 w-3" />
                                                    Under Review
                                                </span>
                                            )}

                                            {item.status === 'resubmit' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Revision Requested
                                                </span>
                                            )}

                                            {item.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    Pending Submission
                                                </span>
                                            )}

                                            {item.status === 'overdue' && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                    Overdue
                                                </span>
                                            )}
                                        </div>

                                        {/* Title & Creator */}
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                                                {item.creator && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <span>Assigned by {item.creator.name}</span>
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

                                        {/* Description */}
                                        {item.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center text-xs font-mono">
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Total Marks</p>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{item.total_marks}M</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Passing</p>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{item.passing_marks}M</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Accepted</p>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">PDF / GitHub</p>
                                            </div>
                                        </div>

                                        {/* Late Submission Notice if applicable */}
                                        {item.submission?.is_late && (
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                                                <AlertCircle className="h-3 w-3 shrink-0" />
                                                Submitted after due date
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                        <Link
                                            href={route('student.assignments.show', item.id)}
                                            className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition"
                                        >
                                            <span>
                                                {item.status === 'reviewed'
                                                    ? 'View Score & Feedback'
                                                    : item.status === 'submitted'
                                                    ? 'View Submitted Solution'
                                                    : item.status === 'resubmit'
                                                    ? 'Submit Revised Solution'
                                                    : 'Open Assignment & Submit'}
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-2xs">
                            <div className="h-12 w-12 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {searchQuery ? 'No matching assignments found' : 'No course assignments yet'}
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                                    {searchQuery
                                        ? 'Try clearing your search query or switching to another filter tab.'
                                        : 'When instructors assign projects or homework for your enrolled courses, they will appear here.'}
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </StudentLayout>
    );
}
