import AdminLayout from '@/Layouts/AdminLayout';
import ExamSubmissionReview from '@/Components/ExamSubmissionReview';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    GraduationCap,
    User,
    ExternalLink,
} from 'lucide-react';

export default function ExamSubmissionPage({ course, exam, questions, submission }) {
    const student = submission.user;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`${route('admin.exams.show', exam.id)}?tab=submissions`}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition shadow-2xs"
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
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
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
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition"
                            >
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                <span>Student Profile</span>
                                <ExternalLink className="h-3 w-3 text-slate-400" />
                            </Link>
                        )}
                        <Link
                            href={`${route('admin.exams.show', exam.id)}?tab=submissions`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-xl transition"
                        >
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>All Submissions</span>
                        </Link>
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
        </AdminLayout>
    );
}
