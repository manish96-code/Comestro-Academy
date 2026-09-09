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

    const [enrolling, setEnrolling] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openModules, setOpenModules] = useState({ 0: true, 1: true });

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

    // Structured curriculum modules
    const curriculumModules = [
        {
            title: 'Module 1: Architecture Overview & Environment Setup',
            duration: '4 lectures · 1h 45m',
            lessons: [
                { title: 'Course Orientation & Architecture Roadmap', duration: '15m', isPreview: true },
                { title: 'Local Development Tooling & Configuration', duration: '25m', isPreview: true },
                { title: 'Understanding Production MVC & Clean Code Standards', duration: '35m', isPreview: false },
                { title: 'Repository Pattern & Service Architecture Foundation', duration: '30m', isPreview: false },
            ],
        },
        {
            title: 'Module 2: Advanced Eloquent ORM & Relational Modeling',
            duration: '6 lectures · 3h 15m',
            lessons: [
                { title: 'Complex Database Schemas, Indexing & Foreign Keys', duration: '40m', isPreview: true },
                { title: 'Polymorphic & Many-to-Many Relationships', duration: '35m', isPreview: false },
                { title: 'Eliminating N+1 Queries & Database Profiling', duration: '30m', isPreview: false },
                { title: 'Eloquent API Resources & Data Transformations', duration: '25m', isPreview: false },
                { title: 'Query Scopes, Custom Casts & Attribute Mutators', duration: '35m', isPreview: false },
                { title: 'Database Transactions & Concurrency Safety', duration: '30m', isPreview: false },
            ],
        },
        {
            title: 'Module 3: Modern Frontends with Inertia.js & React 19',
            duration: '6 lectures · 3h 45m',
            lessons: [
                { title: 'Inertia v2 Architecture: Zero-API SPA Flow', duration: '35m', isPreview: true },
                { title: 'Page Components, Persistent Layouts & Shared Props', duration: '40m', isPreview: false },
                { title: 'Deferred Props, Infinite Scrolling & Optimistic UI', duration: '45m', isPreview: false },
                { title: 'Form Handling, Validation Errors & Flash Feedback', duration: '35m', isPreview: false },
                { title: 'Tailwind CSS Modern Design Systems & Dark Mode', duration: '35m', isPreview: false },
                { title: 'Real-Time State Synchronization', duration: '35m', isPreview: false },
            ],
        },
        {
            title: 'Module 4: Security, Authentication & Role Authorization',
            duration: '5 lectures · 2h 50m',
            lessons: [
                { title: 'Multi-Role User Authentication & Session Security', duration: '35m', isPreview: false },
                { title: 'Role-Based Access Control (RBAC) & Custom Middleware', duration: '40m', isPreview: false },
                { title: 'Policies, Gates & Granular Resource Permissions', duration: '30m', isPreview: false },
                { title: 'CSRF Protection, Rate Limiting & Input Sanitization', duration: '35m', isPreview: false },
                { title: 'Password Resets & Two-Factor Authentication Strategy', duration: '30m', isPreview: false },
            ],
        },
        {
            title: 'Module 5: Real-World Capstone SaaS Project',
            duration: '7 lectures · 5h 20m',
            lessons: [
                { title: 'SaaS Product Architecture & Wireframe Planning', duration: '45m', isPreview: false },
                { title: 'Building Multi-Tenant Course & Subscription Engines', duration: '50m', isPreview: false },
                { title: 'Payment Gateway Integration & Webhook Handling', duration: '55m', isPreview: false },
                { title: 'Background Jobs, Queues & Asynchronous Notifications', duration: '40m', isPreview: false },
                { title: 'File Storage, Image Optimization & Cloud CDN Integration', duration: '40m', isPreview: false },
                { title: 'Analytics Dashboard, Exporting Reports & Activity Logs', duration: '50m', isPreview: false },
            ],
        },
        {
            title: 'Module 6: Automated Testing & Production Deployment',
            duration: '4 lectures · 2h 15m',
            lessons: [
                { title: 'Unit & Feature Testing using Pest PHP', duration: '40m', isPreview: false },
                { title: 'HTTP Endpoint Testing & Authentication Boundaries', duration: '35m', isPreview: false },
                { title: 'Dockerizing the Stack & CI/CD GitHub Actions', duration: '40m', isPreview: false },
                { title: 'Zero-Downtime Production Deployment & Monitoring', duration: '20m', isPreview: false },
            ],
        },
    ];

    // What you'll learn highlights
    const learningPoints = [
        'Build production-grade applications following industry best practices and clean architecture.',
        'Master complex database design, relational modeling, indexing, and high-performance queries.',
        'Create lightning-fast reactive Single Page Applications with Inertia.js v2 and React 19.',
        'Implement robust authentication, multi-role authorization (RBAC), and security boundaries.',
        'Architect scalable RESTful APIs with pagination, rate limiting, and filtering.',
        'Write comprehensive automated feature and unit tests with Pest PHP to ensure code confidence.',
        'Integrate payment gateways, asynchronous background jobs, queues, and cloud file storage.',
        'Deploy scalable cloud systems with Docker, GitHub Actions CI/CD pipelines, and health monitoring.',
    ];

    // Course detail core body
    const mainDetailContent = (
        <div className="space-y-8">
            {/* 1. What You Will Learn Card */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            What You'll Learn in This Course
                        </h2>
                        <p className="text-xs text-gray-500">
                            Industry-demanded competencies built through hands-on implementation
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                                {point}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Course Curriculum Accordion */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            Comprehensive Course Curriculum
                        </h2>
                        <p className="text-xs text-gray-500">
                            {curriculumModules.length} Modules · 32 Lectures · Full Lifetime Access
                        </p>
                    </div>

                    <button
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
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition self-start sm:self-auto"
                    >
                        {Object.keys(openModules).length === curriculumModules.length
                            ? 'Collapse All Modules'
                            : 'Expand All Modules'}
                    </button>
                </div>

                <div className="space-y-3">
                    {curriculumModules.map((module, mIdx) => {
                        const isOpen = !!openModules[mIdx];
                        return (
                            <div
                                key={mIdx}
                                className="border border-gray-200 rounded-xl overflow-hidden transition"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleModule(mIdx)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-gray-100/70 transition text-left"
                                >
                                    <div className="flex items-center gap-3 pr-2">
                                        {isOpen ? (
                                            <ChevronDown className="h-4 w-4 text-indigo-600 shrink-0" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                                        )}
                                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                                            {module.title}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-500 shrink-0">
                                        {module.duration}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {module.lessons.map((lesson, lIdx) => (
                                            <div
                                                key={lIdx}
                                                className="px-4 py-3 flex items-center justify-between text-xs hover:bg-slate-50/60 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Play className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                    <span className="text-gray-700 font-medium">
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {lesson.isPreview && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 uppercase">
                                                            Preview
                                                        </span>
                                                    )}
                                                    <span className="text-gray-400 text-[11px]">
                                                        {lesson.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Description & Detailed Overview */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Course Description
                </h2>
                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 font-normal">
                    {course.description ? (
                        <p>{course.description}</p>
                    ) : (
                        <p>
                            This masterclass takes you from fundamental principles straight into building production-ready architectures. You will learn the exact patterns, tools, and practices used by high-output software engineering teams.
                        </p>
                    )}
                    <p>
                        Rather than building trivial demo applications, this curriculum focuses on real-world edge cases: data consistency, high-throughput caching, authentication boundaries, automated testing with Pest, and modern declarative frontend integration using Inertia and React.
                    </p>
                </div>
            </div>

            {/* 4. Requirements & Prerequisites */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Prerequisites & Requirements
                </h2>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span>Basic understanding of programming fundamentals and object-oriented principles.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span>A computer (Windows, macOS, or Linux) with internet connection and a code editor installed.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span>No prior knowledge of advanced frameworks required — we guide you through each stage.</span>
                    </li>
                </ul>
            </div>

            {/* 5. Instructor Spotlight */}
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

            {/* 6. Related Courses */}
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

                    {/* "Course Includes" Feature List */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            This Course Includes:
                        </h4>
                        <div className="space-y-2.5 text-xs text-gray-600">
                            <div className="flex items-center gap-2.5">
                                <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>{course.duration || 'Self-paced'} of intensive training</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Code className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>Real-world capstone project codebases</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Layers className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>Downloadable starter kits & slide decks</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <User className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>Direct mentor Q&A and code reviews</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Award className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>Official Certificate of Completion</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Globe className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>Full lifetime access on mobile & web</span>
                            </div>
                        </div>
                    </div>

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
                    {course.description && (
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                            {course.description}
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
