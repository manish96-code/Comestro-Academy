import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    ArrowLeft,
    ClipboardList,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    ExternalLink,
    Download,
    Send,
    User,
    FolderGit2,
    Upload,
    Check
} from 'lucide-react';

export default function StudentAssignmentShow({ assignment, submission }) {
    const fileInputRef = useRef(null);
    const [selectedPdfName, setSelectedPdfName] = useState(submission?.file_name || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        pdf_file: null,
        github_url: submission?.github_url || '',
        submission_text: submission?.submission_text || '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('pdf_file', file);
            setSelectedPdfName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.assignments.submit', assignment.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('student.assignments.index')}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Back to Assignments"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {assignment.title}
                                </h1>
                                {submission ? (
                                    submission.status === 'reviewed' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Graded: {submission.marks_obtained}/{assignment.total_marks}
                                        </span>
                                    ) : submission.status === 'resubmit' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800">
                                            <AlertCircle className="h-3 w-3" />
                                            Revision Requested
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                                            <Clock className="h-3 w-3" />
                                            Under Review
                                        </span>
                                    )
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded border bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                        Pending Submission
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                Course: {assignment.course?.title} • {assignment.total_marks} Marks (Passing: {assignment.passing_marks} Marks)
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${assignment.title} - ${assignment.course?.title}`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Evaluation Result Banner (when graded) */}
                    {submission && submission.status === 'reviewed' && (
                        <div className={`p-5 sm:p-6 rounded-xl border transition ${
                            submission.is_passed
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                                : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className={`p-2.5 rounded-lg border shrink-0 ${
                                        submission.is_passed
                                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                                            : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200'
                                    }`}>
                                        {submission.is_passed ? (
                                            <Award className="h-6 w-6" />
                                        ) : (
                                            <AlertCircle className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base sm:text-lg font-bold">
                                                {submission.is_passed ? 'Assignment Passed & Approved' : 'Evaluation Completed'}
                                            </h2>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                                                submission.is_passed
                                                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 border-emerald-300'
                                                    : 'bg-rose-100 dark:bg-rose-900 text-rose-800 border-rose-300'
                                            }`}>
                                                {submission.is_passed ? 'Approved' : 'Needs Work'}
                                            </span>
                                        </div>
                                        {submission.feedback ? (
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                                <span className="font-semibold text-slate-800 dark:text-slate-100">Mentor Feedback: </span>
                                                {submission.feedback}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-slate-500 mt-0.5">Your work has been evaluated and archived.</p>
                                        )}
                                        {submission.reviewer && (
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                Evaluated by {submission.reviewer.name} on {submission.reviewed_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-left sm:text-right sm:border-l sm:border-slate-200/80 dark:sm:border-slate-800 sm:pl-6 shrink-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score Awarded</p>
                                    <p className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
                                        {submission.marks_obtained} <span className="text-sm font-normal text-slate-400">/ {assignment.total_marks}M</span>
                                    </p>
                                    <p className="text-xs text-slate-500 font-mono">
                                        {Math.round((submission.marks_obtained / (assignment.total_marks || 1)) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resubmission requested banner */}
                    {submission && submission.status === 'resubmit' && (
                        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-xs">
                                <AlertCircle className="h-4 w-4 text-rose-600" />
                                <span>Revision Requested by Instructor</span>
                            </div>
                            {submission.feedback && (
                                <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300 bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-rose-200/80 dark:border-rose-900/40">
                                    <span className="font-semibold">Instructor Notes: </span> {submission.feedback}
                                </p>
                            )}
                            <p className="text-[11px] text-rose-700 dark:text-rose-400">
                                Please review the feedback above, update your project, and upload a new PDF or GitHub link below.
                            </p>
                        </div>
                    )}

                    {/* Task Overview Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                    Task Specifications
                                </span>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                    {assignment.title}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                                {assignment.creator && (
                                    <span className="flex items-center gap-1 font-sans text-slate-500 text-xs">
                                        <User className="h-3 w-3" />
                                        <span>Assigned by {assignment.creator.name}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider">
                                Instructions & Deliverables
                            </h3>
                            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                {assignment.description}
                            </div>
                        </div>

                        {/* Specifications Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-xs font-mono">
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Total Marks</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{assignment.total_marks} Marks</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Passing Threshold</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{assignment.passing_marks} Marks</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Due Date</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                    {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'Untimed'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase font-sans font-semibold">Accepted Format</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">PDF & GitHub URL</p>
                            </div>
                        </div>

                        {/* Download Starter File (if provided) */}
                        {assignment.attachment_path && (
                            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">Starter Resource / Prompt File</p>
                                        <p className="text-[10px] text-slate-400">Download the reference material provided by your instructor</p>
                                    </div>
                                </div>
                                <a
                                    href={assignment.attachment_path}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs transition"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Download</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Active Submission Summary (if already submitted) */}
                    {submission && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider">
                                    Your Submitted Solution
                                </h3>
                                <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                                    <span>Submitted: {submission.submitted_at}</span>
                                    {submission.is_late && (
                                        <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[9px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200">
                                            Submitted Late
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap pt-1">
                                {submission.file_url && (
                                    <a
                                        href={submission.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-300 transition"
                                    >
                                        <FileText className="h-4 w-4 text-rose-500" />
                                        <span>{submission.file_name || 'Solution Document.pdf'}</span>
                                        <ExternalLink className="h-3 w-3 text-slate-400" />
                                    </a>
                                )}
                                {submission.github_url && (
                                    <a
                                        href={submission.github_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-300 transition"
                                    >
                                        <FolderGit2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                                        <span>View GitHub Repository</span>
                                        <ExternalLink className="h-3 w-3 text-slate-400" />
                                    </a>
                                )}
                            </div>

                            {submission.submission_text && (
                                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">Your Notes: </span>
                                    {submission.submission_text}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submission / Resubmission Form */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {submission ? 'Update or Resubmit Your Solution' : 'Submit Your Solution'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Upload your solution PDF document and/or paste your GitHub project repository link.
                            </p>
                        </div>

                        {/* Late Notice */}
                        {assignment.is_overdue && (
                            <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                <div>
                                    <span className="font-semibold">Notice: The due date has passed. </span>
                                    Submissions are still accepted and will be automatically marked as submitted after due date.
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* PDF File Upload Zone */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Attach Solution PDF Document
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-5 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                        <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                                            <Upload className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                            {selectedPdfName ? (
                                                <span className="text-emerald-600 font-mono">{selectedPdfName}</span>
                                            ) : (
                                                <span>Click to upload your solution PDF</span>
                                            )}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Strictly PDF (.pdf) format only • Up to 20MB
                                        </p>
                                    </div>
                                </div>
                                {errors.pdf_file && (
                                    <p className="text-[11px] text-rose-500 mt-1">{errors.pdf_file}</p>
                                )}
                            </div>

                            {/* GitHub URL */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    GitHub Repository URL (Optional / If coding project)
                                </label>
                                <div className="relative">
                                    <FolderGit2 className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="url"
                                        value={data.github_url}
                                        onChange={(e) => setData('github_url', e.target.value)}
                                        placeholder="https://github.com/your-username/assignment-repo"
                                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                                    />
                                </div>
                                {errors.github_url && (
                                    <p className="text-[11px] text-rose-500 mt-1">{errors.github_url}</p>
                                )}
                            </div>

                            {/* Submission notes */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Solution Notes or Comments (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.submission_text}
                                    onChange={(e) => setData('submission_text', e.target.value)}
                                    placeholder="Add any context, setup instructions, or notes for your instructor..."
                                    className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Submitting...' : submission ? 'Submit Revision' : 'Submit Assignment'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
