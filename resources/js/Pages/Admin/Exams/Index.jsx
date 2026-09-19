import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    GraduationCap,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    BookOpen,
    Edit3,
    Plus,
    X,
    UserCheck,
    FileCheck,
    Trash2,
    HelpCircle
} from 'lucide-react';

export default function AdminExamsIndex({ exams = { data: [] }, courses = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleFilter = (newSearch, newCourseId) => {
        router.get(
            route('admin.exams.index'),
            {
                search: newSearch !== undefined ? newSearch : search,
                course_id: newCourseId !== undefined ? newCourseId : courseId,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilter(search.trim() || undefined, courseId || undefined);
    };

    const clearFilters = () => {
        setSearch('');
        setCourseId('');
        router.get(route('admin.exams.index'), {}, { preserveState: true, replace: true });
    };

    // Create Exam Form
    const {
        data: createData,
        setData: setCreateData,
        post: postCreateExam,
        processing: createProcessing,
        errors: createErrors,
        reset: resetCreateForm,
    } = useForm({
        course_id: courses[0]?.id || '',
        title: '',
        description: '',
        duration_minutes: 30,
        marks_per_question: 1,
        passing_percentage: 70,
        is_published: true,
    });

    const handleOpenCreateModal = (preselectedCourseId = '') => {
        setCreateData({
            course_id: preselectedCourseId || courseId || courses[0]?.id || '',
            title: '',
            description: '',
            duration_minutes: 30,
            marks_per_question: 1,
            passing_percentage: 70,
            is_published: true,
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!createData.course_id) {
            alert('Please select a course.');
            return;
        }

        postCreateExam(route('admin.courses.exams.store', createData.course_id), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreateForm();
            },
        });
    };

    const handleDeleteExam = (exam) => {
        if (!confirm(`Are you sure you want to delete the exam "${exam.title}"? All associated questions and student submissions will be permanently deleted.`)) {
            return;
        }

        router.delete(route('admin.exams.destroy', exam.id), {
            preserveScroll: true,
        });
    };

    const examList = exams.data || [];

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Course Exams & Assessments
                            </h1>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                Multiple Exams Per Course
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Manage exam questions, time limits, passing grades, and view student certifications
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenCreateModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create New Exam</span>
                    </button>
                </div>
            }
        >
            <Head title="Course Exams - Admin" />

            <div className="py-6 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Exams</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">{stats.total_exams ?? examList.length}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Published</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">{stats.published_exams ?? 0}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Questions Bank</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">{stats.total_questions ?? 0}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Submissions</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white font-mono">{stats.total_submissions ?? 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <form onSubmit={handleSearchSubmit} className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by exam title or course title..."
                                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            handleFilter('', courseId || undefined);
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </form>

                            <div className="flex items-center gap-2">
                                <select
                                    value={courseId}
                                    onChange={(e) => {
                                        setCourseId(e.target.value);
                                        handleFilter(search || undefined, e.target.value || undefined);
                                    }}
                                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-indigo-500 focus:ring-indigo-500 font-medium"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>

                                {(search || courseId) && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exams Table */}
                    {examList.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center space-y-3">
                            <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No exams found</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Create assessments, quizzes, or final certification exams for your courses.
                            </p>
                            <button
                                type="button"
                                onClick={() => handleOpenCreateModal()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create First Exam</span>
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                                        <tr>
                                            <th className="px-4 py-3">Exam Title</th>
                                            <th className="px-4 py-3">Course</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Questions</th>
                                            <th className="px-4 py-3">Duration</th>
                                            <th className="px-4 py-3">Pass Mark</th>
                                            <th className="px-4 py-3">Submissions</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {examList.map((exam) => {
                                            const course = exam.course;
                                            const marksPerQ = exam.marks_per_question ?? 1;
                                            const totalMarks = (exam.questions_count ?? 0) * marksPerQ;

                                            return (
                                                <tr key={exam.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                                                        <div className="flex items-center gap-2">
                                                            <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                                            <div>
                                                                <Link
                                                                    href={route('admin.exams.show', exam.id)}
                                                                    className="hover:text-indigo-600 transition leading-snug"
                                                                >
                                                                    {exam.title}
                                                                </Link>
                                                                {exam.description && (
                                                                    <p className="text-[10px] text-slate-400 line-clamp-1 font-normal">
                                                                        {exam.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {course ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                                <div>
                                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{course.title}</p>
                                                                    {course.category && (
                                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                                            {course.category.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic">No course</span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                            exam.is_published
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
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
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                        {exam.questions_count ?? 0}
                                                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                                                            ({totalMarks} marks)
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                                                        {exam.duration_minutes > 0 ? `${exam.duration_minutes}m` : 'Untimed'}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {exam.passing_percentage}%
                                                    </td>

                                                    <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                        {exam.submissions_count ?? 0}
                                                    </td>

                                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link
                                                                href={route('admin.exams.show', exam.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition border border-indigo-200 dark:border-indigo-800"
                                                                title="Manage Questions & Settings"
                                                            >
                                                                <Edit3 className="h-3.5 w-3.5" />
                                                                <span>Manage</span>
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteExam(exam)}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                                                                title="Delete Exam"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {exams.links && (
                                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                                    <Pagination links={exams.links} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Exam Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Exam</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
                            <div>
                                <InputLabel htmlFor="create_course_id" value="Course *" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                <select
                                    id="create_course_id"
                                    value={createData.course_id}
                                    onChange={(e) => setCreateData('course_id', e.target.value)}
                                    className="mt-1 block w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-500 font-medium"
                                    required
                                >
                                    <option value="" disabled>Select a course</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={createErrors.course_id} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="create_title" value="Exam Title *" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                <TextInput
                                    id="create_title"
                                    type="text"
                                    value={createData.title}
                                    onChange={(e) => setCreateData('title', e.target.value)}
                                    className="mt-1 block w-full text-xs rounded-xl"
                                    placeholder="e.g. Midterm Assessment: Core Concepts"
                                    required
                                />
                                <InputError message={createErrors.title} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="create_description" value="Description / Instructions" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                <textarea
                                    id="create_description"
                                    rows={2}
                                    value={createData.description}
                                    onChange={(e) => setCreateData('description', e.target.value)}
                                    className="mt-1 block w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-indigo-500"
                                    placeholder="Brief instructions for students taking this exam..."
                                />
                                <InputError message={createErrors.description} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <InputLabel htmlFor="create_duration" value="Duration (mins)" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                    <TextInput
                                        id="create_duration"
                                        type="number"
                                        min="0"
                                        max="360"
                                        value={createData.duration_minutes}
                                        onChange={(e) => setCreateData('duration_minutes', e.target.value)}
                                        className="mt-1 block w-full text-xs rounded-xl"
                                        required
                                    />
                                    <InputError message={createErrors.duration_minutes} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="create_marks" value="Marks / Question" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                    <TextInput
                                        id="create_marks"
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={createData.marks_per_question}
                                        onChange={(e) => setCreateData('marks_per_question', e.target.value)}
                                        className="mt-1 block w-full text-xs rounded-xl"
                                        required
                                    />
                                    <InputError message={createErrors.marks_per_question} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="create_pass" value="Passing %" className="text-xs font-semibold text-slate-700 dark:text-slate-200" />
                                    <TextInput
                                        id="create_pass"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={createData.passing_percentage}
                                        onChange={(e) => setCreateData('passing_percentage', e.target.value)}
                                        className="mt-1 block w-full text-xs rounded-xl"
                                        required
                                    />
                                    <InputError message={createErrors.passing_percentage} className="mt-1" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    id="create_published"
                                    type="checkbox"
                                    checked={createData.is_published}
                                    onChange={(e) => setCreateData('is_published', e.target.checked)}
                                    className="rounded border-slate-300 text-indigo-600 shadow-xs focus:ring-indigo-500"
                                />
                                <label htmlFor="create_published" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Publish immediately (students can attempt once eligible)
                                </label>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                                >
                                    {createProcessing ? 'Creating...' : 'Create & Configure'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
