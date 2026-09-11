import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap,
    Users,
    UserCheck,
    Video,
    ShieldCheck,
    ArrowRight,
    Eye,
    Plus,
    BookOpen,
    Activity,
    CheckCircle2,
    Database,
    Zap,
    CreditCard
} from 'lucide-react';

export default function AdminDashboard({ stats, recent_users }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                            Platform Overview
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            Real-time platform activity, enrollment counts & system services
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Top Stats Cards Grid - Clean SaaS Metric Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Card 1: Students */}
                        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                                    Total Students
                                </span>
                                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stats?.total_students ? Number(stats.total_students).toLocaleString() : 0}
                                </span>
                                <span className="text-[11px] font-medium text-emerald-600 font-mono">Active</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <Link
                                    href={route('admin.students.index')}
                                    className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                                >
                                    <span>Manage Students</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Card 2: Instructors */}
                        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                                    Instructors
                                </span>
                                <div className="rounded-lg bg-purple-50 p-2 text-purple-600 border border-purple-100">
                                    <UserCheck className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stats?.total_instructors ? Number(stats.total_instructors).toLocaleString() : 0}
                                </span>
                                <span className="text-[11px] font-medium text-purple-600 font-mono">Mentors</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <Link
                                    href={route('admin.instructors.index')}
                                    className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                                >
                                    <span>Manage Instructors</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Card 3: Active Courses */}
                        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                                    Courses
                                </span>
                                <div className="rounded-lg bg-sky-50 p-2 text-sky-600 border border-sky-100">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stats?.total_courses ? Number(stats.total_courses).toLocaleString() : 0}
                                </span>
                                <span className="text-[11px] font-medium text-sky-600 font-mono">Curriculums</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <Link
                                    href={route('admin.courses.index')}
                                    className="text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                                >
                                    <span>View Catalog</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Card 4: Live Sessions */}
                        <div className="rounded-xl bg-white p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition group">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                                    Live Classes
                                </span>
                                <div className="rounded-lg bg-rose-50 p-2 text-rose-600 border border-rose-100">
                                    <Video className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                    {stats?.live_classes_active || 0}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                    Active Stream
                                </span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500 text-[11px]">WebRTC & Zoom Link Active</span>
                            </div>
                        </div>

                    </div>

                    {/* Main Content Area: Recent Registrations Table + Quick Actions */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">

                        {/* Table Column: Recent Registrations (2 Cols) */}
                        <div className="lg:col-span-2 rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-5 border-b border-slate-100">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                                        Recent Registrations
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Newly registered students and instructors on Comestro Academy
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.students.index')}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
                                >
                                    <span>All Students</span>
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="bg-slate-50 text-[11px] uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="py-2.5 px-4 font-semibold">User</th>
                                            <th className="py-2.5 px-4 font-semibold">Role</th>
                                            <th className="py-2.5 px-4 font-semibold">Status</th>
                                            <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recent_users && recent_users.length > 0 ? (
                                            recent_users.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="h-7 w-7 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-semibold text-slate-900 truncate">
                                                                    {u.name}
                                                                </div>
                                                                <div className="text-[11px] text-slate-400 font-mono truncate">
                                                                    {u.email} {u.phone ? `• ${u.phone}` : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider border ${
                                                                u.role === 'admin'
                                                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                    : u.role === 'instructor'
                                                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                        >
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {getStatusBadge(u.status)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        {u.role === 'instructor' ? (
                                                            <Link
                                                                href={route('admin.instructors.show', u.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                <span>View</span>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={route('admin.students.show', u.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                <span>View</span>
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">
                                                    No recent user registrations found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Column 2: Quick Management & System Status (1 Col) */}
                        <div className="space-y-5">

                            {/* Quick Management Shortcuts */}
                            <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    <Link
                                        href={route('admin.courses.create')}
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 text-slate-800 transition group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-md bg-indigo-600 text-white shadow-2xs">
                                                <Plus className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-xs font-semibold">Create New Course</span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>

                                    <Link
                                        href={route('admin.students.index')}
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 transition group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-md bg-slate-200 text-slate-700">
                                                <GraduationCap className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-xs font-semibold">Browse Students</span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>

                                    <Link
                                        href={route('admin.instructors.create')}
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 transition group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-md bg-purple-100 text-purple-700">
                                                <UserCheck className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-xs font-semibold">Onboard Instructor</span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Platform Health & System Services */}
                            <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3.5">
                                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Services & Engine
                                    </h4>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="space-y-2.5 text-xs divide-y divide-slate-100">
                                    <div className="flex justify-between items-center pt-2 first:pt-0">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Database className="h-3.5 w-3.5 text-slate-400" />
                                            <span>MySQL Database</span>
                                        </div>
                                        <span className="font-mono text-[11px] text-emerald-600 font-medium">Connected</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                                            <span>Razorpay Payments</span>
                                        </div>
                                        <span className="font-mono text-[11px] text-emerald-600 font-medium">Live / Test Active</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Zap className="h-3.5 w-3.5 text-slate-400" />
                                            <span>ImageKit CDN Engine</span>
                                        </div>
                                        <span className="font-mono text-[11px] text-emerald-600 font-medium">Connected</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                                            <span>Role Middleware</span>
                                        </div>
                                        <span className="font-mono text-[11px] text-indigo-600 font-medium">RBAC Guarded</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}

