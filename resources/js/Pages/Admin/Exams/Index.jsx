import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
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
    HelpCircle,
    ArrowRight,
    User,
} from 'lucide-react';

export default function AdminExamsIndex({ exams = { data: [] }, courses = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        examId: null,
        examTitle: '',
        isDeleting: false,
    });

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
        handleFilter(search, courseId);
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
        passing_percentage: 60,
        is_published: true,
    });

    const handleOpenCreateModal = (preselectedCourseId = '') => {
        setCreateData({
            course_id: preselectedCourseId || courseId || courses[0]?.id || '',
            title: '',
            description: '',
            duration_minutes: 30,
            marks_per_question: 1,
            passing_percentage: 60,
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

    const openDeleteModal = (exam) => {
        setDeleteModal({
            isOpen: true,
            examId: exam.id,
            examTitle: exam.title,
            isDeleting: false,
        });
    };

    const confirmDeleteExam = () => {
        if (!deleteModal.examId) return;

        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

        router.delete(route('admin.exams.destroy', deleteModal.examId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setDeleteModal({
                    isOpen: false,
                    examId: null,
                    examTitle: '',
                    isDeleting: false,
                });
            },
            onError: () => {
                setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
            },
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
                                                                {exam.creator && (
                                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-normal mt-0.5">
                                                                        <User className="h-3 w-3 text-slate-400 shrink-0" />
                                                                        <span>Created by <strong className="text-slate-700 dark:text-slate-300 font-medium">{exam.creator.name}</strong></span>
                                                                    </p>
                                                                )}
                                                                {exam.description && (
                                                                    <p className="text-[10px] text-slate-400 line-clamp-1 font-normal mt-0.5">
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
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${exam.is_published
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
                                                                onClick={() => openDeleteModal(exam)}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center shrink-0">
                                    <Award className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                        Create Course Examination
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Configure assessment parameters, timing, and passing criteria.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                                title="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4.5 text-xs max-h-[80vh] overflow-y-auto">
                            {/* Course Selection */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <InputLabel
                                        htmlFor="create_course_id"
                                        value="Associated Course *"
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                    />
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {courses.length} courses available
                                    </span>
                                </div>
                                <div className="relative">
                                    <select
                                        id="create_course_id"
                                        value={createData.course_id}
                                        onChange={(e) => setCreateData('course_id', e.target.value)}
                                        className="block w-full text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white py-2.5 pl-3.5 pr-10 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition shadow-2xs"
                                    >
                                        <option value="" disabled>Select course to attach exam...</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={createErrors.course_id} className="mt-1" />
                            </div>

                            {/* Exam Title */}
                            <div className="space-y-1.5">
                                <InputLabel
                                    htmlFor="create_title"
                                    value="Exam Title *"
                                    className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                />
                                <TextInput
                                    id="create_title"
                                    type="text"
                                    value={createData.title}
                                    onChange={(e) => setCreateData('title', e.target.value)}
                                    className="block w-full text-xs font-medium rounded-xl py-2.5 px-3.5 border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                                    placeholder="e.g. Final Certification Assessment: Architecture & Standards"
                                />
                                <InputError message={createErrors.title} className="mt-1" />
                            </div>

                            {/* Description / Instructions */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <InputLabel
                                        htmlFor="create_description"
                                        value="Student Instructions / Summary"
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                    />
                                    <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                                </div>
                                <textarea
                                    id="create_description"
                                    rows={2}
                                    value={createData.description}
                                    onChange={(e) => setCreateData('description', e.target.value)}
                                    className="block w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 shadow-2xs transition resize-none"
                                    placeholder="Brief guidelines displayed to students prior to starting their attempt..."
                                />
                                <InputError message={createErrors.description} className="mt-1" />
                            </div>

                            {/* Assessment Parameters */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                {/* Duration */}
                                <div className="space-y-1.5">
                                    <InputLabel
                                        htmlFor="create_duration"
                                        value="Duration (Minutes) *"
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="create_duration"
                                            type="number"
                                            min="0"
                                            max="360"
                                            value={createData.duration_minutes}
                                            onChange={(e) => setCreateData('duration_minutes', e.target.value)}
                                            className="block w-full text-xs font-medium rounded-xl py-2.5 pl-3.5 pr-12 border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                                            placeholder="30"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-slate-400 font-medium">
                                            mins
                                        </span>
                                    </div>
                                    <InputError message={createErrors.duration_minutes} className="mt-1" />
                                </div>

                                {/* Marks per Question */}
                                <div className="space-y-1.5">
                                    <InputLabel
                                        htmlFor="create_marks"
                                        value="Marks per Question *"
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="create_marks"
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={createData.marks_per_question}
                                            onChange={(e) => setCreateData('marks_per_question', e.target.value)}
                                            className="block w-full text-xs font-medium rounded-xl py-2.5 pl-3.5 pr-12 border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                                            placeholder="1"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-slate-400 font-medium">
                                            pts
                                        </span>
                                    </div>
                                    <InputError message={createErrors.marks_per_question} className="mt-1" />
                                </div>

                                {/* Passing Percentage */}
                                <div className="space-y-1.5">
                                    <InputLabel
                                        htmlFor="create_pass"
                                        value="Passing Percentage (%) *"
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="create_pass"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={createData.passing_percentage}
                                            onChange={(e) => setCreateData('passing_percentage', e.target.value)}
                                            className="block w-full text-xs font-medium rounded-xl py-2.5 pl-3.5 pr-8 border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                                            placeholder="60"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-slate-400 font-medium">
                                            %
                                        </span>
                                    </div>
                                    <InputError message={createErrors.passing_percentage} className="mt-1" />
                                </div>
                            </div>

                            {/* Publish Immediately Interactive Switch Card */}
                            <div
                                onClick={() => setCreateData('is_published', !createData.is_published)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${createData.is_published
                                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg shrink-0 transition ${createData.is_published
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                        }`}>
                                        <FileCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Publish Exam Immediately
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            Students who finish all lectures can attempt this exam.
                                        </p>
                                    </div>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${createData.is_published ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                                    }`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${createData.is_published ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </div>
                            </div>

                            {/* Actions & Footer */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                                >
                                    <span>{createProcessing ? 'Creating Exam...' : 'Create & Configure Questions'}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, examId: null, examTitle: '', isDeleting: false })}
                onConfirm={confirmDeleteExam}
                processing={deleteModal.isDeleting}
                title="Delete Exam?"
                message={
                    <p>
                        Are you sure you want to delete the exam <span className="font-semibold text-slate-900 dark:text-white">"{deleteModal.examTitle}"</span>? All associated questions and student submissions will be permanently deleted.
                    </p>
                }
                confirmText="Yes, Delete Exam"
                cancelText="Cancel"
                variant="danger"
            />
        </AdminLayout>
    );
}
