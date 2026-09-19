import ConfirmModal from '@/Components/ConfirmModal';

/**
 * Reusable delete confirmation modal (wraps ConfirmModal for backwards compatibility).
 */
export default function ConfirmDeleteModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message = 'Are you sure? This action cannot be undone.',
    confirmText = 'Yes, Delete',
    cancelText = 'Cancel',
    processing = false,
}) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            processing={processing}
            variant="danger"
        />
    );
}

