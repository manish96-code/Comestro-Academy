import AdminLayout from '@/Layouts/AdminLayout';
import ExamSubmissionReview from '@/Components/ExamSubmissionReview';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
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
            title="Exam Submission Review"
            backUrl={`${route('admin.exams.show', exam.id)}?tab=submissions`}
            headerActions={
                <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-md transition shadow-2xs shrink-0 cursor-pointer"
                    title="Remove record so student can retake exam"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Record</span>
                </button>
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
