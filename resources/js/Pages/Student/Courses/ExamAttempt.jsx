import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
    ArrowLeft,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    HelpCircle,
    AlertCircle,
    Send,
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    Lock,
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

    // Timer setup
    const durationSeconds = (exam.duration_minutes || 0) * 60;
    const [timeLeft, setTimeLeft] = useState(durationSeconds > 0 ? durationSeconds : null);
    const hasAutoSubmitted = useRef(false);

    useEffect(() => {
        if (isSubmitted || durationSeconds <= 0) return;

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
                // single_choice or true_false
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
            let msg = 'Are you sure you want to submit your final exam? You have exactly ONE attempt.';
            if (unanswered > 0) {
                msg = `You have ${unanswered} unanswered question(s). ${msg}`;
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

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('student.courses.learn', [course.id, { tab: 'exam' }])}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs"
                            title="Back to Classroom"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                    {exam.title}
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                                    isSubmitted
                                        ? submission.is_passed
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                    {isSubmitted
                                        ? submission.is_passed
                                            ? 'Passed'
                                            : 'Failed'
                                        : 'Final Assessment (1 Attempt)'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                {course.title} • {questions.length} Questions • Passing: {exam.passing_percentage}%
                            </p>
                        </div>
                    </div>

                    {!isSubmitted && (
                        <div className="flex items-center gap-4">
                            {durationSeconds > 0 && (
                                <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs shadow-xs ${
                                    timeLeft !== null && timeLeft < 300
                                        ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                                        : 'bg-white border-slate-200 text-slate-700'
                                }`}>
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>Time Left: {formatTime(timeLeft)}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDirectSubmit(false)}
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition"
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

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* If Submitted: Result Banner */}
                    {isSubmitted && (
                        <div className={`p-6 rounded-2xl border shadow-sm ${
                            submission.is_passed
                                ? 'bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-emerald-200 text-emerald-950'
                                : 'bg-gradient-to-br from-rose-50 via-orange-50/40 to-white border-rose-200 text-rose-950'
                        }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3.5 rounded-2xl border shadow-md shrink-0 ${
                                        submission.is_passed
                                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200'
                                            : 'bg-rose-600 text-white border-rose-500 shadow-rose-200'
                                    }`}>
                                        {submission.is_passed ? (
                                            <Award className="h-8 w-8" />
                                        ) : (
                                            <AlertCircle className="h-8 w-8" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-extrabold tracking-tight">
                                                {submission.is_passed ? 'Congratulations! You Passed!' : 'Exam Submitted — Did Not Pass'}
                                            </h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono border ${
                                                submission.is_passed
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                            }`}>
                                                {submission.is_passed ? 'Certified' : 'Completed'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 max-w-md">
                                            {submission.is_passed
                                                ? 'You have successfully passed the final assessment and verified your mastery of the course syllabus.'
                                                : `You scored ${submission.percentage}%. The minimum passing requirement for this exam was ${exam.passing_percentage}%. This exam was a single-attempt assessment.`}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Score</p>
                                    <p className="text-3xl font-black font-mono mt-0.5 tracking-tight">
                                        {submission.percentage}%
                                    </p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                        {submission.score} / {submission.total_marks} marks
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress tracker bar while taking test */}
                    {!isSubmitted && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Answered {answeredCount} of {questions.length} Questions
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Select your answers below and click 'Submit Exam' when completed.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(answeredCount / Math.max(1, questions.length)) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-4">
                        {questions.map((q, idx) => {
                            const userAnswers = answers[q.id] || [];

                            return (
                                <div
                                    key={q.id}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-slate-200">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                                                    {q.question_text}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-semibold text-indigo-600 font-mono">
                                                        {q.marks || exam.marks_per_question || 1} {((q.marks || exam.marks_per_question || 1) === 1) ? 'Mark' : 'Marks'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2 pt-1">
                                        {(q.options || []).map((opt) => {
                                            const isSelected = userAnswers.includes(opt.id);
                                            const isCorrect = opt.is_correct; // Only provided when isSubmitted === true

                                            let optionBorder = 'border-slate-200 hover:border-slate-300 bg-white';
                                            if (!isSubmitted) {
                                                if (isSelected) {
                                                    optionBorder = 'border-indigo-500 bg-indigo-50/40 text-indigo-950 font-medium';
                                                }
                                            } else {
                                                // Review mode
                                                if (isCorrect) {
                                                    optionBorder = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold';
                                                } else if (isSelected && !isCorrect) {
                                                    optionBorder = 'border-rose-300 bg-rose-50 text-rose-950';
                                                } else {
                                                    optionBorder = 'border-slate-100 bg-slate-50/50 text-slate-500';
                                                }
                                            }

                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    disabled={isSubmitted}
                                                    onClick={() => handleSelectOption(q.id, opt.id, q.question_type)}
                                                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition ${optionBorder} ${
                                                        !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                                                    }`}
                                                >
                                                    <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 border ${
                                                        isSelected
                                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                                            : 'border-slate-300 bg-white'
                                                    }`}>
                                                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                    </div>

                                                    <span className="flex-1 leading-relaxed">
                                                        {opt.option_text}
                                                    </span>

                                                    {isSubmitted && isCorrect && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono shrink-0">
                                                            <CheckCircle2 className="h-3 w-3" /> Correct
                                                        </span>
                                                    )}

                                                    {isSubmitted && isSelected && !isCorrect && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md font-mono shrink-0">
                                                            <XCircle className="h-3 w-3" /> Your choice
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation in Review mode */}
                                    {isSubmitted && q.explanation && (
                                        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-slate-600">
                                            <span className="font-bold text-indigo-900">Explanation:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Submit Action Bar (Taking mode) */}
                    {!isSubmitted && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-800">
                                    Ready to submit your assessment?
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Double-check your choices. Once submitted, your score is calculated immediately.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleDirectSubmit(false)}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition"
                            >
                                <Send className="h-4 w-4" />
                                <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
