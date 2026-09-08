import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import {
    User,
    Calendar,
    Clock,
    Save,
    GraduationCap,
    ExternalLink
} from 'lucide-react';

export default function StudentShow({ student }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        status: student.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.students.update', student.id));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        Student Profile Details
                    </h1>
                    <p className="text-xs text-gray-500">
                        Viewing and editing profile details for {student.name}
                    </p>
                </div>
            }
        >
            <Head title={`Student - ${student.name}`} />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Top Student Banner Card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl border border-indigo-700 shrink-0 shadow-xs">
                                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
                                <p className="text-xs text-gray-500">Student ID: #{student.id}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1.5">
                            <div>{getStatusBadge(data.status)}</div>
                            <div className="flex flex-col sm:items-end text-[11px] text-gray-500 gap-1">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    Joined: {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    Last Login: {student.last_login_at ? new Date(student.last_login_at).toLocaleString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Student Details Form */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Edit Student Information</h3>
                                <p className="text-xs text-gray-500">Modify profile info and status below</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-1.5" message={errors.name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Phone Number" />
                                    <TextInput
                                        id="phone"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Mobile number"
                                    />
                                    <InputError className="mt-1.5" message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-1.5" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Account Status" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-start">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>Update Student Profile</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Academic & Professional Background Card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs space-y-4">
                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Academic & Professional Background</h3>
                                <p className="text-xs text-gray-500">College qualifications and developer portfolio submitted by student</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qualification</p>
                                <p className="text-xs font-bold text-gray-900 mt-1">{student.qualification || 'Not specified'}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">College / Institute</p>
                                <p className="text-xs font-bold text-gray-900 mt-1">{student.college_name || 'Not specified'}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                                <p className="text-xs font-bold text-gray-900 mt-1">
                                    {student.city || student.state ? `${student.city || ''}${student.city && student.state ? ', ' : ''}${student.state || ''}` : 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">GitHub Profile</p>
                                {student.github_url ? (
                                    <a
                                        href={student.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.github_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">Not linked</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">LinkedIn Profile</p>
                                {student.linkedin_url ? (
                                    <a
                                        href={student.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.linkedin_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">Not linked</p>
                                )}
                            </div>
                        </div>

                        {student.bio && (
                            <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200 mt-3">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Student Bio</p>
                                <p className="text-xs text-gray-700 mt-1 leading-relaxed">{student.bio}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
