import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import FilterSelect from '@/Components/FilterSelect';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Award,
    ShieldCheck,
    ShieldAlert,
    ExternalLink,
    GraduationCap,
    CheckCircle2,
    XCircle,
    User,
    Calendar,
    BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminCertificateIndex({ certificates = { data: [] }, stats = {}, courses = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (newSearch, newCourseId, newStatus) => {
        router.get(
            route('admin.certificates.index'),
            {
                search: newSearch || undefined,
                course_id: newCourseId || undefined,
                status: newStatus || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleToggleStatus = (cert) => {
        const actionText = cert.status === 'active' ? 'revoke' : 'activate';
        if (confirm(`Are you sure you want to ${actionText} certificate ${cert.certificate_number}?`)) {
            router.patch(route('admin.certificates.toggle-status', cert.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const courseOptions = [
        { value: '', label: 'All Courses' },
        ...courses.map((c) => ({ value: String(c.id), label: c.title })),
    ];

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'revoked', label: 'Revoked' },
    ];

    return (
        <AdminLayout>
            <Head title="Course Certificates Management" />

            <div className="space-y-6">
                {/* 1. Header & Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-600" />
                            Issued Course Certificates
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Audit, verify, and manage all verified graduation credentials earned by students across all courses.
                        </p>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Certificates</span>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                            {stats.total_issued || 0}
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active & Valid</span>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {stats.active_valid || 0}
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Revoked</span>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                            {stats.revoked || 0}
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Unique Graduates</span>
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                            {stats.unique_graduates || 0}
                        </div>
                    </div>
                </div>

                {/* 3. Filters Toolbar */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex-1 max-w-md">
                        <SearchBar
                            value={search}
                            onChange={(val) => {
                                setSearch(val);
                                handleFilter(val, courseId, status);
                            }}
                            placeholder="Search by certificate number, student, or course..."
                            size="sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <FilterSelect
                            value={courseId}
                            onChange={(e) => {
                                setCourseId(e.target.value);
                                handleFilter(search, e.target.value, status);
                            }}
                            options={courseOptions}
                            size="sm"
                        />

                        <FilterSelect
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                handleFilter(search, courseId, e.target.value);
                            }}
                            options={statusOptions}
                            size="sm"
                        />
                    </div>
                </div>

                {/* 4. Table */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Certificate ID</th>
                                    <th className="py-3 px-4">Student Graduate</th>
                                    <th className="py-3 px-4">Course Program</th>
                                    <th className="py-3 px-4">Issue Date</th>
                                    <th className="py-3 px-4">Score</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {certificates.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-slate-400">
                                            No certificates found matching your query.
                                        </td>
                                    </tr>
                                ) : (
                                    certificates.data.map((cert) => (
                                        <tr
                                            key={cert.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {cert.certificate_number}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {cert.user?.name}
                                                </div>
                                                <div className="text-[11px] text-slate-400 font-mono">
                                                    {cert.user?.email}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">
                                                    {cert.course?.title}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                {new Date(cert.issued_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {cert.final_score ? `${cert.final_score}%` : '—'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                                                        cert.status === 'active'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                                    }`}
                                                >
                                                    {cert.status === 'active' ? (
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3" />
                                                    )}
                                                    {cert.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={route('certificates.verify', cert.certificate_number)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1 transition"
                                                        title="Public Verification"
                                                    >
                                                        Verify <ExternalLink className="w-3 h-3" />
                                                    </a>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(cert)}
                                                        className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                                                            cert.status === 'active'
                                                                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                                                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                                                        }`}
                                                    >
                                                        {cert.status === 'active' ? 'Revoke' : 'Restore'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {certificates.links && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                            <Pagination links={certificates.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
