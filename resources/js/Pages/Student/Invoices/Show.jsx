import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    CheckCircle2,
    Building2,
    User,
    Calendar,
    CreditCard,
    ShieldCheck,
    FileText,
    Download,
    Terminal,
    Sparkles,
    BookOpen
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
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                            title="Back to Enrolled Courses"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                                    Invoice {invoice.invoice_number}
                                </h1>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                    {invoice.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Issued on {invoice.date} for {invoice.course.title}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('student.invoices.index')}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            All Invoices
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
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
                        color: black !important;
                        font-size: 12pt;
                    }
                    header, nav, aside, .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:m-0 {
                        margin: 0 !important;
                    }
                }
            `}</style>

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Invoice Card */}
                    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden print:shadow-none print:border-gray-300">
                        
                        {/* Top Gradient Banner / Header */}
                        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="relative z-10 space-y-1.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-base shadow-sm">
                                        CA
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                                            {invoice.academy.name}
                                        </h2>
                                        <p className="text-[11px] text-gray-300 font-medium">
                                            {invoice.academy.legal_name}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-indigo-200/90 pt-1 font-mono">
                                    Official Course Enrollment & Fee Receipt
                                </p>
                            </div>

                            <div className="relative z-10 sm:text-right space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider font-mono">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>{invoice.status}</span>
                                </div>
                                <div className="text-sm font-bold font-mono text-white pt-1">
                                    {invoice.invoice_number}
                                </div>
                                <div className="text-xs text-gray-300">
                                    Date: <span className="font-semibold text-white">{invoice.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-8">
                            
                            {/* Billing Entities (Billed By & Billed To) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                                {/* Billed To */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                                        <User className="h-3.5 w-3.5 text-gray-400" />
                                        <span>Billed To (Student)</span>
                                    </div>
                                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-1 text-xs">
                                        <p className="text-sm font-bold text-gray-900">
                                            {invoice.student.name}
                                        </p>
                                        <p className="text-gray-600 flex items-center gap-1">
                                            <span>Email:</span>
                                            <span className="font-medium text-gray-900">{invoice.student.email}</span>
                                        </p>
                                        {invoice.student.phone && invoice.student.phone !== 'Not provided' && (
                                            <p className="text-gray-600 flex items-center gap-1">
                                                <span>Phone:</span>
                                                <span className="font-medium text-gray-900">{invoice.student.phone}</span>
                                            </p>
                                        )}
                                        {(invoice.student.city || invoice.student.state) && (
                                            <p className="text-gray-600">
                                                Location: {[invoice.student.city, invoice.student.state].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-gray-400 font-mono pt-1">
                                            Student Enrollment Ref #{enrollmentId}
                                        </p>
                                    </div>
                                </div>

                                {/* Billed By / Academy Provider */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                        <span>Issued By (Academy)</span>
                                    </div>
                                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-1 text-xs text-gray-600">
                                        <p className="text-sm font-bold text-gray-900">
                                            {invoice.academy.legal_name}
                                        </p>
                                        <p>{invoice.academy.address}</p>
                                        <p>{invoice.academy.city_state_pin}</p>
                                        <div className="pt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-gray-500">
                                            <span>GSTIN: <strong>{invoice.academy.gstin}</strong></span>
                                            <span>PAN: <strong>{invoice.academy.pan}</strong></span>
                                        </div>
                                        <p className="text-[11px] text-indigo-600 font-medium pt-1">
                                            {invoice.academy.email} • {invoice.academy.website}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Itemized Table */}
                            <div className="space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                                    Order Items & Course Enrollment
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold">
                                                <th className="py-3 px-4 w-12 text-center">#</th>
                                                <th className="py-3 px-4">Item & Description</th>
                                                <th className="py-3 px-4 text-center">Format</th>
                                                <th className="py-3 px-4 text-right">Course Fee</th>
                                                <th className="py-3 px-4 text-right">Discount</th>
                                                <th className="py-3 px-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr className="hover:bg-gray-50/50 transition">
                                                <td className="py-4 px-4 text-center font-mono text-gray-400 font-medium">1</td>
                                                <td className="py-4 px-4 space-y-1 max-w-sm">
                                                    <div className="font-bold text-sm text-gray-900">
                                                        {invoice.course.title}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-2">
                                                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium font-mono text-[10px]">
                                                            {invoice.course.category}
                                                        </span>
                                                        <span>Mentor: <strong>{invoice.course.instructor_name}</strong></span>
                                                        <span>• Duration: {invoice.course.duration}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-gray-100 text-gray-700 font-mono">
                                                        {invoice.course.type}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right font-mono text-gray-600">
                                                    ₹{Number(invoice.course.original_price).toFixed(2)}
                                                </td>
                                                <td className="py-4 px-4 text-right font-mono text-emerald-600">
                                                    {invoice.course.discount_price !== null && invoice.course.discount_price < invoice.course.original_price
                                                        ? `-₹${(Number(invoice.course.original_price) - Number(invoice.course.discount_price)).toFixed(2)}`
                                                        : '₹0.00'}
                                                </td>
                                                <td className="py-4 px-4 text-right font-mono font-bold text-gray-900">
                                                    {isFree ? 'FREE' : `₹${Number(invoice.amount).toFixed(2)}`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment Summary & Transaction Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                
                                {/* Payment Metadata Box */}
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                        <CreditCard className="h-4 w-4 text-indigo-600" />
                                        <span>Payment Details</span>
                                    </div>
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between text-gray-600">
                                            <span>Payment Method:</span>
                                            <span className="font-semibold text-gray-900">{invoice.payment_method}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-600">
                                            <span>Transaction Ref:</span>
                                            <span className="font-mono text-[11px] font-semibold text-indigo-600 truncate max-w-[200px]" title={invoice.transaction_id}>
                                                {invoice.transaction_id}
                                            </span>
                                        </div>
                                        {invoice.order_id && (
                                            <div className="flex items-center justify-between text-gray-600">
                                                <span>Gateway Order ID:</span>
                                                <span className="font-mono text-[11px] text-gray-700 truncate max-w-[200px]">
                                                    {invoice.order_id}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-gray-600">
                                            <span>Payment Timestamp:</span>
                                            <span className="text-gray-700 font-mono text-[11px]">{invoice.date} {invoice.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-600 pt-1 border-t border-gray-200/60">
                                            <span>Status:</span>
                                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Verified & Completed
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Total Calculation */}
                                <div className="space-y-2 self-center">
                                    <div className="space-y-2 text-xs text-gray-600 px-2">
                                        <div className="flex justify-between">
                                            <span>Standard Course Fee:</span>
                                            <span className="font-mono text-gray-900">
                                                ₹{Number(invoice.course.original_price).toFixed(2)}
                                            </span>
                                        </div>
                                        {invoice.course.discount_price !== null && invoice.course.discount_price < invoice.course.original_price && (
                                            <div className="flex justify-between text-emerald-600">
                                                <span>Discount Applied:</span>
                                                <span className="font-mono">
                                                    -₹{(Number(invoice.course.original_price) - Number(invoice.course.discount_price)).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Taxes & GST (0% / Education):</span>
                                            <span className="font-mono text-gray-900">₹0.00</span>
                                        </div>
                                    </div>

                                    {/* Final Total Banner */}
                                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between text-indigo-950">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider font-mono">
                                                Total Amount Paid
                                            </div>
                                            <div className="text-[10px] text-indigo-600 font-medium">
                                                Inclusive of all platform fees
                                            </div>
                                        </div>
                                        <div className="text-xl sm:text-2xl font-black font-mono text-indigo-700">
                                            {isFree ? 'FREE' : `₹${Number(invoice.amount).toFixed(2)}`}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Sign-off & Verification Seal */}
                            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-gray-400">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-600 font-medium">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                        <span>Authenticated Electronic Course Invoice</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400">
                                        This is a computer-generated tax invoice issued by Comestro Academy. No signature required.
                                    </p>
                                </div>

                                <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg px-3 py-1.5 text-emerald-700 text-[11px] font-mono font-semibold flex items-center gap-1.5 shrink-0">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>PAYMENT VERIFIED</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Action Footer for screen users */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
                        <Link
                            href={route('student.courses.learn', invoice.course.id)}
                            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold transition"
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Continue Learning this course</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition cursor-pointer"
                            >
                                <Printer className="h-4 w-4" />
                                <span>Print / Download Invoice PDF</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}
