import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    GraduationCap,
    Clock,
    Award,
    CheckCircle2,
    XCircle,
    Plus,
    Trash2,
    Save,
    FileCheck,
    Layers,
    HelpCircle,
    UserCheck,
    Eye,
    User,
} from 'lucide-react';

export default function CourseExamPage({ course, exam, initialTab = 'questions' }) {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam === 'submissions' || tabParam === 'questions') return tabParam;
        }
        return initialTab || 'questions';
    });

    // Keep activeTab synced with URL so refreshing the page preserves the tab
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (activeTab === 'submissions') {
                params.set('tab', 'submissions');
            } else {
                params.delete('tab');
            }
            const queryStr = params.toString();
            const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [activeTab]);

    // Listen to browser forward/back buttons
    useEffect(() => {
        const onPopState = () => {
            const params = new URLSearchParams(window.location.search);
            setActiveTab(params.get('tab') === 'submissions' ? 'submissions' : 'questions');
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const [deleteQuestionModal, setDeleteQuestionModal] = useState({
        isOpen: false,
        questionId: null,
        isDeleting: false,
    });

    // Form for Exam Settings
    const {
        data: settingsData,
        setData: setSettingsData,
        post: postSettings,
        processing: settingsProcessing,
        errors: settingsErrors,
    } = useForm({
        title: exam?.title || `Final Assessment: ${course.title}`,
        description: exam?.description || 'Complete all questions to verify your learning and earn your course certification.',
        duration_minutes: exam?.duration_minutes ?? 30,
        marks_per_question: exam?.marks_per_question ?? 1,
        passing_percentage: exam?.passing_percentage ?? 60,
        is_published: exam?.is_published ?? true,
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.exams.settings.save', exam.id), {
            preserveScroll: true,
        });
    };

    // Form for adding a Question
    const [options, setOptions] = useState([
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ]);

    const [optionsError, setOptionsError] = useState('');

    const {
        data: qData,
        setData: setQData,
        processing: qProcessing,
        errors: qErrors,
        reset: resetQuestion,
        setError: setQError,
        clearErrors: clearQErrors,
    } = useForm({
        question_text: '',
    });

    const handleOptionTextChange = (idx, value) => {
        if (optionsError) setOptionsError('');
        const next = [...options];
        next[idx].option_text = value;
        setOptions(next);
    };

    const handleSelectCorrect = (idx) => {
        if (optionsError) setOptionsError('');
        const next = options.map((opt, i) => ({
            ...opt,
            is_correct: i === idx,
        }));
        setOptions(next);
    };

    const handleAddOption = () => {
        if (options.length >= 6) return;
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const handleRemoveOption = (idx) => {
        if (options.length <= 2) return;
        const next = options.filter((_, i) => i !== idx);
        if (!next.some((o) => o.is_correct) && next.length > 0) {
            next[0].is_correct = true;
        }
        setOptions(next);
    };

    const handleStoreQuestion = (e) => {
        e.preventDefault();
        clearQErrors();
        setOptionsError('');

        let hasError = false;

        if (!qData.question_text.trim()) {
            setQError('question_text', 'Please enter the question text.');
            hasError = true;
        }

        const validOptions = options.filter((o) => o.option_text.trim().length > 0);
        if (validOptions.length < 2) {
            setOptionsError('Please provide at least 2 valid options.');
            hasError = true;
        } else if (!validOptions.some((o) => o.is_correct)) {
            setOptionsError('Please select the correct option.');
            hasError = true;
        }

        if (hasError) return;

        router.post(
            route('admin.exams.questions.store', exam.id),
            {
                question_text: qData.question_text,
                options: validOptions,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetQuestion();
                    setOptionsError('');
                    setOptions([
                        { option_text: '', is_correct: true },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                    ]);
                },
                onError: (errs) => {
                    if (errs.question_text) {
                        setQError('question_text', errs.question_text);
                    }
                    if (errs.options) {
                        setOptionsError(errs.options);
                    }
                },
            }
        );
    };

    const handleAddQuestion = handleStoreQuestion;

    const handleDeleteQuestion = (questionId) => {
        setDeleteQuestionModal({
            isOpen: true,
            questionId,
            isDeleting: false,
        });
    };

    const confirmDeleteQuestion = () => {
        if (!deleteQuestionModal.questionId) return;

        setDeleteQuestionModal((prev) => ({ ...prev, isDeleting: true }));

        router.delete(route('admin.exams.questions.destroy', [exam.id, deleteQuestionModal.questionId]), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteQuestionModal({
                    isOpen: false,
                    questionId: null,
                    isDeleting: false,
                });
            },
            onError: () => {
                setDeleteQuestionModal((prev) => ({ ...prev, isDeleting: false }));
            },
        });
    };

    const marksPerQ = Number(settingsData.marks_per_question) || Number(exam?.marks_per_question) || 1;
    const questionsList = exam?.questions || [];
    const submissionsList = exam?.submissions || [];
    const totalMarks = questionsList.length * marksPerQ;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.courses.content', course.id)}
                            className="p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs"
                            title="Back to Course Curriculum"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                    Course Exam & Assessment
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${exam?.is_published
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    {exam?.is_published ? 'Published' : 'Draft / Unpublished'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                                <span>{course.title} • Students unlock this exam upon 100% lecture completion</span>
                                {exam?.creator && (
                                    <span className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] font-medium shadow-2xs">
                                        <User className="h-3 w-3 text-slate-400" />
                                        <span>Created by <strong className="text-slate-800 font-semibold">{exam.creator.name}</strong></span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.courses.content', course.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-2xs transition"
                        >
                            <Layers className="h-3.5 w-3.5 text-slate-500" />
                            <span>Curriculum</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Exam Management - ${course.title}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Questions</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{questionsList.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Marks</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{totalMarks} marks</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Time Limit</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">
                                    {settingsData.duration_minutes > 0 ? `${settingsData.duration_minutes} mins` : 'Untimed'}
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => setActiveTab('submissions')}
                            className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs cursor-pointer hover:border-indigo-300 hover:shadow-xs transition"
                            title="Click to view Student Results"
                        >
                            <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student Submissions</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{submissionsList.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('questions')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeTab === 'questions'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            Questions & Settings ({questionsList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('submissions')}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeTab === 'submissions'
                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            Student Results ({submissionsList.length})
                        </button>
                    </div>

                    {activeTab === 'questions' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Left Column: Exam Settings */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <FileCheck className="h-4 w-4 text-indigo-600" />
                                            Exam Configuration
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Set title, marks per question, and passing score
                                        </p>
                                    </div>

                                    <form onSubmit={handleSaveSettings} className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="title" value="Exam Title *" className="text-xs font-semibold text-slate-700" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                value={settingsData.title}
                                                onChange={(e) => setSettingsData('title', e.target.value)}
                                                className="mt-1 block w-full text-sm font-medium"
                                                placeholder="e.g. Master Final Assessment"
                                            />
                                            <InputError message={settingsErrors.title} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Instructions / Description" className="text-xs font-semibold text-slate-700" />
                                            <textarea
                                                id="description"
                                                rows={3}
                                                value={settingsData.description}
                                                onChange={(e) => setSettingsData('description', e.target.value)}
                                                className="mt-1 block w-full text-sm px-3.5 py-2.5 rounded-md border border-slate-300 bg-white text-slate-900 shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-400"
                                                placeholder="Instructions for the student..."
                                            />
                                            <InputError message={settingsErrors.description} className="mt-1" />
                                        </div>

                                        {/* Marks per Question Input */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <InputLabel htmlFor="marks_per_question" value="Marks per Question *" className="text-xs font-semibold text-slate-700" />
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 5].map((preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() => setSettingsData('marks_per_question', preset)}
                                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition ${Number(settingsData.marks_per_question) === preset
                                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                                }`}
                                                            title={`Set ${preset} ${preset === 1 ? 'Mark' : 'Marks'}`}
                                                        >
                                                            {preset}M
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative mt-1">
                                                <TextInput
                                                    id="marks_per_question"
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={settingsData.marks_per_question}
                                                    onChange={(e) => setSettingsData('marks_per_question', e.target.value)}
                                                    className="block w-full text-sm font-semibold font-mono pr-16"
                                                    placeholder="1"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-slate-400 font-semibold font-mono">
                                                    {Number(settingsData.marks_per_question) === 1 ? 'Mark' : 'Marks'}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Applies uniformly to all questions in this exam.
                                            </p>
                                            <InputError message={settingsErrors.marks_per_question} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <InputLabel htmlFor="duration_minutes" value="Time Limit (Mins)" className="text-xs font-semibold text-slate-700" />
                                                <TextInput
                                                    id="duration_minutes"
                                                    type="number"
                                                    min="0"
                                                    max="360"
                                                    value={settingsData.duration_minutes}
                                                    onChange={(e) => setSettingsData('duration_minutes', e.target.value)}
                                                    className="mt-1 block w-full text-sm font-mono"
                                                />
                                                <p className="text-[10px] text-slate-400 mt-0.5">0 = Unlimited</p>
                                                <InputError message={settingsErrors.duration_minutes} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="passing_percentage" value="Pass Mark (%)" className="text-xs font-semibold text-slate-700" />
                                                <TextInput
                                                    id="passing_percentage"
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={settingsData.passing_percentage}
                                                    onChange={(e) => setSettingsData('passing_percentage', e.target.value)}
                                                    className="mt-1 block w-full text-sm font-mono"
                                                />
                                                <p className="text-[10px] text-slate-400 mt-0.5">e.g. 70% to pass</p>
                                                <InputError message={settingsErrors.passing_percentage} className="mt-1" />
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settingsData.is_published}
                                                    onChange={(e) => setSettingsData('is_published', e.target.checked)}
                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                                />
                                                <span className="text-xs font-semibold text-slate-700">Published</span>
                                            </label>

                                            <button
                                                type="submit"
                                                disabled={settingsProcessing}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-2xs transition"
                                            >
                                                <Save className="h-3.5 w-3.5" />
                                                <span>{settingsProcessing ? 'Saving...' : 'Save Settings'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Column: Question Builder & List */}
                            <div className="lg:col-span-8 space-y-6">

                                {/* Add Question Card (Streamlined) */}
                                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <Plus className="h-4 w-4 text-indigo-600" />
                                                Add New Question
                                            </h2>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Enter question text and options. Each question is worth {marksPerQ} {marksPerQ === 1 ? 'mark' : 'marks'}.
                                            </p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {marksPerQ} {marksPerQ === 1 ? 'Mark' : 'Marks'}
                                        </span>
                                    </div>

                                    <form onSubmit={handleAddQuestion} className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="question_text" value="Question Text *" className="text-xs font-semibold text-slate-700" />
                                            <textarea
                                                id="question_text"
                                                rows={2}
                                                value={qData.question_text}
                                                onChange={(e) => {
                                                    setQData('question_text', e.target.value);
                                                    if (qErrors.question_text) clearQErrors('question_text');
                                                }}
                                                className="mt-1 block w-full text-sm px-3.5 py-2.5 rounded-md border border-slate-300 bg-white text-slate-900 shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-400"
                                                placeholder="e.g. Which hook is used for managing side effects in React?"
                                            />
                                            <InputError message={qErrors.question_text} className="mt-1" />
                                        </div>

                                        {/* Options Editor */}
                                        <div className="space-y-2.5 pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                    <span>Options & Answers</span>
                                                    <span className="text-[10px] font-normal text-slate-400">
                                                        (Click option letter/circle to select the correct answer)
                                                    </span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleAddOption}
                                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
                                                >
                                                    <Plus className="h-3.5 w-3.5" /> Add Option
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {options.map((opt, idx) => {
                                                    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                                                    const letter = optionLetters[idx] || `${idx + 1}`;
                                                    const isCorrect = opt.is_correct;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-2 p-1.5 pl-2 rounded-md border transition-all ${isCorrect
                                                                    ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200/60 shadow-2xs'
                                                                    : 'bg-white border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                                                                }`}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectCorrect(idx)}
                                                                title={isCorrect ? 'Marked as Correct Answer' : 'Click to mark as correct answer'}
                                                                className={`h-8 w-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 transition-all ${isCorrect
                                                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/60'
                                                                    }`}
                                                            >
                                                                {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : letter}
                                                            </button>

                                                            <input
                                                                type="text"
                                                                value={opt.option_text}
                                                                onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                                                                placeholder={`Enter option ${letter} text...`}
                                                                className={`block w-full text-sm px-3 py-2 bg-transparent border-0 focus:ring-0 focus:outline-hidden placeholder:text-slate-400 font-medium ${isCorrect ? 'text-emerald-950 font-semibold' : 'text-slate-800'
                                                                    }`}
                                                            />

                                                            {isCorrect && (
                                                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                                                                    Correct
                                                                </span>
                                                            )}

                                                            {options.length > 2 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveOption(idx)}
                                                                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition shrink-0"
                                                                    title="Remove option"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={optionsError || qErrors.options} className="mt-1.5" />
                                        </div>

                                        <div className="flex justify-end pt-3">
                                            <button
                                                type="submit"
                                                disabled={qProcessing}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-2xs transition"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>{qProcessing ? 'Adding...' : 'Add Question'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Questions List */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Question Bank ({questionsList.length})
                                    </h3>

                                    {questionsList.length === 0 ? (
                                        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-8 text-center space-y-2">
                                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                                            <p className="text-xs font-bold text-slate-700">No questions added yet</p>
                                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                                Use the question builder above to add questions to this exam. Each question will carry {marksPerQ} {marksPerQ === 1 ? 'mark' : 'marks'}.
                                            </p>
                                        </div>
                                    ) : (
                                        questionsList.map((q, qIndex) => (
                                            <div key={q.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2.5">
                                                        <span className="h-5 w-5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 border border-indigo-100">
                                                            {qIndex + 1}
                                                        </span>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900 leading-snug">
                                                                {q.question_text}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                                                                    {marksPerQ} {marksPerQ === 1 ? 'Mark' : 'Marks'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                                                        title="Delete Question"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Options preview */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                                    {(q.options || []).map((opt) => (
                                                        <div
                                                            key={opt.id}
                                                            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-2 border ${opt.is_correct
                                                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-semibold'
                                                                    : 'bg-slate-50 border-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            {opt.is_correct ? (
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                                            ) : (
                                                                <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
                                                            )}
                                                            <span className="truncate">{opt.option_text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Submissions Tab */
                        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                            <div className="p-4 border-b border-slate-100">
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                    Student Exam Results & Gradebook
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Single attempt results recorded for completed course assessments
                                </p>
                            </div>

                            {submissionsList.length === 0 ? (
                                <div className="p-12 text-center space-y-2">
                                    <Award className="h-10 w-10 text-slate-300 mx-auto" />
                                    <p className="text-xs font-bold text-slate-700">No student submissions yet</p>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                        Once enrolled students finish 100% of the lectures and take this exam, their single score and pass/fail status will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                                            <tr>
                                                <th className="px-4 py-3">Student</th>
                                                <th className="px-4 py-3">Marks</th>
                                                <th className="px-4 py-3">Percentage</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Submitted At</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {submissionsList.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                                        {sub.user ? (
                                                            <Link
                                                                href={route('admin.students.show', sub.user.id)}
                                                                className="group block"
                                                            >
                                                                <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">{sub.user.name}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono font-normal group-hover:text-indigo-500/80 transition">{sub.user.email}</p>
                                                            </Link>
                                                        ) : (
                                                            <>
                                                                <p>Unknown Student</p>
                                                                <p className="text-[10px] text-slate-400 font-mono font-normal">-</p>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                                                        {sub.score} / {sub.total_marks} marks
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                                                        {sub.percentage}%
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${sub.is_passed
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            }`}>
                                                            {sub.is_passed ? (
                                                                <>
                                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                    Passed
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="h-3 w-3 text-rose-600" />
                                                                    Failed
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                                                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link
                                                            href={route('admin.exams.submissions.show', [exam.id, sub.id])}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-md transition shadow-2xs"
                                                            title="Review Student's Exam Answers"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>View Answers</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Delete Question Modal */}
            <ConfirmModal
                isOpen={deleteQuestionModal.isOpen}
                onClose={() => setDeleteQuestionModal({ isOpen: false, questionId: null, isDeleting: false })}
                onConfirm={confirmDeleteQuestion}
                processing={deleteQuestionModal.isDeleting}
                title="Delete Question?"
                message="Are you sure you want to delete this question? This action cannot be undone."
                confirmText="Yes, Delete Question"
                cancelText="Cancel"
                variant="danger"
            />
        </AdminLayout>
    );
}
