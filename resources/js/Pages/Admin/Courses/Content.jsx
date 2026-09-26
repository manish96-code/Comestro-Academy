import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Plus,
    Video,
    FileText,
    ExternalLink,
    Play,
    Edit3,
    Trash2,
    Clock,
    Layers,
    X,
    FolderTree,
    FileCheck,
    Save,
    Radio,
    BookOpen,
    HelpCircle,
    Settings,
    UploadCloud,
    Film,
    Link as LinkIcon,
} from 'lucide-react';

export default function CourseContent({ course }) {
    const lessons = useMemo(() => {
        if (Array.isArray(course.modules) && course.modules.length > 0) {
            return course.modules.flatMap((m) => (m.lessons || []).map((l) => ({ ...l, module_name: m.title })));
        }
        return course.lessons || [];
    }, [course]);

    // Group lessons by module_name preserving order
    const modulesGrouped = useMemo(() => {
        const groups = {};
        lessons.forEach((lesson) => {
            const mod = lesson.module_name || 'General';
            if (!groups[mod]) {
                groups[mod] = [];
            }
            groups[mod].push(lesson);
        });
        return groups;
    }, [lessons]);

    const moduleNames = Object.keys(modulesGrouped);

    // Modal state for adding/editing a lesson
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

    const [videoSource, setVideoSource] = useState('upload');
    const [selectedVideoName, setSelectedVideoName] = useState('');
    const [selectedVideoSize, setSelectedVideoSize] = useState('');

    // Form setup for add/edit
    const { data, setData, post, processing, progress, errors, reset, clearErrors, transform } = useForm({
        module_name: moduleNames[0] || 'Module 1: Introduction',
        new_module_name: '',
        title: '',
        video_url: '',
        video_file: null,
        duration: '',
        notes_file: null,
        notes_title: '',
        description: '',
        order: 1,
    });

    const handleVideoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('video_file', file);
        setSelectedVideoName(file.name);
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setSelectedVideoSize(`${sizeMb} MB`);

        // Automatically detect video duration if not already set
        try {
            const tempUrl = URL.createObjectURL(file);
            const tempVideo = document.createElement('video');
            tempVideo.preload = 'metadata';
            tempVideo.onloadedmetadata = () => {
                URL.revokeObjectURL(tempUrl);
                const totalSecs = Math.round(tempVideo.duration);
                if (totalSecs) {
                    const mins = Math.floor(totalSecs / 60);
                    const secs = totalSecs % 60;
                    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                    setData((prev) => ({ ...prev, duration: formatted, video_file: file }));
                }
            };
            tempVideo.src = tempUrl;
        } catch {
            // Ignore duration parse failure
        }
    };

    const handleRemoveSelectedVideo = () => {
        setData('video_file', null);
        setSelectedVideoName('');
        setSelectedVideoSize('');
        const fileInput = document.getElementById('video_file');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const openAddModal = (presetModule = '') => {
        clearErrors();
        setEditingLesson(null);
        setVideoSource('upload');
        setSelectedVideoName('');
        setSelectedVideoSize('');
        setData({
            module_name: presetModule || moduleNames[0] || 'Module 1: Introduction',
            new_module_name: '',
            title: '',
            video_url: '',
            video_file: null,
            duration: '',
            notes_file: null,
            notes_title: '',
            description: '',
            order: lessons.length + 1,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (lesson) => {
        clearErrors();
        setEditingLesson(lesson);
        const isUploaded = lesson.video_provider === 'imagekit' || lesson.video_provider === 'local';
        setVideoSource(isUploaded || !lesson.video_url ? 'upload' : 'url');
        setSelectedVideoName('');
        setSelectedVideoSize('');
        setData({
            module_name: lesson.module_name,
            new_module_name: '',
            title: lesson.title,
            video_url: lesson.video_url || '',
            video_file: null,
            duration: lesson.duration || '',
            notes_file: null,
            notes_title: lesson.notes_title || '',
            description: lesson.description || '',
            order: lesson.order || 1,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLesson(null);
        setSelectedVideoName('');
        setSelectedVideoSize('');
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const effectiveModule = data.module_name === '__new__'
            ? (data.new_module_name.trim() || 'New Module')
            : data.module_name;

        transform((currentData) => {
            const payload = {
                ...currentData,
                module_name: effectiveModule,
            };
            if (videoSource === 'upload') {
                if (currentData.video_file) {
                    // New video file uploaded
                    payload.video_file = currentData.video_file;
                } else if (editingLesson?.video_url) {
                    // Preserved existing uploaded video URL
                    payload.video_url = editingLesson.video_url;
                    delete payload.video_file;
                }
            } else {
                // External URL mode
                delete payload.video_file;
            }
            return payload;
        });

        if (editingLesson) {
            post(route('admin.courses.lessons.update', [course.id, editingLesson.id]), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.courses.lessons.store', course.id), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (lessonId) => {
        if (!confirm('Are you sure you want to delete this lecture? Any uploaded notes will also be unlinked.')) {
            return;
        }

        router.delete(route('admin.courses.lessons.destroy', [course.id, lessonId]), {
            preserveScroll: true,
        });
    };

    // Calculate total stats
    const totalVideos = lessons.filter((l) => l.video_url).length;
    const totalNotes = lessons.filter((l) => l.notes_file).length;

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.courses.index')}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs"
                            title="Back to Courses"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                    {course.title}
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                                    (course.type === 'live' || course.course_type === 'live')
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }`}>
                                    {(course.type === 'live' || course.course_type === 'live') ? (
                                        <>
                                            <Radio className="h-2.5 w-2.5 text-rose-500 animate-pulse" />
                                            Live Course
                                        </>
                                    ) : (
                                        <>
                                            <Video className="h-2.5 w-2.5 text-indigo-500" />
                                            Recorded Lectures & Notes
                                        </>
                                    )}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                /{course.slug} • Manage curriculum modules, video streams, and PDF study resources
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.courses.show', course.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md shadow-2xs transition"
                        >
                            <Settings className="h-3.5 w-3.5 text-slate-500" />
                            <span>Course Settings</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => openAddModal()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition shrink-0"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add New Lecture</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Curriculum & Notes - ${course.title}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Summary Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Modules</p>
                                <p className="text-lg font-bold text-slate-900 font-mono">{moduleNames.length}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-md border border-sky-100">
                                <Video className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Video Lessons</p>
                                <p className="text-lg font-bold text-slate-900 font-mono">{totalVideos} <span className="text-xs text-slate-400 font-normal">/ {lessons.length}</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">PDF Study Notes</p>
                                <p className="text-lg font-bold text-slate-900 font-mono">{totalNotes}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-md border border-amber-100">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Lessons</p>
                                <p className="text-lg font-bold text-slate-900 font-mono">{lessons.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Modules and Lessons Listing */}
                    {lessons.length === 0 ? (
                        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center space-y-4 shadow-2xs">
                            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center mx-auto border border-indigo-100">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div className="space-y-1 max-w-md mx-auto">
                                <h3 className="text-sm font-bold text-slate-900">No Curriculum Lectures Uploaded</h3>
                                <p className="text-xs text-slate-500">
                                    Start structuring this course by adding modules, video streaming links (YouTube / Vimeo / MP4), and uploading study notes (PDFs).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => openAddModal()}
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create First Lecture</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {moduleNames.map((modName, mIdx) => (
                                <div
                                    key={modName}
                                    className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden"
                                >
                                    {/* Module Banner */}
                                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <span className="h-6 w-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 font-mono shadow-xs">
                                                {mIdx + 1}
                                            </span>
                                            <h3 className="font-bold text-xs sm:text-sm text-slate-900">{modName}</h3>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                ({modulesGrouped[modName].length} {modulesGrouped[modName].length === 1 ? 'lesson' : 'lessons'})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openAddModal(modName)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Add Lecture</span>
                                        </button>
                                    </div>

                                    {/* Lessons List in Module */}
                                    <div className="divide-y divide-slate-100">
                                        {modulesGrouped[modName].map((lesson, lIdx) => (
                                            <div
                                                key={lesson.id}
                                                className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            >
                                                {/* Left: Info */}
                                                <div className="flex items-start gap-3.5 min-w-0">
                                                    <div className="h-9 w-9 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                                                        <Video className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <div className="space-y-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                                                                #{lesson.order || lIdx + 1}
                                                            </span>
                                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                                {lesson.title}
                                                            </h4>
                                                        </div>

                                                        {/* Description snippet */}
                                                        {lesson.description && (
                                                            <p className="text-xs text-slate-500 line-clamp-1">
                                                                {lesson.description}
                                                            </p>
                                                        )}

                                                        {/* Video & Notes Status Pills */}
                                                        <div className="flex items-center gap-2.5 pt-0.5 flex-wrap text-xs text-slate-500">
                                                            {/* Video Status */}
                                                            {lesson.video_url ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPreviewVideoUrl(lesson.video_url)}
                                                                    className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 transition text-[11px] cursor-pointer"
                                                                >
                                                                    <Play className="h-2.5 w-2.5 fill-current" />
                                                                    <span>
                                                                        {lesson.video_provider === 'imagekit'
                                                                            ? 'Play (ImageKit CDN)'
                                                                            : (lesson.video_provider === 'local'
                                                                                ? 'Play (Uploaded)'
                                                                                : 'Watch Stream')}
                                                                    </span>
                                                                    {lesson.duration && (
                                                                        <span className="text-sky-600 font-mono ml-0.5">({lesson.duration})</span>
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                                                                    <span>No video attached</span>
                                                                </span>
                                                            )}

                                                            {/* Notes / Resources Status */}
                                                            {((lesson.resources && lesson.resources.length > 0)
                                                                ? lesson.resources
                                                                : (lesson.notes_file ? [{ id: 'legacy', title: lesson.notes_title || 'Lecture Notes (PDF)', file_url: lesson.notes_file }] : [])
                                                            ).map((res) => (
                                                                <a
                                                                    key={res.id}
                                                                    href={res.file_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 transition text-[11px]"
                                                                >
                                                                    <FileCheck className="h-3 w-3" />
                                                                    <span className="max-w-[140px] truncate">{res.title || 'Lecture Notes'}</span>
                                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                                </a>
                                                            ))}
                                                            {(!lesson.notes_file && (!lesson.resources || lesson.resources.length === 0)) && (
                                                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                                                                    <span>No notes</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(lesson)}
                                                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-200 shadow-2xs transition flex items-center gap-1"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(lesson.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                                                        title="Delete Lecture"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Add / Edit Lecture with Video & Notes */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-600 text-white rounded-md shadow-2xs">
                                    <Video className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900">
                                        {editingLesson ? 'Edit Lecture & Course Notes' : 'Add New Curriculum Lecture'}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Configure lesson stream URL, lecture duration, and attach PDF study notes
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Module Selector */}
                            <div className="space-y-1.5">
                                <InputLabel value="Curriculum Module / Chapter *" />
                                <select
                                    value={data.module_name}
                                    onChange={(e) => setData('module_name', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-md border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                >
                                    {moduleNames.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                    <option value="__new__">+ Create New Module / Chapter</option>
                                </select>
                                {data.module_name === '__new__' && (
                                    <div className="pt-2">
                                        <TextInput
                                            type="text"
                                            placeholder="Enter New Module Title (e.g. Module 3: RESTful APIs & Authentication)"
                                            value={data.new_module_name}
                                            onChange={(e) => setData('new_module_name', e.target.value)}
                                            className="w-full text-xs sm:text-sm py-2 px-3"
                                        />
                                    </div>
                                )}
                                <InputError message={errors.module_name} />
                            </div>

                            {/* Lecture Title & Order */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <div className="sm:col-span-9">
                                    <InputLabel htmlFor="title" value="Lecture / Lesson Title *" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Introduction to Routing & Middleware"
                                        className="w-full text-xs sm:text-sm py-2 px-3 mt-1"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="sm:col-span-3">
                                    <InputLabel htmlFor="order" value="Lesson Order" />
                                    <TextInput
                                        id="order"
                                        type="number"
                                        min="1"
                                        value={data.order}
                                        onChange={(e) => setData('order', e.target.value)}
                                        className="w-full text-xs sm:text-sm py-2 px-3 mt-1 font-mono"
                                    />
                                    <InputError message={errors.order} />
                                </div>
                            </div>

                            {/* Section 1: Video Content */}
                            <div className="p-4 rounded-lg border border-sky-200 bg-sky-50/40 space-y-3.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                                        <Video className="h-4 w-4 text-sky-700" />
                                        <span>Lecture Video</span>
                                    </div>

                                    {/* Video Source Segmented Control */}
                                    <div className="inline-flex items-center p-0.5 rounded-md bg-slate-200/80 border border-slate-300 text-xs shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => setVideoSource('upload')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                                                videoSource === 'upload'
                                                    ? 'bg-white text-indigo-700 shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <UploadCloud className="h-3.5 w-3.5" />
                                            <span>Upload Video File</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setVideoSource('url')}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                                                videoSource === 'url'
                                                    ? 'bg-white text-indigo-700 shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <LinkIcon className="h-3.5 w-3.5" />
                                            <span>External URL / Stream</span>
                                        </button>
                                    </div>
                                </div>

                                {videoSource === 'upload' ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                                            <div className="sm:col-span-8">
                                                <InputLabel htmlFor="video_file" value="Select Video File (MP4, WebM, MOV, MKV up to 100MB)" />
                                                <input
                                                    id="video_file"
                                                    type="file"
                                                    onChange={handleVideoFileChange}
                                                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo"
                                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 mt-1 cursor-pointer"
                                                />
                                                <InputError message={errors.video_file} />

                                                {selectedVideoName && (
                                                    <div className="mt-2 flex items-center justify-between p-2 rounded-md bg-white border border-indigo-200 text-xs text-slate-700 shadow-2xs">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Film className="h-4 w-4 text-indigo-600 shrink-0" />
                                                            <span className="font-medium truncate">{selectedVideoName}</span>
                                                            <span className="text-[11px] font-mono text-slate-400">({selectedVideoSize})</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveSelectedVideo}
                                                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                                            title="Remove selected video"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                )}

                                                {editingLesson?.video_url && !selectedVideoName && (
                                                    <div className="flex items-center gap-2 pt-2 text-xs text-slate-600">
                                                        <span className="font-semibold text-slate-700">Current Video:</span>
                                                        <a
                                                            href={editingLesson.video_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-indigo-600 hover:underline font-mono truncate max-w-xs flex items-center gap-1"
                                                        >
                                                            <span className="truncate">{editingLesson.video_url}</span>
                                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                                        </a>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            (Select a new file above to replace)
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="sm:col-span-4">
                                                <InputLabel htmlFor="duration" value="Duration (e.g. 15:30)" />
                                                <TextInput
                                                    id="duration"
                                                    type="text"
                                                    value={data.duration}
                                                    onChange={(e) => setData('duration', e.target.value)}
                                                    placeholder="12:45"
                                                    className="w-full text-xs py-2 px-3 mt-1 font-mono"
                                                />
                                                <p className="text-[10px] text-slate-400 mt-1">Auto-detected from file</p>
                                                <InputError message={errors.duration} />
                                            </div>
                                        </div>

                                        {progress && (
                                            <div className="p-2.5 rounded-md bg-white border border-indigo-200 space-y-1.5 shadow-2xs">
                                                <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
                                                    <span>Uploading Video to ImageKit...</span>
                                                    <span className="font-mono">{progress.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-indigo-600 h-2 transition-all duration-150"
                                                        style={{ width: `${progress.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        <div className="sm:col-span-8">
                                            <InputLabel htmlFor="video_url" value="Video URL (YouTube, Vimeo, MP4, Drive)" />
                                            <TextInput
                                                id="video_url"
                                                type="url"
                                                value={data.video_url}
                                                onChange={(e) => setData('video_url', e.target.value)}
                                                placeholder="https://www.youtube.com/watch?v=... or .mp4"
                                                className="w-full text-xs py-2 px-3 mt-1 font-mono"
                                            />
                                            <InputError message={errors.video_url} />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <InputLabel htmlFor="duration" value="Duration (e.g. 15:30)" />
                                            <TextInput
                                                id="duration"
                                                type="text"
                                                value={data.duration}
                                                onChange={(e) => setData('duration', e.target.value)}
                                                placeholder="12:45"
                                                className="w-full text-xs py-2 px-3 mt-1 font-mono"
                                            />
                                            <InputError message={errors.duration} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Upload Study Notes (PDF/Docs) */}
                            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-3">
                                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>Lecture Notes & Downloadable Material</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <InputLabel htmlFor="notes_title" value="Notes Title (Optional)" />
                                        <TextInput
                                            id="notes_title"
                                            type="text"
                                            value={data.notes_title}
                                            onChange={(e) => setData('notes_title', e.target.value)}
                                            placeholder="e.g. Slide Deck & Cheat Sheet (PDF)"
                                            className="w-full text-xs py-2 px-3 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="notes_file" value="Upload PDF / Document File" />
                                        <input
                                            id="notes_file"
                                            type="file"
                                            onChange={(e) => setData('notes_file', e.target.files[0])}
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                                            className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 mt-1 cursor-pointer"
                                        />
                                        <InputError message={errors.notes_file} />
                                    </div>
                                </div>

                                {editingLesson?.notes_file && (
                                    <div className="flex items-center gap-2 pt-1 text-xs text-emerald-800 font-medium">
                                        <span>Current Notes:</span>
                                        <a
                                            href={editingLesson.notes_file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-emerald-700 underline font-semibold flex items-center gap-1"
                                        >
                                            <span>View Attached File</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Description & Free Preview */}
                            <div className="space-y-3">
                                <div>
                                    <InputLabel htmlFor="description" value="Lesson Summary / Outline Notes" />
                                    <textarea
                                        id="description"
                                        rows="2"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Key takeaways or summary points covered in this lecture..."
                                        className="w-full text-xs rounded-md border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 mt-1 transition"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition disabled:opacity-50"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Saving...' : editingLesson ? 'Update Lecture' : 'Save Lecture'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Player Preview Modal */}
            {previewVideoUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
                    <div className="bg-slate-900 rounded-lg overflow-hidden max-w-3xl w-full border border-slate-700 shadow-2xl">
                        <div className="px-4 py-3 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
                            <span className="text-xs font-semibold flex items-center gap-1.5">
                                <Play className="h-3 w-3 text-indigo-400 fill-current" />
                                Video Lecture Stream Preview
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewVideoUrl(null)}
                                className="p-1 text-slate-400 hover:text-white rounded-md transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black flex items-center justify-center">
                            {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                                <iframe
                                    src={previewVideoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                                    className="w-full h-full"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={previewVideoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
