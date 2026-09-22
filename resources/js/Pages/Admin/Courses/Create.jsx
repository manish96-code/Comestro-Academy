import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    BookPlus,
    Edit3,
    ArrowLeft,
    Save,
    BookOpen,
    Image,
    Sparkles,
    FolderTree,
    Clock,
    IndianRupee,
    UserCheck,
    Plus,
    Trash2,
    CheckCircle2,
    ListChecks,
    Layers,
    Upload,
    UploadCloud,
    Video,
    Radio,
    Calendar,
    Users
} from 'lucide-react';

export default function CourseCreate({ course = null, categories = [], instructors = [] }) {
    const isEdit = Boolean(course);
    const [imagePreview, setImagePreview] = useState(course?.thumbnail || null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleDelete = () => {
        if (!course?.id) return;
        router.delete(route('admin.courses.destroy', course.id));
    };

    const { data, setData, post, patch, processing, errors, transform } = useForm({
        title: course?.title || '',
        subtitle: course?.subtitle || '',
        category_id: course?.category_id || '',
        instructor_id: course?.instructor_id || '',
        description: course?.description || '',
        curriculum: Array.isArray(course?.curriculum)
            ? course.curriculum.map((item) => {
                let initialSubtitles = [''];
                if (Array.isArray(item.subtitles) && item.subtitles.length > 0) {
                    initialSubtitles = item.subtitles;
                } else if (Array.isArray(item.subtitle) && item.subtitle.length > 0) {
                    initialSubtitles = item.subtitle;
                } else if (typeof item.subtitle === 'string' && item.subtitle.trim().length > 0) {
                    if (item.subtitle.includes('\n')) {
                        initialSubtitles = item.subtitle.split('\n').map((s) => s.trim()).filter(Boolean);
                    } else if (item.subtitle.includes(',')) {
                        initialSubtitles = item.subtitle.split(',').map((s) => s.trim()).filter(Boolean);
                    } else {
                        initialSubtitles = [item.subtitle.trim()];
                    }
                }
                return {
                    ...item,
                    title: (item.title || '').replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim(),
                    subtitles: initialSubtitles.length > 0 ? initialSubtitles : [''],
                };
            })
            : [],
        course_includes: Array.isArray(course?.course_includes) && course.course_includes.length > 0
            ? course.course_includes
            : (!course ? [
                '12 Weeks of intensive training',
                'Real-world capstone project codebases',
                'Downloadable starter kits & slide decks',
                'Official Certificate of Completion',
                'Full lifetime access on mobile & web',
            ] : []),
        capstones: Array.isArray(course?.capstones) && course.capstones.length > 0
            ? course.capstones.map((c) => ({
                title: c.title || '',
                desc: c.desc || '',
                stack: c.stack || '',
            }))
            : [],
        thumbnail: course?.thumbnail || '',
        thumbnail_image: null,
        price: course?.price ?? '',
        discount_price: course?.discount_price ?? '',
        duration: course?.duration || '',
        type: course?.type || 'recorded',
        is_featured: Boolean(course?.is_featured),
        status: course?.status || 'draft',
        batches: Array.isArray(course?.batches) && course.batches.length > 0
            ? course.batches.map((b) => ({
                id: b.id,
                batch_name: b.batch_name || '',
                time_slot: b.time_slot || '',
                days: b.days || 'Monday - Friday',
                capacity: b.capacity ?? '',
                is_active: b.is_active ?? true,
            }))
            : [
                {
                    batch_name: 'Morning Batch',
                    time_slot: '09:00 AM - 10:00 AM',
                    days: 'Monday - Friday',
                    capacity: '',
                    is_active: true,
                },
                {
                    batch_name: 'Afternoon Batch',
                    time_slot: '02:00 PM - 03:00 PM',
                    days: 'Monday - Friday',
                    capacity: '',
                    is_active: true,
                },
            ],
    });

    // Automatically transform curriculum module title, subtitles array, clean course_includes, and batches
    transform((formData) => ({
        ...formData,
        curriculum: Array.isArray(formData.curriculum)
            ? formData.curriculum.map((item) => {
                const cleanedSubtitles = Array.isArray(item.subtitles)
                    ? item.subtitles.map((s) => (s || '').trim()).filter(Boolean)
                    : (typeof item.subtitle === 'string'
                        ? item.subtitle.split(',').map((s) => s.trim()).filter(Boolean)
                        : []);
                return {
                    title: (item.title || '').replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim(),
                    subtitles: cleanedSubtitles,
                    subtitle: cleanedSubtitles.join(', '),
                };
            })
            : [],
        course_includes: Array.isArray(formData.course_includes)
            ? formData.course_includes.map((s) => (s || '').trim()).filter(Boolean)
            : [],
        capstones: Array.isArray(formData.capstones)
            ? formData.capstones
                .map((c) => ({
                    title: (c.title || '').trim(),
                    desc: (c.desc || '').trim(),
                    stack: (c.stack || '').trim(),
                }))
                .filter((c) => c.title || c.desc)
            : [],
        batches: formData.type === 'live' && Array.isArray(formData.batches)
            ? formData.batches
                .filter((b) => (b.time_slot || '').trim().length > 0)
                .map((b) => ({
                    id: b.id || undefined,
                    batch_name: (b.batch_name || '').trim() || 'Batch 1',
                    time_slot: (b.time_slot || '').trim(),
                    days: (b.days || '').trim() || 'Monday - Friday',
                    capacity: b.capacity ? parseInt(b.capacity, 10) : null,
                    is_active: b.is_active ?? true,
                }))
            : [],
    }));

    const handleAddBatch = (preset = null) => {
        const nextNum = (data.batches?.length || 0) + 1;
        setData('batches', [
            ...(data.batches || []),
            preset || {
                batch_name: `Batch ${nextNum}`,
                time_slot: '09:00 AM - 10:00 AM',
                days: 'Monday - Friday',
                capacity: '',
                is_active: true,
            },
        ]);
    };

    const handleRemoveBatch = (index) => {
        setData(
            'batches',
            (data.batches || []).filter((_, i) => i !== index)
        );
    };

    const handleBatchChange = (index, field, value) => {
        const updated = [...(data.batches || [])];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setData('batches', updated);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_image', file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            thumbnail_image: null,
            thumbnail: '',
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addCurriculumItem = () => {
        setData('curriculum', [
            ...data.curriculum,
            { title: '', subtitles: [''] },
        ]);
    };

    const updateCurriculumTitle = (index, value) => {
        const updated = [...data.curriculum];
        updated[index] = { ...updated[index], title: value };
        setData('curriculum', updated);
    };

    const removeCurriculumItem = (index) => {
        const updated = data.curriculum.filter((_, i) => i !== index);
        setData('curriculum', updated);
    };

    const addModuleSubtitle = (moduleIndex) => {
        const updated = [...data.curriculum];
        const currentSubtitles = updated[moduleIndex].subtitles || [''];
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: [...currentSubtitles, ''],
        };
        setData('curriculum', updated);
    };

    const updateModuleSubtitle = (moduleIndex, subIndex, value) => {
        const updated = [...data.curriculum];
        const currentSubtitles = [...(updated[moduleIndex].subtitles || [''])];
        currentSubtitles[subIndex] = value;
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: currentSubtitles,
        };
        setData('curriculum', updated);
    };

    const removeModuleSubtitle = (moduleIndex, subIndex) => {
        const updated = [...data.curriculum];
        const currentSubtitles = (updated[moduleIndex].subtitles || ['']).filter((_, i) => i !== subIndex);
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: currentSubtitles.length > 0 ? currentSubtitles : [''],
        };
        setData('curriculum', updated);
    };

    const addCourseIncludeItem = () => {
        setData('course_includes', [
            ...(data.course_includes || []),
            '',
        ]);
    };

    const updateCourseIncludeItem = (index, value) => {
        const updated = [...(data.course_includes || [])];
        updated[index] = value;
        setData('course_includes', updated);
    };

    const removeCourseIncludeItem = (index) => {
        const updated = (data.course_includes || []).filter((_, i) => i !== index);
        setData('course_includes', updated);
    };

    const addCapstoneItem = () => {
        setData('capstones', [
            ...(data.capstones || []),
            { title: '', desc: '', stack: '' },
        ]);
    };

    const updateCapstoneItem = (index, field, value) => {
        const updated = [...(data.capstones || [])];
        updated[index] = { ...updated[index], [field]: value };
        setData('capstones', updated);
    };

    const removeCapstoneItem = (index) => {
        const updated = (data.capstones || []).filter((_, i) => i !== index);
        setData('capstones', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.courses.update', course.id), {
                forceFormData: true,
            });
        } else {
            post(route('admin.courses.store'), {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                            {isEdit ? 'Edit Course Curriculum' : 'Create Course'}
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            {isEdit
                                ? `Updating details and syllabus for ${course.title}`
                                : 'Configure curriculum, allocate instructors, and set pricing'}
                        </p>
                    </div>
                    <Link
                        href={route('admin.courses.index')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title={isEdit ? `Edit Course - ${course.title}` : 'Create Course'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* LEFT COLUMN (8 Cols): Details & Curriculum */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* If Edit Mode: Top Summary Pill */}
                            {isEdit && (
                                <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-12 w-16 rounded-md object-cover border border-slate-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="h-12 w-16 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                        )}
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <h2 className="text-sm font-bold text-slate-900 truncate max-w-md">{course.title}</h2>
                                                {course.type === 'live' ? (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                                        <span>Live</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                        <Video className="h-2.5 w-2.5 text-slate-500" />
                                                        <span>Recorded</span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-mono text-slate-400">/{course.slug}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={route('admin.courses.content', course.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200 transition cursor-pointer"
                                        >
                                            <Video className="h-3.5 w-3.5" />
                                            <span>Manage Lectures</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(true)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Delete Course</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Course Information */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                                        <BookPlus className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                            Course Information
                                        </h3>
                                        <p className="text-[11px] text-slate-500">
                                            Basic title, subtitles, categories and format
                                        </p>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Course Title *" />
                                    <TextInput
                                        id="title"
                                        className="w-full text-xs sm:text-sm py-2 px-3 mt-1"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Master Full-Stack Laravel & React Bootcamp"
                                    />
                                    <InputError className="mt-1" message={errors.title} />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <InputLabel htmlFor="subtitle" value="Subtitle / Catchy Summary" />
                                    <TextInput
                                        id="subtitle"
                                        className="w-full text-xs sm:text-sm py-2 px-3 mt-1"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        placeholder="e.g. Build production-ready web apps from scratch with modern architecture"
                                    />
                                    <InputError className="mt-1" message={errors.subtitle} />
                                </div>

                                {/* Category, Instructor & Type Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category *" />
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-2xs transition"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-1" message={errors.category_id} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="instructor_id" value="Instructor (Optional)" />
                                        <select
                                            id="instructor_id"
                                            value={data.instructor_id}
                                            onChange={(e) => setData('instructor_id', e.target.value)}
                                            className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-2xs transition"
                                        >
                                            <option value="">No Instructor Assigned</option>
                                            {instructors.map((inst) => (
                                                <option key={inst.id} value={inst.id}>
                                                    {inst.user?.name} {inst.designation ? `(${inst.designation})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-1" message={errors.instructor_id} />
                                    </div>
                                </div>

                                {/* Course Format / Type */}
                                <div>
                                    <InputLabel value="Course Format / Learning Type *" />
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'recorded')}
                                            className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                                                data.type === 'recorded'
                                                    ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 shadow-2xs'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`p-1.5 rounded-md ${data.type === 'recorded' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <Video className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold block">Recorded Course</span>
                                                <span className="text-[10px] text-slate-500">Pre-recorded lectures & notes</span>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'live')}
                                            className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                                                data.type === 'live'
                                                    ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 shadow-2xs'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`p-1.5 rounded-md ${data.type === 'live' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <Radio className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold block">Live Class Cohort</span>
                                                <span className="text-[10px] text-slate-500">Live interactive coding sessions</span>
                                            </div>
                                        </button>
                                    </div>
                                    <InputError className="mt-1" message={errors.type} />
                                </div>

                                {/* Live Class Batches / Timings (Only for Live Cohorts) */}
                                {data.type === 'live' && (
                                    <div className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/60 dark:bg-slate-900/40 space-y-4 transition">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4 text-slate-600" />
                                                    Live Cohort Batches & Timings *
                                                </h4>
                                            </div>
                                            <span className="text-[11px] text-slate-500">
                                                Students must pick an active batch when enrolling
                                            </span>
                                        </div>

                                        {/* Quick Presets */}
                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                            <span className="text-[11px] font-medium text-slate-500 mr-1">Quick Add:</span>
                                            {[
                                                { name: 'Morning Batch', time: '09:00 AM - 10:00 AM', days: 'Monday - Friday' },
                                                { name: 'Afternoon Batch', time: '02:00 PM - 03:00 PM', days: 'Monday - Friday' },
                                                { name: 'Evening Batch', time: '07:00 PM - 08:00 PM', days: 'Monday - Friday' },
                                                { name: 'Night Batch', time: '08:00 PM - 09:00 PM', days: 'Monday - Friday' },
                                                { name: 'Weekend Batch', time: '10:00 AM - 01:00 PM', days: 'Saturday - Sunday' },
                                            ].map((preset, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleAddBatch({
                                                        batch_name: preset.name,
                                                        time_slot: preset.time,
                                                        days: preset.days,
                                                        capacity: '',
                                                        is_active: true,
                                                    })}
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-2.5 py-1 shadow-2xs transition cursor-pointer"
                                                >
                                                    <Plus className="h-3 w-3 text-slate-500" />
                                                    {preset.time}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Batches List */}
                                        <div className="space-y-3">
                                            {(data.batches || []).map((batch, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-3"
                                                >
                                                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-slate-800">
                                                                Batch #{index + 1}
                                                            </span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${batch.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                                                                {batch.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={batch.is_active !== false}
                                                                    onChange={(e) => handleBatchChange(index, 'is_active', e.target.checked)}
                                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 text-xs"
                                                                />
                                                                Open for Enrollment
                                                            </label>
                                                            {(data.batches || []).length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveBatch(index)}
                                                                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer ml-1"
                                                                    title="Remove batch"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                                        <div className="sm:col-span-3">
                                                            <InputLabel value="Batch Name" className="text-[11px]" />
                                                            <TextInput
                                                                type="text"
                                                                value={batch.batch_name}
                                                                onChange={(e) => handleBatchChange(index, 'batch_name', e.target.value)}
                                                                placeholder="e.g. Morning Batch"
                                                                className="mt-0.5 text-xs py-1.5 w-full"
                                                            />
                                                        </div>

                                                        <div className="sm:col-span-4">
                                                            <InputLabel value="Time Slot (e.g. 9-10 AM) *" className="text-[11px]" />
                                                            <TextInput
                                                                type="text"
                                                                value={batch.time_slot}
                                                                onChange={(e) => handleBatchChange(index, 'time_slot', e.target.value)}
                                                                placeholder="e.g. 09:00 AM - 10:00 AM"
                                                                className="mt-0.5 text-xs py-1.5 w-full"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="sm:col-span-3">
                                                            <InputLabel value="Days / Schedule" className="text-[11px]" />
                                                            <TextInput
                                                                type="text"
                                                                value={batch.days}
                                                                onChange={(e) => handleBatchChange(index, 'days', e.target.value)}
                                                                placeholder="e.g. Mon - Fri"
                                                                className="mt-0.5 text-xs py-1.5 w-full"
                                                            />
                                                        </div>

                                                        <div className="sm:col-span-2">
                                                            <InputLabel value="Seat Limit" className="text-[11px]" />
                                                            <TextInput
                                                                type="number"
                                                                min="1"
                                                                value={batch.capacity}
                                                                onChange={(e) => handleBatchChange(index, 'capacity', e.target.value)}
                                                                placeholder="Unlimited"
                                                                className="mt-0.5 text-xs py-1.5 w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <button
                                                type="button"
                                                onClick={() => handleAddBatch()}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs transition cursor-pointer"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-slate-500" />
                                                Add Another Batch Slot
                                            </button>
                                        </div>

                                        <InputError className="mt-1" message={errors.batches} />
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Overview & Course Description" />
                                    <textarea
                                        id="description"
                                        rows={4}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-2xs transition"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detail what students will learn, curriculum outline, prerequisites..."
                                    />
                                    <InputError className="mt-1" message={errors.description} />
                                </div>
                            </div>

                            {/* Section 2: Curriculum & Syllabus Builder */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                                            <Layers className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                                                Curriculum Modules & Topics
                                            </h3>
                                            <p className="text-[11px] text-slate-500">
                                                Structure syllabus chapters and bullet points for the student view
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addCurriculumItem}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition cursor-pointer"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Add Module</span>
                                    </button>
                                </div>

                                {data.curriculum && data.curriculum.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.curriculum.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                                                        Module {idx + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCurriculumItem(idx)}
                                                        className="text-slate-400 hover:text-rose-600 transition p-1"
                                                        title="Remove Module"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                {/* Module Title */}
                                                <div className="flex rounded-lg shadow-2xs">
                                                    <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-mono font-bold select-none shrink-0">
                                                        Module {idx + 1}:
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateCurriculumTitle(idx, e.target.value)}
                                                        placeholder="e.g. Core Foundations & Architecture"
                                                        className="w-full text-xs rounded-r-lg border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-1.5 px-3"
                                                        required
                                                    />
                                                </div>

                                                {/* Subtitles / Topics */}
                                                <div className="space-y-2 pt-2 border-t border-slate-200/70">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-500">
                                                            Topics / Lessons ({Array.isArray(item.subtitles) ? item.subtitles.length : 1})
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addModuleSubtitle(idx)}
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded transition"
                                                        >
                                                            <Plus className="h-2.5 w-2.5" />
                                                            <span>Add Topic</span>
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {(Array.isArray(item.subtitles) ? item.subtitles : [item.subtitle || '']).map((sub, sIdx) => (
                                                            <div key={sIdx} className="flex items-center gap-1.5">
                                                                <div className="flex-1 flex rounded-md shadow-2xs">
                                                                    <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-[10px] font-mono select-none shrink-0">
                                                                        {idx + 1}.{sIdx + 1}
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        value={sub}
                                                                        onChange={(e) => updateModuleSubtitle(idx, sIdx, e.target.value)}
                                                                        placeholder={`Topic ${sIdx + 1} (e.g. Variables, Functions)`}
                                                                        className="w-full text-xs rounded-r-md border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-1.5 px-2.5"
                                                                    />
                                                                </div>
                                                                {(Array.isArray(item.subtitles) ? item.subtitles.length : 1) > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeModuleSubtitle(idx, sIdx)}
                                                                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition shrink-0"
                                                                        title="Remove Topic"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg border border-dashed border-slate-300 text-center space-y-1">
                                        <p className="text-xs text-slate-500">
                                            No curriculum modules added yet.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addCurriculumItem}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            + Add first module
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* RIGHT COLUMN (4 Cols): Media, Pricing, Status & Actions */}
                        <div className="lg:col-span-4 space-y-5">

                            {/* Card: Publishing & Actions */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                                    Publishing & Visibility
                                </h4>

                                <div>
                                    <InputLabel htmlFor="status" value="Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => {
                                            const nextStatus = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                status: nextStatus,
                                                is_featured: nextStatus === 'published' ? prev.is_featured : false,
                                            }));
                                        }}
                                        className="w-full text-xs rounded-md border-slate-300 dark:border-slate-700 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-2xs"
                                    >
                                        <option value="draft">Draft (Hidden)</option>
                                        <option value="published">Published (Live)</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <InputError className="mt-1" message={errors.status} />
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                    <label className={`flex items-start gap-2.5 select-none ${data.status !== 'published' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            disabled={data.status !== 'published'}
                                            checked={data.status === 'published' && data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
                                        />
                                        <div>
                                            <span className="text-xs font-semibold text-slate-900 block">Featured Course</span>
                                            <span className="text-[10px] text-slate-400">Highlight on top landing page banner</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                                    <Link
                                        href={route('admin.courses.index')}
                                        className="w-1/3 py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing} className="w-2/3 justify-center py-2 text-xs font-semibold shadow-2xs">
                                        <Save className="h-3.5 w-3.5 mr-1" />
                                        <span>{processing ? 'Saving...' : isEdit ? 'Update' : 'Publish'}</span>
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* Card: Course Thumbnail */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                                    Course Thumbnail
                                </h4>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <div className="space-y-2">
                                        <div className="relative w-full h-36 rounded-md overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs">
                                            <img
                                                src={imagePreview}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-[10px] text-white font-mono px-2 py-0.5 rounded-md">
                                                {data.thumbnail_image ? 'Selected' : 'Current'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition cursor-pointer"
                                            >
                                                Change Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-md border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 p-5 text-center cursor-pointer transition"
                                    >
                                        <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                                        <span className="text-xs font-semibold text-slate-700 block">Click to upload banner</span>
                                        <span className="text-[10px] text-slate-400 font-mono">PNG, JPG, WEBP up to 5MB</span>
                                    </div>
                                )}
                                <InputError className="mt-1" message={errors.thumbnail_image || errors.thumbnail} />
                            </div>

                            {/* Card: Pricing & Duration */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                                    Pricing & Schedule
                                </h4>

                                <div>
                                    <InputLabel htmlFor="price" value="Regular Price (₹) *" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full text-xs font-mono py-1.5 px-3 mt-1"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError className="mt-1" message={errors.price} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="discount_price" value="Discounted Price (₹)" />
                                    <TextInput
                                        id="discount_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full text-xs font-mono py-1.5 px-3 mt-1"
                                        value={data.discount_price}
                                        onChange={(e) => setData('discount_price', e.target.value)}
                                        placeholder="Optional sale price"
                                    />
                                    <InputError className="mt-1" message={errors.discount_price} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="duration" value="Duration / Timeline" />
                                    <TextInput
                                        id="duration"
                                        className="w-full text-xs font-mono py-1.5 px-3 mt-1"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g. 10 Weeks, 40 Hours"
                                    />
                                    <InputError className="mt-1" message={errors.duration} />
                                </div>
                            </div>

                            {/* Card: Course Includes / Perks */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                                        Perks & Includes
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addCourseIncludeItem}
                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                                    >
                                        + Add Perk
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {(data.course_includes || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => updateCourseIncludeItem(idx, e.target.value)}
                                                className="w-full text-xs rounded-md border-slate-300 py-1 px-2.5 shadow-2xs"
                                                placeholder="e.g. Certificate of completion"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCourseIncludeItem(idx)}
                                                className="text-slate-400 hover:text-rose-600 p-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card: Portfolio Capstones */}
                            <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                                            Portfolio Capstones
                                        </h4>
                                        <p className="text-[11px] text-slate-500">
                                            Real projects students will build & deploy
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCapstoneItem}
                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                                    >
                                        + Add Capstone
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(data.capstones || []).length === 0 && (
                                        <p className="text-xs text-slate-400 italic">
                                            No custom capstones added. The course will display stack-tailored defaults.
                                        </p>
                                    )}
                                    {(data.capstones || []).map((cap, idx) => (
                                        <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 relative">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-mono font-semibold text-slate-500">
                                                    Capstone #{idx + 1}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCapstoneItem(idx)}
                                                    className="text-slate-400 hover:text-rose-600 p-0.5"
                                                    title="Remove capstone"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={cap.title}
                                                onChange={(e) => updateCapstoneItem(idx, 'title', e.target.value)}
                                                className="w-full text-xs rounded-md border-slate-300 py-1 px-2.5 shadow-2xs bg-white"
                                                placeholder="Project title (e.g. Multi-Tenant SaaS Platform)"
                                            />
                                            <textarea
                                                rows={2}
                                                value={cap.desc}
                                                onChange={(e) => updateCapstoneItem(idx, 'desc', e.target.value)}
                                                className="w-full text-xs rounded-md border-slate-300 py-1 px-2.5 shadow-2xs bg-white resize-none"
                                                placeholder="Brief description of what students build..."
                                            />
                                            <input
                                                type="text"
                                                value={cap.stack}
                                                onChange={(e) => updateCapstoneItem(idx, 'stack', e.target.value)}
                                                className="w-full text-xs rounded-md border-slate-300 py-1 px-2.5 shadow-2xs bg-white font-mono text-[11px]"
                                                placeholder="Tech stack (e.g. Laravel 12 · React · Stripe)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </form>
                </div>
            </div>

            {/* CONFIRM DELETE COURSE MODAL */}
            {isEdit && (
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Course?"
                    message={
                        <p>
                            Are you sure you want to permanently delete{' '}
                            <span className="font-semibold text-slate-800">{course.title}</span>?
                            All modules, lessons, videos, resources, and enrollments linked to this course will also be removed.
                        </p>
                    }
                    confirmText="Yes, Delete Course"
                    variant="danger"
                />
            )}
        </AdminLayout>
    );
}
