import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';
import SearchBar from '@/Components/SearchBar';
import FilterSelect from '@/Components/FilterSelect';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Ticket,
    Plus,
    Sparkles,
    CheckCircle2,
    Copy,
    Check,
    Edit3,
    Trash2,
    DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CouponIndex({ coupons = { data: [] }, stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [copiedCode, setCopiedCode] = useState(null);

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        couponId: null,
        couponCode: '',
    });

    const handleFilter = (newSearch, newStatus) => {
        router.get(
            route('admin.coupons.index'),
            {
                search: newSearch !== undefined ? newSearch : search,
                status: newStatus !== undefined ? newStatus : status,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Coupon code '${code}' copied!`);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleToggleStatus = (couponId) => {
        router.patch(
            route('admin.coupons.toggle-status', couponId),
            {},
            { preserveScroll: true }
        );
    };

    const handleDeleteCoupon = () => {
        if (!deleteModal.couponId) return;

        router.delete(route('admin.coupons.destroy', deleteModal.couponId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, couponId: null, couponCode: '' });
            },
        });
    };

    const isExpired = (expiresAt) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                Coupons & Promotion Codes
                            </h1>
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                                {stats.total || 0} TOTAL
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Create promotional discounts, limit redemptions, and target specific cohorts
                        </p>
                    </div>

                    <Link
                        href={route('admin.coupons.create')}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition shrink-0 cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Coupon</span>
                    </Link>
                </div>
            }
        >
            <Head title="Coupons & Discounts - Admin" />

            <div className="py-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Metric Highlights */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                            <div className="p-2.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60">
                                <Ticket className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white leading-none font-mono">
                                    {stats.total || 0}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Promo Codes</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                            <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-none font-mono">
                                    {stats.active || 0}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active & Redeemable</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                            <div className="p-2.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/60">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white leading-none font-mono">
                                    {stats.total_redemptions || 0}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Redemptions</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                            <div className="p-2.5 rounded-md bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800/60">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white leading-none font-mono">
                                    ₹{Number(stats.total_discount_given || 0).toLocaleString('en-IN')}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Savings Given</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 shadow-2xs">
                        <SearchBar
                            onSubmit={() => handleFilter(search, status)}
                            containerClassName="max-w-sm"
                            placeholder="Search by code, title, description..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleFilter(e.target.value, status);
                            }}
                            onClear={() => {
                                setSearch('');
                                handleFilter('', status);
                            }}
                        />

                        <div className="flex items-center gap-2">
                            <FilterSelect
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilter(search, e.target.value);
                                }}
                                placeholder="All Statuses"
                                options={[
                                    { value: 'active', label: 'Active Codes' },
                                    { value: 'inactive', label: 'Inactive / Disabled' },
                                    { value: 'expired', label: 'Expired' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Coupons Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                        {coupons.data && coupons.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                            <th className="py-3 px-4">Coupon Code</th>
                                            <th className="py-3 px-4">Discount Value</th>
                                            <th className="py-3 px-4">Scope</th>
                                            <th className="py-3 px-4">Redemptions</th>
                                            <th className="py-3 px-4">Validity</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                        {coupons.data.map((item) => {
                                            const expired = isExpired(item.expires_at);
                                            const usagePercent = item.max_uses
                                                ? Math.min(100, Math.round((item.used_count / item.max_uses) * 100))
                                                : null;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                                                >
                                                    {/* Code */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-mono font-bold text-xs tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
                                                                    {item.code}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopyCode(item.code)}
                                                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded transition"
                                                                    title="Copy code"
                                                                >
                                                                    {copiedCode === item.code ? (
                                                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                                    ) : (
                                                                        <Copy className="h-3.5 w-3.5" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            {item.name && (
                                                                <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                                                                    {item.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Discount Value */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="space-y-0.5">
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1 font-mono">
                                                                {item.discount_type === 'percentage' ? (
                                                                    <span>{item.discount_value}% OFF</span>
                                                                ) : (
                                                                    <span>₹{Number(item.discount_value).toLocaleString('en-IN')} OFF</span>
                                                                )}
                                                            </div>
                                                            {item.discount_type === 'percentage' && item.max_discount_amount && (
                                                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                    Capped at ₹{Number(item.max_discount_amount).toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                            {Number(item.min_order_amount) > 0 && (
                                                                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                                                    Min order: ₹{Number(item.min_order_amount).toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Course Scope */}
                                                    <td className="py-3.5 px-4">
                                                        {item.applies_to_all_courses ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                                All Courses
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                                {item.courses_count || 0} Specific {item.courses_count === 1 ? 'Course' : 'Courses'}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Usage Limit & Progress */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="space-y-1 max-w-[120px]">
                                                            <div className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300">
                                                                {item.used_count} / {item.max_uses ? item.max_uses : '∞'}
                                                            </div>
                                                            {usagePercent !== null && (
                                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all ${
                                                                            usagePercent >= 100
                                                                                ? 'bg-rose-500'
                                                                                : usagePercent >= 75
                                                                                ? 'bg-amber-500'
                                                                                : 'bg-indigo-600'
                                                                        }`}
                                                                        style={{ width: `${usagePercent}%` }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Validity */}
                                                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                                                        {item.expires_at ? (
                                                            <div className="space-y-0.5">
                                                                <div>Till {new Date(item.expires_at).toLocaleDateString()}</div>
                                                                {expired && (
                                                                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">
                                                                        Expired
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                                                                No expiration
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Status Toggle */}
                                                    <td className="py-3.5 px-4 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(item.id)}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                                                                !item.is_active
                                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                                                    : expired
                                                                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/60'
                                                            }`}
                                                            title="Click to toggle active status"
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${
                                                                    !item.is_active
                                                                        ? 'bg-slate-400'
                                                                        : expired
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-emerald-500'
                                                                }`}
                                                            />
                                                            <span>{!item.is_active ? 'Disabled' : expired ? 'Expired' : 'Active'}</span>
                                                        </button>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link
                                                                href={route('admin.coupons.edit', item.id)}
                                                                className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                                title="Edit Coupon"
                                                            >
                                                                <Edit3 className="h-3.5 w-3.5" />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeleteModal({
                                                                        isOpen: true,
                                                                        couponId: item.id,
                                                                        couponCode: item.code,
                                                                    })
                                                                }
                                                                className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                                                title="Delete Coupon"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        No coupons found
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                        Create promotional codes to offer seasonal discounts, referral perks, and scholarships.
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.coupons.create')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-2xs transition"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Create First Coupon</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {coupons.links && coupons.links.length > 3 && (
                        <div className="pt-2">
                            <Pagination links={coupons.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Coupon Code"
                message={`Are you sure you want to delete coupon '${deleteModal.couponCode}'? Existing enrollments and invoices will retain their historical record, but future checkouts will no longer be able to redeem this code.`}
                confirmText="Delete Coupon"
                confirmVariant="danger"
                onConfirm={handleDeleteCoupon}
                onClose={() => setDeleteModal({ isOpen: false, couponId: null, couponCode: '' })}
            />
        </AdminLayout>
    );
}
