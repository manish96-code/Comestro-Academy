import { Award, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const getOptionLetter = (idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return letters[idx] || String(idx + 1);
};

/**
 * Reusable Exam Submission Review Component.
 * Used by both Students (ExamAttempt.jsx) and Admins (Submission.jsx).
 *
 * @param {object} course
 * @param {object} exam
 * @param {array}  questions
 * @param {object} submission
 * @param {boolean} isAdmin
 */
export default function ExamSubmissionReview({
    course = {},
    exam = {},
    questions = [],
    submission = {},
    isAdmin = false,
}) {
    if (!submission) return null;

    const marksPerQ = exam.marks_per_question ?? 1;
    const answers = submission.answers || {};

    return (
        <div className="space-y-6">
            {/* Result Summary Card */}
            <div
                className={`p-5 sm:p-6 rounded-lg border transition ${
                    submission.is_passed
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                        : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div
                            className={`p-2.5 rounded-md border shrink-0 ${
                                submission.is_passed
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            }`}
                        >
                            {submission.is_passed ? (
                                <Award className="h-6 w-6" />
                            ) : (
                                <AlertCircle className="h-6 w-6" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg font-bold">
                                    {isAdmin
                                        ? `${submission.user?.name || 'Student'}'s Submission: ${submission.is_passed ? 'Passed' : 'Failed'}`
                                        : (submission.is_passed ? 'Exam Passed Successfully' : 'Exam Failed')}
                                </h2>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono border ${
                                        submission.is_passed
                                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                            : 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                                    }`}
                                >
                                    {submission.is_passed ? 'Passed' : 'Failed'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                {isAdmin ? (
                                    <>
                                        Student <span className="font-semibold">{submission.user?.name}</span> ({submission.user?.email}) scored{' '}
                                        <span className="font-bold">{submission.percentage}%</span>. Passing threshold is{' '}
                                        <span className="font-bold">{exam.passing_percentage}%</span>.
                                    </>
                                ) : submission.is_passed ? (
                                    'Great work! You have satisfied the completion requirement. Review your answer breakdown below.'
                                ) : (
                                    `You achieved ${submission.percentage}%. The passing threshold is ${exam.passing_percentage}%. Review your questions and solutions below.`
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="text-left sm:text-right sm:border-l sm:border-slate-200/80 dark:sm:border-slate-800 sm:pl-6 shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Final Result</p>
                        <p className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
                            {submission.percentage}%
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {submission.score} / {submission.total_marks} Marks
                        </p>
                        {submission.submitted_at && (
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                                Submitted {submission.submitted_at}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Question Breakdown & Solutions */}
            <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Detailed Answer Breakdown ({questions.length} Questions)
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Correct
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-rose-500" /> Wrong
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-slate-400" /> Skipped
                        </span>
                    </div>
                </div>

                {questions.map((q, idx) => {
                    const ans = answers[q.id];
                    const userSelectedIds = Array.isArray(ans)
                        ? ans.map(Number)
                        : (ans !== undefined && ans !== null && ans !== '' ? [Number(ans)] : []);

                    const userSelectedOpts = (q.options || []).filter((opt) => userSelectedIds.includes(Number(opt.id)));
                    const correctOpts = (q.options || []).filter((opt) => opt.is_correct);

                    const isUserCorrect = (
                        correctOpts.length > 0 &&
                        userSelectedIds.length === correctOpts.length &&
                        correctOpts.every((co) => userSelectedIds.includes(Number(co.id)))
                    );

                    const isSkipped = userSelectedIds.length === 0;
                    const questionMarks = q.marks ?? marksPerQ;

                    const userAnswerLabel = userSelectedOpts.length > 0
                        ? userSelectedOpts.map((opt) => {
                            const optIdx = (q.options || []).findIndex((o) => o.id === opt.id);
                            const letter = optIdx >= 0 ? getOptionLetter(optIdx) : '';
                            return `Option ${letter} - ${opt.option_text}`;
                        }).join(', ')
                        : 'None (Not Answered)';

                    const correctAnswerLabel = correctOpts.length > 0
                        ? correctOpts.map((opt) => {
                            const optIdx = (q.options || []).findIndex((o) => o.id === opt.id);
                            const letter = optIdx >= 0 ? getOptionLetter(optIdx) : '';
                            return `Option ${letter} - ${opt.option_text}`;
                        }).join(', ')
                        : 'Not specified';

                    return (
                        <div
                            key={q.id}
                            id={`question-${q.id}`}
                            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 transition shadow-2xs"
                        >
                            {/* Question Title & Result Icon */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-md border text-xs font-bold font-mono shrink-0 mt-0.5 ${
                                            isUserCorrect
                                                ? 'border-emerald-400 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
                                                : isSkipped
                                                    ? 'border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                    : 'border-rose-400 text-rose-600 bg-rose-50/50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                                        }`}
                                    >
                                        Q{idx + 1}
                                    </span>

                                    <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                                        {q.question_text}
                                    </h4>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
                                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {isUserCorrect ? `+${questionMarks}` : '0'} / {questionMarks} {questionMarks === 1 ? 'Mark' : 'Marks'}
                                    </span>
                                    {isUserCorrect ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    ) : isSkipped ? (
                                        <AlertCircle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-rose-500" />
                                    )}
                                </div>
                            </div>

                            {/* Options List */}
                            <div className="space-y-2 pt-1">
                                {(q.options || []).map((opt, optIdx) => {
                                    const isSelected = userSelectedIds.includes(Number(opt.id));
                                    const isCorrect = Boolean(opt.is_correct);
                                    const letter = getOptionLetter(optIdx);

                                    let containerClasses = 'border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300';
                                    let letterClasses = 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-semibold';
                                    let badge = null;

                                    if (isCorrect && isSelected) {
                                        containerClasses = 'border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-medium';
                                        letterClasses = 'border border-emerald-400 text-white bg-emerald-600 font-bold';
                                        badge = (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md shrink-0 border border-emerald-300 dark:border-emerald-700">
                                                <CheckCircle2 className="h-3 w-3" /> {isAdmin ? "Student's Answer (Correct)" : 'Your Answer (Correct)'}
                                            </span>
                                        );
                                    } else if (isCorrect && !isSelected) {
                                        containerClasses = 'border border-emerald-300/80 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-medium';
                                        letterClasses = 'border border-emerald-300 text-emerald-600 bg-white dark:bg-slate-900 font-bold';
                                        badge = (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200 dark:border-emerald-800">
                                                Correct Answer
                                            </span>
                                        );
                                    } else if (!isCorrect && isSelected) {
                                        containerClasses = 'border border-rose-300 dark:border-rose-700 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 font-medium';
                                        letterClasses = 'border border-rose-400 text-white bg-rose-600 font-bold';
                                        badge = (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md shrink-0 border border-rose-300 dark:border-rose-700">
                                                <XCircle className="h-3 w-3" /> {isAdmin ? "Student's Answer (Wrong)" : 'Your Answer (Wrong)'}
                                            </span>
                                        );
                                    }

                                    return (
                                        <div
                                            key={opt.id}
                                            className={`w-full text-left px-3.5 py-2.5 rounded-md text-xs sm:text-sm flex items-center justify-between gap-3 transition ${containerClasses}`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className={`px-2 py-0.5 rounded-md text-xs font-mono shrink-0 ${letterClasses}`}>
                                                    {letter}
                                                </span>
                                                <span className="leading-relaxed truncate">
                                                    {opt.option_text}
                                                </span>
                                            </div>
                                            {badge}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Result summary bar */}
                            <div className="mt-4 p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {isAdmin ? "STUDENT'S ANSWER" : 'YOUR ANSWER'}
                                    </p>
                                    <p
                                        className={`font-semibold ${
                                            isUserCorrect
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : isSkipped
                                                    ? 'text-slate-400 dark:text-slate-500'
                                                    : 'text-rose-600 dark:text-rose-400'
                                        }`}
                                    >
                                        {userAnswerLabel}
                                    </p>
                                </div>

                                {!isUserCorrect && (
                                    <div className="space-y-0.5 sm:text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            CORRECT ANSWER
                                        </p>
                                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {correctAnswerLabel}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Explanation if available */}
                            {q.explanation && (
                                <div className="p-3.5 rounded-md bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                                    <span className="font-bold">Explanation: </span>
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
