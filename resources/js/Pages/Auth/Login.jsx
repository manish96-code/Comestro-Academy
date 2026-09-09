import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    GraduationCap,
    Lock,
    Mail,
    Shield,
    Sparkles,
    UserCheck,
    Users
} from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [activeDemo, setActiveDemo] = useState(null);
    const [demoLoading, setDemoLoading] = useState(null);
    const [demoOpen, setDemoOpen] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Instant auto-login as selected demo role
    const loginAsDemo = (role, email, pass) => {
        setData({
            email: email,
            password: pass,
            remember: false,
        });
        setActiveDemo(role);
        setDemoLoading(role);

        router.post(
            route('login'),
            {
                email: email,
                password: pass,
                remember: false,
            },
            {
                onFinish: () => setDemoLoading(null),
            }
        );
    };

    return (
        <GuestLayout>
            <Head title="Sign In | Comestro Academy" />

            <div className="space-y-6">
                {/* Form Header */}
                <div className="space-y-2 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="h-3 w-3" />
                        <span>Welcome Back</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Sign In to Your Account
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-500">
                        Access your enrolled courses, projects, assignments, and faculty portal.
                    </p>
                </div>

                {/* Session Status Alert */}
                {status && (
                    <div className="p-3.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="text-xs font-bold text-gray-700" />

                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="name@example.com"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                    errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                }`}
                                required
                            />
                        </div>

                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-gray-700" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                    errors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded-md border-gray-300 text-emerald-600 shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 h-4 w-4"
                            />
                            <span className="ms-2 text-xs text-gray-600 font-medium">
                                Keep me signed in
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 focus:ring-2 focus:ring-emerald-500/30 shadow-md shadow-emerald-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Bottom Switcher */}
                <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-600">
                        Don't have an account yet?{' '}
                        <Link
                            href={route('register')}
                            className="font-bold text-emerald-600 hover:text-emerald-700 transition underline underline-offset-4"
                        >
                            Create a free student account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Fixed Bottom-Right Demo Login Dock */}
            <div className="fixed bottom-5 right-5 z-50">
                {demoOpen ? (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/90 p-3.5 shadow-2xl shadow-slate-900/15 max-w-xs transition-all animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-gray-100">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Demo Logins</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                                    Instant Sign In
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setDemoOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition"
                                    title="Minimize demo panel"
                                >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                            <button
                                type="button"
                                disabled={demoLoading !== null || processing}
                                onClick={() => loginAsDemo('admin', 'manish@gmail.com', '123456789')}
                                className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                                    activeDemo === 'admin'
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                                title="Auto Login as Admin: manish@gmail.com"
                            >
                                {demoLoading === 'admin' ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Shield className="h-3 w-3 shrink-0" />
                                )}
                                <span>Admin</span>
                            </button>

                            <button
                                type="button"
                                disabled={demoLoading !== null || processing}
                                onClick={() => loginAsDemo('instructor', 'rajesh@example.com', '123456789')}
                                className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                                    activeDemo === 'instructor'
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                                title="Auto Login as Faculty: rajesh@example.com"
                            >
                                {demoLoading === 'instructor' ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <UserCheck className="h-3 w-3 shrink-0" />
                                )}
                                <span>Faculty</span>
                            </button>

                            <button
                                type="button"
                                disabled={demoLoading !== null || processing}
                                onClick={() => loginAsDemo('student', 'rahul@example.com', '123456789')}
                                className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                                    activeDemo === 'student'
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                                title="Auto Login as Student: rahul@example.com"
                            >
                                {demoLoading === 'student' ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                )}
                                <span>Student</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setDemoOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-gray-200 text-xs font-bold text-gray-700 shadow-xl shadow-slate-900/10 hover:border-emerald-500 hover:text-emerald-600 transition"
                        title="Open Demo Logins"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Demo Logins</span>
                        <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                )}
            </div>
        </GuestLayout>
    );
}
