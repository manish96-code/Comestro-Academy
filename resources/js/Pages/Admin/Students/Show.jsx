import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    User,
    Calendar,
    Clock,
    Save,
    GraduationCap,
    ExternalLink,
    ArrowLeft,
    Shield,
    Globe,
    Building,
    MapPin,
    BookOpen,
    Plus,
    Trash2,
    CheckCircle2,
    XCircle,
    X,
    FolderTree,
    Sparkles
} from 'lucide-react';

export default function StudentShow({ student, enrollments = [], availableCourses = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        status: student.status || 'active',
    });

    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(availableCourses[0]?.id || '');
    const [enrollStatus, setEnrollStatus] = useState('active');
    const [enrollProcessing, setEnrollProcessing] = useState(false);

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        enrollmentId: null,
        courseTitle: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.students.update', student.id));
    };

    const handleEnrollSubmit = (e) => {
        e.preventDefault();
        if (!selectedCourseId) return;

        setEnrollProcessing(true);
        router.post(
            route('admin.students.enrollments.store', student.id),
            {
                course_id: selectedCourseId,
                status: enrollStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEnrollModalOpen(false);
                    setEnrollProcessing(false);
                },
                onError: () => {
                    setEnrollProcessing(false);
                },
            }
        );
    };

    const handleStatusChange = (enrollmentId, newStatus) => {
        router.patch(
            route('admin.enrollments.update', enrollmentId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const confirmDelete = (enrollment) => {
        setDeleteModal({
            isOpen: true,
            enrollmentId: enrollment.id,
            courseTitle: enrollment.course?.title || 'this course',
        });
    };

    const handleDeleteEnrollment = () => {
        if (!deleteModal.enrollmentId) return;

        router.delete(route('admin.enrollments.destroy', deleteModal.enrollmentId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, enrollmentId: null, courseTitle: '' });
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    const getEnrollmentBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        Active Access
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <Sparkles className="h-3 w-3 text-sky-500" />
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3 text-rose-500" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">
                            Student Profile & Course Access
                        </h1>
                        <p className="text-xs text-slate-500">
                            Academic background, developer links, and enrolled courses for {student.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.students.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
                            <span>Back to Students</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Student: ${student.name}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Top Student Banner Card */}
                    <div className="rounded-xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-100 shrink-0">
                                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900">{student.name}</h2>
                                <p className="text-xs text-slate-500 font-mono">Student ID: #{student.id}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div>{getStatusBadge(data.status)}</div>
                            <div className="flex flex-col sm:items-end text-[11px] text-slate-400 gap-1 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 text-slate-400" />
                                    Registered: {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    Last Active: {student.last_login_at ? new Date(student.last_login_at).toLocaleString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ENROLLED COURSES SECTION */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <span>Enrolled Courses</span>
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {enrollments.length}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        View enrolled curriculum, adjust access status, or grant new course enrollments
                                    </p>
                                </div>
                            </div>

                            {availableCourses.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCourseId(availableCourses[0]?.id || '');
                                        setIsEnrollModalOpen(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Enroll in Course</span>
                                </button>
                            )}
                        </div>

                        {enrollments.length === 0 ? (
                            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                                <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                <h4 className="text-xs sm:text-sm font-bold text-slate-700">No Courses Enrolled</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    This student is not yet enrolled in any course. Click the button above to grant them immediate learning access.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-semibold">
                                            <th className="py-3 px-4">Course</th>
                                            <th className="py-3 px-4">Enrolled Date</th>
                                            <th className="py-3 px-4">Status & Access</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {enrollments.map((enrollment) => {
                                            const course = enrollment.course;
                                            return (
                                                <tr key={enrollment.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            {course?.thumbnail ? (
                                                                <img
                                                                    src={course.thumbnail}
                                                                    alt={course.title}
                                                                    className="h-10 w-14 object-cover rounded-md border border-slate-200 shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-14 bg-indigo-50 border border-indigo-100 rounded-md flex items-center justify-center text-indigo-600 shrink-0">
                                                                    <BookOpen className="h-5 w-5" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={route('admin.courses.show', course?.id || '')}
                                                                    className="font-bold text-slate-900 hover:text-indigo-600 truncate block max-w-xs transition"
                                                                >
                                                                    {course?.title || 'Unknown Course'}
                                                                </Link>
                                                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                                    {course?.duration || 'Self-Paced'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>


                                                    <td className="py-3.5 px-4 font-mono text-slate-600">
                                                        {enrollment.enrolled_at
                                                            ? new Date(enrollment.enrolled_at).toLocaleDateString()
                                                            : 'N/A'}
                                                    </td>

                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {getEnrollmentBadge(enrollment.status)}
                                                            <select
                                                                value={enrollment.status}
                                                                onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                                                                className="text-[11px] font-semibold rounded-md border-slate-200 bg-white text-slate-700 py-1 px-2 focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
                                                            >
                                                                <option value="active">Set Active</option>
                                                                <option value="completed">Set Completed</option>
                                                                <option value="cancelled">Cancel / Revoke</option>
                                                            </select>
                                                        </div>
                                                    </td>

                                                    <td className="py-3.5 px-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => confirmDelete(enrollment)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                                                            title="Remove enrollment"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Edit Student Details Form */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Student Account Settings</h3>
                                <p className="text-xs text-slate-500">Update contact info and platform access status</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name *" />
                                    <TextInput
                                        id="name"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-1.5" message={errors.name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Phone Number" />
                                    <TextInput
                                        id="phone"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 font-mono"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Mobile number"
                                    />
                                    <InputError className="mt-1.5" message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Address *" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 font-mono"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-1.5" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Account Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-xs transition"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended (Blocked)</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Saving...' : 'Update Student Profile'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Academic & Professional Background Card */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Academic & Developer Background</h3>
                                <p className="text-xs text-slate-500">College qualifications and portfolio repositories submitted by student</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Qualification</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{student.qualification || 'Not specified'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">College / Institute</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{student.college_name || 'Not specified'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">
                                    {student.city || student.state ? `${student.city || ''}${student.city && student.state ? ', ' : ''}${student.state || ''}` : 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GitHub Profile</p>
                                {student.github_url ? (
                                    <a
                                        href={student.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.github_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">Not linked</p>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LinkedIn Profile</p>
                                {student.linkedin_url ? (
                                    <a
                                        href={student.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.linkedin_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">Not linked</p>
                                )}
                            </div>
                        </div>

                        {student.bio && (
                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 mt-3">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student Bio</p>
                                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{student.bio}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ENROLL STUDENT IN COURSE MODAL */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Enroll Student in Course</h3>
                                    <p className="text-xs text-slate-500">Grant curriculum access to {student.name}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEnrollModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEnrollSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="course_id" value="Select Course *" />
                                <select
                                    id="course_id"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 py-2.5 px-3 mt-1 shadow-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                                    required
                                >
                                    {availableCourses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title} ({c.duration || 'Self-Paced'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel htmlFor="enroll_status" value="Initial Access Status *" />
                                <select
                                    id="enroll_status"
                                    value={enrollStatus}
                                    onChange={(e) => setEnrollStatus(e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 py-2.5 px-3 mt-1 shadow-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                                >
                                    <option value="active">Active (Full Classroom Access)</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEnrollModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={enrollProcessing} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>{enrollProcessing ? 'Enrolling...' : 'Confirm Enrollment'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, enrollmentId: null, courseTitle: '' })}
                onConfirm={handleDeleteEnrollment}
                title="Remove Course Enrollment?"
                message={
                    <p>
                        Are you sure you want to remove <span className="font-semibold text-slate-800">{student.name}</span> from{' '}
                        <span className="font-semibold text-slate-800">{deleteModal.courseTitle}</span>? This will revoke their classroom access.
                    </p>
                }
                confirmText="Yes, Remove Enrollment"
            />
        </AdminLayout>
    );
}
