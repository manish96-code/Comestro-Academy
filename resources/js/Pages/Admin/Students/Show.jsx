import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    User,
    Calendar,
    Clock,
    Save,
    GraduationCap,
    ExternalLink,
    ArrowLeft,
    Shield,
    Globe,
    Building,
    MapPin
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">
                            Student Profile Details
                        </h1>
                        <p className="text-xs text-slate-500">
                            Academic background, developer links, and account status for {student.name}
                        </p>
                    </div>
                    <Link
                        href={route('admin.students.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Students</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Student - ${student.name}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Top Student Banner Card */}
                    <div className="rounded-xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-100 shrink-0">
                                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900">{student.name}</h2>
                                <p className="text-xs text-slate-500 font-mono">Student ID: #{student.id}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div>{getStatusBadge(data.status)}</div>
                            <div className="flex flex-col sm:items-end text-[11px] text-slate-400 gap-1 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 text-slate-400" />
                                    Registered: {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    Last Active: {student.last_login_at ? new Date(student.last_login_at).toLocaleString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Student Details Form */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Student Account Settings</h3>
                                <p className="text-xs text-slate-500">Update contact info and platform access status</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name *" />
                                    <TextInput
                                        id="name"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
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
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 font-mono"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Mobile number"
                                    />
                                    <InputError className="mt-1.5" message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Address *" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 font-mono"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-1.5" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Account Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-xs transition"
                                    >
                                        <option value="active">Active (Enrolled)</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended (Blocked)</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Saving...' : 'Update Student Profile'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Academic & Professional Background Card */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Academic & Developer Background</h3>
                                <p className="text-xs text-slate-500">College qualifications and portfolio repositories submitted by student</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Qualification</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{student.qualification || 'Not specified'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">College / Institute</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{student.college_name || 'Not specified'}</p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">
                                    {student.city || student.state ? `${student.city || ''}${student.city && student.state ? ', ' : ''}${student.state || ''}` : 'Not specified'}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GitHub Profile</p>
                                {student.github_url ? (
                                    <a
                                        href={student.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.github_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">Not linked</p>
                                )}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LinkedIn Profile</p>
                                {student.linkedin_url ? (
                                    <a
                                        href={student.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 mt-1 inline-flex items-center gap-1 truncate max-w-full"
                                    >
                                        <span className="truncate">{student.linkedin_url}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">Not linked</p>
                                )}
                            </div>
                        </div>

                        {student.bio && (
                            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 mt-3">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Student Bio</p>
                                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{student.bio}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
