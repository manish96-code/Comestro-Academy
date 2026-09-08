import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';

export default function InstructorCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'active',
        designation: '',
        qualification: '',
        expertise: '',
        experience_years: 0,
        bio: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.instructors.store'));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            Add New Instructor
                        </h1>
                        <p className="text-xs text-gray-500">
                            Create a new instructor account for Comestro Academy
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
            <Head title="Add New Instructor" />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Instructor Information</h3>
                                <p className="text-xs text-gray-500">Fill in account and professional details below</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Personal & Account Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Dr. Rajesh Sharma"
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
                                        placeholder="10-digit mobile number"
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
                                        placeholder="instructor@example.com"
                                    />
                                    <InputError className="mt-1.5" message={errors.email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Account Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Min. 8 characters"
                                    />
                                    <InputError className="mt-1.5" message={errors.password} />
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="pt-4 border-t border-gray-100 space-y-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Professional Details</h4>

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
                                        placeholder="Brief introduction about the instructor's background and achievements..."
                                    ></textarea>
                                    <InputError className="mt-1.5" message={errors.bio} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Account Status" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition sm:w-1/2"
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
                                    <span>Create Instructor Account</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
