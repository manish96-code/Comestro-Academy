import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FolderPlus, Edit3, ArrowLeft, Save, Tag } from 'lucide-react';

export default function CategoryCreate({ category = null, parentCategories = [] }) {
    const isEdit = Boolean(category);

    const { data, setData, post, patch, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        parent_id: category?.parent_id || '',
        status: category?.status || 'active',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            patch(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {isEdit ? 'Edit Course Category' : 'Add New Course Category'}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {isEdit
                                ? `Viewing and updating category for ${category.name}`
                                : 'Create a main domain or subcategory for course classification'}
                        </p>
                    </div>
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Categories</span>
                    </Link>
                </div>
            }
        >
            <Head title={isEdit ? `Edit Category - ${category.name}` : 'Add Course Category'} />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* If Edit Mode: Top Category Badge */}
                    {isEdit && (
                        <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl border border-indigo-700 shrink-0 shadow-xs">
                                    <Tag className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h2 className="text-base font-bold text-gray-900">{category.name}</h2>
                                    <p className="text-xs font-mono text-gray-500">Slug: /{category.slug}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                category.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                {category.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    )}

                    {/* Main Form Card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                {isEdit ? <Edit3 className="h-5 w-5" /> : <FolderPlus className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {isEdit ? 'Edit Category Details' : 'Category Details'}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {isEdit ? 'Update category information below' : 'Fill in category details below'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Category Name" />
                                <TextInput
                                    id="name"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Web Development"
                                />
                                <InputError className="mt-1.5" message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent Category (Optional)" />
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                    >
                                        <option value="">None (Root Level Category)</option>
                                        {parentCategories && parentCategories.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <InputError className="mt-1.5" message={errors.parent_id} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Category Status" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Description (Optional)" />
                                <textarea
                                    id="description"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                    placeholder="Brief summary of what this category covers..."
                                ></textarea>
                                <InputError className="mt-1.5" message={errors.description} />
                            </div>

                            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-start">
                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{isEdit ? 'Update Category Details' : 'Create Category'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
