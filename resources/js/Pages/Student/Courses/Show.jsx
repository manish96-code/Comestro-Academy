import ApplicationLogo from '@/Components/ApplicationLogo';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    Clock,
    BookOpen,
    User,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Star,
    Share2,
    ShieldCheck,
    Award,
    Video,
    FileText,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Play,
    ExternalLink,
    GraduationCap,
    Compass,
    Layers,
    Zap,
    LayoutDashboard,
    Menu,
    X,
    Check,
    Code,
    Terminal,
    Globe,
    Calendar
} from 'lucide-react';

export default function CourseShow({ course, relatedCourses = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;

    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (tabParam === 'curriculum' || tabParam === 'about') {
                return tabParam;
            }
            if (window.location.hash === '#curriculum') return 'curriculum';
            if (window.location.hash === '#about') return 'about';
        }
        return 'about';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [enrolling, setEnrolling] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openModules, setOpenModules] = useState({ 0: true, 1: true });

    const changeTab = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            window.history.replaceState({}, '', url.toString());
        }
    };

    useEffect(() => {
        const onPopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (tabParam === 'curriculum' || tabParam === 'about') {
                setActiveTab(tabParam);
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const toggleModule = (index) => {
        setOpenModules((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleEnroll = () => {
        if (!user) {
            toast.error('Please log in or create an account to enroll in this course.');
            router.visit(route('login'));
            return;
        }

        setEnrolling(true);
        router.post(
            route('courses.enroll', course.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setEnrolling(false),
            }
        );
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Course link copied to clipboard!');
        } else {
            toast.success('Course link: ' + window.location.href);
        }
    };

    const instructor = course.instructor;
    const instructorUser = instructor?.user;
    const isEnrolled = course.is_enrolled;

    // Computed discount percentage
    const discountPercent =
        course.price && course.discount_price && Number(course.price) > Number(course.discount_price)
            ? Math.round(((Number(course.price) - Number(course.discount_price)) / Number(course.price)) * 100)
            : null;

    const curriculumModules = Array.isArray(course.curriculum) ? course.curriculum : [];

    // Automatically format module title with sequential module numbering
    const getModuleTitle = (title, index) => {
        if (!title) return `Module ${index + 1}`;
        const cleanTitle = title.replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim();
        return `Module ${index + 1}: ${cleanTitle || title}`;
    };

    // Helper to parse subtitle into individual topics
    const parseTopics = (subtitle) => {
        if (!subtitle || typeof subtitle !== 'string') {
            return [];
        }
        if (subtitle.includes('\n')) {
            return subtitle.split('\n').map((s) => s.trim()).filter(Boolean);
        }
        if (subtitle.includes(',')) {
            return subtitle.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [subtitle.trim()];
    };

    // Helper to map dynamic feature text to appropriate visual icon
    const getFeatureIcon = (text) => {
        const lower = (text || '').toLowerCase();
        if (lower.includes('week') || lower.includes('hour') || lower.includes('month') || lower.includes('time') || lower.includes('duration') || lower.includes('pace')) {
            return <Clock className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        if (lower.includes('project') || lower.includes('code') || lower.includes('build') || lower.includes('repo')) {
            return <Code className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        if (lower.includes('starter') || lower.includes('download') || lower.includes('kit') || lower.includes('slide') || lower.includes('asset') || lower.includes('resource') || lower.includes('token') || lower.includes('template')) {
            return <Layers className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        if (lower.includes('mentor') || lower.includes('q&a') || lower.includes('review') || lower.includes('instructor') || lower.includes('community') || lower.includes('support') || lower.includes('critique')) {
            return <User className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        if (lower.includes('certificate') || lower.includes('completion') || lower.includes('diploma') || lower.includes('badge')) {
            return <Award className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        if (lower.includes('lifetime') || lower.includes('mobile') || lower.includes('web') || lower.includes('access') || lower.includes('device')) {
            return <Globe className="h-4 w-4 text-indigo-600 shrink-0" />;
        }
        return <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />;
    };

    const courseIncludesList = Array.isArray(course.course_includes) && course.course_includes.length > 0
        ? course.course_includes.filter(Boolean)
        : [];

    // Course detail core body
    const mainDetailContent = (
        <div className="space-y-8">
            {/* Tab Navigation: About vs Curriculum (Matches LearnSyntax UI) */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={() => changeTab('about')}
                        className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative ${
                            activeTab === 'about'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        About
                    </button>
                    <button
                        type="button"
                        onClick={() => changeTab('curriculum')}
                        className={`pb-3.5 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 ${
                            activeTab === 'curriculum'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <span>Curriculum</span>
                        {curriculumModules.length > 0 && (
                            <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    activeTab === 'curriculum'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {curriculumModules.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB 1: ABOUT CONTENT (Matches LearnSyntax Screenshot 1) */}
            {activeTab === 'about' && (
                <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-5">
                    <div className="border-l-4 border-indigo-600 pl-3">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            About This Course
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Comprehensive overview, roadmap, and learning objectives
                        </p>
                    </div>

                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4 font-normal">
                        {course.description ? (
                            course.description.split('\n\n').map((paragraph, pIdx) => (
                                <p key={pIdx}>{paragraph}</p>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">
                                No course description provided yet.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: CURRICULUM CONTENT (Matches LearnSyntax Screenshot 2) */}
            {activeTab === 'curriculum' && (
                <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                    {/* Curriculum Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
                        <div className="border-l-4 border-indigo-600 pl-3">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                Course Curriculum
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                A structured step-by-step roadmap to mastery.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                {curriculumModules.length} Modules
                            </span>

                            <button
                                type="button"
                                onClick={() => {
                                    const allOpen = Object.keys(openModules).length === curriculumModules.length;
                                    if (allOpen) {
                                        setOpenModules({});
                                    } else {
                                        const newObj = {};
                                        curriculumModules.forEach((_, i) => (newObj[i] = true));
                                        setOpenModules(newObj);
                                    }
                                }}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                            >
                                {Object.keys(openModules).length === curriculumModules.length
                                    ? 'Collapse All'
                                    : 'Expand All'}
                            </button>
                        </div>
                    </div>

                    {/* Modules List */}
                    {curriculumModules.length > 0 ? (
                        <div className="space-y-4">
                            {curriculumModules.map((module, mIdx) => {
                                const isOpen = !!openModules[mIdx];
                                const topics = parseTopics(module.subtitle);

                                return (
                                    <div
                                        key={mIdx}
                                        className="border border-gray-200 rounded-xl overflow-hidden transition-all shadow-2xs hover:border-indigo-200"
                                    >
                                        {/* Module Header Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => toggleModule(mIdx)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50/70 hover:bg-gray-100/70 transition text-left"
                                        >
                                            <div className="flex items-center gap-3 pr-2">
                                                <div className="text-indigo-600 shrink-0">
                                                    {isOpen ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <span className="text-xs sm:text-sm font-bold text-gray-900">
                                                    {getModuleTitle(module.title, mIdx)}
                                                </span>
                                            </div>

                                            <span className="text-[11px] font-medium text-gray-500 shrink-0 ml-2">
                                                {topics.length > 0 ? `${topics.length} ${topics.length === 1 ? 'Topic' : 'Topics'}` : 'Overview'}
                                            </span>
                                        </button>

                                        {/* Expanded Topics List (View Only) */}
                                        {isOpen && (
                                            <div className="bg-white divide-y divide-gray-100">
                                                {topics.length > 0 ? (
                                                    topics.map((topic, tIdx) => (
                                                        <div
                                                            key={tIdx}
                                                            className="px-4 py-3 flex items-center gap-3 text-xs sm:text-sm hover:bg-slate-50/70 transition"
                                                        >
                                                            <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                                                            <span className="text-gray-700 font-medium">
                                                                {topic}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-xs text-gray-500 italic">
                                                        Interactive sessions, theory, and practical tasks included in this module.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-xs sm:text-sm border border-dashed border-gray-200 rounded-xl">
                            No curriculum modules have been added for this course yet.
                        </div>
                    )}
                </div>
            )}

            {/* Instructor Spotlight */}
            {instructor && (
                <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div>
                            <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">
                                Course Instructor
                            </span>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                Meet Your Mentor
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                            {instructorUser?.name ? instructorUser.name.charAt(0).toUpperCase() : 'M'}
                        </div>

                        <div className="space-y-3 flex-1">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    {instructorUser?.name || 'Academy Mentor'}
                                </h3>
                                <p className="text-xs text-indigo-600 font-semibold">
                                    {instructor.designation || 'Senior Software Engineer & Academy Mentor'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                {instructor.qualification && (
                                    <div className="flex items-center gap-1.5">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        <span>{instructor.qualification}</span>
                                    </div>
                                )}
                                {instructor.experience_years > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <Award className="h-4 w-4 text-gray-400" />
                                        <span>{instructor.experience_years}+ Years Industry Experience</span>
                                    </div>
                                )}
                            </div>

                            {instructor.expertise && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {instructor.expertise.split(',').map((skill, sIdx) => (
                                        <span
                                            key={sIdx}
                                            className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {instructor.bio && (
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 font-normal">
                                    {instructor.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Related Courses */}
            {relatedCourses && relatedCourses.length > 0 && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                Related & Recommended Courses
                            </h2>
                            <p className="text-xs text-gray-500">
                                Expand your skillset with complementary technologies
                            </p>
                        </div>
                        <Link
                            href={route('courses.index')}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
                        >
                            <span>View All Courses</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {relatedCourses.map((relCourse) => (
                            <Link
                                key={relCourse.id}
                                href={route('courses.show', relCourse.slug || relCourse.id)}
                                className="bg-white rounded-xl border border-gray-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                            >
                                <div>
                                    <div className="relative h-32 bg-slate-900 flex items-center justify-center overflow-hidden">
                                        {relCourse.thumbnail ? (
                                            <img
                                                src={relCourse.thumbnail}
                                                alt={relCourse.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <GraduationCap className="h-8 w-8 text-indigo-300/40" />
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-600 text-white">
                                                {relCourse.category?.name || 'Tech'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
                                            {relCourse.title}
                                        </h4>
                                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                                            <span>{relCourse.duration || 'Self-paced'}</span>
                                            <span className="font-bold text-gray-900">
                                                {Number(relCourse.price) === 0
                                                    ? 'Free'
                                                    : relCourse.discount_price
                                                    ? `₹${Number(relCourse.discount_price).toLocaleString('en-IN')}`
                                                    : `₹${Number(relCourse.price).toLocaleString('en-IN')}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Right Sticky Sidebar (Pricing Card & Enrollment Actions)
    const stickyEnrollmentCard = (
        <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-lg overflow-hidden">
                {/* Media Preview / Thumbnail */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-tr from-slate-950 via-indigo-950 to-indigo-900 flex items-center justify-center overflow-hidden group">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : null}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition backdrop-blur-xs" />

                    {/* Centered Play / Preview Trigger */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="h-14 w-14 rounded-full bg-white/90 text-indigo-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-200">
                            <Play className="h-6 w-6 fill-current ml-1" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">
                            Preview This Course
                        </span>
                    </div>

                    {discountPercent && (
                        <div className="absolute top-3 right-3 z-20">
                            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-600 text-white shadow-md">
                                {discountPercent}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content & Action CTAs */}
                <div className="p-6 space-y-6">
                    {/* Price Block */}
                    <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Enrollment Fee
                        </div>
                        <div className="flex items-baseline gap-2.5">
                            {Number(course.price) === 0 ? (
                                <span className="text-3xl font-extrabold text-emerald-600">
                                    FREE
                                </span>
                            ) : course.discount_price ? (
                                <>
                                    <span className="text-3xl font-extrabold text-gray-900">
                                        ₹{Number(course.discount_price).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-base text-gray-400 line-through">
                                        ₹{Number(course.price).toLocaleString('en-IN')}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-extrabold text-gray-900">
                                    ₹{Number(course.price).toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>100% Secure Checkout · Instant Full Access</span>
                        </p>
                    </div>

                    {/* Main CTA Button */}
                    <div className="space-y-2.5">
                        {isEnrolled ? (
                            <Link
                                href={route('student.courses.enrolled')}
                                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Enrolled · Go to Course Materials</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled={enrolling}
                                onClick={handleEnroll}
                                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {enrolling ? (
                                    <span>Enrolling...</span>
                                ) : (
                                    <>
                                        <span>Enroll in Course Now</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        )}

                        {user && (user.role === 'admin' || user.role === 'instructor') && (
                            <Link
                                href={route('admin.courses.show', course.id)}
                                className="w-full py-2 px-3 text-center text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition block"
                            >
                                ✏️ Edit Course in Admin Panel
                            </Link>
                        )}
                    </div>

                    {/* Trust Signals */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-center text-xs text-slate-600">
                        <span className="font-semibold text-slate-900">7-Day Money-Back Guarantee</span> · Full refund if you're not satisfied.
                    </div>

                    {/* Dynamic "Course Includes" Feature List */}
                    {courseIncludesList.length > 0 && (
                        <div className="space-y-3 pt-2 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                This Course Includes:
                            </h4>
                            <div className="space-y-2.5 text-xs text-gray-600">
                                {courseIncludesList.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-2.5">
                                        {getFeatureIcon(feature)}
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Button */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Share this course</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Dynamic Hero Banner displaying course title & metadata
    const heroHeaderSection = (
        <div className="relative bg-[#0b1120] text-white overflow-hidden py-10 sm:py-14 border-b border-slate-800">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 overflow-x-auto pb-1 scrollbar-none">
                    <Link href="/" className="hover:text-emerald-400 transition shrink-0">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href={route('courses.index')} className="hover:text-emerald-400 transition shrink-0">
                        Courses
                    </Link>
                    {course.category && (
                        <>
                            <span>/</span>
                            <Link
                                href={`${route('courses.index')}?category_id=${course.category.id}`}
                                className="hover:text-emerald-400 transition shrink-0"
                            >
                                {course.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-slate-200 truncate max-w-xs">{course.title}</span>
                </div>

                <div className="max-w-3xl space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        {course.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {course.category.name}
                            </span>
                        )}
                        {course.is_featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Featured Masterclass</span>
                            </span>
                        )}
                        {isEnrolled && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Enrolled</span>
                            </span>
                        )}
                    </div>

                    {/* Course Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {course.title}
                    </h1>

                    {/* Brief Subtitle / Excerpt */}
                    {(course.subtitle || course.description) && (
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                            {course.subtitle || course.description}
                        </p>
                    )}

                    {/* Social Proof & Metrics Strip */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-amber-400">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <span className="font-bold text-white">4.9</span>
                            <span className="text-slate-400 text-xs">({course.enrollments_count ? course.enrollments_count + 120 : 120} reviews)</span>
                        </div>

                        {/* Enrolled Students */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                            <User className="h-4 w-4 text-emerald-400" />
                            <span>
                                <strong className="text-white font-semibold">
                                    {course.enrollments_count ? course.enrollments_count + 450 : 450}
                                </strong>{' '}
                                students enrolled
                            </span>
                        </div>

                        {/* Mentor Mini Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Instructor:</span>
                            <span className="text-white font-semibold underline decoration-emerald-500/40">
                                {instructorUser?.name || 'Comestro Mentor'}
                            </span>
                        </div>

                        {/* Syllabus Modules */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                            <BookOpen className="h-4 w-4 text-indigo-400" />
                            <span>
                                <strong className="text-white font-semibold">
                                    {curriculumModules.length}
                                </strong>{' '}
                                Syllabus Modules
                            </span>
                        </div>

                        {/* Duration */}
                        {course.duration && (
                            <div className="flex items-center gap-1.5 text-slate-300">
                                <Clock className="h-4 w-4 text-indigo-400" />
                                <span>
                                    <strong className="text-white font-semibold">{course.duration}</strong>
                                </span>
                            </div>
                        )}

                        {/* Language */}
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Globe className="h-4 w-4" />
                            <span>English & Hindi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // If student is logged in, wrap inside StudentLayout for unified portal experience
    if (user && user.role === 'student') {
        return (
            <StudentLayout
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('courses.index')}
                                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                title="Back to Courses Catalog"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-md sm:max-w-xl">
                                    {course.title}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Course Details & Curriculum
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={route('courses.index')}
                                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
                            >
                                All Courses
                            </Link>
                            {isEnrolled && (
                                <Link
                                    href={route('student.courses.enrolled')}
                                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/60 rounded-lg transition"
                                >
                                    My Enrolled Courses
                                </Link>
                            )}
                        </div>
                    </div>
                }
            >
                <Head title={`${course.title} - Comestro Academy`} />

                {/* Dark Hero Banner */}
                {heroHeaderSection}

                {/* Dual Column Layout: Content + Sticky Action Card */}
                <div className="py-8 sm:py-12 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Column: Details, Syllabus, Instructor */}
                            <div className="lg:col-span-8">
                                {mainDetailContent}
                            </div>

                            {/* Right Column: Sticky Pricing & Enrollment Card */}
                            <div className="lg:col-span-4">
                                {stickyEnrollmentCard}
                            </div>
                        </div>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    // Public Layout for Guests, Visitors, and Non-Student users
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
            <Head title={`${course.title} - Comestro Academy`} />
            <Toaster position="top-right" />

            {/* Public Header / Navigation */}
            <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="group flex items-center">
                            <ApplicationLogo />
                        </Link>

                        <nav className="hidden sm:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-xs font-mono font-medium text-slate-600 hover:text-indigo-600 transition"
                            >
                                Home
                            </Link>
                            <Link
                                href={route('courses.index')}
                                className="text-xs font-mono font-semibold text-indigo-600 transition"
                            >
                                All Courses
                            </Link>
                        </nav>
                    </div>

                    {/* Auth CTAs */}
                    <div className="hidden sm:flex items-center gap-3">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                <span>Go to Dashboard →</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-4 py-2 text-xs font-mono font-medium text-slate-700 hover:text-slate-950 transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                                >
                                    <span>Get Started →</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:hidden shadow-lg space-y-3 font-mono text-sm">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-slate-700 hover:text-indigo-600"
                        >
                            // Home
                        </Link>
                        <Link
                            href={route('courses.index')}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-indigo-600 font-semibold"
                        >
                            // All Courses
                        </Link>
                        <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-xs font-mono font-bold text-white shadow-sm"
                                >
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-slate-300 px-4 py-2 text-center text-xs font-mono font-medium text-slate-700"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-xs font-mono font-bold text-white shadow-sm"
                                    >
                                        Get Started →
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Dark Hero Banner */}
            {heroHeaderSection}

            {/* Main Content Area */}
            <main className="flex-1 py-8 sm:py-12 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Details, Syllabus, Instructor */}
                        <div className="lg:col-span-8">
                            {mainDetailContent}
                        </div>

                        {/* Right Column: Sticky Pricing & Enrollment Card */}
                        <div className="lg:col-span-4">
                            {stickyEnrollmentCard}
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
                <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                        © {new Date().getFullYear()} Comestro Academy. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <Link href={route('courses.index')} className="hover:text-indigo-600">All Courses</Link>
                        <Link href={route('login')} className="hover:text-indigo-600">Login</Link>
                        <Link href={route('register')} className="hover:text-indigo-600">Register</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
