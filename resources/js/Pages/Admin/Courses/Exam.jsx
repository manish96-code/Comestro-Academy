import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
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
    AlertCircle,
    CheckSquare,
    HelpCircle,
    UserCheck,
    Calendar
} from 'lucide-react';

export default function CourseExamPage({ course, exam }) {
    const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'submissions'

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
        passing_percentage: exam?.passing_percentage ?? 70,
        is_published: exam?.is_published ?? true,
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.courses.exam.save', course.id), {
            preserveScroll: true,
        });
    };

    // Form for adding a Question
    const [questionType, setQuestionType] = useState('single_choice');
    const [options, setOptions] = useState([
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ]);

    const {
        data: qData,
        setData: setQData,
        post: postQuestion,
        processing: qProcessing,
        errors: qErrors,
        reset: resetQuestion,
        clearErrors: clearQErrors,
    } = useForm({
        question_text: '',
        question_type: 'single_choice',
        points: 1,
        explanation: '',
        options: [],
    });

    const handleTypeChange = (type) => {
        setQuestionType(type);
        if (type === 'true_false') {
            setOptions([
                { option_text: 'True', is_correct: true },
                { option_text: 'False', is_correct: false },
            ]);
        } else if (options.length < 2) {
            setOptions([
                { option_text: '', is_correct: true },
                { option_text: '', is_correct: false },
            ]);
        }
    };

    const handleOptionTextChange = (index, text) => {
        const next = [...options];
        next[index].option_text = text;
        setOptions(next);
    };

    const handleOptionCorrectChange = (index) => {
        if (questionType === 'single_choice' || questionType === 'true_false') {
            const next = options.map((opt, i) => ({
                ...opt,
                is_correct: i === index,
            }));
            setOptions(next);
        } else {
            // multiple choice
            const next = [...options];
            next[index].is_correct = !next[index].is_correct;
            setOptions(next);
        }
    };

    const addOptionRow = () => {
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const removeOptionRow = (index) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        clearQErrors();

        // Validation
        const validOptions = options.filter((o) => o.option_text.trim() !== '');
        if (validOptions.length < 2) {
            alert('Please provide at least 2 options with text.');
            return;
        }
        if (!validOptions.some((o) => o.is_correct)) {
            alert('Please designate at least one correct option.');
            return;
        }

        router.post(
            route('admin.courses.exam.questions.store', course.id),
            {
                question_text: qData.question_text,
                question_type: questionType,
                points: Number(qData.points) || 1,
                explanation: qData.explanation,
                options: validOptions,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetQuestion();
                    if (questionType === 'true_false') {
                        setOptions([
                            { option_text: 'True', is_correct: true },
                            { option_text: 'False', is_correct: false },
                        ]);
                    } else {
                        setOptions([
                            { option_text: '', is_correct: true },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                        ]);
                    }
                },
            }
        );
    };

    const handleDeleteQuestion = (questionId) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        router.delete(route('admin.courses.exam.questions.destroy', [course.id, questionId]), {
            preserveScroll: true,
        });
    };

    const questionsList = exam?.questions || [];
    const submissionsList = exam?.submissions || [];
    const totalPoints = questionsList.reduce((sum, q) => sum + (q.points || 1), 0);

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.courses.content', course.id)}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs"
                            title="Back to Course Curriculum"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                    Course Exam & Assessment
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                                    exam?.is_published
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                    {exam?.is_published ? 'Published' : 'Draft / Unpublished'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                {course.title} • Students unlock this exam upon 100% lecture completion
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.courses.content', course.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-xs transition"
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
                        <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Questions</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{questionsList.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Marks</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">{totalPoints} pts</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Time Limit</p>
                                <p className="text-lg font-bold text-slate-800 font-mono">
                                    {settingsData.duration_minutes > 0 ? `${settingsData.duration_minutes} mins` : 'Untimed'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-xs">
                            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
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
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                                activeTab === 'questions'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            Questions & Settings ({questionsList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('submissions')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                                activeTab === 'submissions'
                                    ? 'bg-indigo-600 text-white shadow-xs'
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
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            <FileCheck className="h-4 w-4 text-indigo-600" />
                                            Exam Configuration
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Set title, time limits, and passing criteria
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
                                                className="mt-1 block w-full text-xs"
                                                placeholder="e.g. Master Final Assessment"
                                                required
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
                                                className="mt-1 block w-full text-xs rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Instructions for the student..."
                                            />
                                            <InputError message={settingsErrors.description} className="mt-1" />
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
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    required
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
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    required
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
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
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

                                {/* Add Question Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <Plus className="h-4 w-4 text-indigo-600" />
                                                Add New Question
                                            </h2>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Create single choice, multiple choice, or true/false questions
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('single_choice')}
                                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                                                    questionType === 'single_choice'
                                                        ? 'bg-white text-indigo-600 shadow-2xs'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Single Choice
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('multiple_choice')}
                                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                                                    questionType === 'multiple_choice'
                                                        ? 'bg-white text-indigo-600 shadow-2xs'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                Multiple Choice
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTypeChange('true_false')}
                                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                                                    questionType === 'true_false'
                                                        ? 'bg-white text-indigo-600 shadow-2xs'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                True / False
                                            </button>
                                        </div>
                                    </div>

                                    <form onSubmit={handleAddQuestion} className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="question_text" value="Question Text *" className="text-xs font-semibold text-slate-700" />
                                            <textarea
                                                id="question_text"
                                                rows={2}
                                                value={qData.question_text}
                                                onChange={(e) => setQData('question_text', e.target.value)}
                                                className="mt-1 block w-full text-xs rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="e.g. Which hook is used for managing side effects in React?"
                                                required
                                            />
                                            <InputError message={qErrors.question_text} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <InputLabel htmlFor="points" value="Points / Marks" className="text-xs font-semibold text-slate-700" />
                                                <TextInput
                                                    id="points"
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={qData.points}
                                                    onChange={(e) => setQData('points', e.target.value)}
                                                    className="mt-1 block w-full text-xs font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="explanation" value="Explanation (Optional)" className="text-xs font-semibold text-slate-700" />
                                                <TextInput
                                                    id="explanation"
                                                    type="text"
                                                    value={qData.explanation}
                                                    onChange={(e) => setQData('explanation', e.target.value)}
                                                    className="mt-1 block w-full text-xs"
                                                    placeholder="Shown to students after submission"
                                                />
                                            </div>
                                        </div>

                                        {/* Options Editor */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                    <span>Options & Answers</span>
                                                    <span className="text-[10px] font-normal text-slate-400">
                                                        ({questionType === 'multiple_choice' ? 'Select all correct answers' : 'Select the single correct answer'})
                                                    </span>
                                                </label>
                                                {questionType !== 'true_false' && (
                                                    <button
                                                        type="button"
                                                        onClick={addOptionRow}
                                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                    >
                                                        <Plus className="h-3 w-3" /> Add Option
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {options.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOptionCorrectChange(idx)}
                                                            title={opt.is_correct ? 'Correct Answer' : 'Click to mark as correct'}
                                                            className={`p-1.5 rounded-lg border transition ${
                                                                opt.is_correct
                                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-400'
                                                            }`}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </button>

                                                        <input
                                                            type="text"
                                                            value={opt.option_text}
                                                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                                                            disabled={questionType === 'true_false'}
                                                            placeholder={`Option ${idx + 1}`}
                                                            className={`block w-full text-xs rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                opt.is_correct ? 'bg-emerald-50/30 border-emerald-200 font-medium' : ''
                                                            }`}
                                                            required
                                                        />

                                                        {questionType !== 'true_false' && options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOptionRow(idx)}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-3">
                                            <button
                                                type="submit"
                                                disabled={qProcessing}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
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
                                        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
                                            <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                                            <p className="text-xs font-bold text-slate-700">No questions added yet</p>
                                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                                Use the question builder above to add questions to this exam. Students will see these once they complete 100% of lectures.
                                            </p>
                                        </div>
                                    ) : (
                                        questionsList.map((q, qIndex) => (
                                            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
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
                                                                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase font-mono">
                                                                    {q.question_type.replace('_', ' ')}
                                                                </span>
                                                                <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                                                    {q.points} {q.points === 1 ? 'Point' : 'Points'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
                                                            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border ${
                                                                opt.is_correct
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

                                                {q.explanation && (
                                                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        <span className="font-bold text-slate-600">Explanation:</span> {q.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Submissions Tab */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                                                <th className="px-4 py-3">Score</th>
                                                <th className="px-4 py-3">Percentage</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Submitted At</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {submissionsList.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                                        <p>{sub.user?.name || 'Unknown Student'}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono font-normal">{sub.user?.email}</p>
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                                                        {sub.score} / {sub.total_points}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono font-bold text-indigo-600">
                                                        {sub.percentage}%
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                            sub.is_passed
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
        </AdminLayout>
    );
}
