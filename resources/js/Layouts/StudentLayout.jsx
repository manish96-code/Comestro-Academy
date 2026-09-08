import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    User,
    BookOpen,
    Video,
    LogOut,
    Menu,
    X,
    GraduationCap,
    ChevronDown,
    Award
} from 'lucide-react';

export default function StudentLayout({ header, children }) {
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

    const navigation = [
        {
            name: 'Dashboard',
            href: route('student.dashboard'),
            active: route().current('student.dashboard'),
            icon: LayoutDashboard,
        },
        {
            name: 'My Profile',
            href: route('student.profile'),
            active: route().current('student.profile*'),
            icon: User,
        },
        {
            name: 'Enrolled Courses',
            href: '#',
            active: false,
            icon: BookOpen,
            badge: 'Soon',
        },
        {
            name: 'Live Interactive Classes',
            href: '#',
            active: false,
            icon: Video,
            badge: 'Live',
        },
        {
            name: 'Certificates',
            href: '#',
            active: false,
            icon: Award,
            badge: 'Soon',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Toaster position="top-right" />

            {/* Desktop Left Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-white border-r border-slate-800 fixed inset-y-0 z-30">
                
                {/* Brand Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
                    <div className="p-1.5 bg-indigo-600 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm leading-tight text-white tracking-wide">
                            Comestro Academy
                        </h1>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
                            Student Portal
                        </span>
                    </div>
                </div>

                {/* Sidebar Nav Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                        Student Menu
                    </div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                    item.active
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-4 w-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        item.badge === 'Live'
                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom User Profile Card */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-semibold text-white truncate">
                                    {user?.name || 'Student'}
                                </div>
                                <div className="text-[10px] text-indigo-300 capitalize truncate">
                                    Student ID: #{user?.id}
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
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
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 flex flex-col p-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                                <GraduationCap className="h-6 w-6 text-indigo-500" />
                                <span className="font-bold text-sm">Student Portal</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                                            item.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-400">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    
                    {/* Left: Mobile Toggle & Page Header Title */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            {header}
                        </div>
                    </div>

                    {/* Right: User Menu Dropdown */}
                    <div className="flex items-center space-x-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center space-x-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-gray-100 transition">
                                    <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <span className="hidden sm:inline-block font-medium">{user?.name}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-900">{user?.name}</p>
                                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <Dropdown.Link href={route('student.profile')}>
                                    My Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
