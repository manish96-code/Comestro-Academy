import AdminLayout from '@/Layouts/AdminLayout';
import ExamSubmissionReview from '@/Components/ExamSubmissionReview';
import { Head } from '@inertiajs/react';

export default function ExamSubmissionPage({ course, exam, questions, submission }) {
    const student = submission.user;

    return (
        <AdminLayout
            title="Exam Submission Review"
            backUrl={`${route('admin.exams.show', exam.id)}?tab=submissions`}
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
        </AdminLayout>
    );
}
