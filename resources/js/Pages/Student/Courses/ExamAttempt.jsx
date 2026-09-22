import StudentLayout from '@/Layouts/StudentLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import ExamSubmissionReview from '@/Components/ExamSubmissionReview';
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

    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer setup (duration_minutes in seconds)
    const durationSeconds = exam?.duration_minutes ? exam.duration_minutes * 60 : null;
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [hasStarted, setHasStarted] = useState(false);
    const hasAutoSubmitted = useRef(false);
    const isArmed = useRef(false);

    const handleStartExam = () => {
        setHasStarted(true);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const [confirmModal, setConfirmModal] = useState({
        isOpen: !isSubmitted,
        title: 'Exam Instructions',
        message: 'The exam runs in full-screen mode. Do not switch tabs or leave this window (the exam will submit automatically). Click Continue when you are ready.',
        confirmText: 'Continue',
        cancelText: 'Cancel',
        variant: 'primary',
        onConfirm: () => handleStartExam(),
        onClose: () => router.visit(route('student.exams.index')),
    });

    const handleDirectSubmit = () => {
        if (isSubmitted || isSubmitting) return;

        setIsSubmitting(true);
        router.post(
            route('student.exams.submit', exam.id),
            {
                answers: answersRef.current || answers || {},
                started_at: startedAt,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const promptManualSubmit = () => {
        if (isSubmitted || isSubmitting) return;

        const unanswered = questions.length - answeredCount;
        const msg = unanswered > 0
            ? `Notice: You have ${unanswered} unanswered question(s). You have exactly ONE attempt. Are you sure you wish to submit now?`
            : 'Are you ready to submit your examination? You have exactly ONE attempt.';

        setConfirmModal({
            isOpen: true,
            title: 'Submit Examination',
            message: msg,
            confirmText: 'Yes, Submit Examination',
            cancelText: 'Cancel & Review',
            variant: 'primary',
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                handleDirectSubmit();
            },
            onClose: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleViolationSubmit = (reason) => {
        if (isSubmitted || isSubmitting || hasAutoSubmitted.current) return;
        hasAutoSubmitted.current = true;

        handleDirectSubmit();

        setConfirmModal({
            isOpen: true,
            title: 'Exam Submitted Automatically',
            message: reason || 'Tab change or window switch was detected. In accordance with examination rules, your examination has been submitted.',
            confirmText: 'View Exam Results',
            cancelText: 'Close',
            variant: 'danger',
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                router.visit(route('student.exams.show', exam.id), { replace: true });
            },
            onClose: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
        });
    };

    const handleExitAttempt = (e) => {
        if (e) e.preventDefault();
        if (isSubmitted) {
            router.visit(route('student.exams.index'));
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Exit Examination',
            message: 'Warning: Exiting or backing out will submit your examination attempt. Are you sure you want to exit and submit your exam now?',
            confirmText: 'Yes, Submit & Exit',
            cancelText: 'Cancel & Stay on Exam',
            variant: 'danger',
            onConfirm: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                hasAutoSubmitted.current = true;
                handleDirectSubmit();
            },
            onClose: () => {
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => { });
                }
            },
        });
    };

    // Arm security triggers after 1.5s once exam has started
    useEffect(() => {
        if (!hasStarted || isSubmitted) return;

        const armTimer = setTimeout(() => {
            isArmed.current = true;
        }, 1500);

        return () => clearTimeout(armTimer);
    }, [hasStarted, isSubmitted]);

    // 1. Fullscreen change listener once exam has started
    useEffect(() => {
        if (!hasStarted || isSubmitted) return;

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isArmed.current && !hasAutoSubmitted.current) {
                handleViolationSubmit('Exiting full-screen mode was detected. In accordance with examination rules, your examination has been submitted automatically.');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, [hasStarted, isSubmitted]);

    // 2. Tab change, Window Blur, & Browser Back auto-submission with confirmation
    useEffect(() => {
        if (!hasStarted || isSubmitted) return;

        // Push state to intercept browser back navigation
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            if (isSubmitted || hasAutoSubmitted.current) return;
            handleExitAttempt();
        };

        const handleVisibilityChange = () => {
            if (!isArmed.current || isSubmitted || hasAutoSubmitted.current) return;
            if (document.hidden || document.visibilityState === 'hidden') {
                handleViolationSubmit('Tab change, window switch, or window minimization was detected. In accordance with examination rules, your examination has been submitted automatically.');
            }
        };

        const handleWindowBlur = () => {
            if (!isArmed.current || isSubmitted || hasAutoSubmitted.current) return;
            handleViolationSubmit('Tab change or window focus loss was detected. In accordance with examination rules, your examination has been submitted automatically.');
        };

        const handleBeforeUnload = (e) => {
            if (isSubmitted || hasAutoSubmitted.current) return;
            e.preventDefault();
            e.returnValue = 'Leaving or reloading will automatically submit your examination.';
            return e.returnValue;
        };

        window.addEventListener('popstate', handlePopState);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasStarted, isSubmitted]);

    useEffect(() => {
        if (!hasStarted || isSubmitted || !durationSeconds) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(timer);
                    if (!hasAutoSubmitted.current) {
                        hasAutoSubmitted.current = true;
                        handleDirectSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, isSubmitted, durationSeconds]);

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

    const getOptionLetter = (index) => String.fromCharCode(65 + index);

    // REVIEW MODE (Already Submitted)
    if (isSubmitted) {
        return (
            <StudentLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('student.exams.index')}
                                className="p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs transition"
                                title="Back to All Exams"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                        {exam.title}
                                    </h1>
                                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${submission.is_passed
                                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                        }`}>
                                        {submission.is_passed ? 'Passed' : 'Failed'}
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

                <div className="py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                        <ExamSubmissionReview
                            course={course}
                            exam={exam}
                            questions={questions}
                            submission={submission}
                            isAdmin={false}
                        />
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // EXAM TAKING MODE
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start w-full">
            <Head title={`${exam.title} - ${course.title}`} />

            {/* Unified Confirmation & Instruction Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={confirmModal.onClose}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                processing={isSubmitting}
            />

            {/* LEFT SIDE: Square Jump-to-Question Palette & Timer */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-5">
                {/* Timer & Exit */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={handleExitAttempt}
                        className="p-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs transition cursor-pointer"
                        title="Exit Exam"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>

                    {durationSeconds > 0 && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono font-bold text-xs sm:text-sm transition ${timeLeft !== null && timeLeft < 300
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
                            btnClasses = 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-2xs';
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
                                className={`aspect-square rounded-md font-mono text-xs sm:text-sm flex items-center justify-center transition border cursor-pointer ${btnClasses}`}
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
                        <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600 inline-block shrink-0" />
                        <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 inline-block shrink-0" />
                        <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-sm bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-500 inline-block shrink-0" />
                        <span>Current Question</span>
                    </div>
                </div>

                {/* Quick submit button in left palette */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                        type="button"
                        onClick={promptManualSubmit}
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-md shadow-2xs transition cursor-pointer"
                    >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE: ONLY SHOW QUESTION */}
            <div className="flex-1 w-full min-w-0">
                {currentQuestion ? (
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xs">
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

                                let containerClasses = 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200';
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
                                        className={`w-full text-left px-4 py-3.5 rounded-md text-sm sm:text-base flex items-center gap-3.5 transition-all cursor-pointer border ${containerClasses}`}
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
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
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
                                            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition cursor-pointer"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-md shadow-2xs transition cursor-pointer"
                                        >
                                            <span>Next Question</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={promptManualSubmit}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-md shadow-2xs transition cursor-pointer"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>{isSubmitting ? 'Submitting...' : 'Submit Examination'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-2xs">
                        <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Questions Found</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

