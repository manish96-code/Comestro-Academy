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
    GraduationCap
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            Instructor Profile Details
                        </h1>
                        <p className="text-xs text-gray-500">
                            Viewing and editing profile details for {instructor.name}
                        </p>
                    </div>
                    <Link
                        href={route('admin.instructors.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Instructors List</span>
                    </Link>
                </div>
            }
        >
            <Head title={`Instructor - ${instructor.name}`} />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Top Instructor Banner Card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl border border-purple-700 shrink-0 shadow-xs">
                                {instructor.name ? instructor.name.charAt(0).toUpperCase() : 'I'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-gray-900">{instructor.name}</h2>
                                    {instructor.designation && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                            {instructor.designation}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Instructor ID: #{instructor.id} {instructor.qualification ? `• ${instructor.qualification}` : ''}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1.5">
                            <div>{getStatusBadge(data.status)}</div>
                            <div className="flex flex-col sm:items-end text-[11px] text-gray-500 gap-1">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    Joined: {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    Last Login: {instructor.last_login_at ? new Date(instructor.last_login_at).toLocaleString() : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Instructor Details Form */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Edit Instructor Profile</h3>
                                <p className="text-xs text-gray-500">Update account credentials and professional details</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Personal Details */}
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

                            {/* Professional Details Section */}
                            <div className="pt-4 border-t border-gray-100 space-y-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Professional Profile</h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <InputLabel htmlFor="designation" value="Designation / Title" />
                                        <TextInput
                                            id="designation"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            placeholder="e.g. Lead Web Instructor"
                                        />
                                        <InputError className="mt-1.5" message={errors.designation} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="qualification" value="Qualification" />
                                        <TextInput
                                            id="qualification"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5"
                                            value={data.qualification}
                                            onChange={(e) => setData('qualification', e.target.value)}
                                            placeholder="e.g. M.Tech in CS"
                                        />
                                        <InputError className="mt-1.5" message={errors.qualification} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <InputLabel htmlFor="expertise" value="Expertise / Specialization" />
                                        <TextInput
                                            id="expertise"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5"
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
                                            className="w-full text-xs sm:text-sm py-2 px-3.5"
                                            value={data.experience_years}
                                            onChange={(e) => setData('experience_years', e.target.value)}
                                        />
                                        <InputError className="mt-1.5" message={errors.experience_years} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="bio" value="Bio / Description" />
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                        placeholder="Brief introduction about the instructor's background..."
                                    ></textarea>
                                    <InputError className="mt-1.5" message={errors.bio} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="New Password (optional)" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 sm:w-1/2"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <InputError className="mt-1.5" message={errors.password} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-start">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>Update Instructor Profile</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
