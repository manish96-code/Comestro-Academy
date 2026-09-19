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
    ChevronLeft,
    ChevronRight,
    Check
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

    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = questions[currentIndex] || null;
    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex >= questions.length - 1;

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleClearAnswer = (questionId) => {
        if (isSubmitted) return;
        setAnswers((prev) => {
            const copy = { ...prev };
            delete copy[questionId];
            return copy;
        });
    };

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
            route('student.exams.submit', exam.id),
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

    // 1. REVIEW MODE (Already Submitted)
    if (isSubmitted) {
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
                                        submission.is_passed
                                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                    }`}>
                                        {submission.is_passed ? 'Passed' : 'Completed'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                    {course.title} • {questions.length} Questions • Passing: {exam.passing_percentage}%
                                </p>
                            </div>
                        </div>
                    </div>
                }
            >
                <Head title={`Results: ${exam.title} - ${course.title}`} />

                <div className="py-6 sm:py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                        {/* Result Summary Card */}
                    <div className={`p-5 sm:p-6 rounded-xl border transition ${
                        submission.is_passed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
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

                    {/* Question Breakdown & Solutions */}
                    <div className="space-y-4 sm:space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Question Breakdown & Solutions ({questions.length} Questions)
                            </h3>
                        </div>

                        {questions.map((q, idx) => {
                            const userSelectedIds = answers[q.id] || [];
                            const userSelectedOpts = (q.options || []).filter((opt) => userSelectedIds.includes(opt.id));
                            const correctOpts = (q.options || []).filter((opt) => opt.is_correct);

                            const isUserCorrect = (
                                correctOpts.length > 0 &&
                                userSelectedIds.length === correctOpts.length &&
                                correctOpts.every((co) => userSelectedIds.includes(co.id))
                            );

                            const isSkipped = userSelectedIds.length === 0;

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
                                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/90 p-5 sm:p-6 space-y-4 transition"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <span
                                                className={`px-2 py-0.5 rounded border text-xs font-bold font-mono shrink-0 mt-0.5 ${
                                                    isUserCorrect
                                                        ? 'border-emerald-400 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
                                                        : isSkipped
                                                        ? 'border-slate-300 text-slate-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                                        : 'border-rose-400 text-rose-600 bg-rose-50/40 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                                                }`}
                                            >
                                                {idx + 1}
                                            </span>

                                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                                                {q.question_text}
                                            </h3>
                                        </div>

                                        <div className="shrink-0 mt-0.5">
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
                                            const isSelected = userSelectedIds.includes(opt.id);
                                            const isCorrect = opt.is_correct;
                                            const letter = getOptionLetter(optIdx);

                                            let containerClasses = 'border border-transparent bg-slate-50/60 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400';
                                            let letterClasses = 'border border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-900';

                                            if (isCorrect) {
                                                containerClasses = 'border border-emerald-200/90 bg-emerald-50/70 dark:bg-emerald-950/20 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-medium';
                                                letterClasses = 'border border-emerald-300 text-emerald-600 bg-white dark:bg-slate-900 font-bold';
                                            } else if (isSelected && !isCorrect) {
                                                containerClasses = 'border border-rose-200/90 bg-rose-50/70 dark:bg-rose-950/20 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 font-medium';
                                                letterClasses = 'border border-rose-300 text-rose-600 bg-white dark:bg-slate-900 font-bold';
                                            }

                                            return (
                                                <div
                                                    key={opt.id}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-3 ${containerClasses}`}
                                                >
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0 ${letterClasses}`}>
                                                        {letter}
                                                    </span>
                                                    <span className="leading-relaxed flex-1">
                                                        {opt.option_text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Result split bar */}
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

                                    {/* Explanation if present */}
                                    {q.explanation && (
                                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-100/70 dark:border-indigo-900/40">
                                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">Explanation:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
    }

    // EXAM TAKING MODE (!isSubmitted)
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start w-full">
            <Head title={`${exam.title} - ${course.title}`} />

            {/* LEFT SIDE: Square Jump-to-Question Palette & Timer */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-5">
                {/* Timer & Exit */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <Link
                        href={route('student.exams.index')}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        title="Exit Exam"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>

                    {durationSeconds > 0 && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm transition ${
                            timeLeft !== null && timeLeft < 300
                                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 animate-pulse'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                        Jump to Question
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        {answeredCount} of {questions.length} Answered
                    </p>
                </div>

                {/* Square buttons grid */}
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => {
                        const isAnswered = Array.isArray(answers[q.id]) && answers[q.id].length > 0;
                        const isCurrent = idx === currentIndex;

                        let btnClasses = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400';
                        if (isAnswered && !isCurrent) {
                            btnClasses = 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs';
                        } else if (isCurrent) {
                            btnClasses = isAnswered
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900'
                                : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-500 font-bold ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900';
                        }

                        return (
                            <button
                                key={q.id}
                                type="button"
                                onClick={() => setCurrentIndex(idx)}
                                className={`aspect-square rounded-lg font-mono text-xs sm:text-sm flex items-center justify-center transition border cursor-pointer ${btnClasses}`}
                                title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Palette Legend */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-indigo-600 inline-block shrink-0" />
                        <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 inline-block shrink-0" />
                        <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-500 inline-block shrink-0" />
                        <span>Current Question</span>
                    </div>
                </div>

                {/* Quick submit button in left palette */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                        type="button"
                        onClick={() => handleDirectSubmit(false)}
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition cursor-pointer"
                    >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE: ONLY SHOW QUESTION */}
            <div className="flex-1 w-full min-w-0">
                {currentQuestion ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
                        {/* Question Header Meta */}
                        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono">
                                    Question {currentIndex + 1} of {questions.length}
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium font-mono">
                                    {currentQuestion.marks ?? exam.marks_per_question ?? 1} {Number(currentQuestion.marks ?? exam.marks_per_question ?? 1) === 1 ? 'Mark' : 'Marks'}
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium">
                                    {currentQuestion.question_type === 'multiple_choice' ? 'Multiple Choice' : 'Single Choice'}
                                </span>
                            </div>

                            {/* Answer status & Clear button */}
                            {Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Check className="h-3.5 w-3.5" /> Answered
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleClearAnswer(currentQuestion.id)}
                                        className="text-[11px] text-slate-400 hover:text-rose-500 underline ml-1 cursor-pointer transition"
                                    >
                                        Clear
                                    </button>
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400 font-mono">
                                    Not answered yet
                                </span>
                            )}
                        </div>

                        {/* Question Text */}
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                                {currentQuestion.question_text}
                            </h2>
                            {currentQuestion.question_type === 'multiple_choice' && (
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                    (Select all options that apply)
                                </p>
                            )}
                        </div>

                        {/* Options List */}
                        <div className="space-y-3 pt-2">
                            {(currentQuestion.options || []).map((opt, optIdx) => {
                                const userSelectedIds = answers[currentQuestion.id] || [];
                                const isSelected = userSelectedIds.includes(opt.id);
                                const letter = getOptionLetter(optIdx);

                                let containerClasses = 'border-slate-200/80 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200';
                                let letterClasses = 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800';

                                if (isSelected) {
                                    containerClasses = 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-600 text-indigo-950 dark:text-indigo-200 font-semibold ring-1 ring-indigo-500';
                                    letterClasses = 'border-indigo-500 text-white bg-indigo-600 font-bold';
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleSelectOption(currentQuestion.id, opt.id, currentQuestion.question_type)}
                                        className={`w-full text-left px-4 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-3.5 transition-all cursor-pointer border ${containerClasses}`}
                                    >
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono shrink-0 border transition ${letterClasses}`}>
                                            {letter}
                                        </span>
                                        <span className="leading-relaxed flex-1">
                                            {opt.option_text}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Bottom Navigation: Previous / Skip / Next */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handlePrev}
                                disabled={isFirstQuestion}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span>Previous Question</span>
                            </button>

                            <div className="flex items-center gap-3 justify-end">
                                {!isLastQuestion ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition cursor-pointer"
                                        >
                                            <span>Next Question</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleDirectSubmit(false)}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition cursor-pointer"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>{isSubmitting ? 'Submitting...' : 'Submit Examination'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-8">
                        <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Questions Found</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

