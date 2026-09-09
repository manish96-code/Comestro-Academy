import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    Shield,
    Sparkles,
    User
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Calculate password strength
    const passwordStrength = useMemo(() => {
        const p = data.password || '';
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p) || /[a-z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;

        if (p.length === 0) return { score: 0, label: '', color: 'bg-gray-200' };
        if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
        if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
        if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
    }, [data.password]);

    return (
        <GuestLayout>
            <Head title="Create Account | Comestro Academy" />

            <div className="space-y-6">
                {/* Form Header */}
                <div className="space-y-2 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="h-3 w-3" />
                        <span>Start Learning Today</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        Create Your Account
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-500">
                        Join 12,000+ developers building career-ready skills in software engineering.
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" className="text-xs font-bold text-gray-700" />
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <User className="h-4 w-4" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="e.g. Rahul Sharma"
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                    errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                }`}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1.5" />
                    </div>

                    {/* Email Address */}
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
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                    errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                }`}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    {/* Phone Number with +91 Country Indicator */}
                    <div>
                        <InputLabel htmlFor="phone" value="Mobile Phone Number" className="text-xs font-bold text-gray-700" />
                        <div className="relative mt-1 flex rounded-xl shadow-xs">
                            <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-xs sm:text-sm font-semibold select-none">
                                🇮🇳 +91
                            </span>
                            <div className="relative flex-1">
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    placeholder="9876543210"
                                    autoComplete="tel"
                                    maxLength={10}
                                    onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ''))}
                                    className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-r-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
                                        errors.phone ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                    }`}
                                    required
                                />
                            </div>
                        </div>
                        <p className="mt-1 text-[11px] text-gray-400">10-digit mobile number starting with 6, 7, 8, or 9</p>
                        <InputError message={errors.phone} className="mt-1" />
                    </div>

                    {/* Password & Confirm Password Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-xs font-bold text-gray-700" />
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-3.5 w-3.5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    placeholder="Min 8 chars"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full text-xs sm:text-sm pl-9 pr-9 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                        errors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-xs font-bold text-gray-700" />
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="h-3.5 w-3.5" />
                                </div>
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full text-xs sm:text-sm pl-9 pr-9 py-2.5 rounded-xl border bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition shadow-xs ${
                                        errors.password_confirmation ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>
                    </div>

                    {/* Password Strength Meter */}
                    {data.password && (
                        <div className="space-y-1.5 p-2.5 bg-gray-50 rounded-xl border border-gray-200/80">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500">Password Strength:</span>
                                <span className={`font-bold ${
                                    passwordStrength.score >= 3 ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 h-1.5">
                                {[1, 2, 3, 4].map((step) => (
                                    <div
                                        key={step}
                                        className={`rounded-full h-full transition-colors ${
                                            step <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Terms Agreement */}
                    <div className="pt-1">
                        <label className="flex items-start cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-0.5 rounded-md border-gray-300 text-emerald-600 shadow-xs focus:ring-emerald-500/30 focus:border-emerald-600 h-4 w-4"
                                required
                            />
                            <span className="ms-2.5 text-[11px] sm:text-xs text-gray-600 leading-tight">
                                I agree to Comestro Academy's{' '}
                                <a href="#" className="font-semibold text-emerald-600 hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="font-semibold text-emerald-600 hover:underline">
                                    Privacy Policy
                                </a>.
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing || !agreedToTerms}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 focus:ring-2 focus:ring-emerald-500/30 shadow-md shadow-emerald-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Free Account</span>
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Bottom Switcher */}
                <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-emerald-600 hover:text-emerald-700 transition underline underline-offset-4"
                        >
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
