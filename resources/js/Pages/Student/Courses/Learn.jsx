import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    Check,
    Lock,
    GraduationCap,
    AlertCircle,
    XCircle,
    ClipboardList,
    Award,
} from 'lucide-react';

export default function CourseLearn({ course, enrollment = null, progress = {}, completedLessonIds = [], unlockedLessonIds = [], exams = [], assignments = [], certificate = null }) {
    const modules = course.modules || [];
    const { auth } = usePage().props;
    const isAdminOrInstructor = auth?.user?.role === 'admin' || auth?.user?.role === 'instructor';

    const courseExams = exams || [];

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

    // Unlocked check (server-computed with sequential progression + admin bypass)
    const unlockedSet = useMemo(() => {
        if (isAdminOrInstructor) return new Set(allLessons.map((l) => l.id));
        return new Set(unlockedLessonIds.length > 0 ? unlockedLessonIds : [allLessons[0]?.id]);
    }, [unlockedLessonIds, allLessons, isAdminOrInstructor]);

    const isLessonUnlocked = (lessonId) => !lessonId ? false : unlockedSet.has(lessonId);

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

    // Toggle lesson completed status (only allowed for unlocked lectures)
    const handleToggleComplete = (lessonId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isToggling || !lessonId || !isLessonUnlocked(lessonId)) return;
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

    // Read URL query params
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlLessonId = urlParams ? Number(urlParams.get('lesson')) : null;
    const urlTab = urlParams ? urlParams.get('tab') : null;

    // Helper to resolve an accessible unlocked lesson
    const resolveDefaultLessonId = () => {
        if (allLessons.length === 0) return null;
        if (urlLessonId && isLessonUnlocked(urlLessonId)) return urlLessonId;
        const inProgress = allLessons.find((l) => isLessonUnlocked(l.id) && !isLessonCompleted(l.id));
        return inProgress?.id || allLessons[0]?.id || null;
    };

    // Active lesson ID
    const [activeLessonId, setActiveLessonId] = useState(() => resolveDefaultLessonId());

    // Keep activeLessonId valid and unlocked
    useEffect(() => {
        if (allLessons.length > 0 && activeLessonId && !isLessonUnlocked(activeLessonId)) {
            const fallbackId = resolveDefaultLessonId();
            if (fallbackId && fallbackId !== activeLessonId) {
                setActiveLessonId(fallbackId);
            }
        }
    }, [activeLessonId, unlockedSet, allLessons]);

    // Current lesson
    const activeLesson = useMemo(() => {
        return allLessons.find((l) => l.id === activeLessonId) || allLessons[0] || null;
    }, [allLessons, activeLessonId]);

    // Current lesson index
    const activeIndex = useMemo(() => {
        return allLessons.findIndex((l) => l.id === activeLesson?.id);
    }, [allLessons, activeLesson]);

    // Previous lesson in course sequence (for locking notice)
    const activeLessonPrev = useMemo(() => {
        if (!activeLesson) return null;
        const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
        return idx > 0 ? allLessons[idx - 1] : null;
    }, [activeLesson, allLessons]);

    // Handle video ended
    const handleVideoFinished = () => {
        if (!activeLesson || !isLessonUnlocked(activeLesson.id)) return;

        // Mark active lesson completed
        if (!isLessonCompleted(activeLesson.id)) {
            handleToggleComplete(activeLesson.id);
        }

        // Start 5s countdown to next lesson
        if (activeIndex < allLessons.length - 1) {
            setAutoAdvanceTimer(5);
        }
    };

    // Current video URL
    const activeVideoUrl = useMemo(() => {
        if (!activeLesson) return null;
        let url = activeLesson.video_url;
        if (!url && activeLesson.videos && activeLesson.videos.length > 0) {
            url = activeLesson.videos[0].video_url;
        }
        if (url && url.includes('ik.imagekit.io') && !url.includes('tr=')) {
            url = url.includes('?') ? `${url}&tr=orig` : `${url}?tr=orig`;
        }
        return url;
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

    // Active tab (notes | overview | live | exam)
    const [activeTab, setActiveTab] = useState(() => {
        if (urlTab && ['notes', 'overview', 'live', 'exam'].includes(urlTab)) {
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
                const nextLesson = allLessons[activeIndex + 1];
                if (nextLesson && (isLessonUnlocked(nextLesson.id) || isLessonCompleted(activeLesson?.id))) {
                    setActiveLessonId(nextLesson.id);
                }
            }
            setAutoAdvanceTimer(null);
        }
    }, [autoAdvanceTimer, activeIndex, allLessons, isLessonUnlocked, isLessonCompleted, activeLesson]);

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
            const nextLesson = allLessons[activeIndex + 1];
            if (nextLesson && isLessonUnlocked(nextLesson.id)) {
                setActiveLessonId(nextLesson.id);
            }
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
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
                                <Link href={route('student.courses.enrolled')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                    My Enrolled Courses
                                </Link>
                                <span>/</span>
                                <span className="truncate max-w-xs sm:max-w-md text-slate-700 dark:text-slate-300 font-medium">
                                    {course.title}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                                    {course.title}
                                </h1>
                                {enrollment?.batch && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono">
                                        <Clock className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                        Batch: {enrollment.batch.time_slot} ({enrollment.batch.batch_name})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Course progress bar */}
                    {allLessons.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Progress:</span>
                                <div className="w-36 sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            progressPct === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                                        }`}
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <span className="text-xs font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                                    {progressPct}%
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className={`h-3.5 w-3.5 ${progressPct === 100 ? 'text-emerald-500' : 'text-indigo-500'}`} />
                                <span>
                                    <strong className="text-slate-800 dark:text-slate-200">{completedCount}</strong> of <strong className="text-slate-800 dark:text-slate-200">{allLessons.length}</strong> lessons completed
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

                            {/* Certificate graduation banner if 100% completed */}
                            {progressPct === 100 && (
                                <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                {certificate ? 'Certificate of Completion Ready!' : 'Course Complete (100%)!'}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {certificate
                                                    ? 'Congratulations! You have passed all requirements and earned your verified certificate of completion.'
                                                    : 'Ensure all exams and assignments are passed to claim your verified certificate.'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={certificate ? route('student.certificates.show', certificate.id) : route('student.certificates.index')}
                                        className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition"
                                    >
                                        <Award className="w-3.5 h-3.5" />
                                        {certificate ? 'View Certificate' : 'Certificates Hub'}
                                    </Link>
                                </div>
                            )}

                            {/* Video player */}
                            <div className="bg-black rounded-lg overflow-hidden shadow-2xs border border-slate-800">
                                {!isLessonUnlocked(activeLesson?.id) ? (
                                    /* Locked Lecture Screen */
                                    <div className="py-16 px-6 text-center space-y-4 bg-slate-900 rounded-lg border border-slate-800 text-white shadow-2xs">
                                        <div className="h-14 w-14 mx-auto rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-xs">
                                            <Lock className="h-7 w-7" />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-1.5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <Lock className="h-3 w-3" /> Lecture Locked
                                            </span>
                                            <h3 className="text-base font-bold text-white">
                                                {activeLesson?.title || 'This Lecture is Locked'}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {activeLessonPrev
                                                    ? `Please watch and complete "${activeLessonPrev.title}" first to unlock this lecture.`
                                                    : 'You must complete the previous lecture before this lecture can be played.'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveLessonId(resolveDefaultLessonId())}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-2xs transition"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" />
                                            <span>Go to Current Lecture</span>
                                        </button>
                                    </div>
                                ) : activeVideoUrl ? (
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
                                    <div className="py-14 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs">
                                        <div className="h-14 w-14 mx-auto rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                                            <BookOpen className="h-7 w-7" />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Reading & Study Notes Lecture
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                This lecture is structured around reading materials and downloadable study notes. Review the summary and study guides below.
                                            </p>
                                        </div>
                                        {activeResources.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('notes')}
                                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-2xs transition"
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
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 p-4 rounded-md shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-2xs">
                                            {autoAdvanceTimer}s
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                <span>Lecture Completed! Next lecture will begin shortly.</span>
                                            </div>
                                            {allLessons[activeIndex + 1] && (
                                                <p className="text-xs text-emerald-700 dark:text-emerald-400 truncate font-medium mt-0.5">
                                                    Up next: <span className="font-semibold text-emerald-900 dark:text-emerald-200">{allLessons[activeIndex + 1].title}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => setAutoAdvanceTimer(null)}
                                            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-md transition"
                                        >
                                            Stay Here
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleNext();
                                                setAutoAdvanceTimer(null);
                                            }}
                                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-2xs transition inline-flex items-center gap-1"
                                        >
                                            <span>Play Next</span>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Lesson title & controls */}
                            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                                                {activeLesson?.moduleTitle || 'General Module'}
                                            </span>
                                            {activeLesson?.duration && (
                                                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{activeLesson.duration}</span>
                                                </span>
                                            )}
                                            {!isLessonUnlocked(activeLesson?.id) && (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 font-mono">
                                                    <Lock className="h-3 w-3" /> Locked
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                            {activeLesson ? activeLesson.title : 'Select a Lecture'}
                                        </h2>
                                    </div>

                                    {/* Navigation & complete buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                                        {activeLesson && (
                                            <button
                                                type="button"
                                                disabled={isToggling || !isLessonUnlocked(activeLesson.id)}
                                                onClick={(e) => handleToggleComplete(activeLesson.id, e)}
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md shadow-2xs transition ${
                                                    !isLessonUnlocked(activeLesson.id)
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75'
                                                        : isLessonCompleted(activeLesson.id)
                                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                        : 'bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                                                }`}
                                                title={
                                                    !isLessonUnlocked(activeLesson.id)
                                                        ? 'Complete previous lecture to unlock'
                                                        : isLessonCompleted(activeLesson.id)
                                                        ? 'Click to mark lesson as incomplete'
                                                        : 'Click to mark lesson as completed'
                                                }
                                            >
                                                {!isLessonUnlocked(activeLesson.id) ? (
                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                )}
                                                <span>
                                                    {!isLessonUnlocked(activeLesson.id)
                                                        ? 'Locked'
                                                        : isLessonCompleted(activeLesson.id)
                                                        ? 'Completed'
                                                        : 'Mark Complete'}
                                                </span>
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            disabled={activeIndex <= 0}
                                            onClick={handlePrev}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span>Previous</span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                activeIndex >= allLessons.length - 1 ||
                                                !isLessonUnlocked(allLessons[activeIndex + 1]?.id)
                                            }
                                            onClick={handleNext}
                                            title={
                                                activeIndex < allLessons.length - 1 &&
                                                !isLessonUnlocked(allLessons[activeIndex + 1]?.id)
                                                    ? 'Complete this lecture to unlock next lecture'
                                                    : 'Next Lecture'
                                            }
                                            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            <span>Next Lecture</span>
                                            {activeIndex < allLessons.length - 1 &&
                                            !isLessonUnlocked(allLessons[activeIndex + 1]?.id) ? (
                                                <Lock className="h-3.5 w-3.5 ml-0.5" />
                                            ) : (
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs navigation */}
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('notes')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition inline-flex items-center gap-1.5 ${
                                            activeTab === 'notes'
                                                ? 'bg-indigo-600 text-white shadow-2xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Study Notes & Resources ({activeResources.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('overview')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition inline-flex items-center gap-1.5 ${
                                            activeTab === 'overview'
                                                ? 'bg-indigo-600 text-white shadow-2xs'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span>Lecture Notes & Description</span>
                                    </button>

                                    {course.live_classes && course.live_classes.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('live')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition inline-flex items-center gap-1.5 ${
                                                activeTab === 'live'
                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <Radio className="h-3.5 w-3.5" />
                                            <span>Live Sessions ({course.live_classes.length})</span>
                                        </button>
                                    )}

                                    {courseExams.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('exam')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition inline-flex items-center gap-1.5 ${
                                                activeTab === 'exam'
                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <GraduationCap className="h-3.5 w-3.5" />
                                            <span>
                                                Exams ({courseExams.length})
                                                {!progress?.is_completed && !isAdminOrInstructor && (
                                                    <Lock className="h-2.5 w-2.5 inline ml-1 text-amber-500" />
                                                )}
                                            </span>
                                        </button>
                                    )}

                                    {assignments && assignments.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('assignments')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition inline-flex items-center gap-1.5 ${
                                                activeTab === 'assignments'
                                                    ? 'bg-indigo-600 text-white shadow-2xs'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <ClipboardList className="h-3.5 w-3.5" />
                                            <span>Assignments ({assignments.length})</span>
                                        </button>
                                    )}
                                </div>

                                {/* Notes tab */}
                                {activeTab === 'notes' && (
                                    <div className="space-y-4 pt-1">
                                        {!isLessonUnlocked(activeLesson?.id) ? (
                                            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-md flex items-center justify-center gap-2">
                                                <Lock className="h-4 w-4 text-slate-400" />
                                                <span>Complete the previous lecture to unlock study notes and attachments.</span>
                                            </div>
                                        ) : activeResources.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {activeResources.map((res) => (
                                                    <div
                                                        key={res.id}
                                                        className="p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs transition flex items-center justify-between gap-3"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                                                                {getResourceIcon(res.resource_type)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                                    {res.title}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                                                    <span className="uppercase font-semibold text-slate-600 dark:text-slate-300">
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
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition shrink-0"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            <span>Download</span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-md">
                                                No downloadable PDF or source files attached for this lecture.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Overview tab */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-3 pt-1">
                                        {!isLessonUnlocked(activeLesson?.id) ? (
                                            <p className="text-xs text-slate-400 italic">
                                                Overview is locked. Complete the previous lecture to view description.
                                            </p>
                                        ) : activeLesson?.description ? (
                                            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/70 dark:bg-slate-800/60 p-4 rounded-md border border-slate-100 dark:border-slate-800">
                                                {activeLesson.description}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">
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
                                                className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                            {cls.status}
                                                        </span>
                                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                            {cls.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {new Date(cls.start_time).toLocaleString()}
                                                    </p>
                                                </div>

                                                {cls.meeting_link && (
                                                    <a
                                                        href={cls.meeting_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-2xs transition self-start sm:self-auto shrink-0"
                                                    >
                                                        <span>Join Live Class</span>
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Exam tab */}
                                {activeTab === 'exam' && courseExams.length > 0 && (
                                    <div className="pt-2 space-y-4">
                                        {!progress?.is_completed && !isAdminOrInstructor && (
                                            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 rounded-md flex flex-col sm:flex-row items-center gap-3.5">
                                                <div className="h-10 w-10 rounded-md bg-amber-100 dark:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-mono">
                                                            Exams Locked
                                                        </span>
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                            {completedCount} of {allLessons.length} lectures completed ({progressPct}% progress)
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        Complete 100% of all lectures in this course to unlock your examinations.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {courseExams.map((examItem) => {
                                                const sub = examItem.submission;
                                                const isLocked = !progress?.is_completed && !isAdminOrInstructor;

                                                return (
                                                    <div
                                                        key={examItem.id}
                                                        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs space-y-4 transition hover:border-slate-300 dark:hover:border-slate-700"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <div className="flex items-start sm:items-center gap-3.5">
                                                                <div className={`p-3 rounded-md shrink-0 ${
                                                                    sub?.is_passed
                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                                        : isLocked
                                                                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                                                        : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                                                                }`}>
                                                                    {sub?.is_passed ? (
                                                                        <CheckCircle2 className="h-5 w-5" />
                                                                    ) : isLocked ? (
                                                                        <Lock className="h-5 w-5" />
                                                                    ) : (
                                                                        <GraduationCap className="h-5 w-5" />
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                                            {examItem.title}
                                                                        </h3>
                                                                        {sub ? (
                                                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                                                                                sub.is_passed
                                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                                            }`}>
                                                                                {sub.is_passed ? 'Passed' : 'Failed'}
                                                                            </span>
                                                                        ) : isLocked ? (
                                                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                                                Locked
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                                                Ready to Attempt
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {examItem.description && (
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                            {examItem.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                                                                {sub ? (
                                                                    <>
                                                                        <div className="text-right">
                                                                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Your Score</p>
                                                                            <p className="text-base font-black font-mono text-slate-900 dark:text-white">{sub.percentage}%</p>
                                                                            <p className="text-[10px] text-slate-400 font-mono">{sub.score} / {sub.total_marks} marks</p>
                                                                        </div>
                                                                        <Link
                                                                            href={route('student.exams.show', examItem.id)}
                                                                            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md transition inline-flex items-center gap-1.5"
                                                                        >
                                                                            <span>Review Answers</span>
                                                                            <ChevronRight className="h-3.5 w-3.5" />
                                                                        </Link>
                                                                    </>
                                                                ) : isLocked ? (
                                                                    <button
                                                                        type="button"
                                                                        disabled
                                                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 cursor-not-allowed"
                                                                    >
                                                                        <Lock className="h-3.5 w-3.5" />
                                                                        <span>Locked</span>
                                                                    </button>
                                                                ) : (
                                                                    <Link
                                                                        href={route('student.exams.show', examItem.id)}
                                                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md shadow-2xs transition"
                                                                    >
                                                                        <Play className="h-3.5 w-3.5 fill-current" />
                                                                        <span>Start Exam</span>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                                            <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Questions</p>
                                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                                                                    {examItem.questions_count || (examItem.questions ? examItem.questions.length : 0)}
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Duration</p>
                                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                                                                    {examItem.duration_minutes > 0 ? `${examItem.duration_minutes} Mins` : 'Untimed'}
                                                                </p>
                                                            </div>
                                                            <div className="bg-slate-50/70 dark:bg-slate-800/60 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Passing Score</p>
                                                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{examItem.passing_percentage}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Assignments tab */}
                                {activeTab === 'assignments' && (
                                    <div className="pt-2 space-y-3">
                                        {assignments.map((asgn) => (
                                            <div
                                                key={asgn.id}
                                                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                            {asgn.title}
                                                        </h4>
                                                        {asgn.submission ? (
                                                            asgn.submission.status === 'reviewed' ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                    Score: {asgn.submission.marks_obtained}/{asgn.total_marks}M
                                                                </span>
                                                            ) : asgn.submission.status === 'resubmit' ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                                                    <AlertCircle className="h-3 w-3" /> Revision Needed
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                                                    <Clock className="h-3 w-3" /> Under Review
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                                Pending Submission
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {asgn.description}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                                        {asgn.total_marks} Marks • {asgn.due_date ? `Due ${new Date(asgn.due_date).toLocaleDateString()}` : 'No deadline'}
                                                        {asgn.creator && ` • Assigned by ${asgn.creator.name}`}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={route('student.assignments.show', asgn.id)}
                                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition shrink-0"
                                                >
                                                    <span>{asgn.submission?.status === 'reviewed' ? 'View Feedback' : 'Open & Submit'}</span>
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar: course playlist */}
                        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
                            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">

                                {/* Playlist header */}
                                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <FolderCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                <span>Course Curriculum</span>
                                            </h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                                {allLessons.length} {allLessons.length === 1 ? 'Lecture' : 'Lectures'} · {modules.length} Modules
                                            </p>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                            {progressPct}% Done
                                        </span>
                                    </div>

                                    {/* Sidebar progress bar */}
                                    {allLessons.length > 0 && (
                                        <div className="space-y-1 pt-1">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        progressPct === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                                                    }`}
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                                <span>{completedCount}/{allLessons.length} Completed</span>
                                                <span>{progressPct}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modules list */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[calc(100vh-280px)] overflow-y-auto">
                                    {modules.map((mod, mIdx) => {
                                        const isOpen = !!openModules[mod.id];
                                        const modLessons = mod.lessons || [];

                                        return (
                                            <div key={mod.id} className="bg-white dark:bg-slate-900">
                                                {/* Module header */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModule(mod.id)}
                                                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between text-left"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                        <span className="h-5 w-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">
                                                            {mIdx + 1}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                            {mod.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                                                            {modLessons.length}
                                                        </span>
                                                        <ChevronDown
                                                            className={`h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform ${
                                                                isOpen ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Lessons list */}
                                                {isOpen && (
                                                    <div className="divide-y divide-slate-50 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                                                        {modLessons.map((lesson, lIdx) => {
                                                            const isUnlocked = isLessonUnlocked(lesson.id);
                                                            const isActive = lesson.id === activeLesson?.id;
                                                            const isCompleted = isLessonCompleted(lesson.id);

                                                            return (
                                                                <div
                                                                    key={lesson.id}
                                                                    className={`w-full px-4 py-3 text-left transition flex items-start justify-between gap-3 group ${
                                                                        !isUnlocked
                                                                            ? 'bg-slate-50/50 dark:bg-slate-900/40 opacity-60 cursor-not-allowed select-none'
                                                                            : isActive
                                                                            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-l-4 border-indigo-600 font-semibold'
                                                                            : isCompleted
                                                                            ? 'bg-emerald-50/20 dark:bg-emerald-950/20 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300'
                                                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        disabled={!isUnlocked}
                                                                        onClick={() => isUnlocked && setActiveLessonId(lesson.id)}
                                                                        className={`flex items-start gap-2.5 min-w-0 flex-1 text-left ${
                                                                            !isUnlocked ? 'cursor-not-allowed' : ''
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className={`mt-0.5 p-1 rounded-md shrink-0 ${
                                                                                !isUnlocked
                                                                                    ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-400'
                                                                                    : isActive
                                                                                    ? 'bg-indigo-600 text-white'
                                                                                    : isCompleted
                                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                                                                    : 'text-slate-400 dark:text-slate-500'
                                                                            }`}
                                                                        >
                                                                            {!isUnlocked ? (
                                                                                <Lock className="h-3 w-3" />
                                                                            ) : isCompleted ? (
                                                                                <Check className="h-3 w-3" />
                                                                            ) : (
                                                                                <Play className="h-3 w-3 fill-current" />
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0 space-y-0.5">
                                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                                <span
                                                                                    className={`text-xs line-clamp-2 leading-snug ${
                                                                                        !isUnlocked
                                                                                            ? 'text-slate-400 font-medium'
                                                                                            : isActive
                                                                                            ? 'font-bold text-indigo-950 dark:text-indigo-200'
                                                                                            : isCompleted
                                                                                            ? 'font-medium text-slate-800 dark:text-slate-200'
                                                                                            : 'font-medium text-slate-700 dark:text-slate-300'
                                                                                    }`}
                                                                                >
                                                                                    {lesson.title}
                                                                                </span>
                                                                                {!isUnlocked && (
                                                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[9px] font-semibold font-mono bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                                                                                        <Lock className="h-2 w-2" /> Locked
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {lesson.duration && (
                                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
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
                                                                            title={
                                                                                !isUnlocked
                                                                                    ? 'Complete previous lecture to unlock'
                                                                                    : isCompleted
                                                                                    ? 'Mark as incomplete'
                                                                                    : 'Mark as completed'
                                                                            }
                                                                            disabled={isToggling || !isUnlocked}
                                                                            onClick={(e) => isUnlocked && handleToggleComplete(lesson.id, e)}
                                                                            className={`p-1 rounded-md transition ${
                                                                                !isUnlocked
                                                                                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                                                                                    : isCompleted
                                                                                    ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                                                                                    : 'text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                                            }`}
                                                                        >
                                                                            <CheckCircle2
                                                                                className={`h-4 w-4 ${
                                                                                    !isUnlocked
                                                                                        ? 'text-slate-300 dark:text-slate-600'
                                                                                        : isCompleted
                                                                                        ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950/40'
                                                                                        : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'
                                                                                }`}
                                                                            />
                                                                        </button>

                                                                        {lesson.resources && lesson.resources.length > 0 && (
                                                                            <span
                                                                                title={
                                                                                    !isUnlocked
                                                                                        ? 'Locked study materials'
                                                                                        : `${lesson.resources.length} study material(s) attached`
                                                                                }
                                                                                className={`p-1 rounded-md shrink-0 ${
                                                                                    !isUnlocked
                                                                                        ? 'text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
                                                                                        : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                                                                                }`}
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
                                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3 shadow-2xs">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                                        {course.instructor.user?.name ? course.instructor.user.name.charAt(0).toUpperCase() : 'M'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                                            Mentor & Instructor
                                        </p>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                            {course.instructor.user?.name || 'Academy Mentor'}
                                        </h4>
                                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate">
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
