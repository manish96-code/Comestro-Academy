import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    Clock,
    Award,
    ArrowRight,
    User,
    Sparkles,
    Compass,
    CheckCircle2
} from 'lucide-react';

export default function StudentDashboard({ student, enrolledCoursesCount = 0, recentEnrollments = [] }) {
    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            Welcome back, {student?.name}! 👋
                        </h1>
                        <p className="text-xs text-gray-500">
                            Track your learning progress, upcoming classes, and account details
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('student.courses.index')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                        >
                            <Compass className="h-3.5 w-3.5" />
                            <span>Explore Courses</span>
                        </Link>
                        <Link
                            href={route('student.profile')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition shrink-0"
                        >
                            <User className="h-3.5 w-3.5" />
                            <span>My Profile</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Student Dashboard" />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Welcome Banner Card */}
                    <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
                        <div className="relative z-10 max-w-xl space-y-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/20 text-white backdrop-blur-xs">
                                <Sparkles className="h-3 w-3" />
                                <span>Student Learning Hub</span>
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Ready to level up your skills today?
                            </h2>
                            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                                Access video lectures, live interactive batches, and industry projects designed by expert mentors.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href={route('student.courses.index')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg shadow-xs transition"
                                >
                                    <Compass className="h-4 w-4" />
                                    <span>Browse Catalog</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <Link
                            href={route('student.courses.enrolled')}
                            className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs flex items-center space-x-4 hover:border-indigo-300 transition group"
                        >
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Enrolled Courses</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">{enrolledCoursesCount}</p>
                            </div>
                        </Link>

                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs flex items-center space-x-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Learning Hours</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">0 hrs</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs flex items-center space-x-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Certificates Earned</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">0</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Enrolled Courses or Explore Callout */}
                    {recentEnrollments.length > 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Your Active Courses</h3>
                                    <p className="text-xs text-gray-500">Pick up right where you left off</p>
                                </div>
                                <Link
                                    href={route('student.courses.enrolled')}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                    <span>View All ({enrolledCoursesCount})</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {recentEnrollments.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition flex flex-col justify-between"
                                    >
                                        <div className="space-y-2">
                                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 rounded">
                                                {item.course?.category?.name || 'General'}
                                            </span>
                                            <h4 className="text-xs font-bold text-gray-900 line-clamp-2">
                                                {item.course?.title}
                                            </h4>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Enrolled</span>
                                            </span>
                                            <span className="text-[11px] text-gray-400">
                                                {item.course?.duration || 'Self-paced'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Explore Available Courses</h3>
                                    <p className="text-xs text-gray-500">
                                        You have not enrolled in any courses yet. Browse our catalog and start learning today!
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('student.courses.index')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                            >
                                <Compass className="h-3.5 w-3.5" />
                                <span>Browse Courses</span>
                            </Link>
                        </div>
                    )}

                    {/* Quick Access Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-gray-900">Personal Account & Settings</h3>
                            <p className="text-xs text-gray-500">
                                Keep your contact details, phone number, and password up to date.
                            </p>
                        </div>
                        <Link
                            href={route('student.profile')}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-xs transition shrink-0"
                        >
                            <span>Go to My Profile</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
