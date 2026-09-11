import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Video,
    LogOut,
    Menu,
    X,
    FolderTree,
    BookOpen,
    ExternalLink,
    ChevronDown,
    Layers,
    Code,
    Sparkles,
    ShieldCheck
} from 'lucide-react';

export default function AdminLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const navGroups = [
        {
            label: 'Overview',
            items: [
                {
                    name: 'Dashboard',
                    href: route('admin.dashboard'),
                    active: route().current('admin.dashboard'),
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            label: 'Learning & Content',
            items: [
                {
                    name: 'Courses',
                    href: route('admin.courses.index'),
                    active: route().current('admin.courses.*'),
                    icon: BookOpen,
                },
                {
                    name: 'Course Categories',
                    href: route('admin.categories.index'),
                    active: route().current('admin.categories.*'),
                    icon: FolderTree,
                },
                {
                    name: 'Live Class Control',
                    href: '#',
                    active: false,
                    icon: Video,
                    badge: 'Live',
                },
            ],
        },
        {
            label: 'People & Accounts',
            items: [
                {
                    name: 'Students',
                    href: route('admin.students.index'),
                    active: route().current('admin.students.*'),
                    icon: GraduationCap,
                },
                {
                    name: 'Instructors',
                    href: route('admin.instructors.index'),
                    active: route().current('admin.instructors.*'),
                    icon: Users,
                },
            ],
        },
    ];

    const renderNavItems = (onItemClick = null) => (
        <div className="space-y-5">
            {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                    <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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
                                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        item.active
                                            ? 'bg-indigo-50/90 text-indigo-700 font-semibold border-l-2 border-indigo-600 shadow-2xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon
                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                item.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                                            }`}
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span
                                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                                item.badge === 'Live'
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
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
        <div className="min-h-screen bg-slate-50/70 flex antialiased text-slate-800">
            {/* Desktop Fixed Left Sidebar - Clean White SaaS Theme */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-slate-200/90 fixed inset-y-0 z-30 shadow-2xs">
                {/* Brand Header */}
                <div className="h-14 flex items-center justify-between px-5 border-b border-slate-200/80 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                            <Code className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                            <h1 className="font-extrabold text-xs tracking-wider uppercase text-slate-900 leading-none truncate">
                                Comestro
                            </h1>
                            <span className="text-[10px] font-medium text-slate-500 tracking-tight">
                                Academy Admin
                            </span>
                        </div>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        v2.0
                    </span>
                </div>

                {/* Grouped Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto px-3.5 py-4">
                    {renderNavItems()}
                </div>

                {/* Quick Public Catalog Link */}
                <div className="px-3.5 pb-2">
                    <Link
                        href={route('courses.index')}
                        target="_blank"
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-xs font-medium transition group"
                    >
                        <div className="flex items-center gap-2">
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                            <span>View Public Catalog</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 group-hover:text-indigo-600">↗</span>
                    </Link>
                </div>

                {/* Bottom User Card */}
                <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                            <div className="h-8 w-8 rounded-md bg-indigo-600/10 text-indigo-700 border border-indigo-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="truncate min-w-0">
                                <div className="text-xs font-semibold text-slate-900 truncate">
                                    {user?.name || 'Admin'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono capitalize truncate">
                                    {user?.role || 'Administrator'}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Log Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Slide-over Sidebar Backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />

                    <div className="fixed inset-y-0 left-0 w-64 bg-white text-slate-900 z-50 flex flex-col shadow-xl border-r border-slate-200 animate-in slide-in-from-left duration-200">
                        {/* Mobile Header */}
                        <div className="h-14 flex items-center justify-between px-5 border-b border-slate-200">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    <Code className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block">
                                        Comestro Academy
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        Admin Portal
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            {renderNavItems(() => setSidebarOpen(false))}
                        </div>

                        {/* Mobile Footer User Info */}
                        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="h-8 w-8 rounded-md bg-indigo-600/10 text-indigo-700 border border-indigo-200/60 flex items-center justify-center font-bold text-xs shrink-0">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <div className="truncate">
                                        <div className="text-xs font-semibold text-slate-900 truncate">
                                            {user?.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 capitalize">
                                            {user?.role}
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Compact Top Navbar */}
                <header className="h-14 bg-white border-b border-slate-200/90 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Left: Mobile Toggle & Page Header / Breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                            {header}
                        </div>
                    </div>

                    {/* Right: Quick Tools & Profile Dropdown */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        {/* Public Catalog Link on Desktop */}
                        <Link
                            href={route('courses.index')}
                            target="_blank"
                            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition"
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                            <span>Live Portal</span>
                        </Link>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100/80 transition cursor-pointer"
                                    >
                                        <div className="h-7 w-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                        <span className="hidden sm:inline-block truncate max-w-[120px]">
                                            {user?.name}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-xs font-semibold text-slate-900 truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-mono truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        <span>Log Out</span>
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-slate-50/70">{children}</main>

                <Toaster position="top-right" reverseOrder={false} />
            </div>
        </div>
    );
}

