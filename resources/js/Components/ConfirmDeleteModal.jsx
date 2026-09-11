import { AlertCircle } from 'lucide-react';

/**
 * Reusable delete confirmation modal.
 *
 * @param {boolean}  isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string}   title
 * @param {string|React.ReactNode} message
 * @param {string}   confirmText
 * @param {boolean}  processing
 */
export default function ConfirmDeleteModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message = 'Are you sure? This action cannot be undone.',
    confirmText = 'Yes, Delete',
    processing = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
                {/* Icon */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3 border border-rose-100">
                    <AlertCircle className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>

                {/* Message */}
                <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {typeof message === 'string' ? <p>{message}</p> : message}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-center gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition disabled:opacity-50"
                    >
                        {processing ? 'Deleting...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
