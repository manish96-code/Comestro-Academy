import Dropdown from '@/Components/Dropdown';
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
            name: 'Explore Courses',
            href: route('courses.index'),
            active: route().current('courses.index') || route().current('student.courses.index'),
            icon: Compass,
        },
        {
            name: 'Enrolled Courses',
            href: route('student.courses.enrolled'),
            active: route().current('student.courses.enrolled'),
            icon: BookOpen,
        },
        {
            name: 'My Profile',
            href: route('student.profile'),
            active: route().current('student.profile*'),
            icon: User,
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
            <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white text-gray-800 border-r border-gray-200 fixed inset-y-0 z-30">
                
                {/* Brand Header */}
                <div className="h-16 flex items-center px-6 border-b border-gray-200/80 space-x-3 bg-white">
                    <div className="p-1.5 bg-indigo-600 rounded-xl shadow-xs">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm leading-tight text-gray-900 tracking-wide">
                            Comestro Academy
                        </h1>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600">
                            Student Portal
                        </span>
                    </div>
                </div>

                {/* Sidebar Nav Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 font-mono">
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
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                                        : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`h-4 w-4 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        item.badge === 'Live'
                                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom User Profile Card */}
                <div className="p-3.5 border-t border-gray-200/80 bg-white">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 shadow-2xs hover:bg-gray-100/80 transition">
                        <Link
                            href={route('student.profile')}
                            className="flex items-center space-x-3 overflow-hidden group flex-1 min-w-0"
                            title="View Profile"
                        >
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-2xs">
                                {user?.profile_pic ? (
                                    <img src={user.profile_pic} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                                )}
                            </div>
                            <div className="truncate">
                                <div className="text-xs font-semibold text-gray-900 group-hover:text-indigo-600 transition truncate">
                                    {user?.name || 'Student'}
                                </div>
                                <div className="text-[10px] text-indigo-600 font-medium capitalize truncate">
                                    Student ID: #{user?.id}
                                </div>
                            </div>
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 ml-1"
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

                    <div className="fixed inset-y-0 left-0 w-64 bg-white text-gray-800 z-50 flex flex-col p-4 shadow-2xl border-r border-gray-200">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                                <GraduationCap className="h-6 w-6 text-indigo-600" />
                                <span className="font-bold text-sm text-gray-900">Student Portal</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
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
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className={`h-4 w-4 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                                item.badge === 'Live'
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
                                <button className="flex items-center space-x-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 py-1.5 px-2.5 rounded-xl hover:bg-gray-100 border border-gray-200/80 bg-white shadow-2xs transition">
                                    <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-2xs shrink-0">
                                        {user?.profile_pic ? (
                                            <img src={user.profile_pic} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                                        )}
                                    </div>
                                    <span className="hidden sm:inline-block font-semibold text-gray-800">{user?.name}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-1.5 bg-white border border-gray-200 rounded-xl shadow-xl ring-0 divide-y divide-gray-100 w-52">
                                <div className="px-4 py-2.5 bg-gray-50/70">
                                    <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-gray-500 font-mono truncate mt-0.5">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <Dropdown.Link
                                        href={route('student.profile')}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/70 transition"
                                    >
                                        <User className="h-3.5 w-3.5 text-gray-400" />
                                        <span>My Profile</span>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 transition"
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
            </div>
        </div>
    );
}
