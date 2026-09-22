import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    Clock,
    Award,
    ArrowRight,
    Compass,
    CheckCircle2,
    Play,
    User,
    Video,
    FileText,
    Code,
    Sparkles,
    ChevronRight,
    Layers,
    Terminal
} from 'lucide-react';

export default function StudentDashboard({ student, enrolledCoursesCount = 0, recentEnrollments = [] }) {
    const mostRecent = recentEnrollments.length > 0 ? recentEnrollments[0] : null;

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Welcome back, {student?.name || 'Student'}
                            </h1>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                Active Learner
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Pick up where you left off and keep building your coding skills
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Student Dashboard - Comestro Academy" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Section 1: Prominent Continue Learning Card */}
                    {mostRecent && mostRecent.course ? (
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 font-mono">
                                            <Play className="h-2.5 w-2.5 fill-current" />
                                            Continue Learning
                                        </span>
                                        {mostRecent.course.category && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {mostRecent.course.category.name}
                                            </span>
                                        )}
                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                            Enrolled {new Date(mostRecent.enrolled_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                            {mostRecent.course.title}
                                        </h2>
                                        {mostRecent.course.description && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed max-w-2xl">
                                                {mostRecent.course.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-slate-400" />
                                            <span>Mentor: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{mostRecent.course.instructor?.user?.name || 'Comestro Mentor'}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            <span>{mostRecent.course.duration || 'Self-paced curriculum'}</span>
                                        </div>
                                        {mostRecent.course.level && (
                                            <div className="flex items-center gap-1.5">
                                                <Layers className="h-3.5 w-3.5 text-slate-400" />
                                                <span className="capitalize">{mostRecent.course.level}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 sm:w-auto lg:w-48 justify-center">
                                    <Link
                                        href={route('student.courses.learn', mostRecent.course.id)}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-xs transition"
                                    >
                                        <Play className="h-3.5 w-3.5 fill-current" />
                                        <span>Resume Classroom</span>
                                    </Link>
                                    <Link
                                        href={route('courses.show', mostRecent.course.slug || mostRecent.course.id)}
                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-md transition"
                                    >
                                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                                        <span>View Syllabus</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State: No Enrollments */
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-start space-x-4 max-w-xl">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-800">
                                    <Terminal className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                                        Coding Education Platform
                                    </span>
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        Start your hands-on coding curriculum
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Enroll in full-stack, backend, and language-specific courses. Gain access to video lectures, downloadable notes, source code, and live interactive coding sessions.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('courses.index')}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-xs transition shrink-0"
                            >
                                <Compass className="h-4 w-4" />
                                <span>Explore Courses Catalog</span>
                            </Link>
                        </div>
                    )}

                    {/* Section 2: Metrics Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href={route('student.courses.enrolled')}
                            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3.5">
                                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md group-hover:bg-indigo-600 group-hover:text-white transition">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                        Enrolled Courses
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                        {enrolledCoursesCount} <span className="text-xs font-normal text-slate-400">active</span>
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                        </Link>

                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                            <div className="flex items-center space-x-3.5">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                        Student ID
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                        #{student?.id || '—'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800">
                                Verified
                            </span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                            <div className="flex items-center space-x-3.5">
                                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-md">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                        Certificates
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                        0 <span className="text-xs font-normal text-slate-400">earned</span>
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                Soon
                            </span>
                        </div>
                    </div>

                    {/* Section 3: Active Enrolled Courses Cards */}
                    {recentEnrollments.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Enrolled Courses</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Pick up where you stopped and continue learning</p>
                                </div>
                                <Link
                                    href={route('student.courses.enrolled')}
                                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition"
                                >
                                    <span>View All ({enrolledCoursesCount})</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentEnrollments.map((item) => {
                                    const course = item.course;
                                    if (!course) return null;
                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between overflow-hidden"
                                        >
                                            <div className="p-4 space-y-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 rounded-md font-mono truncate max-w-[140px]">
                                                        {course.category?.name || 'Coding'}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                </div>

                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                                    {course.title}
                                                </h4>

                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span className="truncate max-w-[120px]">
                                                        {course.instructor?.user?.name || 'Mentor'}
                                                    </span>
                                                    <span>{course.duration || 'Self-paced'}</span>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <Link
                                                    href={route('courses.show', course.slug || course.id)}
                                                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                                                >
                                                    Overview
                                                </Link>
                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition shadow-2xs"
                                                >
                                                    <Play className="h-3 w-3 fill-current" />
                                                    <span>Continue</span>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section 4: Learning Resources & Live Support Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
                            <div className="flex items-center space-x-2.5 text-slate-900 dark:text-white font-bold text-xs">
                                <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-md">
                                    <Video className="h-4 w-4" />
                                </div>
                                <span>Live Interactive Classes & Recordings</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Join interactive live coding batches, participate in real-time doubt clearing sessions, and access past class recordings directly inside enrolled courses.
                            </p>
                            <div className="pt-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                    Integrated into Classroom Curriculum
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
                            <div className="flex items-center space-x-2.5 text-slate-900 dark:text-white font-bold text-xs">
                                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span>Study Notes, Code & Assignments</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Download lecture PDFs, source code snippets, and cheat sheets uploaded by mentors to practice locally in your code editor.
                            </p>
                            <div className="pt-1">
                                <Link
                                    href={route('student.profile')}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                                >
                                    <span>Manage Student Profile & Portfolio</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
