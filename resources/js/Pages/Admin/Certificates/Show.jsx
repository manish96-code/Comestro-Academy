import AdminLayout from '@/Layouts/AdminLayout';
import CertificateView from '@/Components/CertificateView';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdminCertificateShow({ certificate }) {
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        processing: false,
    });

    const handleConfirmToggle = () => {
        setConfirmModal((prev) => ({ ...prev, processing: true }));
        router.patch(
            route('admin.certificates.toggle-status', certificate.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setConfirmModal({ isOpen: false, processing: false }),
                onError: () => setConfirmModal((prev) => ({ ...prev, processing: false })),
                onFinish: () => setConfirmModal((prev) => ({ ...prev, processing: false })),
            }
        );
    };

    return (
        <AdminLayout
            title={`Certificate #${certificate.certificate_number}`}
            backUrl={route('admin.certificates.index')}
        >
            <Head title={`Certificate - ${certificate.certificate_number}`} />

            <CertificateView certificate={certificate}>
                <button
                    type="button"
                    onClick={() => setConfirmModal({ isOpen: true, processing: false })}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer ${
                        certificate.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                >
                    {certificate.status === 'active' ? (
                        <>
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Revoke Certificate</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Restore Certificate</span>
                        </>
                    )}
                </button>
            </CertificateView>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, processing: false })}
                onConfirm={handleConfirmToggle}
                processing={confirmModal.processing}
                title={certificate.status === 'active' ? 'Revoke Certificate?' : 'Restore Certificate?'}
                message={
                    certificate.status === 'active' ? (
                        <span>
                            Are you sure you want to revoke certificate{' '}
                            <strong className="font-mono text-slate-900 dark:text-white">
                                {certificate.certificate_number}
                            </strong>{' '}
                            issued to{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {certificate.student?.name}
                            </span>?
                        </span>
                    ) : (
                        <span>
                            Are you sure you want to restore certificate{' '}
                            <strong className="font-mono text-slate-900 dark:text-white">
                                {certificate.certificate_number}
                            </strong>{' '}
                            issued to{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {certificate.student?.name}
                            </span>?
                        </span>
                    )
                }
                confirmText={certificate.status === 'active' ? 'Yes, Revoke' : 'Yes, Restore'}
                variant={certificate.status === 'active' ? 'danger' : 'success'}
            />
        </AdminLayout>
    );
}
