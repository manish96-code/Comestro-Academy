import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Play,
    Video,
    FileText,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    BookOpen,
    Clock,
    CheckCircle2,
    Calendar,
    Radio,
    ExternalLink,
    FileCode,
    FileArchive,
    File,
    FolderCheck,
    Layers,
    User
} from 'lucide-react';

export default function CourseLearn({ course }) {
    const modules = course.modules || [];

    // Flatten all lessons across modules for easy indexing and Prev/Next navigation
    const allLessons = useMemo(() => {
        const list = [];
        modules.forEach((mod) => {
            (mod.lessons || []).forEach((lesson) => {
                list.push({
                    ...lesson,
                    moduleTitle: mod.title,
                });
            });
        });
        return list;
    }, [modules]);

    // Track active lesson (defaults to first lesson)
    const [activeLessonId, setActiveLessonId] = useState(allLessons[0]?.id || null);

    // Active lesson object
    const activeLesson = useMemo(() => {
        return allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;
    }, [allLessons, activeLessonId]);

    // Active lesson index
    const activeIndex = useMemo(() => {
        return allLessons.findIndex((l) => l.id === activeLesson?.id);
    }, [allLessons, activeLesson]);

    // Active video stream URL
    const activeVideoUrl = useMemo(() => {
        if (!activeLesson) return null;
        if (activeLesson.video_url) return activeLesson.video_url;
        if (activeLesson.videos && activeLesson.videos.length > 0) {
            return activeLesson.videos[0].video_url;
        }
        return null;
    }, [activeLesson]);

    // Active lesson resources
    const activeResources = useMemo(() => {
        if (!activeLesson) return [];
        if (activeLesson.resources && activeLesson.resources.length > 0) {
            return activeLesson.resources;
        }
        if (activeLesson.notes_file) {
            return [{
                id: 'legacy',
                title: activeLesson.notes_title || 'Lecture Study Notes (PDF)',
                file_url: activeLesson.notes_file,
                resource_type: 'pdf',
            }];
        }
        return [];
    }, [activeLesson]);

    // Active content tab: 'overview' | 'notes' | 'live'
    const [activeTab, setActiveTab] = useState('notes');

    // Track open modules in sidebar accordion
    const [openModules, setOpenModules] = useState(() => {
        const initial = {};
        modules.forEach((m) => {
            initial[m.id] = true;
        });
        return initial;
    });

    const toggleModule = (modId) => {
        setOpenModules((prev) => ({
            ...prev,
            [modId]: !prev[modId],
        }));
    };

    // Helper to generate embed URL for YouTube/Vimeo
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
        }
        const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }
        return url;
    };

    const isEmbeddable = activeVideoUrl && (
        activeVideoUrl.includes('youtube.com') ||
        activeVideoUrl.includes('youtu.be') ||
        activeVideoUrl.includes('vimeo.com')
    );

    // Prev / Next lesson triggers
    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveLessonId(allLessons[activeIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (activeIndex < allLessons.length - 1) {
            setActiveLessonId(allLessons[activeIndex + 1].id);
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="h-5 w-5 text-rose-500 shrink-0" />;
            case 'code':
                return <FileCode className="h-5 w-5 text-emerald-500 shrink-0" />;
            case 'archive':
                return <FileArchive className="h-5 w-5 text-amber-500 shrink-0" />;
            default:
                return <File className="h-5 w-5 text-indigo-500 shrink-0" />;
        }
    };

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-1">
                            <Link href={route('student.courses.enrolled')} className="hover:text-indigo-600 transition">
                                My Enrolled Courses
                            </Link>
                            <span>/</span>
                            <span className="truncate max-w-xs sm:max-w-md text-gray-700 font-medium">
                                {course.title}
                            </span>
                        </div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">
                            {course.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={route('courses.show', course.slug || course.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                        >
                            Course Details
                        </Link>
                        <Link
                            href={route('student.courses.enrolled')}
                            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/60 rounded-lg shadow-2xs transition"
                        >
                            All Enrolled Courses
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${activeLesson ? activeLesson.title : 'Learning Portal'} - ${course.title}`} />

            <div className="py-6 bg-slate-100 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* LEFT COLUMN: Main Video Player & Lesson Details (8 Cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* 1. Video Theater Screen */}
                            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                                {activeVideoUrl ? (
                                    <div className="relative w-full pt-[56.25%] bg-black">
                                        {isEmbeddable ? (
                                            <iframe
                                                src={getEmbedUrl(activeVideoUrl)}
                                                title={activeLesson.title}
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                key={activeVideoUrl}
                                                src={activeVideoUrl}
                                                controls
                                                autoPlay
                                                className="absolute inset-0 w-full h-full object-contain"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                ) : (
                                    /* No Video State: Theory / Notes Lecture */
                                    <div className="py-16 px-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
                                        <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-1">
                                            <h3 className="text-base font-bold text-white">
                                                Reading & Notes Lecture
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                This lecture is structured around reading materials and downloadable study notes. Review the summary and study guides below.
                                            </p>
                                        </div>
                                        {activeResources.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('notes')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>View Attached Notes ({activeResources.length})</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 2. Lesson Title, Navigation Controls & Badges */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                                {activeLesson?.moduleTitle || 'General Module'}
                                            </span>
                                            {activeLesson?.duration && (
                                                <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{activeLesson.duration}</span>
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-tight">
                                            {activeLesson ? activeLesson.title : 'Select a Lecture'}
                                        </h2>
                                    </div>

                                    {/* Prev / Next Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                                        <button
                                            type="button"
                                            disabled={activeIndex <= 0}
                                            onClick={handlePrev}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-2xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span>Previous</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={activeIndex >= allLessons.length - 1}
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <span>Next Lecture</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('notes')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                                            activeTab === 'notes'
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Study Notes & Resources ({activeResources.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('overview')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                                            activeTab === 'overview'
                                                ? 'bg-indigo-600 text-white shadow-xs'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span>Lecture Notes & Description</span>
                                    </button>

                                    {course.live_classes && course.live_classes.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('live')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                                                activeTab === 'live'
                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Radio className="h-3.5 w-3.5" />
                                            <span>Live Sessions ({course.live_classes.length})</span>
                                        </button>
                                    )}
                                </div>

                                {/* Tab Content 1: Study Notes & Downloads */}
                                {activeTab === 'notes' && (
                                    <div className="space-y-4 pt-1">
                                        {activeResources.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {activeResources.map((res) => (
                                                    <div
                                                        key={res.id}
                                                        className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition flex items-center justify-between gap-3"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-2xs shrink-0">
                                                                {getResourceIcon(res.resource_type)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-bold text-gray-900 truncate">
                                                                    {res.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mt-0.5">
                                                                    <span className="uppercase font-semibold text-gray-600">
                                                                        {res.resource_type || 'PDF'}
                                                                    </span>
                                                                    {res.formatted_file_size && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>{res.formatted_file_size}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <a
                                                            href={res.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition shrink-0"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            <span>Download</span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-xl">
                                                No downloadable PDF or source files attached for this lecture.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tab Content 2: Lecture Overview */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-3 pt-1">
                                        {activeLesson?.description ? (
                                            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                                                {activeLesson.description}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">
                                                No supplementary notes or written summary provided for this lecture.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Tab Content 3: Live Interactive Classes */}
                                {activeTab === 'live' && course.live_classes && (
                                    <div className="space-y-3 pt-1">
                                        {course.live_classes.map((cls) => (
                                            <div
                                                key={cls.id}
                                                className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                                                            {cls.status}
                                                        </span>
                                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                                            {cls.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(cls.start_time).toLocaleString()}
                                                    </p>
                                                </div>

                                                {cls.meeting_link && (
                                                    <a
                                                        href={cls.meeting_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition self-start sm:self-auto shrink-0"
                                                    >
                                                        <span>Join Live Class</span>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Course Playlist / Curriculum Sidebar (4 Cols) */}
                        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

                                {/* Playlist Header */}
                                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <FolderCheck className="h-4 w-4 text-indigo-400" />
                                            <span>Course Playlist</span>
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-mono">
                                            {allLessons.length} {allLessons.length === 1 ? 'Lecture' : 'Lectures'} in {modules.length} Modules
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        Enrolled
                                    </span>
                                </div>

                                {/* Modules & Lessons Accordion List */}
                                <div className="divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto">
                                    {modules.map((mod, mIdx) => {
                                        const isOpen = !!openModules[mod.id];
                                        const modLessons = mod.lessons || [];

                                        return (
                                            <div key={mod.id} className="bg-white">
                                                {/* Module Toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModule(mod.id)}
                                                    className="w-full px-4 py-3 bg-gray-50/80 hover:bg-gray-100 transition flex items-center justify-between text-left"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                        <span className="h-5 w-5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">
                                                            {mIdx + 1}
                                                        </span>
                                                        <span className="text-xs font-bold text-gray-900 truncate">
                                                            {mod.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-[10px] font-semibold text-gray-400 font-mono">
                                                            {modLessons.length}
                                                        </span>
                                                        <ChevronDown
                                                            className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                                                                isOpen ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Lessons list inside Module */}
                                                {isOpen && (
                                                    <div className="divide-y divide-gray-50 bg-white">
                                                        {modLessons.map((lesson, lIdx) => {
                                                            const isActive = lesson.id === activeLesson?.id;
                                                            return (
                                                                <button
                                                                    key={lesson.id}
                                                                    type="button"
                                                                    onClick={() => setActiveLessonId(lesson.id)}
                                                                    className={`w-full px-4 py-3 text-left transition flex items-start justify-between gap-3 ${
                                                                        isActive
                                                                            ? 'bg-indigo-50/90 text-indigo-900 border-l-4 border-indigo-600 font-semibold'
                                                                            : 'hover:bg-slate-50 text-gray-700'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start gap-2.5 min-w-0">
                                                                        <div className={`mt-0.5 p-1 rounded ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>
                                                                            <Play className="h-3 w-3 fill-current" />
                                                                        </div>
                                                                        <div className="min-w-0 space-y-0.5">
                                                                            <span className={`text-xs line-clamp-2 leading-snug ${isActive ? 'font-bold text-indigo-950' : 'font-medium'}`}>
                                                                                {lesson.title}
                                                                            </span>
                                                                            {lesson.duration && (
                                                                                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                                                                    <Clock className="h-2.5 w-2.5" />
                                                                                    <span>{lesson.duration}</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {lesson.resources && lesson.resources.length > 0 && (
                                                                        <span
                                                                            title={`${lesson.resources.length} study material(s) attached`}
                                                                            className="mt-0.5 p-1 text-emerald-600 bg-emerald-50 rounded shrink-0"
                                                                        >
                                                                            <Download className="h-3 w-3" />
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Instructor Card Mini */}
                            {course.instructor && (
                                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-2xs">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                                        {course.instructor.user?.name ? course.instructor.user.name.charAt(0).toUpperCase() : 'M'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                            Mentor & Instructor
                                        </p>
                                        <h4 className="text-xs font-bold text-gray-900 truncate">
                                            {course.instructor.user?.name || 'Academy Mentor'}
                                        </h4>
                                        <p className="text-[11px] text-indigo-600 truncate">
                                            {course.instructor.designation || 'Software Instructor'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
