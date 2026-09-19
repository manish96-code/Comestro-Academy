import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

/**
 * Reusable confirmation modal with variant support (danger, warning, primary, success).
 *
 * @param {boolean}  isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string}   title
 * @param {string|React.ReactNode} message
 * @param {string}   confirmText
 * @param {string}   cancelText
 * @param {boolean}  processing
 * @param {'danger'|'warning'|'primary'|'success'} variant
 */
export default function ConfirmModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    processing = false,
    variant = 'danger',
}) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-900/60 text-rose-600 dark:text-rose-400',
            confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
            icon: AlertCircle,
        },
        warning: {
            iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-100 dark:border-amber-900/60 text-amber-600 dark:text-amber-400',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
            icon: AlertTriangle,
        },
        primary: {
            iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400',
            confirmBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
            icon: Info,
        },
        success: {
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400',
            confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
            icon: CheckCircle2,
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;
    const IconComponent = currentVariant.icon;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 text-center">
                {/* Icon */}
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-3 border ${currentVariant.iconBg}`}>
                    <IconComponent className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {title}
                </h3>

                {/* Message */}
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {typeof message === 'string' ? <p>{message}</p> : message}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-center gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition disabled:opacity-50 cursor-pointer ${currentVariant.confirmBtn}`}
                    >
                        {processing ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
