import Dropdown from '@/Components/Dropdown';
import NotificationBell from '@/Components/NotificationBell';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    User,
    BookOpen,
    Compass,
    Video,
    LogOut,
    Menu,
    X,
    GraduationCap,
    ChevronDown,
    Award,
    Receipt,
    Sparkles,
    Sun,
    Moon,
    FileCheck,
    ClipboardList
} from 'lucide-react';

export default function StudentLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Theme state with localStorage persistence
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const navigationGroups = [
        {
            label: 'Learning',
            items: [
                {
                    name: 'Dashboard',
                    href: route('student.dashboard'),
                    active: route().current('student.dashboard'),
                    icon: LayoutDashboard,
                },
                {
                    name: 'My Courses',
                    href: route('student.courses.enrolled'),
                    active: route().current('student.courses.enrolled'),
                    icon: BookOpen,
                },
                {
                    name: 'Course Exams',
                    href: route('student.exams.index'),
                    active: route().current('student.exams.*'),
                    icon: FileCheck,
                },
                {
                    name: 'Assignments',
                    href: route('student.assignments.index'),
                    active: route().current('student.assignments.*'),
                    icon: ClipboardList,
                },
                {
                    name: 'Browse Courses',
                    href: route('courses.index'),
                    active: route().current('courses.index') || route().current('student.courses.index'),
                    icon: Compass,
                },
                {
                    name: 'Live Classes',
                    href: '#',
                    active: false,
                    icon: Video,
                    badge: 'Live',
                },
            ],
        },
        {
            label: 'Achievements',
            items: [
                {
                    name: 'Certificates',
                    href: '#',
                    active: false,
                    icon: Award,
                    badge: 'Soon',
                },
            ],
        },
        {
            label: 'Account',
            items: [
                {
                    name: 'My Profile',
                    href: route('student.profile'),
                    active: route().current('student.profile*'),
                    icon: User,
                },
                {
                    name: 'Invoices',
                    href: route('student.invoices.index'),
                    active: route().current('student.invoices*'),
                    icon: Receipt,
                },
            ],
        },
    ];

    const renderNavItems = (onItemClick = null) => (
        <div className="space-y-5">
            {navigationGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                    <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                        {group.label}
                    </div>
                    <div className="space-y-0.5">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={onItemClick}
                                    className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                        item.active
                                            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100/90 dark:border-indigo-800/60 shadow-2xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {item.active && (
                                        <span className="absolute left-0 inset-y-2 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                                    )}
                                    <div className="flex items-center space-x-2.5">
                                        <Icon className={`h-4 w-4 ${item.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 font-mono ${
                                            item.badge === 'Live'
                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {item.badge === 'Live' && (
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                                </span>
                                            )}
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex antialiased relative selection:bg-indigo-500 selection:text-white transition-colors duration-200">
            {/* Subtle ambient decorative lighting at top */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute -top-40 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute top-20 left-1/3 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-md text-slate-800 dark:text-slate-200 border-r border-slate-200/80 dark:border-slate-800 fixed inset-y-0 z-30 transition-colors duration-200">
                
                {/* Brand Header */}
                <div className="h-16 flex items-center px-5 border-b border-slate-200/70 dark:border-slate-800 space-x-3 bg-white dark:bg-[#0c101c] transition-colors duration-200">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200 shrink-0">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="font-bold text-xs leading-tight text-slate-900 dark:text-white tracking-tight truncate">
                                Comestro Academy
                            </h1>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-800/60 font-mono uppercase">
                                Portal
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                            Student Workspace
                        </p>
                    </div>
                </div>

                {/* Sidebar Nav Links */}
                <div className="flex-1 overflow-y-auto px-3.5 py-4">
                    {renderNavItems()}
                </div>

                {/* Sidebar Motivational Learning Goal Widget */}
                <div className="p-3.5 mx-3 mb-2 rounded-xl bg-gradient-to-br from-indigo-50/90 to-violet-50/40 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-100/80 dark:border-indigo-900/40 shadow-2xs space-y-2 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Learning Track</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                            Active
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                        Keep up the pace! Complete weekly milestones to earn your verified certificate.
                    </p>
                </div>

                {/* Bottom User Profile Card */}
                <div className="p-3 border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0c101c] transition-colors duration-200">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition group">
                        <Link
                            href={route('student.profile')}
                            className="flex items-center space-x-2.5 overflow-hidden flex-1 min-w-0"
                            title="View Profile"
                        >
                            <div className="relative shrink-0">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-2xs">
                                    {user?.profile_pic ? (
                                        <img src={user.profile_pic} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                                    )}
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                                    {user?.name || 'Student'}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                                    ID: #{user?.id}
                                </div>
                            </div>
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition shrink-0 ml-1 cursor-pointer"
                            title="Log Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Slide-over Sidebar Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0c101c] text-slate-800 dark:text-slate-200 z-50 flex flex-col p-4 shadow-2xl border-r border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-sm text-slate-900 dark:text-white">Student Portal</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 py-4 overflow-y-auto">
                            {renderNavItems(() => setSidebarOpen(false))}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0 z-10">
                
                {/* Top Navbar */}
                <header className="h-16 bg-white/85 dark:bg-[#0c101c]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
                    
                    {/* Left: Mobile Toggle & Page Header Title */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            {header}
                        </div>
                    </div>

                    {/* Right: Theme Switcher, Notifications & User Menu Dropdown */}
                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                        {/* Clean Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-2xs"
                            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
                            ) : (
                                <Moon className="h-4 w-4 text-slate-600 hover:text-indigo-600 transition-transform duration-200" />
                            )}
                        </button>

                        <NotificationBell user={user} />

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs transition cursor-pointer">
                                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-2xs shrink-0">
                                        {user?.profile_pic ? (
                                            <img src={user.profile_pic} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                                        )}
                                    </div>
                                    <span className="hidden sm:inline-block font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-1.5 bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl ring-0 divide-y divide-slate-100 dark:divide-slate-800 w-52">
                                <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/70">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <Dropdown.Link
                                        href={route('student.profile')}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition"
                                    >
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span>My Profile</span>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition"
                                    >
                                        <LogOut className="h-3.5 w-3.5 text-rose-500" />
                                        <span>Log Out</span>
                                    </Dropdown.Link>
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1">
                    {children}
                </main>

                <Toaster position="top-right" reverseOrder={false} />
            </div>
        </div>
    );
}
