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
    RotateCcw
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
                            Exams unlock automatically when you reach 100% lecture completion
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

            <div className="space-y-6">

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Exams</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{stats.total || exams.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60">
                                <Unlock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ready to Attempt</p>
                                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{stats.ready || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Passed & Certified</p>
                                <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">{stats.passed || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Locked</p>
                                <p className="text-xl font-black text-slate-700 dark:text-slate-300 font-mono">{stats.locked || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setFilterTab('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                filterTab === 'all'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            All ({exams.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('ready')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                filterTab === 'ready'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Ready to Attempt ({stats.ready || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('passed')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                filterTab === 'passed'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Passed ({stats.passed || 0})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('locked')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                                filterTab === 'locked'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Locked ({stats.locked || 0})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search exams or courses..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Exams Grid / List */}
                {filteredExams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredExams.map((item) => {
                            const { course, exam, progress, submission, status } = item;

                            return (
                                <div
                                    key={exam.id}
                                    className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-700"
                                >
                                    <div className="space-y-3">
                                        {/* Header Row: Category & Status Badge */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                {course.category?.name || 'Course Assessment'}
                                            </span>

                                            {status === 'ready' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                    <Unlock className="h-3 w-3" />
                                                    Ready to Attempt
                                                </span>
                                            )}

                                            {status === 'passed' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Passed • {submission.percentage}%
                                                </span>
                                            )}

                                            {status === 'failed' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                    <XCircle className="h-3 w-3" />
                                                    Submitted • {submission.percentage}%
                                                </span>
                                            )}

                                            {status === 'locked' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                    <Lock className="h-3 w-3" />
                                                    Locked ({progress.progress_percentage}% Done)
                                                </span>
                                            )}
                                        </div>

                                        {/* Exam Title & Course Link */}
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                                {exam.title}
                                            </h2>
                                            <Link
                                                href={route('student.courses.learn', course.id)}
                                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium line-clamp-1 mt-0.5 inline-block"
                                            >
                                                Course: {course.title}
                                            </Link>
                                        </div>

                                        {/* Specs Pills */}
                                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 dark:border-slate-800/80 text-[11px] font-mono">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Questions</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {exam.questions_count} Qs
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Total Marks</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {exam.total_marks} Marks
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Passing</p>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {exam.passing_percentage}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Course Progress or Submission Result info */}
                                        {status === 'locked' && (
                                            <div className="space-y-1.5 pt-1">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                                                        Lectures Completed: {progress.completed_lessons} / {progress.total_lessons}
                                                    </span>
                                                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                                        {progress.progress_percentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${progress.progress_percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                                                    Watch 100% of course lectures to unlock this exam.
                                                </p>
                                            </div>
                                        )}

                                        {(status === 'passed' || status === 'failed') && submission && (
                                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Your Score</p>
                                                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                                                        {submission.score} / {submission.total_marks} marks ({submission.percentage}%)
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {submission.submitted_at}
                                                </span>
                                            </div>
                                        )}

                                        {status === 'ready' && (
                                            <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                <span>All lectures finished! You are eligible for 1 attempt.</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                        {status === 'ready' && (
                                            <Link
                                                href={route('student.courses.exam.show', course.id)}
                                                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                                            >
                                                <span>Attempt Exam Now</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        )}

                                        {(status === 'passed' || status === 'failed') && (
                                            <Link
                                                href={route('student.courses.exam.show', course.id)}
                                                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                                            >
                                                <span>Review Submission</span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        )}

                                        {status === 'locked' && (
                                            <Link
                                                href={route('student.courses.learn', course.id)}
                                                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                                            >
                                                <Play className="h-3.5 w-3.5" />
                                                <span>Continue Lectures</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                            {searchQuery ? 'No matching exams found' : 'No course exams available'}
                        </h2>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            {searchQuery
                                ? 'Try clearing your search query or switching tabs.'
                                : 'When your enrolled courses have exams published by instructors, they will be listed here for you to attempt upon completing 100% of course lectures.'}
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('student.courses.enrolled')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-2xs"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>Go to My Enrolled Courses</span>
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </StudentLayout>
    );
}
