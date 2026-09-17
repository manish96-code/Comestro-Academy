import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Plus,
    ClipboardList,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    ExternalLink,
    Download,
    Trash2,
    Edit3,
    Send,
    User,
    X,
    FolderGit2
} from 'lucide-react';

export default function AdminCourseAssignments({ course, assignments = [] }) {
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(() => assignments[0]?.id || null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [gradingSubmission, setGradingSubmission] = useState(null);

    // Active assignment
    const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0] || null;

    // Assignment Form
    const assignmentForm = useForm({
        title: '',
        description: '',
        total_marks: 100,
        passing_marks: 40,
        due_date: '',
        attachment: null,
    });

    // Grading Form
    const gradeForm = useForm({
        marks_obtained: '',
        status: 'reviewed',
        feedback: '',
    });

    const openCreateModal = () => {
        setEditingAssignment(null);
        assignmentForm.reset();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (assignment) => {
        setEditingAssignment(assignment);
        assignmentForm.setData({
            title: assignment.title,
            description: assignment.description,
            total_marks: assignment.total_marks,
            passing_marks: assignment.passing_marks,
            due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : '',
            attachment: null,
        });
        setIsCreateModalOpen(true);
    };

    const handleSaveAssignment = (e) => {
        e.preventDefault();
        if (editingAssignment) {
            assignmentForm.post(route('admin.courses.assignments.update', [course.id, editingAssignment.id]), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    assignmentForm.reset();
                },
            });
        } else {
            assignmentForm.post(route('admin.courses.assignments.store', course.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    assignmentForm.reset();
                },
            });
        }
    };

    const handleDeleteAssignment = (assignmentId) => {
        if (!confirm('Are you sure you want to delete this assignment and all student submissions?')) return;
        router.delete(route('admin.courses.assignments.destroy', [course.id, assignmentId]), {
            preserveScroll: true,
        });
    };

    const openGradeModal = (submission) => {
        setGradingSubmission(submission);
        gradeForm.setData({
            marks_obtained: submission.marks_obtained !== null ? submission.marks_obtained : '',
            status: submission.status === 'resubmit' ? 'resubmit' : 'reviewed',
            feedback: submission.feedback || '',
        });
    };

    const handleSaveGrade = (e) => {
        e.preventDefault();
        if (!gradingSubmission) return;

        gradeForm.post(route('admin.assignments.submissions.grade', gradingSubmission.id), {
            preserveScroll: true,
            onSuccess: () => {
                setGradingSubmission(null);
                gradeForm.reset();
            },
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.assignments.index')}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Back to All Assignments"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {course.title} — Assignments
                                </h1>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                    {assignments.length} {assignments.length === 1 ? 'Assignment' : 'Assignments'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                Manage practical project tasks, evaluate student PDF/GitHub work, and enter grades
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shrink-0"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create Assignment</span>
                    </button>
                </div>
            }
        >
            <Head title={`${course.title} Assignments - Admin`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {assignments.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                            {/* Sidebar: Assignment Selector List */}
                            <div className="lg:col-span-1 space-y-2">
                                <p className="text-[11px] font-bold uppercase font-mono text-slate-400 px-1 tracking-wider">
                                    Course Tasks
                                </p>
                                <div className="space-y-1.5">
                                    {assignments.map((item, idx) => {
                                        const isSelected = item.id === activeAssignment?.id;
                                        const pendingCount = (item.submissions || []).filter((s) => s.status === 'submitted').length;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => setSelectedAssignmentId(item.id)}
                                                className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 ${
                                                    isSelected
                                                        ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/20'
                                                        : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-[10px] font-mono font-bold text-slate-400">Task #{idx + 1}</span>
                                                    {pendingCount > 0 && (
                                                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                            {pendingCount} Pending
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                                    {item.title}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    {item.total_marks} Marks • {item.submissions?.length || 0} Submissions
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main: Active Assignment Details & Submissions Table */}
                            {activeAssignment && (
                                <div className="lg:col-span-3 space-y-6">

                                    {/* Assignment Overview Card */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                            <div>
                                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                                    {activeAssignment.title}
                                                </h2>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap font-mono">
                                                    {activeAssignment.creator && (
                                                        <span className="flex items-center gap-1 font-sans text-slate-500 dark:text-slate-400">
                                                            <User className="h-3 w-3" />
                                                            <span>Created by {activeAssignment.creator.name}</span>
                                                        </span>
                                                    )}
                                                    {activeAssignment.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Due: {new Date(activeAssignment.due_date).toLocaleString()}</span>
                                                        </span>
                                                    )}
                                                    <span>Pass: {activeAssignment.passing_marks}/{activeAssignment.total_marks} Marks</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(activeAssignment)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                                    title="Edit Assignment"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAssignment(activeAssignment.id)}
                                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                                    title="Delete Assignment"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                            {activeAssignment.description}
                                        </div>

                                        {/* Instructor Attachment */}
                                        {activeAssignment.attachment_path && (
                                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-indigo-600" />
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Starter / Prompt Attachment</span>
                                                </div>
                                                <a
                                                    href={activeAssignment.attachment_path.startsWith('http') ? activeAssignment.attachment_path : `/storage/${activeAssignment.attachment_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    <span>Download File</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Submissions Gradebook Table */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    Student Submissions Gradebook
                                                </h3>
                                                <p className="text-[11px] text-slate-400">
                                                    {activeAssignment.submissions?.length || 0} student(s) submitted this assignment
                                                </p>
                                            </div>
                                        </div>

                                        {activeAssignment.submissions && activeAssignment.submissions.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-100 dark:border-slate-800">
                                                        <tr>
                                                            <th className="py-3 px-4">Student</th>
                                                            <th className="py-3 px-4">Submitted At</th>
                                                            <th className="py-3 px-4">Files / Links</th>
                                                            <th className="py-3 px-4">Status & Score</th>
                                                            <th className="py-3 px-4 text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                                        {activeAssignment.submissions.map((sub) => (
                                                            <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                                <td className="py-3 px-4">
                                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                                        {sub.student?.name || 'Student'}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-400">
                                                                        {sub.student?.email}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4 font-mono">
                                                                    <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                                                                        {new Date(sub.submitted_at).toLocaleString()}
                                                                    </div>
                                                                    <div>
                                                                        {sub.is_late ? (
                                                                            <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">
                                                                                • Submitted Late
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                                                                                • On Time
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        {sub.file_path && (
                                                                            <a
                                                                                href={`/storage/${sub.file_path}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[11px] font-medium border border-slate-200/60 dark:border-slate-700"
                                                                            >
                                                                                <FileText className="h-3 w-3 text-rose-500" />
                                                                                <span>PDF File</span>
                                                                                <ExternalLink className="h-2.5 w-2.5" />
                                                                            </a>
                                                                        )}
                                                                        {sub.github_url && (
                                                                            <a
                                                                                href={sub.github_url}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[11px] font-medium border border-slate-200/60 dark:border-slate-700"
                                                                            >
                                                                                <FolderGit2 className="h-3 w-3 text-slate-600" />
                                                                                <span>GitHub</span>
                                                                                <ExternalLink className="h-2.5 w-2.5" />
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    {sub.status === 'reviewed' ? (
                                                                        <div>
                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                                                                                <CheckCircle2 className="h-3 w-3" />
                                                                                {sub.marks_obtained} / {activeAssignment.total_marks} Marks
                                                                            </span>
                                                                            {sub.feedback && (
                                                                                <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5 italic">
                                                                                    "{sub.feedback}"
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ) : sub.status === 'resubmit' ? (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                                                            <AlertCircle className="h-3 w-3" />
                                                                            Revision Requested
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                                                                            <Clock className="h-3 w-3" />
                                                                            Pending Review
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openGradeModal(sub)}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs transition"
                                                                    >
                                                                        <span>{sub.status === 'reviewed' ? 'Re-grade' : 'Grade'}</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-xs text-slate-400">
                                                No submissions have been uploaded for this assignment yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    No assignments created for this course yet
                                </h3>
                                <p className="text-xs text-slate-400 max-w-md mx-auto">
                                    Publish practical homework tasks, projects, or milestone assignments with deadlines and marks.
                                </p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Create First Assignment</span>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Create / Edit Assignment Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {editingAssignment ? 'Edit Assignment' : 'Create Course Assignment'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAssignment} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Assignment Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={assignmentForm.data.title}
                                    onChange={(e) => assignmentForm.setData('title', e.target.value)}
                                    placeholder="e.g. Build a Responsive Dashboard with Tailwind"
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                                {assignmentForm.errors.title && (
                                    <p className="text-[11px] text-rose-500 mt-0.5">{assignmentForm.errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Task Instructions & Requirements *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={assignmentForm.data.description}
                                    onChange={(e) => assignmentForm.setData('description', e.target.value)}
                                    placeholder="Provide detailed instructions, submission deliverables, and criteria..."
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                                {assignmentForm.errors.description && (
                                    <p className="text-[11px] text-rose-500 mt-0.5">{assignmentForm.errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Total Marks *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={1000}
                                        required
                                        value={assignmentForm.data.total_marks}
                                        onChange={(e) => assignmentForm.setData('total_marks', parseInt(e.target.value) || 0)}
                                        className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Passing Marks *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={1000}
                                        required
                                        value={assignmentForm.data.passing_marks}
                                        onChange={(e) => assignmentForm.setData('passing_marks', parseInt(e.target.value) || 0)}
                                        className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Due Date (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={assignmentForm.data.due_date}
                                    onChange={(e) => assignmentForm.setData('due_date', e.target.value)}
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Submissions after this time will automatically be accepted and flagged as "Submitted Late".
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Resource / Starter File Attachment (Optional)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => assignmentForm.setData('attachment', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={assignmentForm.processing}
                                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-semibold text-white transition"
                                >
                                    {assignmentForm.processing ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Publish Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grade Submission Modal */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Grade Submission
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    {gradingSubmission.student?.name} ({gradingSubmission.student?.email})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setGradingSubmission(null)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveGrade} className="p-5 space-y-4">
                            {gradingSubmission.submission_text && (
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Student Solution Notes</p>
                                    <p className="mt-0.5 text-slate-700 dark:text-slate-300">{gradingSubmission.submission_text}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Marks Awarded (Out of {activeAssignment.total_marks}) *
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={activeAssignment.total_marks}
                                    required
                                    value={gradeForm.data.marks_obtained}
                                    onChange={(e) => gradeForm.setData('marks_obtained', e.target.value)}
                                    placeholder={`0 - ${activeAssignment.total_marks}`}
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                                />
                                {gradeForm.errors.marks_obtained && (
                                    <p className="text-[11px] text-rose-500 mt-0.5">{gradeForm.errors.marks_obtained}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Status Assessment *
                                </label>
                                <select
                                    value={gradeForm.data.status}
                                    onChange={(e) => gradeForm.setData('status', e.target.value)}
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="reviewed">Evaluated & Approved (Reviewed)</option>
                                    <option value="resubmit">Request Resubmission (Needs Revision)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Qualitative Feedback & Comments
                                </label>
                                <textarea
                                    rows={3}
                                    value={gradeForm.data.feedback}
                                    onChange={(e) => gradeForm.setData('feedback', e.target.value)}
                                    placeholder="Explain strengths, improvements, code quality, or why revision is requested..."
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGradingSubmission(null)}
                                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={gradeForm.processing}
                                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-xs font-semibold text-white transition"
                                >
                                    {gradeForm.processing ? 'Saving...' : 'Submit Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
