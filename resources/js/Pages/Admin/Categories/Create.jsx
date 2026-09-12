import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { FolderPlus, Edit3, ArrowLeft, Save, Tag, FolderTree, Trash2 } from 'lucide-react';

export default function CategoryCreate({ category = null, parentCategories = [] }) {
    const isEdit = Boolean(category);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, post, patch, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        parent_id: category?.parent_id || '',
        status: category?.status || 'active',
    });

    const handleDelete = () => {
        if (!category?.id) return;
        router.delete(route('admin.categories.destroy', category.id));
    };

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
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">
                            {isEdit ? 'Edit Course Category' : 'Create Course Category'}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {isEdit
                                ? `Updating category classification and parent hierarchy for ${category.name}`
                                : 'Create a primary track or subcategory for course organization'}
                        </p>
                    </div>
                    <Link
                        href={route('admin.categories.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Categories</span>
                    </Link>
                </div>
            }
        >
            <Head title={isEdit ? `Edit Category - ${category.name}` : 'Create Course Category'} />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* If Edit Mode: Top Category Badge */}
                    {isEdit && (
                        <div className="rounded-xl bg-white p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
                            <div className="flex items-center space-x-3.5">
                                <div className="h-11 w-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100 shrink-0">
                                    <Tag className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h2 className="text-sm sm:text-base font-bold text-slate-900">{category.name}</h2>
                                    <p className="text-xs font-mono text-slate-500">Slug: /{category.slug}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                category.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                                    category.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}></span>
                                {category.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    )}

                    {/* Main Form Card */}
                    <div className="rounded-xl bg-white p-6 border border-slate-200/90 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                {isEdit ? <Edit3 className="h-4 w-4" /> : <FolderPlus className="h-4 w-4" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    {isEdit ? 'Category Settings' : 'New Category Configuration'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Specify title, parent hierarchy, and status
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Category Name *" />
                                <TextInput
                                    id="name"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5 mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Full Stack Web Development"
                                    required
                                />
                                <InputError className="mt-1.5" message={errors.name} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent Hierarchy (Optional)" />
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-xs transition"
                                    >
                                        <option value="">None (Root Category)</option>
                                        {parentCategories && parentCategories.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <InputError className="mt-1.5" message={errors.parent_id} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Category Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 mt-1 shadow-xs transition"
                                    >
                                        <option value="active">Active (Visible to Students)</option>
                                        <option value="inactive">Inactive (Hidden)</option>
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
                                    className="w-full text-xs sm:text-sm rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 mt-1 shadow-xs transition"
                                    placeholder="Brief summary of technologies and courses under this category..."
                                ></textarea>
                                <InputError className="mt-1.5" message={errors.description} />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                {isEdit ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete Category</span>
                                    </button>
                                ) : (
                                    <div />
                                )}

                                <PrimaryButton disabled={processing} className="flex items-center gap-1.5">
                                    <Save className="h-3.5 w-3.5" />
                                    <span>{processing ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            {/* CONFIRM DELETE MODAL */}
            {isEdit && (
                <ConfirmDeleteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Category?"
                    message={
                        <p>
                            Are you sure you want to delete <span className="font-semibold text-slate-800">{category.name}</span>?
                            Categories assigned to active courses cannot be deleted until courses are reassigned.
                        </p>
                    }
                    confirmText="Yes, Delete Category"
                />
            )}
        </AdminLayout>
    );
}
