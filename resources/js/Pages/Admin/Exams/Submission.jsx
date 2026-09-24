import AdminLayout from '@/Layouts/AdminLayout';
import ExamSubmissionReview from '@/Components/ExamSubmissionReview';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    GraduationCap,
    User,
    ExternalLink,
    Trash2,
} from 'lucide-react';

export default function ExamSubmissionPage({ course, exam, questions, submission }) {
    const student = submission.user;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.exams.submissions.destroy', [exam.id, submission.id]), {
            onSuccess: () => {
                setDeleteModalOpen(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`${route('admin.exams.show', exam.id)}?tab=submissions`}
                            className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition shadow-2xs"
                            title="Back to Submissions Gradebook"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                    Exam Submission Review
                                </h1>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono border ${
                                        submission.is_passed
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                             : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                                >
                                    {submission.is_passed ? 'Passed' : 'Failed'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {exam.title} • {course.title}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {student?.id && (
                            <Link
                                href={route('admin.students.show', student.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-2xs transition"
                            >
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                <span>Student Profile</span>
                                <ExternalLink className="h-3 w-3 text-slate-400" />
                            </Link>
                        )}
                        <Link
                            href={`${route('admin.exams.show', exam.id)}?tab=submissions`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-md transition shadow-2xs"
                        >
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>All Submissions</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setDeleteModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-md transition shadow-2xs cursor-pointer"
                            title="Remove record so student can retake exam"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove Record</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Submission: ${student?.name || 'Student'} - ${exam.title}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Shared Submission Review Component */}
                    <ExamSubmissionReview
                        course={course}
                        exam={exam}
                        questions={questions}
                        submission={submission}
                        isAdmin={true}
                    />
                </div>
            </div>

            {/* Confirm Delete Submission Record Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                processing={isDeleting}
                title="Remove Exam Record?"
                message={`Are you sure you want to remove the exam submission for ${student?.name || 'this student'}? This will reset their attempt so the student can take the exam again.`}
                confirmText="Yes, Remove Record"
                cancelText="Cancel"
                variant="danger"
            />
        </AdminLayout>
    );
}
