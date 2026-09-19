import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    GraduationCap,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    Lock,
    Unlock,
    ArrowRight,
    Search,
    BookOpen,
    Play,
    AlertCircle,
    FileCheck,
    ChevronRight,
    Sparkles,
    Target
} from 'lucide-react';

export default function StudentExamsIndex({ exams = [], stats = {} }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // 'all', 'ready', 'passed', 'locked'

    const filteredExams = useMemo(() => {
        return exams.filter((item) => {
            const course = item.course;
            const exam = item.exam;

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchCourse = course.title?.toLowerCase().includes(q);
                const matchExam = exam.title?.toLowerCase().includes(q);
                const matchCategory = course.category?.name?.toLowerCase().includes(q);
                if (!matchCourse && !matchExam && !matchCategory) return false;
            }

            // Tab filter
            if (filterTab === 'ready') {
                return item.status === 'ready';
            }
            if (filterTab === 'passed') {
                return item.status === 'passed';
            }
            if (filterTab === 'locked') {
                return item.status === 'locked';
            }

            return true;
        });
    }, [exams, searchQuery, filterTab]);

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Course Exams & Certifications
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Single Attempt
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Official assessments unlock automatically upon completing 100% of course lectures
                        </p>
                    </div>

                    <Link
                        href={route('student.courses.enrolled')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl shadow-2xs transition"
                    >
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        <span>My Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Exams - Student Portal" />

            {/* Main Outer Container with Proper Padding & Max Width */}
            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Overview Header Banner - Flat & Clean */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="space-y-1.5 max-w-2xl">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold font-mono uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5" />
                                Certification Center
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Validate Your Skills & Earn Certificates
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Each course features an official comprehensive assessment. Finish all syllabus lectures to unlock your examination, verify your mastery, and claim your credential.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center min-w-[100px]">
                                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{stats.passed || 0}</p>
                                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">Certificates</p>
                            </div>
                            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-center min-w-[100px]">
                                <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{stats.ready || 0}</p>
                                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-0.5">Ready to Take</p>
                            </div>
                        </div>
                    </div>

                    {/* Top Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
                                    <FileCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Exams</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{stats.total || exams.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 shrink-0">
                                    <Unlock className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ready to Take</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{stats.ready || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60 shrink-0">
                                    <Award className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Passed & Certified</p>
                                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{stats.passed || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Locked</p>
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300 font-mono">{stats.locked || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
                            <button
                                type="button"
                                onClick={() => setFilterTab('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    filterTab === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>All Assessments</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${filterTab === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {exams.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab('ready')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    filterTab === 'ready'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Ready to Attempt</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${filterTab === 'ready' ? 'bg-indigo-700 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'}`}>
                                    {stats.ready || 0}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab('passed')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    filterTab === 'passed'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Passed & Certified</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${filterTab === 'passed' ? 'bg-indigo-700 text-white' : 'bg-amber-50 dark:bg-amber-950 text-amber-600'}`}>
                                    {stats.passed || 0}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab('locked')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
                                    filterTab === 'locked'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>Locked</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${filterTab === 'locked' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {stats.locked || 0}
                                </span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72">
                            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search assessment..."
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Exams Grid / List */}
                    {filteredExams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {filteredExams.map((item) => {
                                const { course, exam, progress, submission, status } = item;

                                return (
                                    <div
                                        key={exam.id}
                                        className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 transition hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between gap-5 relative"
                                    >
                                        <div className="space-y-3.5">
                                            {/* Top Tag & Status Row */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                                                    {course.category?.name || 'Course Assessment'}
                                                </span>

                                                {status === 'ready' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                        Ready to Attempt
                                                    </span>
                                                )}

                                                {status === 'passed' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                        Passed • {submission.percentage}%
                                                    </span>
                                                )}

                                                {status === 'failed' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Failed • {submission.percentage}%
                                                    </span>
                                                )}

                                                {status === 'locked' && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                        <Lock className="h-3 w-3" />
                                                        Locked ({progress.progress_percentage}%)
                                                    </span>
                                                )}
                                            </div>

                                            {/* Exam Title & Course Meta */}
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                    <BookOpen className="h-3 w-3 text-slate-400 shrink-0" />
                                                    <span className="truncate">Course: {course.title}</span>
                                                </div>
                                            </div>

                                            {/* Description if present */}
                                            {exam.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {exam.description}
                                                </p>
                                            )}

                                            {/* 4-Item Clean Specifications Grid */}
                                            <div className="grid grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] font-mono">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold tracking-wider">Duration</p>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-slate-400" />
                                                        {exam.duration_minutes > 0 ? `${exam.duration_minutes}m` : 'Untimed'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold tracking-wider">Questions</p>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                                                        <FileCheck className="h-3 w-3 text-slate-400" />
                                                        {exam.questions_count} Qs
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold tracking-wider">Total Marks</p>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                                                        <Award className="h-3 w-3 text-amber-500" />
                                                        {exam.total_marks}M
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold tracking-wider">Pass Mark</p>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                                                        <Target className="h-3 w-3 text-emerald-500" />
                                                        {exam.passing_percentage}%
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Details / Progress Bars */}
                                            {status === 'locked' && (
                                                <div className="space-y-2 p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 text-xs">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-1.5">
                                                            <Lock className="h-3 w-3 text-amber-600" />
                                                            Lecture Progress: {progress.completed_lessons} of {progress.total_lessons}
                                                        </span>
                                                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                                                            {progress.progress_percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-amber-200/60 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${progress.progress_percentage}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3 shrink-0" />
                                                        Complete 100% of lectures in classroom to automatically unlock this exam.
                                                    </p>
                                                </div>
                                            )}

                                            {(status === 'passed' || status === 'failed') && submission && (
                                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Your Score</p>
                                                        <p className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                                                            {submission.score} / {submission.total_marks} Marks ({submission.percentage}%)
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Submitted On</p>
                                                        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                                                            {submission.submitted_at}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'ready' && (
                                                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <div className="leading-snug">
                                                        <p className="font-semibold text-emerald-900 dark:text-emerald-200">All lectures completed</p>
                                                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">You are eligible for your single attempt.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button Footer */}
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                            {status === 'ready' && (
                                                <Link
                                                    href={route('student.exams.show', exam.id)}
                                                    onClick={() => {
                                                        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                                                            document.documentElement.requestFullscreen().catch(() => {});
                                                        }
                                                    }}
                                                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer"
                                                >
                                                    <span>Attempt Examination</span>
                                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            )}

                                            {(status === 'passed' || status === 'failed') && (
                                                <Link
                                                    href={route('student.exams.show', exam.id)}
                                                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                                                >
                                                    <span>Review Answers & Results</span>
                                                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            )}

                                            {status === 'locked' && (
                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                                                >
                                                    <Play className="h-3 w-3 fill-current" />
                                                    <span>Continue Course Lectures</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {searchQuery ? 'No matching assessments found' : 'No course exams available yet'}
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                                    {searchQuery
                                        ? 'Try clearing your search query or switching to another filter tab.'
                                        : 'When your enrolled courses have exams published, they will be listed here for you to attempt.'}
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={route('student.courses.enrolled')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                                >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>Browse Enrolled Courses</span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </StudentLayout>
    );
}
