import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    GraduationCap,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    BookOpen,
    FolderTree,
    Edit3,
    Plus,
    X,
    UserCheck,
    FileCheck
} from 'lucide-react';

export default function AdminExamsIndex({ courses, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.exams.index'), { search: search.trim() || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(route('admin.exams.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const courseList = courses.data || [];
    const examsConfigured = courseList.filter((c) => c.exam).length;
    const totalSubmissions = courseList.reduce((acc, c) => acc + (c.exam?.submissions_count || 0), 0);

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                Course Exams & Assessments
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Single Attempt
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                            Manage exam questions, time limits, passing grades, and view student certifications
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Course Exams - Admin" />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Courses</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{courses.total || courseList.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Exams Configured</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{examsConfigured}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-xs col-span-2 sm:col-span-1">
                            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student Submissions</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{totalSubmissions}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by course title or exam title..."
                                    className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Course Exam Cards */}
                    {courseList.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-2">
                            <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">No courses found</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Create courses from the Courses menu to configure their final assessments.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Course</th>
                                            <th className="px-4 py-3">Exam Status</th>
                                            <th className="px-4 py-3">Questions</th>
                                            <th className="px-4 py-3">Duration</th>
                                            <th className="px-4 py-3">Pass Mark</th>
                                            <th className="px-4 py-3">Submissions</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {courseList.map((course) => {
                                            const exam = course.exam;

                                            return (
                                                <tr key={course.id} className="hover:bg-slate-50/60 transition">
                                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                                                            <div>
                                                                <p className="leading-snug">{course.title}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono font-normal">
                                                                    /{course.slug} {course.category ? `• ${course.category.name}` : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {exam ? (
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                                exam.is_published
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            }`}>
                                                                {exam.is_published ? (
                                                                    <>
                                                                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                        Published
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Clock className="h-3 w-3 text-amber-600" />
                                                                        Draft
                                                                    </>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-500">
                                                                Not Set
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                                                        {exam?.questions_count ?? 0}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono text-slate-600">
                                                        {exam ? (exam.duration_minutes > 0 ? `${exam.duration_minutes}m` : 'Untimed') : '-'}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-indigo-600">
                                                        {exam ? `${exam.passing_percentage}%` : '-'}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                                                        {exam?.submissions_count ?? 0}
                                                    </td>

                                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                                        <Link
                                                            href={route('admin.courses.exam.show', course.id)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition ${
                                                                exam
                                                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                            }`}
                                                        >
                                                            {exam ? (
                                                                <>
                                                                    <Edit3 className="h-3.5 w-3.5" />
                                                                    <span>Manage Exam</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                    <span>Create Exam</span>
                                                                </>
                                                            )}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {courses.links && (
                                <div className="p-4 border-t border-slate-100">
                                    <Pagination links={courses.links} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
