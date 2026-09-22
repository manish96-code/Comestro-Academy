import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Ticket,
    Percent,
    DollarSign,
    Calendar,
    ArrowLeft,
    BookOpen,
    Shuffle
} from 'lucide-react';

export default function CouponCreate({ courses = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        max_discount_amount: '',
        min_order_amount: '',
        max_uses: '',
        max_uses_per_user: '1',
        starts_at: '',
        expires_at: '',
        is_active: true,
        applies_to_all_courses: true,
        course_ids: [],
    });

    const generateRandomCode = () => {
        const prefixes = ['SAVE', 'TECH', 'DEV', 'PROMO', 'COHORT', 'FLAT'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setData('code', `${prefix}${randomNum}`);
    };

    const handleCourseToggle = (courseId) => {
        if (data.course_ids.includes(courseId)) {
            setData('course_ids', data.course_ids.filter((id) => id !== courseId));
        } else {
            setData('course_ids', [...data.course_ids, courseId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.coupons.store'));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.coupons.index')}
                        className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Back to Coupons"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Create Promotion Coupon
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Set up discount percentages, redemption quotas, and course applicability rules
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Create Coupon - Admin" />

            <div className="py-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* General Information Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <Ticket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Coupon Identification
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="code" value="Coupon Code *" />
                                    <div className="mt-1 flex items-center gap-2">
                                        <TextInput
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            placeholder="e.g. SUMMER2026"
                                            className="w-full font-mono uppercase font-bold tracking-wider"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateRandomCode}
                                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-md transition shrink-0 cursor-pointer"
                                            title="Generate random coupon code"
                                        >
                                            <Shuffle className="h-3.5 w-3.5" />
                                            <span>Random</span>
                                        </button>
                                    </div>
                                    <InputError message={errors.code} className="mt-1" />
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                        Students will type this code during course checkout.
                                    </p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="name" value="Campaign / Marketing Name" />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Independence Day Special Discount"
                                        className="mt-1 w-full"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Internal Description / Terms" />
                                <textarea
                                    id="description"
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Optional notes regarding the affiliate, scholarship, or special campaign terms..."
                                    className="mt-1 w-full text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition p-2.5"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>
                        </div>

                        {/* Discount Configuration Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <Percent className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Discount Economics
                                </h2>
                            </div>

                            {/* Discount Type Radio Selector */}
                            <div>
                                <InputLabel value="Discount Method *" />
                                <div className="grid grid-cols-2 gap-3 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setData('discount_type', 'percentage')}
                                        className={`p-3 rounded-md border text-left flex items-start gap-3 transition cursor-pointer ${
                                            data.discount_type === 'percentage'
                                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="p-2 rounded-md bg-white dark:bg-slate-800 shadow-2xs text-indigo-600">
                                            <Percent className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs">Percentage Discount (%)</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Reduces a percentage off the course price (e.g. 20% off)
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('discount_type', 'fixed')}
                                        className={`p-3 rounded-md border text-left flex items-start gap-3 transition cursor-pointer ${
                                            data.discount_type === 'fixed'
                                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-600'
                                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="p-2 rounded-md bg-white dark:bg-slate-800 shadow-2xs text-emerald-600">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs">Fixed Amount Discount (₹)</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Deducts a flat rupee value (e.g. ₹500 off)
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                                <div>
                                    <InputLabel
                                        htmlFor="discount_value"
                                        value={data.discount_type === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                                    />
                                    <TextInput
                                        id="discount_value"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={data.discount_type === 'percentage' ? '100' : undefined}
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        placeholder={data.discount_type === 'percentage' ? 'e.g. 25' : 'e.g. 500'}
                                        className="mt-1 w-full font-mono"
                                    />
                                    <InputError message={errors.discount_value} className="mt-1" />
                                </div>

                                {data.discount_type === 'percentage' && (
                                    <div>
                                        <InputLabel htmlFor="max_discount_amount" value="Maximum Discount Cap (₹)" />
                                        <TextInput
                                            id="max_discount_amount"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.max_discount_amount}
                                            onChange={(e) => setData('max_discount_amount', e.target.value)}
                                            placeholder="e.g. 1500 (Optional)"
                                            className="mt-1 w-full font-mono"
                                        />
                                        <InputError message={errors.max_discount_amount} className="mt-1" />
                                        <p className="text-[10px] text-slate-400 mt-0.5">Leave blank for uncapped percentage</p>
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="min_order_amount" value="Minimum Course Price (₹)" />
                                    <TextInput
                                        id="min_order_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.min_order_amount}
                                        onChange={(e) => setData('min_order_amount', e.target.value)}
                                        placeholder="e.g. 999 (0 for no min)"
                                        className="mt-1 w-full font-mono"
                                    />
                                    <InputError message={errors.min_order_amount} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Usage Limits & Validity Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Redemption Quotas & Timeframe
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <InputLabel htmlFor="max_uses" value="Total Uses Limit" />
                                    <TextInput
                                        id="max_uses"
                                        type="number"
                                        min="1"
                                        value={data.max_uses}
                                        onChange={(e) => setData('max_uses', e.target.value)}
                                        placeholder="e.g. 100 (Blank = ∞)"
                                        className="mt-1 w-full font-mono"
                                    />
                                    <InputError message={errors.max_uses} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="max_uses_per_user" value="Max Uses Per Student *" />
                                    <TextInput
                                        id="max_uses_per_user"
                                        type="number"
                                        min="1"
                                        value={data.max_uses_per_user}
                                        onChange={(e) => setData('max_uses_per_user', e.target.value)}
                                        placeholder="Default 1"
                                        className="mt-1 w-full font-mono"
                                    />
                                    <InputError message={errors.max_uses_per_user} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="starts_at" value="Valid From (Starts At)" />
                                    <TextInput
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) => setData('starts_at', e.target.value)}
                                        className="mt-1 w-full text-xs"
                                    />
                                    <InputError message={errors.starts_at} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="expires_at" value="Valid Until (Expires At)" />
                                    <TextInput
                                        id="expires_at"
                                        type="datetime-local"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                        className="mt-1 w-full text-xs"
                                    />
                                    <InputError message={errors.expires_at} className="mt-1" />
                                </div>
                            </div>
                        </div>

                        {/* Course Applicability Scope Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-4">
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Course Eligibility Scope
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="course_scope"
                                            checked={data.applies_to_all_courses}
                                            onChange={() => setData('applies_to_all_courses', true)}
                                            className="text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <span>All Published Courses</span>
                                    </label>

                                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="course_scope"
                                            checked={!data.applies_to_all_courses}
                                            onChange={() => setData('applies_to_all_courses', false)}
                                            className="text-indigo-600 focus:ring-indigo-500 rounded"
                                        />
                                        <span>Restrict to Specific Courses</span>
                                    </label>
                                </div>

                                {!data.applies_to_all_courses && (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-md border border-slate-200 dark:border-slate-700 space-y-2 max-h-56 overflow-y-auto">
                                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                            Select eligible courses:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {courses.map((course) => {
                                                const isChecked = data.course_ids.includes(course.id);
                                                return (
                                                    <label
                                                        key={course.id}
                                                        className={`flex items-center gap-2.5 p-2 rounded-md border text-xs cursor-pointer transition ${
                                                            isChecked
                                                                ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleCourseToggle(course.id)}
                                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="truncate flex-1 font-medium">{course.title}</span>
                                                        <span className="text-[10px] font-mono text-slate-400">₹{Number(course.price).toLocaleString()}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <InputError message={errors.course_ids} className="mt-1" />
                            </div>
                        </div>

                        {/* Status Toggle & Submit Controls */}
                        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>Active & Immediately Redeemable</span>
                            </label>

                            <div className="flex items-center gap-2.5">
                                <Link
                                    href={route('admin.coupons.index')}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
                                >
                                    Cancel
                                </Link>

                                <PrimaryButton disabled={processing} className="px-5 py-2">
                                    {processing ? 'Creating...' : 'Create Coupon Code'}
                                </PrimaryButton>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
