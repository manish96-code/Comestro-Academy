import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Receipt,
    CreditCard,
    ArrowRight,
    CheckCircle2,
    Calendar,
    BookOpen,
    ExternalLink,
    Search,
    ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function InvoiceIndex({ enrollments, stats }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEnrollments = enrollments.data ? enrollments.data.filter((enrollment) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const courseTitle = enrollment.course?.title?.toLowerCase() || '';
        const invoiceNum = enrollment.invoice_number?.toLowerCase() || '';
        return courseTitle.includes(query) || invoiceNum.includes(query);
    }) : [];

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                            Billing & Course Invoices
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            View, download, and track payment receipts for your enrolled courses
                        </p>
                    </div>

                    <Link
                        href={route('student.courses.enrolled')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-50 shadow-2xs transition"
                    >
                        <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                        <span>My Enrolled Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Invoices & Receipts - Comestro Academy" />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Summary Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                                    Total Invoices
                                </span>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Receipt className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-gray-900">
                                {stats.total_invoices || 0}
                            </div>
                            <p className="text-[11px] text-gray-400">
                                All course admissions & receipts
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                                    Total Investment
                                </span>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-gray-900">
                                ₹{Number(stats.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-gray-400">
                                Total tuition paid to date
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
                                    Active Admissions
                                </span>
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-gray-900">
                                {stats.active_enrollments || 0}
                            </div>
                            <p className="text-[11px] text-gray-400">
                                Current active enrollments
                            </p>
                        </div>
                    </div>

                    {/* Invoices List / Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
                        
                        {/* Table Header / Filter */}
                        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    Invoice Records
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Official tax receipts generated for each enrolled course
                                </p>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by course or invoice #..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {filteredEnrollments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold">
                                            <th className="py-3 px-4">Invoice #</th>
                                            <th className="py-3 px-4">Course Enrolled</th>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Payment Method</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEnrollments.map((enrollment) => {
                                            const course = enrollment.course;
                                            const enrolledDate = enrollment.enrolled_at
                                                ? new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : 'Recently';

                                            const isFree = Number(enrollment.paid_amount) <= 0;

                                            return (
                                                <tr key={enrollment.id} className="hover:bg-gray-50/60 transition group">
                                                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                                                        <Link
                                                            href={route('student.invoices.show', enrollment.id)}
                                                            className="hover:text-indigo-600 transition"
                                                        >
                                                            {enrollment.invoice_number}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs">
                                                        <div className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">
                                                            {course?.title || 'Enrolled Course'}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-mono">
                                                            {course?.category?.name || 'Comestro Academy'}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                                                        {enrolledDate}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="truncate max-w-[140px] font-medium text-gray-700">
                                                                {enrollment.payment_method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                                                        {isFree ? (
                                                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-emerald-200">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            `₹${Number(enrollment.paid_amount).toFixed(2)}`
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                            PAID
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <Link
                                                            href={route('student.invoices.show', enrollment.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 rounded-md transition"
                                                        >
                                                            <FileText className="h-3 w-3" />
                                                            <span>View Invoice</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-3">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center border border-gray-200">
                                    <Receipt className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-gray-900">
                                        {searchQuery ? 'No Matching Invoices Found' : 'No Invoices Yet'}
                                    </h4>
                                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                        {searchQuery
                                            ? `No invoices matched "${searchQuery}". Try searching with a different term.`
                                            : 'When you enroll in courses, your tax invoices and payment receipts will appear here.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pagination Links if multiple pages */}
                        {enrollments.links && enrollments.links.length > 3 && (
                            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <div>
                                    Showing {enrollments.from || 0} to {enrollments.to || 0} of {enrollments.total || 0} invoices
                                </div>
                                <div className="flex items-center gap-1">
                                    {enrollments.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-2.5 py-1 rounded border text-xs font-medium transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : link.url
                                                        ? 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
