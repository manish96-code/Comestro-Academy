import StudentLayout from '@/Layouts/StudentLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Calendar,
    Clock,
    Save,
    ShieldCheck,
    GraduationCap,
    Building2,
    MapPin,
    ExternalLink,
    FileText,
    Globe,
    Upload,
    Trash2
} from 'lucide-react';

export default function StudentProfile({ student }) {
    // Profile details form
    const profileForm = useForm({
        name: student?.name || '',
        phone: student?.phone || '',
        profile_pic: null,
        qualification: student?.qualification || '',
        college_name: student?.college_name || '',
        city: student?.city || '',
        state: student?.state || '',
        github_url: student?.github_url || '',
        linkedin_url: student?.linkedin_url || '',
        bio: student?.bio || '',
    });

    // Profile photo preview
    const [previewUrl, setPreviewUrl] = useState(student?.profile_pic || null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData('profile_pic', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Remove photo directly from DB or reset preview
    const handleRemovePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        profileForm.setData('profile_pic', null);

        if (student?.profile_pic) {
            router.delete(route('student.profile.pic.destroy'), {
                preserveScroll: true,
                onSuccess: () => setPreviewUrl(null),
            });
        } else {
            setPreviewUrl(null);
        }
    };

    // Submit profile update
    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.post(route('student.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('student.profile.password'), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    // Status badge helper
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active Student
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
        <StudentLayout
            header={
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        My Student Profile
                    </h1>
                    <p className="text-xs text-gray-500">
                        Manage your personal credentials, education, college background, and portfolio links
                    </p>
                </div>
            }
        >
            <Head title="My Profile" />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Summary card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl border border-indigo-700 shrink-0 shadow-xs overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt={student?.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : student?.name ? (
                                    student.name.charAt(0).toUpperCase()
                                ) : (
                                    'S'
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-gray-900">{student?.name}</h2>
                                    {getStatusBadge(student?.status)}
                                </div>
                                <p className="text-xs text-gray-500">Student ID: #{student?.id}</p>
                                {(student?.qualification || student?.college_name) && (
                                    <p className="text-xs text-indigo-600 font-medium flex items-center gap-1.5 pt-0.5">
                                        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                        <span>
                                            {student?.qualification}
                                            {student?.qualification && student?.college_name ? ' • ' : ''}
                                            {student?.college_name}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end text-[11px] text-gray-500 gap-1.5 shrink-0">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                Enrolled Since: {student?.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                Last Login: {student?.last_login_at ? new Date(student.last_login_at).toLocaleString() : 'Never'}
                            </span>
                        </div>
                    </div>

                    {/* Profile edit form */}
                    <form onSubmit={submitProfile} className="space-y-6">
                        
                        {/* Basic information */}
                        <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs space-y-5">
                            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Basic Information</h3>
                                    <p className="text-xs text-gray-500">Update your primary identity and communication contact</p>
                                </div>
                            </div>

                            {/* Profile picture picker */}
                            <div>
                                <InputLabel value="Profile Picture" />
                                <div className="mt-2 flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl border border-indigo-700 shrink-0 shadow-xs overflow-hidden">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt={student?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : student?.name ? (
                                                student.name.charAt(0).toUpperCase()
                                            ) : (
                                                'S'
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-2xs transition"
                                            >
                                                <Upload className="h-3.5 w-3.5 text-indigo-600" />
                                                <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
                                            </button>
                                            {previewUrl && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    <span>Remove</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500">
                                            JPG, PNG or WEBP (Max 5MB)
                                        </p>
                                        <InputError message={profileForm.errors.profile_pic} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Full Name *" />
                                <TextInput
                                    id="name"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    placeholder="e.g. Rahul Sharma"
                                />
                                <InputError className="mt-1.5" message={profileForm.errors.name} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        readOnly
                                        disabled
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1 bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed select-none"
                                        value={student?.email || ''}
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Cannot be changed
                                    </p>
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Phone Number (10 digits)" />
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        maxLength="10"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        placeholder="9876543210"
                                    />
                                    <InputError className="mt-1.5" message={profileForm.errors.phone} />
                                </div>
                            </div>
                        </div>

                        {/* Education background */}
                        <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs space-y-5">
                            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Education & College Background</h3>
                                    <p className="text-xs text-gray-500">Your degree, college/university, and location details</p>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="qualification" value="Highest Qualification / Degree" />
                                <TextInput
                                    id="qualification"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                    value={profileForm.data.qualification}
                                    onChange={(e) => profileForm.setData('qualification', e.target.value)}
                                    placeholder="e.g. B.Tech Computer Science, BCA, MCA"
                                />
                                <InputError className="mt-1.5" message={profileForm.errors.qualification} />
                            </div>

                            <div>
                                <InputLabel htmlFor="college_name" value="College / University / Institute Name" />
                                <TextInput
                                    id="college_name"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                    value={profileForm.data.college_name}
                                    onChange={(e) => profileForm.setData('college_name', e.target.value)}
                                    placeholder="e.g. National Institute of Technology, Patna"
                                />
                                <InputError className="mt-1.5" message={profileForm.errors.college_name} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="city" value="City" />
                                    <TextInput
                                        id="city"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={profileForm.data.city}
                                        onChange={(e) => profileForm.setData('city', e.target.value)}
                                        placeholder="e.g. Patna, Delhi, Bangalore"
                                    />
                                    <InputError className="mt-1.5" message={profileForm.errors.city} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="state" value="State" />
                                    <TextInput
                                        id="state"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={profileForm.data.state}
                                        onChange={(e) => profileForm.setData('state', e.target.value)}
                                        placeholder="e.g. Bihar, Maharashtra"
                                    />
                                    <InputError className="mt-1.5" message={profileForm.errors.state} />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Professional Links & Bio */}
                        <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs space-y-5">
                            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Professional Links & Bio</h3>
                                    <p className="text-xs text-gray-500">Showcase your portfolio, GitHub, and professional networks</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="github_url" value="GitHub Profile URL" />
                                    <TextInput
                                        id="github_url"
                                        type="url"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={profileForm.data.github_url}
                                        onChange={(e) => profileForm.setData('github_url', e.target.value)}
                                        placeholder="https://github.com/username"
                                    />
                                    <InputError className="mt-1.5" message={profileForm.errors.github_url} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="linkedin_url" value="LinkedIn Profile URL" />
                                    <TextInput
                                        id="linkedin_url"
                                        type="url"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={profileForm.data.linkedin_url}
                                        onChange={(e) => profileForm.setData('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                    <InputError className="mt-1.5" message={profileForm.errors.linkedin_url} />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="bio" value="Bio / Learning Goals" />
                                <textarea
                                    id="bio"
                                    rows={3}
                                    className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2.5 px-3.5 shadow-xs transition mt-1"
                                    value={profileForm.data.bio}
                                    onChange={(e) => profileForm.setData('bio', e.target.value)}
                                    placeholder="Brief summary about your learning journey and tech career aspirations..."
                                />
                                <InputError className="mt-1.5" message={profileForm.errors.bio} />
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                                <PrimaryButton
                                    disabled={profileForm.processing}
                                    className="px-6 py-2.5 text-xs font-semibold shadow-xs"
                                >
                                    <Save className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{profileForm.processing ? 'Saving...' : 'Save Profile Changes'}</span>
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>

                    {/* Section 4: Security & Password Update */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Security & Password</h3>
                                <p className="text-xs text-gray-500">Ensure your account uses a strong, secure password</p>
                            </div>
                        </div>

                        <form onSubmit={submitPassword} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="current_password" value="Current Password *" />
                                <TextInput
                                    id="current_password"
                                    type="password"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    placeholder="Enter your current password"
                                    autoComplete="current-password"
                                />
                                <InputError className="mt-1.5" message={passwordForm.errors.current_password} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="password" value="New Password *" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                    />
                                    <InputError className="mt-1.5" message={passwordForm.errors.password} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password *" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Re-enter new password"
                                        autoComplete="new-password"
                                    />
                                    <InputError className="mt-1.5" message={passwordForm.errors.password_confirmation} />
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                                <PrimaryButton
                                    disabled={passwordForm.processing}
                                    className="px-5 py-2 text-xs font-semibold shadow-xs"
                                >
                                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{passwordForm.processing ? 'Updating...' : 'Update Password'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
