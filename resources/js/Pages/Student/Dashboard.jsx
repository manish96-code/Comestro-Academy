import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    Clock,
    Award,
    ArrowRight,
    User,
    Sparkles
} from 'lucide-react';

export default function StudentDashboard({ student }) {
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
                    <Link
                        href={route('student.profile')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-lg transition shrink-0"
                    >
                        <User className="h-3.5 w-3.5" />
                        <span>Manage Profile</span>
                    </Link>
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
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs flex items-center space-x-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Enrolled Courses</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">0</p>
                            </div>
                        </div>

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
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
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
