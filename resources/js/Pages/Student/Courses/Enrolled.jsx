import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    User,
    CheckCircle2,
    Calendar,
    Compass,
    GraduationCap,
    ArrowRight,
    Play,
    Terminal
} from 'lucide-react';

export default function EnrolledCourses({ enrollments }) {
    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                            My Enrolled Courses
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Track your learning progress, resume lectures, and access study materials
                        </p>
                    </div>
                    <Link
                        href={route('courses.index')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition shrink-0"
                    >
                        <Compass className="h-3.5 w-3.5" />
                        <span>Explore More Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Enrolled Courses - Comestro Academy" />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {enrollments.data && enrollments.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrollments.data.map((enrollment) => {
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

                                return (
                                    <div
                                        key={enrollment.id}
                                        className="bg-white rounded-xl border border-gray-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition flex flex-col justify-between overflow-hidden group"
                                    >
                                        <div>
                                            {/* Thumbnail / Visual Header */}
                                            <div className="relative h-44 bg-slate-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : null}

                                                {/* Fallback Graphic */}
                                                <div className="flex flex-col items-center justify-center text-center space-y-1 p-4">
                                                    <div className="p-3 bg-white rounded-xl text-indigo-600 border border-gray-200 shadow-2xs">
                                                        <Terminal className="h-7 w-7" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase font-mono mt-1">
                                                        {course.category?.name || 'Comestro Academy'}
                                                    </span>
                                                </div>

                                                {/* Category & Status Badges */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase font-mono rounded-md bg-white/95 text-indigo-700 border border-gray-200 shadow-2xs">
                                                        {course.category?.name || 'Coding'}
                                                    </span>
                                                </div>

                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                        Active
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body Information */}
                                            <div className="p-5 space-y-3">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                                                    {course.title}
                                                </h3>

                                                {course.description && (
                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                        {course.description}
                                                    </p>
                                                )}

                                                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5 text-gray-700 font-medium truncate max-w-[65%]">
                                                            <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                            <span className="truncate">
                                                                {instructorUser?.name || 'Academy Mentor'}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-400 shrink-0">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{course.duration || 'Self-paced'}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-mono">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Enrolled on {enrolledDate}</span>
                                                    </div>
                                                </div>

                                                {/* Course Completion Progress Bar */}
                                                {course.progress && course.progress.total_lessons > 0 ? (
                                                    <div className="pt-3 border-t border-gray-100 space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-semibold text-gray-700 flex items-center gap-1">
                                                                {course.progress.is_completed ? (
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                                ) : (
                                                                    <Play className="h-3 w-3 text-indigo-600 fill-current" />
                                                                )}
                                                                <span>Progress</span>
                                                            </span>
                                                            <span className={`font-bold font-mono text-xs ${
                                                                course.progress.is_completed ? 'text-emerald-600' : 'text-indigo-600'
                                                            }`}>
                                                                {course.progress.progress_percentage}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                                    course.progress.is_completed ? 'bg-emerald-500' : 'bg-indigo-600'
                                                                }`}
                                                                style={{ width: `${course.progress.progress_percentage}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                                                            <span>
                                                                {course.progress.completed_lessons} of {course.progress.total_lessons} lessons completed
                                                            </span>
                                                            {course.progress.is_completed && (
                                                                <span className="text-emerald-600 font-bold uppercase text-[10px]">
                                                                    Completed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="pt-3 border-t border-gray-100 space-y-1.5">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-semibold text-gray-700 flex items-center gap-1">
                                                                <Play className="h-3 w-3 text-indigo-600 fill-current" />
                                                                <span>Progress</span>
                                                            </span>
                                                            <span className="font-bold font-mono text-xs text-indigo-600">
                                                                0%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div className="h-2 rounded-full bg-indigo-600" style={{ width: '0%' }} />
                                                        </div>
                                                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                                                            <span>Ready to start</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="p-4 pt-0 bg-white">
                                            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-2">
                                                <Link
                                                    href={route('courses.show', course.slug || course.id)}
                                                    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
                                                >
                                                    <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                                                    <span>Syllabus</span>
                                                </Link>

                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className={`px-3.5 py-1.5 font-semibold text-xs rounded-lg shadow-2xs transition inline-flex items-center gap-1.5 text-white ${
                                                        course.progress?.is_completed
                                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                                    }`}
                                                >
                                                    <Play className="h-3 w-3 fill-current" />
                                                    <span>
                                                        {course.progress?.is_completed
                                                            ? 'Review Course'
                                                            : (course.progress?.completed_lessons || 0) > 0
                                                            ? 'Continue Learning'
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
                        /* Clean Empty State */
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-4 shadow-2xs">
                            <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Terminal className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-gray-900">No Enrolled Courses Yet</h3>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                                    You have not enrolled in any coding courses yet. Explore our published courses catalog to start learning.
                                </p>
                            </div>
                            <div>
                                <Link
                                    href={route('courses.index')}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition inline-flex items-center gap-1.5"
                                >
                                    <Compass className="h-4 w-4" />
                                    <span>Browse Courses Catalog</span>
                                </Link>
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
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white shadow-2xs'
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
