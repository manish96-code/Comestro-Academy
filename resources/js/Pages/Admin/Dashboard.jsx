import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    GraduationCap,
    Users,
    UserCheck,
    Video,
    ShieldCheck,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

export default function AdminDashboard({ stats, recent_users }) {
    const handleStatusChange = (userId, newStatus) => {
        router.patch(
            route('admin.users.status', userId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
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
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            Dashboard
                        </h1>
                        <p className="text-[11px] text-gray-500">
                            Overview of platform performance & activity
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Top Stats Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        
                        {/* Card 1: Students */}
                        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Total Students
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats?.total_students || 0}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600 font-semibold">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                <span>+12% from last month</span>
                            </div>
                        </div>

                        {/* Card 2: Instructors */}
                        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Instructors
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats?.total_instructors || 0}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-gray-500 font-medium">
                                <span>Verified Teaching Staff</span>
                            </div>
                        </div>

                        {/* Card 3: Active Courses */}
                        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Active Courses
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats?.total_courses || 0}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600 font-semibold">
                                <span>Live & Recorded Cohorts</span>
                            </div>
                        </div>

                        {/* Card 4: Live Sessions */}
                        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Active Live Classes
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats?.live_classes_active || 0}
                                    </h3>
                                </div>
                                <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                                    <Video className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-rose-600 font-semibold">
                                <span className="animate-pulse">● Live Stream Ongoing</span>
                            </div>
                        </div>

                    </div>

                    {/* Main Content Area: Recent Users + Quick Actions */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        
                        {/* Table Column: Recent Registrations */}
                        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-200/80 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Recent Registrations
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Newly joined students and instructors on Comestro Academy.
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.users')}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                                >
                                    <span>View All Users</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                        <tr>
                                            <th className="py-3 px-4 rounded-l-lg font-semibold">User</th>
                                            <th className="py-3 px-4 font-semibold">Role</th>
                                            <th className="py-3 px-4 font-semibold">Status</th>
                                            <th className="py-3 px-4 text-right rounded-r-lg font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recent_users && recent_users.length > 0 ? (
                                            recent_users.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50/80 transition">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-semibold text-gray-900">
                                                            {u.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {u.email} {u.phone ? `• ${u.phone}` : ''}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 capitalize">
                                                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-md border ${
                                                            u.role === 'admin' 
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : u.role === 'instructor'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                : 'bg-gray-100 text-gray-700 border-gray-200'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {getStatusBadge(u.status)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <select
                                                            value={u.status}
                                                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                                            className="text-xs rounded-lg border-gray-300 bg-white text-gray-700 py-1 px-2.5 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                            <option value="suspended">Suspend</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-400">
                                                    No users registered yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Column 2: Quick Management & System Status */}
                        <div className="space-y-6">
                            
                            {/* Quick Actions Panel */}
                            <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    Quick Management
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('admin.users')}
                                        className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50/70 border border-gray-100 hover:border-indigo-100 text-gray-800 transition group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium">Manage All Users</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <button
                                        onClick={() => alert('Course management coming in next module!')}
                                        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-purple-50/70 border border-gray-100 hover:border-purple-100 text-gray-800 transition group text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                                <GraduationCap className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium">Manage Courses & Batches</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => alert('Live Stream credentials configured')}
                                        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-rose-50/70 border border-gray-100 hover:border-rose-100 text-gray-800 transition group text-left"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                                                <Video className="h-5 w-5" />
                                            </div>
                                            <span className="text-sm font-medium">Live Class Control</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Platform Health Widget */}
                            <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-300">
                                        Platform Health
                                    </h4>
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Database Engine</span>
                                        <span className="text-emerald-400 font-medium">Connected</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Auth & Middleware</span>
                                        <span className="text-emerald-400 font-medium">Role-Guarded</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Inertia React Engine</span>
                                        <span className="text-indigo-300 font-medium">v2.0 Active</span>
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
