import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Edit3,
    Plus,
    BookOpen,
    FolderTree,
    Clock,
    Sparkles,
    User,
    X,
    Video,
    Radio,
    Filter,
    Users,
    UserPlus,
    CheckCircle2,
    XCircle,
    Trash2,
    GraduationCap,
    ExternalLink
} from 'lucide-react';

export default function CourseIndex({ courses, categories = [], students = [], filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryId, setCategoryId] = useState(filters?.category_id || '');
    const [status, setStatus] = useState(filters?.status || '');

    // Enrolled Students Modal state
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [studentModalSearch, setStudentModalSearch] = useState('');
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [enrollUserId, setEnrollUserId] = useState('');
    const [enrollStatus, setEnrollStatus] = useState('active');
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        enrollmentId: null,
        studentName: '',
        courseTitle: '',
    });

    const [deleteCourseModal, setDeleteCourseModal] = useState({
        isOpen: false,
        courseId: null,
        courseTitle: '',
    });

    const activeCourse = selectedCourseId ? courses.data?.find((c) => c.id === selectedCourseId) : null;
    const enrolledStudents = activeCourse?.enrollments || [];

    const filteredEnrolledStudents = enrolledStudents.filter((enr) => {
        if (!studentModalSearch.trim()) return true;
        const term = studentModalSearch.toLowerCase();
        const st = enr.user;
        return (
            st?.name?.toLowerCase().includes(term) ||
            st?.email?.toLowerCase().includes(term) ||
            st?.phone?.toLowerCase().includes(term)
        );
    });

    const availableStudentsToEnroll = students.filter(
        (st) => !enrolledStudents.some((enr) => enr.user_id === st.id)
    );

    const openStudentsModal = (course) => {
        setSelectedCourseId(course.id);
        setStudentModalSearch('');
        setShowEnrollForm(false);
        setEnrollUserId('');
        setEnrollStatus('active');
    };

    const closeStudentsModal = () => {
        setSelectedCourseId(null);
        setShowEnrollForm(false);
    };

    const handleUpdateStatus = (enrollmentId, newStatus) => {
        router.patch(
            route('admin.enrollments.update', enrollmentId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleEnrollStudent = (e) => {
        e.preventDefault();
        if (!enrollUserId || !selectedCourseId) return;

        setIsEnrolling(true);
        router.post(
            route('admin.enrollments.store'),
            {
                course_id: selectedCourseId,
                user_id: enrollUserId,
                status: enrollStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEnrollUserId('');
                    setShowEnrollForm(false);
                    setIsEnrolling(false);
                },
                onError: () => {
                    setIsEnrolling(false);
                },
            }
        );
    };

    const handleDeleteEnrollment = () => {
        if (!deleteModal.enrollmentId) return;

        router.delete(route('admin.enrollments.destroy', deleteModal.enrollmentId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, enrollmentId: null, studentName: '', courseTitle: '' });
            },
        });
    };

    const handleDeleteCourse = () => {
        if (!deleteCourseModal.courseId) return;

        router.delete(route('admin.courses.destroy', deleteCourseModal.courseId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteCourseModal({ isOpen: false, courseId: null, courseTitle: '' });
            },
        });
    };

    const hasActiveFilters = Boolean(search || categoryId || status);

    const clearFilters = () => {
        setSearch('');
        setCategoryId('');
        setStatus('');
        router.get(route('admin.courses.index'), {}, { preserveState: false });
    };

    const handleFilter = (newSearch, newCat, newStat) => {
        router.get(
            route('admin.courses.index'),
            {
                search: newSearch || undefined,
                category_id: newCat || undefined,
                status: newStat || undefined,
            },
            { preserveState: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilter(search, categoryId, status);
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setCategoryId(val);
        handleFilter(search, val, status);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        handleFilter(search, categoryId, val);
    };

    const getStatusBadge = (courseStatus) => {
        switch (courseStatus) {
            case 'published':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Published
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Draft
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Archived
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                            Courses & Curriculums
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            Manage curriculum, pricing, instructor allocations, and video content
                        </p>
                    </div>
                    <Link
                        href={route('admin.courses.create')}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition shrink-0"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Course</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Header Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl bg-white p-3.5 sm:p-4 border border-slate-200 shadow-2xs">
                        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses, slugs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-2xs"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Category Filter */}
                            <select
                                value={categoryId}
                                onChange={handleCategoryChange}
                                className="text-xs rounded-lg border border-slate-300 bg-white text-slate-700 py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className="text-xs rounded-lg border border-slate-300 bg-white text-slate-700 py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
                            >
                                <option value="">All Statuses</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <X className="h-3 w-3" />
                                    <span>Reset</span>
                                </button>
                            )}

                            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                                Total: <strong className="text-slate-900 font-bold ml-0.5">{courses?.total || 0}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left">
                                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider font-mono">
                                    <tr>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Course</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Category</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Instructor</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Pricing</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Duration</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Status</th>
                                        <th scope="col" className="py-2.5 px-4 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                                    {courses?.data && courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <tr key={course.id} className="hover:bg-slate-50/70 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="h-10 w-14 rounded-md object-cover border border-slate-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-14 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                                                                <BookOpen className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                        <div className="space-y-0.5 min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Link
                                                                    href={route('admin.courses.show', course.id)}
                                                                    className="font-bold text-slate-900 hover:text-indigo-600 transition truncate max-w-xs"
                                                                >
                                                                    {course.title}
                                                                </Link>
                                                                {course.type === 'live' ? (
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                        <span className="relative flex h-1.5 w-1.5">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                                                        </span>
                                                                        <span>Live</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                                        <Video className="h-2.5 w-2.5 text-slate-500" />
                                                                        <span>Recorded</span>
                                                                    </span>
                                                                )}
                                                                {course.is_featured && (
                                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                                        <Sparkles className="h-2.5 w-2.5" />
                                                                        <span>Featured</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="font-mono text-[10px] text-slate-400 truncate">/{course.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.category ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                            <FolderTree className="h-3 w-3 text-slate-500" />
                                                            <span>{course.category.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">None</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.instructor?.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {course.instructor.user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900 leading-tight">{course.instructor.user.name}</p>
                                                                <p className="text-[10px] text-slate-400">{course.instructor.designation || 'Instructor'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-slate-400 italic text-[11px]">
                                                            <User className="h-3 w-3 text-slate-300" />
                                                            <span>Unassigned</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {Number(course.price) === 0 ? (
                                                        <span className="font-semibold text-emerald-600 font-mono">Free</span>
                                                    ) : course.discount_price ? (
                                                        <div className="space-y-0.2">
                                                            <span className="font-bold text-slate-900 font-mono">
                                                                ₹{Number(course.discount_price).toLocaleString()}
                                                            </span>
                                                            <span className="text-[10px] line-through text-slate-400 block font-mono">
                                                                ₹{Number(course.price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-slate-900 font-mono">
                                                            ₹{Number(course.price).toLocaleString()}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                                                    {course.duration ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono">
                                                            <Clock className="h-3 w-3 text-slate-400" />
                                                            <span>{course.duration}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 font-mono">-</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {getStatusBadge(course.status)}
                                                </td>

                                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {course.type === 'recorded' ? (
                                                            <Link
                                                                href={route('admin.courses.content', course.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200 transition shadow-2xs"
                                                                title="Upload Videos & Lecture Notes"
                                                            >
                                                                <Video className="h-3 w-3 text-sky-600" />
                                                                <span>Videos & Notes</span>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={route('admin.courses.content', course.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition shadow-2xs"
                                                                title="Live Sessions & Content"
                                                            >
                                                                <Radio className="h-3 w-3 text-rose-600" />
                                                                <span>Live Content</span>
                                                            </Link>
                                                        )}

                                                        <Link
                                                            href={route('admin.courses.show', course.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition shadow-2xs"
                                                        >
                                                            <Edit3 className="h-3 w-3 text-slate-500" />
                                                            <span>Edit</span>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => openStudentsModal(course)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition shadow-2xs"
                                                            title="View Enrolled Students"
                                                        >
                                                            <Users className="h-3 w-3 text-emerald-600" />
                                                            <span>Students ({course.enrollments_count ?? (course.enrollments ? course.enrollments.length : 0)})</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteCourseModal({
                                                                    isOpen: true,
                                                                    courseId: course.id,
                                                                    courseTitle: course.title,
                                                                })
                                                            }
                                                            className="inline-flex items-center justify-center p-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md border border-rose-200 transition shadow-2xs"
                                                            title="Delete Course"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-200">
                                                        {hasActiveFilters ? <Search className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">
                                                            {hasActiveFilters ? 'No matching courses found' : 'No courses found'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                                            {hasActiveFilters
                                                                ? 'Try adjusting your search query or category filter.'
                                                                : 'Get started by creating your first course curriculum.'}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters ? (
                                                        <button
                                                            type="button"
                                                            onClick={clearFilters}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
                                                        >
                                                            <X className="h-3 w-3 text-slate-400" />
                                                            <span>Clear filters</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={route('admin.courses.create')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                            <span>Create course</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <Pagination
                            links={courses?.links}
                            from={courses?.from}
                            to={courses?.to}
                            total={courses?.total}
                            itemLabel="courses"
                        />

                    </div>
                </div>
            </div>

            {/* ENROLLED STUDENTS MANAGEMENT MODAL */}
            {activeCourse && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-3">
                                {activeCourse.thumbnail ? (
                                    <img
                                        src={activeCourse.thumbnail}
                                        alt={activeCourse.title}
                                        className="h-11 w-16 rounded-lg object-cover border border-slate-200 shrink-0"
                                    />
                                ) : (
                                    <div className="h-11 w-16 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                            {activeCourse.title}
                                        </h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                            {enrolledStudents.length} Enrolled
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {activeCourse.category?.name || 'Uncategorized'} • {activeCourse.instructor?.user?.name || 'No Instructor assigned'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeStudentsModal}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Top Controls: Search + Enroll Student Toggle */}
                        <div className="py-3.5 flex items-center justify-between gap-3 shrink-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={studentModalSearch}
                                    onChange={(e) => setStudentModalSearch(e.target.value)}
                                    placeholder="Search enrolled students by name, email..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowEnrollForm(!showEnrollForm)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                <span>{showEnrollForm ? 'Cancel Enroll' : 'Enroll Student'}</span>
                            </button>
                        </div>

                        {/* Quick Enroll Form */}
                        {showEnrollForm && (
                            <form
                                onSubmit={handleEnrollStudent}
                                className="p-3.5 mb-3 bg-indigo-50/50 rounded-xl border border-indigo-100/80 space-y-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-150"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                        <GraduationCap className="h-4 w-4 text-indigo-600" />
                                        Manual Student Enrollment
                                    </span>
                                    <span className="text-[11px] text-indigo-600">
                                        {availableStudentsToEnroll.length} available to enroll
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                            Select Student
                                        </label>
                                        <select
                                            value={enrollUserId}
                                            onChange={(e) => setEnrollUserId(e.target.value)}
                                            required
                                            className="w-full text-xs rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">-- Choose a student --</option>
                                            {availableStudentsToEnroll.map((st) => (
                                                <option key={st.id} value={st.id}>
                                                    {st.name} ({st.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                            Initial Status
                                        </label>
                                        <select
                                            value={enrollStatus}
                                            onChange={(e) => setEnrollStatus(e.target.value)}
                                            className="w-full text-xs rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowEnrollForm(false)}
                                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-md transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!enrollUserId || isEnrolling}
                                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md shadow-xs transition"
                                    >
                                        {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Students List Table */}
                        <div className="overflow-y-auto flex-1 border border-slate-200 rounded-xl">
                            {filteredEnrolledStudents.length === 0 ? (
                                <div className="py-12 text-center text-slate-400">
                                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                    <p className="text-xs font-medium text-slate-600">
                                        {studentModalSearch ? 'No students match your search.' : 'No students enrolled in this course yet.'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Click "Enroll Student" above to manually grant classroom access.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold sticky top-0">
                                            <th className="py-2.5 px-3.5">Student</th>
                                            <th className="py-2.5 px-3.5">Enrolled Date</th>
                                            <th className="py-2.5 px-3.5">Status</th>
                                            <th className="py-2.5 px-3.5 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredEnrolledStudents.map((enrollment) => {
                                            const student = enrollment.user;
                                            return (
                                                <tr key={enrollment.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="py-2.5 px-3.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                                                                {student?.name?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Link
                                                                        href={route('admin.students.show', student?.id || '')}
                                                                        className="font-semibold text-slate-900 hover:text-indigo-600 transition truncate max-w-[180px] block"
                                                                        title="View Student Profile"
                                                                    >
                                                                        {student?.name || 'Unknown Student'}
                                                                    </Link>
                                                                    <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                                                                </div>
                                                                <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                                                                    {student?.email || 'No email'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                                                        {enrollment.enrolled_at
                                                            ? new Date(enrollment.enrolled_at).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>

                                                    <td className="py-2.5 px-3.5">
                                                        <select
                                                            value={enrollment.status}
                                                            onChange={(e) => handleUpdateStatus(enrollment.id, e.target.value)}
                                                            className={`text-[11px] font-semibold rounded-md py-1 px-2 border transition ${
                                                                enrollment.status === 'active'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                    : enrollment.status === 'completed'
                                                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                                            }`}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>

                                                    <td className="py-2.5 px-3.5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteModal({
                                                                    isOpen: true,
                                                                    enrollmentId: enrollment.id,
                                                                    studentName: student?.name || 'this student',
                                                                    courseTitle: activeCourse.title,
                                                                })
                                                            }
                                                            className="inline-flex items-center justify-center h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition"
                                                            title="Unenroll student"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 mt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
                            <span>
                                Showing {filteredEnrolledStudents.length} of {enrolledStudents.length} students
                            </span>
                            <button
                                type="button"
                                onClick={closeStudentsModal}
                                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONFIRM DELETE / UNENROLL MODAL */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, enrollmentId: null, studentName: '', courseTitle: '' })}
                onConfirm={handleDeleteEnrollment}
                title="Remove Course Enrollment?"
                message={
                    <p>
                        Are you sure you want to remove <span className="font-semibold text-slate-800">{deleteModal.studentName}</span> from{' '}
                        <span className="font-semibold text-slate-800">{deleteModal.courseTitle}</span>? This will revoke their classroom access.
                    </p>
                }
                confirmText="Yes, Remove Enrollment"
            />

            {/* CONFIRM DELETE COURSE MODAL */}
            <ConfirmDeleteModal
                isOpen={deleteCourseModal.isOpen}
                onClose={() => setDeleteCourseModal({ isOpen: false, courseId: null, courseTitle: '' })}
                onConfirm={handleDeleteCourse}
                title="Delete Course?"
                message={
                    <p>
                        Are you sure you want to permanently delete{' '}
                        <span className="font-semibold text-slate-800">{deleteCourseModal.courseTitle}</span>?
                        All modules, lessons, videos, resources, and enrollments linked to this course will also be removed.
                    </p>
                }
                confirmText="Yes, Delete Course"
            />
        </AdminLayout>
    );
}

