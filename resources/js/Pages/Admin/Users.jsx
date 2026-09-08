import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, Filter, ArrowLeft } from 'lucide-react';

export default function AdminUsers({ users, filters }) {
    const handleStatusChange = (userId, newStatus) => {
        router.patch(
            route('admin.users.status', userId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleRoleFilter = (role) => {
        router.get(
            route('admin.users'),
            { role: role || undefined },
            { preserveState: true }
        );
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            User Management
                        </h1>
                        <p className="text-[11px] text-gray-500">
                            Manage students, instructors, and administrators
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-8 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filters & Actions Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-200/80">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter Role:</span>
                            <div className="flex space-x-1">
                                {['', 'student', 'instructor', 'admin'].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => handleRoleFilter(r)}
                                        className={`px-3 py-1 text-xs rounded-lg font-medium transition capitalize ${
                                            (filters.role || '') === r
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {r === '' ? 'All Roles' : r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 font-medium">
                            Total Records: <strong className="text-gray-900 font-bold">{users?.total || 0}</strong>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200/80">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4 rounded-l-lg font-semibold">ID</th>
                                        <th className="py-3 px-4 font-semibold">Name & Email</th>
                                        <th className="py-3 px-4 font-semibold">Phone</th>
                                        <th className="py-3 px-4 font-semibold">Role</th>
                                        <th className="py-3 px-4 font-semibold">Status</th>
                                        <th className="py-3 px-4 text-right rounded-r-lg font-semibold">Manage Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users?.data && users.data.length > 0 ? (
                                        users.data.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/80 transition">
                                                <td className="py-3.5 px-4 font-semibold text-gray-400">#{u.id}</td>
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-gray-900">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{u.phone || 'N/A'}</td>
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
                                                <td className="py-3.5 px-4 capitalize text-xs font-semibold">
                                                    {u.status === 'active' && <span className="text-emerald-600">● Active</span>}
                                                    {u.status === 'inactive' && <span className="text-amber-600">● Inactive</span>}
                                                    {u.status === 'suspended' && <span className="text-rose-600">● Suspended</span>}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <select
                                                        value={u.status}
                                                        onChange={(e) => handleStatusChange(u.id, e.target.value)}
                                                        className="text-xs rounded-lg border-gray-300 bg-white text-gray-700 py-1 px-2.5 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                        <option value="suspended">Suspended</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-400">
                                                No users found.
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
