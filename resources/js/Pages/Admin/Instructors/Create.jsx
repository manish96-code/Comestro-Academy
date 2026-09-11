import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, ArrowLeft, Save, Shield, Briefcase, GraduationCap } from 'lucide-react';

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
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">
                            Add New Instructor
                        </h1>
                        <p className="text-xs text-slate-500">
                            Onboard a faculty instructor or teaching assistant to Comestro Academy
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
            <Head title="Add New Instructor" />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Faculty Registration</h3>
                                <p className="text-xs text-slate-500">Fill in authentication credentials and professional credentials</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Section 1: Account & Contact */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
                                    <Shield className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Account & Identity</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Full Name *" />
                                        <TextInput
                                            id="name"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Dr. Rajesh Sharma"
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
                                            placeholder="+91 98765 43210"
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
                                            placeholder="instructor@comestro.com"
                                            required
                                        />
                                        <InputError className="mt-1.5" message={errors.email} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password" value="Initial Password *" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Min. 8 characters"
                                            required
                                        />
                                        <InputError className="mt-1.5" message={errors.password} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Professional Details */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
                                    <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Professional & Academic Background</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="designation" value="Designation / Academic Title" />
                                        <TextInput
                                            id="designation"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.designation}
                                            onChange={(e) => setData('designation', e.target.value)}
                                            placeholder="e.g. Lead Full-Stack Instructor"
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
                                            placeholder="e.g. M.Tech in Computer Science"
                                        />
                                        <InputError className="mt-1.5" message={errors.qualification} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="expertise" value="Primary Tech Stack & Expertise" />
                                        <TextInput
                                            id="expertise"
                                            className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                            value={data.expertise}
                                            onChange={(e) => setData('expertise', e.target.value)}
                                            placeholder="e.g. Laravel, React, Node.js, System Design"
                                        />
                                        <InputError className="mt-1.5" message={errors.expertise} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="experience_years" value="Industry Experience (Years)" />
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
                                    <InputLabel htmlFor="bio" value="Biography & Background Overview" />
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 mt-1 shadow-xs transition"
                                        placeholder="Detailed career history, industry background, and achievements..."
                                    ></textarea>
                                    <InputError className="mt-1.5" message={errors.bio} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Initial Account Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-xs transition sm:w-1/2"
                                    >
                                        <option value="active">Active (Can publish & teach)</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Creating...' : 'Create Instructor Account'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
