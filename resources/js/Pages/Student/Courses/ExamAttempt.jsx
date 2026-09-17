import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
    ArrowLeft,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Send,
    GraduationCap,
    BookOpen,
    Sparkles
} from 'lucide-react';

export default function ExamAttempt({ course, exam, questions = [], submission = null, progress = {} }) {
    const isSubmitted = !!submission;

    // Started at time
    const [startedAt] = useState(() => new Date().toISOString());

    // Selected answers state: { [questionId]: [optionId, ...] }
    const [answers, setAnswers] = useState(() => {
        if (submission?.answers) {
            return submission.answers;
        }
        return {};
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer setup (duration_minutes in seconds)
    const durationSeconds = exam?.duration_minutes ? exam.duration_minutes * 60 : null;
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const hasAutoSubmitted = useRef(false);

    useEffect(() => {
        if (isSubmitted || !durationSeconds) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(timer);
                    if (!hasAutoSubmitted.current) {
                        hasAutoSubmitted.current = true;
                        handleDirectSubmit(true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted, durationSeconds]);

    const formatTime = (secs) => {
        if (secs === null || secs <= 0) return '00:00';
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (questionId, optionId, questionType) => {
        if (isSubmitted) return;

        setAnswers((prev) => {
            if (questionType === 'multiple_choice') {
                const currentList = prev[questionId] || [];
                const nextList = currentList.includes(optionId)
                    ? currentList.filter((id) => id !== optionId)
                    : [...currentList, optionId];
                return { ...prev, [questionId]: nextList };
            } else {
                return { ...prev, [questionId]: [optionId] };
            }
        });
    };

    const answeredCount = useMemo(() => {
        return questions.filter((q) => {
            const val = answers[q.id];
            return Array.isArray(val) && val.length > 0;
        }).length;
    }, [answers, questions]);

    const handleDirectSubmit = (isAuto = false) => {
        if (isSubmitted || isSubmitting) return;

        if (!isAuto) {
            const unanswered = questions.length - answeredCount;
            let msg = 'Are you ready to submit your examination? You have exactly ONE attempt.';
            if (unanswered > 0) {
                msg = `Notice: You have ${unanswered} unanswered question(s). Are you sure you wish to submit now?`;
            }
            if (!confirm(msg)) return;
        }

        setIsSubmitting(true);
        router.post(
            route('student.courses.exam.submit', course.id),
            {
                answers: answers,
                started_at: startedAt,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const getOptionLetter = (index) => String.fromCharCode(65 + index);

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('student.exams.index')}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="Back to All Exams"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {exam.title}
                                </h1>
                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                                    isSubmitted
                                        ? submission.is_passed
                                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                        : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                                }`}>
                                    {isSubmitted
                                        ? submission.is_passed
                                            ? 'Passed'
                                            : 'Completed'
                                        : '1 Attempt Permitted'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                {course.title} • {questions.length} Questions • Passing: {exam.passing_percentage}%
                            </p>
                        </div>
                    </div>

                    {!isSubmitted && (
                        <div className="flex items-center gap-3 shrink-0">
                            {durationSeconds > 0 && (
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-semibold text-xs transition ${
                                    timeLeft !== null && timeLeft < 300
                                        ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                }`}>
                                    <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                    <span>Time Left: {formatTime(timeLeft)}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDirectSubmit(false)}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
                            >
                                <Send className="h-3.5 w-3.5" />
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`${exam.title} - ${course.title}`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Result Summary (Review Mode) - Clean Flat Card */}
                    {isSubmitted && (
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
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base sm:text-lg font-bold">
                                                {submission.is_passed ? 'Exam Passed Successfully' : 'Assessment Completed'}
                                            </h2>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                                                submission.is_passed
                                                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 border-emerald-300'
                                                    : 'bg-rose-100 dark:bg-rose-900 text-rose-800 border-rose-300'
                                            }`}>
                                                {submission.is_passed ? 'Certified' : 'Completed'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                            {submission.is_passed
                                                ? 'Great work! You have satisfied the completion requirement. Review your answer breakdown below.'
                                                : `You achieved ${submission.percentage}%. The passing threshold is ${exam.passing_percentage}%. Review your questions and solutions below.`}
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
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Tracker (Taking mode) */}
                    {!isSubmitted && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        Answered {answeredCount} of {questions.length} Questions
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Select your answers below, then submit when ready.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${(answeredCount / Math.max(1, questions.length)) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Question Jump Pills */}
                    {!isSubmitted && questions.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                            <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider mr-1">Questions:</span>
                            {questions.map((q, idx) => {
                                const isAnswered = Array.isArray(answers[q.id]) && answers[q.id].length > 0;
                                return (
                                    <a
                                        key={q.id}
                                        href={`#question-${q.id}`}
                                        className={`h-7 w-7 rounded-lg font-bold font-mono text-xs flex items-center justify-center transition border ${
                                            isAnswered
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                        }`}
                                    >
                                        {idx + 1}
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {/* Questions List (Styled faithfully like the LearnSyntax screenshot) */}
                    <div className="space-y-4 sm:space-y-5">
                        {questions.map((q, idx) => {
                            const userSelectedIds = answers[q.id] || [];
                            const userSelectedOpts = (q.options || []).filter((opt) => userSelectedIds.includes(opt.id));
                            const correctOpts = (q.options || []).filter((opt) => opt.is_correct);

                            // Correctness logic for this question
                            const isUserCorrect = isSubmitted && (
                                correctOpts.length > 0 &&
                                userSelectedIds.length === correctOpts.length &&
                                correctOpts.every((co) => userSelectedIds.includes(co.id))
                            );

                            const isSkipped = isSubmitted && userSelectedIds.length === 0;

                            // Formatted labels for the bottom split bar
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
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/90 p-5 sm:p-6 space-y-4 transition scroll-mt-24"
                                >
                                    {/* Top Row: Question number box on left, question text, right status circle icon */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            {/* Number Box */}
                                            <span
                                                className={`px-2 py-0.5 rounded border text-xs font-bold font-mono shrink-0 mt-0.5 ${
                                                    isSubmitted
                                                        ? isUserCorrect
                                                            ? 'border-emerald-400 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
                                                            : isSkipped
                                                            ? 'border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                            : 'border-rose-400 text-rose-600 bg-rose-50/40 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                                                }`}
                                            >
                                                {idx + 1}
                                            </span>

                                            {/* Question Text */}
                                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                                                {q.question_text}
                                            </h3>
                                        </div>

                                        {/* Status Icon on Right (Review Mode) */}
                                        {isSubmitted && (
                                            <div className="shrink-0 mt-0.5">
                                                {isUserCorrect ? (
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                ) : isSkipped ? (
                                                    <AlertCircle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-rose-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Options List */}
                                    <div className="space-y-2 pt-1">
                                        {(q.options || []).map((opt, optIdx) => {
                                            const isSelected = userSelectedIds.includes(opt.id);
                                            const isCorrect = opt.is_correct;
                                            const letter = getOptionLetter(optIdx);

                                            // Determine option styling matching screenshot
                                            let containerClasses = 'border border-transparent bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                                            let letterClasses = 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900';

                                            if (!isSubmitted) {
                                                if (isSelected) {
                                                    containerClasses = 'border border-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-medium';
                                                    letterClasses = 'border border-indigo-400 text-indigo-600 bg-white dark:bg-slate-900';
                                                } else {
                                                    containerClasses = 'border border-slate-100 dark:border-slate-800/60 bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300';
                                                }
                                            } else {
                                                // Review mode
                                                if (isCorrect) {
                                                    containerClasses = 'border border-emerald-200/90 bg-emerald-50/70 dark:bg-emerald-950/20 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-medium';
                                                    letterClasses = 'border border-emerald-300 text-emerald-600 bg-white dark:bg-slate-900';
                                                } else if (isSelected && !isCorrect) {
                                                    containerClasses = 'border border-rose-200/90 bg-rose-50/70 dark:bg-rose-950/20 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 font-medium';
                                                    letterClasses = 'border border-rose-300 text-rose-600 bg-white dark:bg-slate-900';
                                                } else {
                                                    containerClasses = 'border border-transparent bg-slate-50/60 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400';
                                                    letterClasses = 'border border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-900';
                                                }
                                            }

                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    disabled={isSubmitted}
                                                    onClick={() => handleSelectOption(q.id, opt.id, q.question_type)}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-3 transition-colors ${containerClasses} ${
                                                        !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                                                    }`}
                                                >
                                                    {/* Letter box: [ A ], [ B ] */}
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0 ${letterClasses}`}>
                                                        {letter}
                                                    </span>

                                                    {/* Option Text */}
                                                    <span className="leading-relaxed flex-1">
                                                        {opt.option_text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Bottom Banner (Review mode - YOUR ANSWER / CORRECT ANSWER split bar) */}
                                    {isSubmitted && (
                                        <div className="mt-4 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    YOUR ANSWER
                                                </p>
                                                <p className={`text-xs font-semibold ${
                                                    isUserCorrect
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : isSkipped
                                                        ? 'text-slate-400 dark:text-slate-500'
                                                        : 'text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {userAnswerLabel}
                                                </p>
                                            </div>

                                            <div className="space-y-0.5 sm:text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    CORRECT ANSWER
                                                </p>
                                                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                                    {correctAnswerLabel}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation if present */}
                                    {isSubmitted && q.explanation && (
                                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-100/70 dark:border-indigo-900/40">
                                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">Explanation:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Submission Action Card */}
                    {!isSubmitted && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Ready to Complete Your Exam?
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Double-check your responses above. Once submitted, your examination is finalized immediately.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleDirectSubmit(false)}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition shrink-0"
                            >
                                <Send className="h-4 w-4" />
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Examination'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}

