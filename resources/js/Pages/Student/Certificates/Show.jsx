import StudentLayout from "@/Layouts/StudentLayout";
import CertificateView from "@/Components/CertificateView";
import { Head } from "@inertiajs/react";

export default function CertificateShow({ certificate }) {
    return (
        <StudentLayout
            title={`Certificate #${certificate.certificate_number}`}
            backUrl={route("student.certificates.index")}
        >
            <Head title={`Certificate - ${certificate.certificate_number}`} />
            <CertificateView certificate={certificate} />
        </StudentLayout>
    );
}
