import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
    Play,
    FileText,
    Download,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    BookOpen,
    Clock,
    CheckCircle2,
    Radio,
    ExternalLink,
    FileCode,
    FileArchive,
    File,
    FolderCheck,
    Check
} from 'lucide-react';

export default function CourseLearn({ course, progress = {}, completedLessonIds = [] }) {
    const modules = course.modules || [];

    // All lessons flat list
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

    // Completion helpers
    const [isToggling, setIsToggling] = useState(false);

    const isLessonCompleted = (lessonId) => completedLessonIds.includes(lessonId);

    const completedCount = useMemo(() => {
        return allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
    }, [allLessons, completedLessonIds]);

    const progressPct = useMemo(() => {
        if (allLessons.length === 0) return 0;
        return Math.min(100, Math.round((completedCount / allLessons.length) * 100));
    }, [completedCount, allLessons.length]);

    // Video iframe ref
    const iframeRef = useRef(null);

    // Auto-advance countdown (seconds)
    const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);

    // Toggle lesson completed status
    const handleToggleComplete = (lessonId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isToggling || !lessonId) return;
        setIsToggling(true);

        router.post(
            route('student.courses.lessons.toggle-complete', [course.id, lessonId]),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsToggling(false),
            }
        );
    };

    // Handle video ended
    const handleVideoFinished = () => {
        if (!activeLesson) return;

        // Mark active lesson completed
        if (!isLessonCompleted(activeLesson.id)) {
            handleToggleComplete(activeLesson.id);
        }

        // Start 5s countdown to next lesson
        if (activeIndex < allLessons.length - 1) {
            setAutoAdvanceTimer(5);
        }
    };

    // Read URL query params
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlLessonId = urlParams ? Number(urlParams.get('lesson')) : null;
    const urlTab = urlParams ? urlParams.get('tab') : null;

    // Active lesson ID
    const [activeLessonId, setActiveLessonId] = useState(urlLessonId || allLessons[0]?.id || null);

    // Current lesson
    const activeLesson = useMemo(() => {
        return allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;
    }, [allLessons, activeLessonId]);

    // Current lesson index
    const activeIndex = useMemo(() => {
        return allLessons.findIndex((l) => l.id === activeLesson?.id);
    }, [allLessons, activeLesson]);

    // Current video URL
    const activeVideoUrl = useMemo(() => {
        if (!activeLesson) return null;
        if (activeLesson.video_url) return activeLesson.video_url;
        if (activeLesson.videos && activeLesson.videos.length > 0) {
            return activeLesson.videos[0].video_url;
        }
        return null;
    }, [activeLesson]);

    // Current lesson resources
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

    // Active tab (notes | overview | live)
    const [activeTab, setActiveTab] = useState(() => {
        if (urlTab && ['notes', 'overview', 'live'].includes(urlTab)) {
            return urlTab;
        }
        return 'notes';
    });

    // Sidebar open modules
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

    // Sync lesson and tab to URL
    useEffect(() => {
        if (typeof window !== 'undefined' && activeLessonId) {
            const params = new URLSearchParams();
            params.set('lesson', activeLessonId);
            if (activeTab) params.set('tab', activeTab);
            window.history.replaceState({}, '', `?${params.toString()}`);
        }
    }, [activeLessonId, activeTab]);

    // YouTube & Vimeo embed URL
    const getEmbedUrl = (url) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch) {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            return `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1&autoplay=1&origin=${encodeURIComponent(origin)}`;
        }
        const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&api=1`;
        }
        return url;
    };

    // Countdown timer effect
    useEffect(() => {
        if (autoAdvanceTimer === null) return;

        if (autoAdvanceTimer > 0) {
            const timer = setTimeout(() => {
                setAutoAdvanceTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (autoAdvanceTimer === 0) {
            if (activeIndex < allLessons.length - 1) {
                setActiveLessonId(allLessons[activeIndex + 1].id);
            }
            setAutoAdvanceTimer(null);
        }
    }, [autoAdvanceTimer, activeIndex, allLessons]);

    // Reset timer on lesson change
    useEffect(() => {
        setAutoAdvanceTimer(null);
    }, [activeLessonId]);

    // Listen for YouTube/Vimeo video end events
    useEffect(() => {
        const handleMessage = (event) => {
            try {
                let data = event.data;
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch {
                        return;
                    }
                }

                if (!data) return;

                // YouTube ended event
                const isYouTubeEnded =
                    (data.event === 'onStateChange' && data.info === 0) ||
                    (data.event === 'infoDelivery' && data.info && data.info.playerState === 0);

                // Vimeo ended event
                const isVimeoEnded = data.event === 'finish' || data.event === 'ended';

                if (isYouTubeEnded || isVimeoEnded) {
                    handleVideoFinished();
                }
            } catch {
                // Ignore other messages
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [activeLesson, completedLessonIds, activeIndex, allLessons, isToggling]);

    const isEmbeddable = activeVideoUrl && (
        activeVideoUrl.includes('youtube.com') ||
        activeVideoUrl.includes('youtu.be') ||
        activeVideoUrl.includes('vimeo.com')
    );

    // Prev / Next navigation
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
                <div className="space-y-3">
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

                    {/* Course progress bar */}
                    {allLessons.length > 0 && (
                        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-700">Course Progress:</span>
                                <div className="w-36 sm:w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                        }`}
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <span className="text-xs font-extrabold font-mono text-indigo-600">
                                    {progressPct}%
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className={`h-3.5 w-3.5 ${progressPct === 100 ? 'text-emerald-500' : 'text-indigo-500'}`} />
                                <span>
                                    <strong className="text-gray-800">{completedCount}</strong> of <strong className="text-gray-800">{allLessons.length}</strong> lessons completed
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={`${activeLesson ? activeLesson.title : 'Learning Portal'} - ${course.title}`} />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Main video & lesson details */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Video player */}
                            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                                {activeVideoUrl ? (
                                    <div className="relative w-full pt-[56.25%] bg-black">
                                        {isEmbeddable ? (
                                            <iframe
                                                ref={iframeRef}
                                                id={`player-frame-${activeLesson?.id}`}
                                                key={activeVideoUrl}
                                                src={getEmbedUrl(activeVideoUrl)}
                                                title={activeLesson.title}
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                onLoad={() => {
                                                    try {
                                                        if (iframeRef.current?.contentWindow) {
                                                            iframeRef.current.contentWindow.postMessage(
                                                                JSON.stringify({ event: 'listening' }),
                                                                '*'
                                                            );
                                                            iframeRef.current.contentWindow.postMessage(
                                                                JSON.stringify({ method: 'addEventListener', value: 'finish' }),
                                                                '*'
                                                            );
                                                        }
                                                    } catch {
                                                        // ignore
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <video
                                                key={activeVideoUrl}
                                                src={activeVideoUrl}
                                                controls
                                                autoPlay
                                                onEnded={handleVideoFinished}
                                                className="absolute inset-0 w-full h-full object-contain"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                ) : (
                                    /* Reading / notes lecture */
                                    <div className="py-14 px-6 text-center space-y-4 bg-white rounded-2xl border border-gray-200 text-gray-800 shadow-2xs">
                                        <div className="h-14 w-14 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                            <BookOpen className="h-7 w-7" />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-1">
                                            <h3 className="text-base font-bold text-gray-900">
                                                Reading & Study Notes Lecture
                                            </h3>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                This lecture is structured around reading materials and downloadable study notes. Review the summary and study guides below.
                                            </p>
                                        </div>
                                        {activeResources.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('notes')}
                                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>View Attached Notes ({activeResources.length})</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Auto-advance banner */}
                            {autoAdvanceTimer !== null && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-2xs">
                                            {autoAdvanceTimer}s
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span>Lecture Completed! Next lecture will begin shortly.</span>
                                            </div>
                                            {allLessons[activeIndex + 1] && (
                                                <p className="text-xs text-emerald-700 truncate font-medium mt-0.5">
                                                    Up next: <span className="font-semibold text-emerald-900">{allLessons[activeIndex + 1].title}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => setAutoAdvanceTimer(null)}
                                            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-950 bg-white border border-emerald-200 rounded-lg transition"
                                        >
                                            Stay Here
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleNext();
                                                setAutoAdvanceTimer(null);
                                            }}
                                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition inline-flex items-center gap-1"
                                        >
                                            <span>Play Next</span>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Lesson title & controls */}
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

                                    {/* Navigation & complete buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                                        {activeLesson && (
                                            <button
                                                type="button"
                                                disabled={isToggling}
                                                onClick={(e) => handleToggleComplete(activeLesson.id, e)}
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-2xs transition ${
                                                    isLessonCompleted(activeLesson.id)
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
                                                }`}
                                                title={
                                                    isLessonCompleted(activeLesson.id)
                                                        ? 'Click to mark lesson as incomplete'
                                                        : 'Click to mark lesson as completed'
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span>
                                                    {isLessonCompleted(activeLesson.id) ? 'Completed' : 'Mark Complete'}
                                                </span>
                                            </button>
                                        )}

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

                                {/* Tabs navigation */}
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

                                {/* Notes tab */}
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

                                {/* Overview tab */}
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

                                {/* Live classes tab */}
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

                        {/* Sidebar: course playlist */}
                        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

                                {/* Playlist header */}
                                <div className="p-4 bg-white border-b border-gray-200 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                                <FolderCheck className="h-4 w-4 text-indigo-600" />
                                                <span>Course Curriculum</span>
                                            </h3>
                                            <p className="text-[11px] text-gray-500 font-mono">
                                                {allLessons.length} {allLessons.length === 1 ? 'Lecture' : 'Lectures'} · {modules.length} Modules
                                            </p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {progressPct}% Done
                                        </span>
                                    </div>

                                    {/* Sidebar progress bar */}
                                    {allLessons.length > 0 && (
                                        <div className="space-y-1 pt-1">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                                    }`}
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                                                <span>{completedCount}/{allLessons.length} Completed</span>
                                                <span>{progressPct}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modules list */}
                                <div className="divide-y divide-gray-100 max-h-[calc(100vh-280px)] overflow-y-auto">
                                    {modules.map((mod, mIdx) => {
                                        const isOpen = !!openModules[mod.id];
                                        const modLessons = mod.lessons || [];

                                        return (
                                            <div key={mod.id} className="bg-white">
                                                {/* Module header */}
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

                                                {/* Lessons list */}
                                                {isOpen && (
                                                    <div className="divide-y divide-gray-50 bg-white">
                                                        {modLessons.map((lesson, lIdx) => {
                                                            const isActive = lesson.id === activeLesson?.id;
                                                            const isCompleted = isLessonCompleted(lesson.id);

                                                            return (
                                                                <div
                                                                    key={lesson.id}
                                                                    className={`w-full px-4 py-3 text-left transition flex items-start justify-between gap-3 group ${
                                                                        isActive
                                                                            ? 'bg-indigo-50/90 text-indigo-900 border-l-4 border-indigo-600 font-semibold'
                                                                            : isCompleted
                                                                            ? 'bg-emerald-50/20 hover:bg-emerald-50/40 text-gray-700'
                                                                            : 'hover:bg-slate-50 text-gray-700'
                                                                    }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveLessonId(lesson.id)}
                                                                        className="flex items-start gap-2.5 min-w-0 flex-1 text-left"
                                                                    >
                                                                        <div className={`mt-0.5 p-1 rounded shrink-0 ${
                                                                            isActive
                                                                                ? 'bg-indigo-600 text-white'
                                                                                : isCompleted
                                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                                : 'text-gray-400'
                                                                        }`}>
                                                                            {isCompleted ? (
                                                                                <Check className="h-3 w-3" />
                                                                            ) : (
                                                                                <Play className="h-3 w-3 fill-current" />
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0 space-y-0.5">
                                                                            <span className={`text-xs line-clamp-2 leading-snug ${
                                                                                isActive
                                                                                    ? 'font-bold text-indigo-950'
                                                                                    : isCompleted
                                                                                    ? 'font-medium text-gray-800'
                                                                                    : 'font-medium'
                                                                            }`}>
                                                                                {lesson.title}
                                                                            </span>
                                                                            {lesson.duration && (
                                                                                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                                                                    <Clock className="h-2.5 w-2.5" />
                                                                                    <span>{lesson.duration}</span>
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </button>

                                                                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                                                        {/* Toggle complete button */}
                                                                        <button
                                                                            type="button"
                                                                            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                                                                            disabled={isToggling}
                                                                            onClick={(e) => handleToggleComplete(lesson.id, e)}
                                                                            className={`p-1 rounded-md transition ${
                                                                                isCompleted
                                                                                    ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100'
                                                                                    : 'text-gray-300 hover:text-emerald-600 hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            <CheckCircle2 className={`h-4 w-4 ${isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                                                        </button>

                                                                        {lesson.resources && lesson.resources.length > 0 && (
                                                                            <span
                                                                                title={`${lesson.resources.length} study material(s) attached`}
                                                                                className="p-1 text-emerald-600 bg-emerald-50 rounded shrink-0"
                                                                            >
                                                                                <Download className="h-3 w-3" />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Instructor card */}
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
