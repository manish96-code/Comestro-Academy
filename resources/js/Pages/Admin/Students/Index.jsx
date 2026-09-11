import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Eye,
    GraduationCap,
    Mail,
    Phone,
    RotateCcw,
    Users
} from 'lucide-react';

export default function StudentIndex({ students, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.students.index'),
            { search: search || undefined },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.students.index'));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                Students Directory
                            </h1>
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                                {students?.total || 0} TOTAL
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Manage student registrations, academic background, and learning accounts
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Students Directory" />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Header Filter Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                        <form onSubmit={handleSearch} className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-lg">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by student name, email, phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-xs"
                            >
                                Search
                            </button>
                            {filters?.search && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                                    title="Reset search"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                        </form>

                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span>Enrolled Students:</span>
                            <strong className="text-slate-900 font-bold">{students?.total || 0}</strong>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4">Student Name</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Phone</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students?.data && students.data.length > 0 ? (
                                        students.data.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50/70 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-xs">{student.name}</div>
                                                            <div className="text-[11px] text-slate-400 font-mono">ID: #{student.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-700">
                                                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                                                        <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                                        {student.email}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-600 font-mono text-[11px]">
                                                    {student.phone || 'N/A'}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(student.status)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link
                                                        href={route('admin.students.show', student.id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition"
                                                        title="View Profile Details"
                                                    >
                                                        <Eye className="h-3 w-3 text-slate-400" />
                                                        <span>View Profile</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400">
                                                <div className="max-w-xs mx-auto space-y-2">
                                                    <GraduationCap className="h-8 w-8 mx-auto text-slate-300" />
                                                    <p className="text-xs text-slate-500 font-medium">No students found</p>
                                                    <p className="text-[11px] text-slate-400">Try adjusting your search criteria.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

        </AdminLayout>
    );
}
