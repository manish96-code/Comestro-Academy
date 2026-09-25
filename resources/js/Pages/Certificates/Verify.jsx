import { Head, useForm } from '@inertiajs/react';
import {
    ShieldCheck,
    ShieldAlert,
    Award,
    CheckCircle2,
    User,
    BookOpen,
    Search,
    Check
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CertificateVerify({
    searched = false,
    found = false,
    searched_code = '',
    searched_name = '',
    certificate = null,
    error_message = null
}) {
    const { data, setData, post, processing, errors } = useForm({
        certificate_number: searched_code || '',
        student_name: searched_name || '',
    });

    const handleVerify = (e) => {
        e.preventDefault();
        const targetUrl = typeof route === 'function' ? route('certificates.verify.check') : '/verify-certificate';
        post(targetUrl, {
            preserveScroll: true,
        });
    };

    return (
        <PublicLayout
            activeNav="verify"
            containerClassName="max-w-3xl mx-auto px-4 sm:px-6"
            mainClassName="pt-24 sm:pt-28 pb-16 flex-1 flex flex-col justify-center"
        >
            <Head title={found && certificate ? `Verified: ${certificate.student_name} - Comestro Academy` : 'Verify Certificate - Comestro Academy'} />

            <div className="space-y-6 w-full my-auto">
                {/* Search & Verification Input Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Verify Certificate Authenticity
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                            Enter the official Certificate Number and the Student's Full Name as printed on the credential to verify its validity.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Certificate Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.certificate_number}
                                    onChange={(e) => setData('certificate_number', e.target.value)}
                                    placeholder="e.g. CA-2026-CKOQNE"
                                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono tracking-wider focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                                {errors.certificate_number && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.certificate_number}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Student Full Name <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.student_name}
                                    onChange={(e) => setData('student_name', e.target.value)}
                                    placeholder="e.g. Rahul Verma"
                                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {errors.student_name && (
                                    <p className="mt-1 text-xs text-rose-500">{errors.student_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition disabled:opacity-50 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                                {processing ? 'Verifying Credential...' : 'Verify Credential'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result Section: Verified Certificate */}
                {searched && found && certificate && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in duration-300">
                        {/* Status Header */}
                        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 sm:p-8 text-white text-center space-y-2">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                                Authenticated & Verified Credential
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Official Certificate of Completion
                            </h2>
                            <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
                                This credential has been officially verified and issued by Comestro Academy of Technology.
                            </p>
                        </div>

                        {/* Certificate Snapshot Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-indigo-500" /> Student Name
                                    </span>
                                    <p className="text-base font-bold text-slate-900 dark:text-white capitalize">
                                        {certificate.student_name}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-amber-500" /> Certificate Identifier
                                    </span>
                                    <p className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                        {certificate.certificate_number}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                                <div className="space-y-1">
                                    <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Course Program
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {certificate.course_title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Track: {certificate.course_category || 'Software Engineering'} • Duration: {certificate.course_duration || 'Self-paced'}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Issue Date</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {certificate.issued_at}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Faculty</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {certificate.instructor_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Credential Status</span>
                                        <span className={`font-semibold inline-flex items-center gap-1 ${
                                            certificate.is_valid
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-rose-600 dark:text-rose-400'
                                        }`}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {certificate.is_valid ? 'Active & Valid' : 'Revoked'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Guarantee */}
                            <div className="text-center pt-2 space-y-1 text-xs text-slate-400">
                                <p>
                                    This certificate affirms that the recipient has completed 100% of curriculum coursework and passed all examinations.
                                </p>
                                <p className="font-mono text-[11px]">
                                    Comestro Academy Public Verification Registry
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Section: Certificate Not Found / Mismatch Error */}
                {searched && !found && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/50 p-6 sm:p-8 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Verification Failed
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            {error_message || `No active credential could be verified matching certificate number "${searched_code}".`}
                        </p>
                        <p className="text-xs text-slate-400">
                            Please check both the Certificate Number and the Student Name for any spelling errors.
                        </p>
                    </div>
                )}

                {/* Initial Guidance Card (Before Searching) */}
                {!searched && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Tamper-Proof
                            </span>
                            <p>Every certificate is cryptographically assigned a unique ID in our central registrar.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-indigo-500" /> Direct Verification
                            </span>
                            <p>Employers and institutions can verify authentic course completion and exam scores.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-blue-500" /> Privacy Protected
                            </span>
                            <p>Verification requires matching both the Certificate ID and the Student's Full Name.</p>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
