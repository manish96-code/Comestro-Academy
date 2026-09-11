import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    UserCheck,
    Calendar,
    Clock,
    Save,
    ArrowLeft,
    Briefcase,
    GraduationCap,
    Shield,
    Mail,
    Phone,
    Key
} from 'lucide-react';

export default function InstructorShow({ instructor }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: instructor.name || '',
        email: instructor.email || '',
        phone: instructor.phone || '',
        status: instructor.status || 'active',
        password: '',
        designation: instructor.designation || '',
        qualification: instructor.qualification || '',
        expertise: instructor.expertise || '',
        experience_years: instructor.experience_years || 0,
        bio: instructor.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.instructors.update', instructor.id));
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
                            Instructor Profile
                        </h1>
                        <p className="text-xs text-slate-500">
                            Faculty profile settings and curriculum management for {instructor.name}
                        </p>
                    </div>
                    <Link
                        href={route('admin.instructors.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Instructors</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Instructor - ${instructor.name}`} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Top Instructor Banner Card */}
                    <div className="rounded-xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-100 shrink-0">
                                {instructor.name ? instructor.name.charAt(0).toUpperCase() : 'I'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900">{instructor.name}</h2>
                                    {instructor.designation && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                            {instructor.designation}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 font-mono">
                                    ID: #{instructor.id} {instructor.qualification ? `• ${instructor.qualification}` : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <div>{getStatusBadge(data.status)}</div>
                            <div className="flex flex-col sm:items-end text-[11px] text-slate-400 gap-1 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 text-slate-400" />
                                    Joined: {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    Last Active: {instructor.last_login_at ? new Date(instructor.last_login_at).toLocaleString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Instructor Details Form */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <UserCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Edit Faculty Profile</h3>
                                <p className="text-xs text-slate-500">Update account credentials, status, and professional bio</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Section 1: Personal & Account */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
                                    <Shield className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Personal & Access Details</span>
                                </div>

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
                                            <option value="active">Active (Full access)</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended (Restricted)</option>
                                        </select>
                                        <InputError className="mt-1.5" message={errors.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Professional Profile */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
                                    <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Professional & Academic Details</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="designation" value="Designation / Academic Title" />
                                        <TextInput
                                            id="designation"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            placeholder="e.g. Lead Web Instructor"
                                        />
                                        <InputError className="mt-1.5" message={errors.designation} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="qualification" value="Highest Qualification" />
                                        <TextInput
                                            id="qualification"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.qualification}
                                            onChange={(e) => setData('qualification', e.target.value)}
                                            placeholder="e.g. M.Tech in CS"
                                        />
                                        <InputError className="mt-1.5" message={errors.qualification} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="expertise" value="Expertise / Specialization" />
                                        <TextInput
                                            id="expertise"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.expertise}
                                            onChange={(e) => setData('expertise', e.target.value)}
                                            placeholder="e.g. PHP, Laravel, React, MySQL"
                                        />
                                        <InputError className="mt-1.5" message={errors.expertise} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="experience_years" value="Experience (Years)" />
                                        <TextInput
                                            id="experience_years"
                                            type="number"
                                            min="0"
                                            max="50"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 font-mono"
                                            value={data.experience_years}
                                            onChange={(e) => setData('experience_years', e.target.value)}
                                        />
                                        <InputError className="mt-1.5" message={errors.experience_years} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="bio" value="Bio / Faculty Description" />
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 mt-1 shadow-xs transition"
                                        placeholder="Brief introduction about the instructor's background..."
                                    ></textarea>
                                    <InputError className="mt-1.5" message={errors.bio} />
                                </div>

                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Key className="h-3.5 w-3.5 text-slate-500" />
                                        <InputLabel htmlFor="password" value="Reset Password (Optional)" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 sm:w-1/2 bg-white"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Only fill this if you want to reset this instructor's password.</p>
                                    <InputError className="mt-1.5" message={errors.password} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Saving...' : 'Update Instructor Profile'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
