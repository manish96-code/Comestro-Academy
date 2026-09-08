import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Eye
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
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
                            Students Management
                        </h1>
                        <p className="text-xs text-gray-500">
                            View student list and profile details
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Students List" />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
                    
                    {/* Header Filter Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-white p-4 border border-gray-200 shadow-xs">
                        
                        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-xl">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-xs"
                            >
                                Search
                            </button>
                        </form>

                        <div className="text-xs text-gray-600 font-medium shrink-0 whitespace-nowrap bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                            Total Students: <strong className="text-gray-900 font-bold ml-1">{students?.total || 0}</strong>
                        </div>
                    </div>

                    {/* Clean Students Table */}
                    <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4">Student Name</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Phone</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students?.data && students.data.length > 0 ? (
                                        students.data.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-8 w-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200">
                                                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 text-xs">{student.name}</div>
                                                            <div className="text-[11px] text-gray-400">ID: #{student.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-700">{student.email}</td>
                                                <td className="py-3 px-4 font-medium text-gray-600">{student.phone || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(student.status)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Link
                                                        href={route('admin.students.show', student.id)}
                                                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition"
                                                        title="View Profile Details"
                                                    >
                                                        <Eye className="h-3.5 w-3.5 mr-1" />
                                                        View Profile
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-10 text-center text-gray-400">
                                                No students found matching your search.
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
