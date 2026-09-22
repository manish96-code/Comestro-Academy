import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    CheckCircle2,
    BookOpen,
} from 'lucide-react';

export default function InvoiceShow({ invoice, enrollmentId }) {
    const handlePrint = () => {
        window.print();
    };

    const isFree = Number(invoice.amount) <= 0;

    return (
        <StudentLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('student.courses.enrolled')}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition"
                            title="Back to Enrolled Courses"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                    Invoice {invoice.invoice_number}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    {invoice.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Issued on {invoice.date} for {invoice.course.title}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('student.invoices.index')}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs transition"
                        >
                            All Invoices
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-2xs transition cursor-pointer"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print / Save PDF</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number} - Comestro Academy`} />

            {/* Print Styling Fixes */}
            <style>{`
                @media print {
                    body {
                        background: white !important;
                        color: #0f172a !important;
                        font-size: 11pt;
                    }
                    header, nav, aside, .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:border-none {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                }
            `}</style>

            <div className="py-6 min-h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-950">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                    {/* Invoice Paper Card (Clean, minimal, no heavy shadow or border) */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-2xs print:border-none print:p-0 print:bg-white print:text-slate-900">

                        {/* 1. Header: Brand on left, Invoice metadata on right */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                        CA
                                    </div>
                                    <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                        Comestro Academy
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Course Enrollment Receipt</p>
                            </div>

                            <div className="sm:text-right space-y-1 text-xs">
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>{invoice.status}</span>
                                </div>
                                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                    {invoice.invoice_number}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400">
                                    Date: <span className="text-slate-700 dark:text-slate-300 font-medium">{invoice.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Billed To (Clean typography, no bulky box, no Issued By) */}
                        <div className="space-y-1.5">
                            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Billed To
                            </div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {invoice.student.name}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                                <p>{invoice.student.email}</p>
                                {invoice.student.phone && invoice.student.phone !== 'Not provided' && (
                                    <p>{invoice.student.phone}</p>
                                )}
                                {(invoice.student.city || invoice.student.state) && (
                                    <p>{[invoice.student.city, invoice.student.state].filter(Boolean).join(', ')}</p>
                                )}
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono pt-1">
                                    Student Enrollment Ref #{enrollmentId}
                                </p>
                            </div>
                        </div>

                        {/* 3. Items Table (Clean, light lines, no heavy wrapper) */}
                        <div>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                                        <th className="py-2.5 pr-4 font-semibold">Course / Item</th>
                                        <th className="py-2.5 px-3 text-center font-semibold">Format</th>
                                        <th className="py-2.5 px-3 text-right font-semibold">Course Fee</th>
                                        <th className="py-2.5 px-3 text-right font-semibold">Discount</th>
                                        <th className="py-2.5 pl-4 text-right font-semibold">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr>
                                        <td className="py-4 pr-4 space-y-1">
                                            <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                                {invoice.course.title}
                                            </div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5">
                                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{invoice.course.category}</span>
                                                <span>•</span>
                                                <span>Mentor: {invoice.course.instructor_name}</span>
                                                {invoice.course.duration && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{invoice.course.duration}</span>
                                                    </>
                                                )}
                                            </div>
                                            {invoice.course.batch && (
                                                <div className="pt-0.5">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-mono">
                                                        <span>Live Batch: {invoice.course.batch.time_slot}</span>
                                                        <span className="text-slate-500 dark:text-slate-400 font-normal">({invoice.course.batch.batch_name})</span>
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-center align-top whitespace-nowrap">
                                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                                                {invoice.course.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-right align-top font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            ₹{Number(invoice.course.original_price).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-3 text-right align-top font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                            {invoice.course.discount_price !== null && invoice.course.discount_price < invoice.course.original_price
                                                ? `-₹${(Number(invoice.course.original_price) - Number(invoice.course.discount_price)).toFixed(2)}`
                                                : '₹0.00'}
                                        </td>
                                        <td className="py-4 pl-4 text-right align-top font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                            {isFree ? 'FREE' : `₹${Number(invoice.amount).toFixed(2)}`}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 4. Payment Details & Financial Totals */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {/* Left: Clean Payment Metadata */}
                            <div className="space-y-2 text-xs">
                                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Payment Details
                                </div>
                                <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between sm:justify-start sm:gap-4">
                                        <span className="text-slate-400 dark:text-slate-500 w-28 shrink-0">Method:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">{invoice.payment_method}</span>
                                    </div>
                                    {invoice.transaction_id && (
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="text-slate-400 dark:text-slate-500 w-28 shrink-0">Transaction Ref:</span>
                                            <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] break-all">{invoice.transaction_id}</span>
                                        </div>
                                    )}
                                    {invoice.order_id && (
                                        <div className="flex justify-between sm:justify-start sm:gap-4">
                                            <span className="text-slate-400 dark:text-slate-500 w-28 shrink-0">Order ID:</span>
                                            <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px] break-all">{invoice.order_id}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between sm:justify-start sm:gap-4">
                                        <span className="text-slate-400 dark:text-slate-500 w-28 shrink-0">Paid At:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">{invoice.date} {invoice.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Clean Financial Summary */}
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Course Fee:</span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">₹{Number(invoice.course.original_price).toFixed(2)}</span>
                                </div>
                                {invoice.course.discount_price !== null && invoice.course.discount_price < invoice.course.original_price && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Course Discount:</span>
                                        <span className="font-mono">-₹{(Number(invoice.course.original_price) - Number(invoice.course.discount_price)).toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.course.coupon_code && invoice.course.coupon_discount && (
                                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-medium">
                                        <span>Coupon Applied ({invoice.course.coupon_code}):</span>
                                        <span className="font-mono">-₹{Number(invoice.course.coupon_discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                    <span>Taxes & GST (0%):</span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">₹0.00</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Total Paid:</span>
                                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                                        {isFree ? 'FREE' : `₹${Number(invoice.amount).toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 5. Minimalist Footer */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                            <p>Computer-generated invoice issued by Comestro Academy. No signature required.</p>
                            <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Payment Verified</span>
                            </div>
                        </div>

                    </div>

                    {/* Action buttons below invoice */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
                        <Link
                            href={route('student.courses.learn', invoice.course.id)}
                            className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition"
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Go to Classroom</span>
                        </Link>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition cursor-pointer shadow-2xs"
                        >
                            <Printer className="h-4 w-4" />
                            <span>Print / Save PDF</span>
                        </button>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
