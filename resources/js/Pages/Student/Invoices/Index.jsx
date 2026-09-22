import StudentLayout from '@/Layouts/StudentLayout';
import SearchBar from '@/Components/SearchBar';
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
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Billing & Course Invoices
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            View, download, and track payment receipts for your enrolled courses
                        </p>
                    </div>

                    <Link
                        href={route('student.courses.enrolled')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs transition"
                    >
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        <span>My Enrolled Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Invoices & Receipts - Comestro Academy" />

            <div className="py-6 min-h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Summary Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                    Total Invoices
                                </span>
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md">
                                    <Receipt className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                {stats.total_invoices || 0}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                All course admissions & receipts
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                    Total Investment
                                </span>
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                ₹{Number(stats.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                Total tuition paid to date
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                                    Active Admissions
                                </span>
                                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-md">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                {stats.active_enrollments || 0}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                Current active enrollments
                            </p>
                        </div>
                    </div>

                    {/* Invoices List / Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                        
                        {/* Table Header / Filter */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Invoice Records
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Official tax receipts generated for each enrolled course
                                </p>
                            </div>

                            <SearchBar
                                containerClassName="relative w-full sm:w-64"
                                placeholder="Search by course or invoice #..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClear={() => setSearchQuery('')}
                            />
                        </div>

                        {filteredEnrollments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                            <th className="py-3 px-4">Invoice #</th>
                                            <th className="py-3 px-4">Course Enrolled</th>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Payment Method</th>
                                            <th className="py-3 px-4 text-right">Amount</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                                                <tr key={enrollment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group">
                                                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                        <Link
                                                            href={route('student.invoices.show', enrollment.id)}
                                                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                                        >
                                                            {enrollment.invoice_number}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3.5 px-4 max-w-xs">
                                                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                            {course?.title || 'Enrolled Course'}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-mono">
                                                            {course?.category?.name || 'Comestro Academy'}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                                        {enrolledDate}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="truncate max-w-[140px] font-medium text-slate-700 dark:text-slate-200">
                                                                {enrollment.payment_method}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                        {isFree ? (
                                                            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border border-emerald-200 dark:border-emerald-800">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            `₹${Number(enrollment.paid_amount).toFixed(2)}`
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                            PAID
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <Link
                                                            href={route('student.invoices.show', enrollment.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-md transition"
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
                                <div className="mx-auto h-12 w-12 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                    <Receipt className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {searchQuery ? 'No Matching Invoices Found' : 'No Invoices Yet'}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                        {searchQuery
                                            ? `No invoices matched "${searchQuery}". Try searching with a different term.`
                                            : 'When you enroll in courses, your tax invoices and payment receipts will appear here.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pagination Links if multiple pages */}
                        {enrollments.links && enrollments.links.length > 3 && (
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <div>
                                    Showing {enrollments.from || 0} to {enrollments.to || 0} of {enrollments.total || 0} invoices
                                </div>
                                <div className="flex items-center gap-1">
                                    {enrollments.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : link.url
                                                        ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                                                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
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
