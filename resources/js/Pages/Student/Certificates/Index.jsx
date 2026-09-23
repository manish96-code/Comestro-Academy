import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Award,
    Sparkles,
    Check,
    Copy,
    GraduationCap,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CertificateIndex({ earned = [] }) {
    const [copiedCertId, setCopiedCertId] = useState(null);

    const copyVerificationLink = (cert) => {
        navigator.clipboard.writeText(cert.verification_url);
        setCopiedCertId(cert.id);
        toast.success(`Verification link for ${cert.certificate_number} copied!`);
        setTimeout(() => setCopiedCertId(null), 2500);
    };

    return (
        <StudentLayout
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            My Certificates
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            View, print, and share your official graduation certificates of completion
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="My Certificates" />

            <div className="py-6 min-h-[calc(100vh-140px)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                {/* Content: Only display certificates if available */}
                {earned.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-2xs">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            No Certificates Available
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            You haven't earned any certificates yet. Certificates are issued once you complete 100% of a course and pass all exams and assignments.
                        </p>
                        <div className="pt-2">
                            <Link
                                href={route('student.courses.enrolled')}
                                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                            >
                                Go to My Enrolled Courses <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {earned.map((cert) => (
                            <div
                                key={cert.id}
                                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
                            >
                                {/* Certificate Header */}
                                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-5 text-white relative overflow-hidden">
                                    <div className="absolute top-2 right-2 opacity-10">
                                        <Award className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10 space-y-2">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs text-[10px] font-mono font-medium tracking-wider text-amber-300 uppercase">
                                            <Award className="w-3 h-3 text-amber-400" />
                                            {cert.certificate_number}
                                        </div>
                                        <h3 className="text-base font-bold line-clamp-1">
                                            {cert.course_title}
                                        </h3>
                                        <p className="text-xs text-slate-300">
                                            Issued on {cert.issued_at}
                                        </p>
                                    </div>
                                </div>

                                {/* Body Metadata */}
                                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-400">Recipient:</span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {cert.student_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-slate-400">Faculty:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {cert.instructor_name}
                                            </span>
                                        </div>
                                        {cert.final_score && (
                                            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                                                <span className="text-slate-400">Graduation Score:</span>
                                                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {cert.final_score}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex flex-col gap-2">
                                        <Link
                                            href={route('student.certificates.show', cert.id)}
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition"
                                        >
                                            <Award className="w-3.5 h-3.5" />
                                            View & Print Certificate
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => copyVerificationLink(cert)}
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition cursor-pointer"
                                        >
                                            {copiedCertId === cert.id ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    Copied Verification Link!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                                    Share / Verify URL
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </StudentLayout>
    );
}
