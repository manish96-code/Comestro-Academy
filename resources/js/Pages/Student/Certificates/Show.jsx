import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    Award,
    ShieldCheck,
    CheckCircle2
} from 'lucide-react';

export default function CertificateShow({ certificate }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Certificate #{certificate.certificate_number}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {certificate.course.title}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Certificate - ${certificate.certificate_number}`} />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* 1. Print Toolbar (Hidden during Print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                    <Link
                        href={route('student.certificates.index')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to My Certificates
                    </Link>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Print Styles */}
                <style>{`
                    @media print {
                        @page {
                            size: landscape A4;
                            margin: 10mm;
                        }
                        header, nav, aside, footer, .print\\:hidden {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                            color: #0f172a !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .print\\:border-none {
                            border: none !important;
                        }
                        .print\\:p-0 {
                            padding: 0 !important;
                        }
                        .certificate-canvas {
                            box-shadow: none !important;
                            border: 3px double #d97706 !important;
                            page-break-inside: avoid !important;
                        }
                    }
                `}</style>

                {/* 2. Official Certificate Canvas */}
                <div className="certificate-canvas bg-white text-slate-900 rounded-lg border-4 border-double border-amber-600/60 p-8 sm:p-12 md:p-16 shadow-lg relative overflow-hidden select-none">
                    {/* Corner Ornate Accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-700 m-2 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-700 m-2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-amber-700 m-2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-700 m-2 pointer-events-none" />

                    {/* Watermark Emblem in Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <Award className="w-96 h-96 text-slate-900" />
                    </div>

                    <div className="relative z-10 text-center space-y-6 sm:space-y-8">
                        {/* Header Institution */}
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 text-indigo-900 font-extrabold tracking-widest text-sm uppercase">
                                <Award className="w-5 h-5 text-amber-600" />
                                Comestro Academy of Technology
                            </div>
                            <div className="h-0.5 w-24 bg-amber-600/70 mx-auto" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-wider text-slate-900 uppercase">
                                Certificate of Completion
                            </h1>
                            <p className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-amber-700">
                                Official Verification of Academic & Engineering Mastery
                            </p>
                        </div>

                        {/* Presentation Text */}
                        <div className="space-y-3 pt-2">
                            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider">
                                This credential certifies that
                            </p>
                            <div className="py-2 border-b-2 border-amber-500/40 max-w-lg mx-auto">
                                <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-wide text-slate-950 capitalize">
                                    {certificate.student.name}
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2">
                                has successfully fulfilled 100% of all required lectures, demonstrated theoretical depth through comprehensive examinations, and built and passed all practical production capstones in
                            </p>
                            <h3 className="text-xl sm:text-3xl font-serif font-bold text-indigo-950">
                                {certificate.course.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                Curriculum Category: {certificate.course.category || 'Software Engineering'} • Track Duration: {certificate.course.duration || 'Self-paced'}
                            </p>
                        </div>

                        {/* Signatures & Seal Section */}
                        <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 border-t border-slate-200/80">
                            {/* Left: Faculty Signature */}
                            <div className="space-y-1 text-center sm:text-left">
                                <div className="font-serif italic text-lg sm:text-xl text-slate-800 border-b border-slate-300 pb-1 inline-block min-w-[160px]">
                                    {certificate.course.instructor_name}
                                </div>
                                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                    Lead Instructor
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    Faculty of Computer Science
                                </div>
                            </div>

                            {/* Center: Gold Seal Emblem */}
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-500 bg-amber-50 flex items-center justify-center shadow-inner relative">
                                    <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-amber-600" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                                    Official Seal
                                </div>
                                <div className="text-[9px] text-slate-400 font-mono">
                                    Verified Credential
                                </div>
                            </div>

                            {/* Right: Academic Board Signature */}
                            <div className="space-y-1 text-center sm:text-right">
                                <div className="font-serif italic text-lg sm:text-xl text-slate-800 border-b border-slate-300 pb-1 inline-block min-w-[160px]">
                                    Academic Board
                                </div>
                                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                    Director of Academics
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    Comestro Academy Board
                                </div>
                            </div>
                        </div>

                        {/* Footer Verification Meta */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
                            <div>
                                Certificate ID: <strong className="text-slate-800">{certificate.certificate_number}</strong>
                            </div>
                            <div>
                                Issue Date: <strong className="text-slate-800">{certificate.issued_at}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </StudentLayout>
    );
}
