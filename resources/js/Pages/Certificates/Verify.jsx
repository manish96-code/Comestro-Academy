import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    ShieldAlert,
    Award,
    CheckCircle2,
    Calendar,
    User,
    BookOpen,
    GraduationCap,
    ArrowLeft
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function CertificateVerify({ found, searched_code, certificate }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
            <Head title={found ? `Verified: ${certificate.student_name} - Comestro Academy` : 'Certificate Verification'} />

            {/* Top Navigation Bar */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 sm:px-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="w-8 h-8 fill-current text-indigo-600" />
                    <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                        Comestro Academy
                    </span>
                </Link>

                <div className="flex items-center gap-3 text-xs">
                    <Link
                        href={route('courses.index')}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition hidden sm:inline"
                    >
                        Browse Courses
                    </Link>
                    <Link
                        href={route('login')}
                        className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                        Student Portal
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl w-full mx-auto p-4 sm:p-8 my-auto space-y-6">
                {found && certificate ? (
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {/* Status Header */}
                        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 sm:p-8 text-white text-center space-y-2">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                                Authenticated & Verified Credential
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Official Certificate of Completion
                            </h1>
                            <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
                                This credential has been officially verified and issued by Comestro Academy of Technology.
                            </p>
                        </div>

                        {/* Certificate Snapshot Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-indigo-500" /> Graduate Name
                                    </span>
                                    <p className="text-base font-bold text-slate-900 dark:text-white capitalize">
                                        {certificate.student_name}
                                    </p>
                                </div>

                                <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <span className="text-slate-400 font-medium block flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5 text-amber-500" /> Certificate Identifier
                                    </span>
                                    <p className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                        {certificate.certificate_number}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                                <div className="space-y-1">
                                    <span className="text-slate-400 text-xs font-medium block flex items-center gap-1.5">
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
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 shadow-sm">
                        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto text-rose-600">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Certificate Not Found
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            No active credential could be located matching identifier{' '}
                            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-800 dark:text-slate-200">
                                {searched_code}
                            </code>
                            . Please check the reference code and try again.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Comestro Academy
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-6 px-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                © {new Date().getFullYear()} Comestro Academy of Technology. All rights reserved.
            </footer>
        </div>
    );
}
