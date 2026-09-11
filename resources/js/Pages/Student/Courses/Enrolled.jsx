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
    ArrowRight
} from 'lucide-react';

export default function EnrolledCourses({ enrollments }) {
    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            My Enrolled Courses
                        </h1>
                        <p className="text-xs text-gray-500">
                            Track and access all your active courses and learning materials
                        </p>
                    </div>
                    <Link
                        href={route('student.courses.index')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                    >
                        <Compass className="h-3.5 w-3.5" />
                        <span>Explore More Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="My Enrolled Courses - Student Portal" />

            <div className="py-6 bg-gray-50">
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
                                        className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                                    >
                                        <div>
                                            {/* Thumbnail / Header */}
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

                                                {/* Status Badge */}
                                                <div className="absolute top-3 right-3 z-20">
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                </div>

                                                <div className="absolute top-3 left-3 z-20">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-600 text-white shadow-xs">
                                                        {course.category?.name || 'Tech'}
                                                    </span>
                                                </div>
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

                                                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5 text-gray-700 font-medium truncate max-w-[60%]">
                                                            <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                            <span className="truncate">
                                                                {instructorUser?.name || 'Academy Mentor'}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-400">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span>{course.duration || 'Self-paced'}</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span>Enrolled on {enrolledDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="p-5 pt-0">
                                            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                                    <span>Course Materials</span>
                                                </div>
                                                <Link
                                                    href={route('student.courses.learn', course.id)}
                                                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs transition inline-flex items-center gap-1"
                                                >
                                                    <span>Start Learning</span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </Link>
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
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-gray-900">No Enrolled Courses Yet</h3>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    You have not enrolled in any courses yet. Browse our published courses catalog and enroll with one click.
                                </p>
                            </div>
                            <Link
                                href={route('student.courses.index')}
                                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-1.5"
                            >
                                <Compass className="h-4 w-4" />
                                <span>Browse Courses Catalog</span>
                            </Link>
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
