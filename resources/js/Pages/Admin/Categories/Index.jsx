import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Edit3,
    Plus,
    Tag,
    Layers,
    FolderTree,
    Sparkles,
    RotateCcw,
    Trash2
} from 'lucide-react';

export default function CategoryIndex({ categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        categoryId: null,
        categoryName: '',
    });

    const handleDeleteCategory = () => {
        if (!deleteModal.categoryId) return;

        router.delete(route('admin.categories.destroy', deleteModal.categoryId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
            },
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.categories.index'),
            { search: search || undefined },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        router.get(route('admin.categories.index'));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Inactive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                Course Categories
                            </h1>
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                                {categories?.total || 0} TOTAL
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Organize tech stacks, programming tracks, and course taxonomy
                        </p>
                    </div>
                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Category</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Categories" />

            <div className="py-6 bg-slate-50 min-h-[calc(100vh-5rem)]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Filter & Search Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
                        <form onSubmit={handleSearch} className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-lg">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by category name, slug, description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-xs"
                            >
                                Search
                            </button>
                            {filters?.search && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                                    title="Reset search"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                        </form>

                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                            <Tag className="h-3.5 w-3.5 text-slate-400" />
                            <span>Total Registered:</span>
                            <strong className="text-slate-900 font-bold">{categories?.total || 0}</strong>
                        </div>
                    </div>

                    {/* Categories Table */}
                    <div className="rounded-xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4">Category Name</th>
                                        <th className="py-3 px-4">Slug</th>
                                        <th className="py-3 px-4">Parent Category</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories?.data && categories.data.length > 0 ? (
                                        categories.data.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                                            <Tag className="h-3.5 w-3.5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-xs">{cat.name}</div>
                                                            {cat.description && (
                                                                <div className="text-[11px] text-slate-400 truncate max-w-xs">{cat.description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                        /{cat.slug}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-700">
                                                    {cat.parent ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                            <FolderTree className="h-3 w-3 text-slate-400" />
                                                            {cat.parent.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 font-normal text-[11px]">Root Category</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(cat.status)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={route('admin.categories.show', cat.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition"
                                                            title="Edit Category"
                                                        >
                                                            <Edit3 className="h-3 w-3 text-slate-400" />
                                                            <span>Edit</span>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteModal({
                                                                    isOpen: true,
                                                                    categoryId: cat.id,
                                                                    categoryName: cat.name,
                                                                })
                                                            }
                                                            className="inline-flex items-center justify-center p-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg border border-rose-200 shadow-xs transition"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400">
                                                <div className="max-w-xs mx-auto space-y-2">
                                                    <Tag className="h-8 w-8 mx-auto text-slate-300" />
                                                    <p className="text-xs text-slate-500 font-medium">No categories found</p>
                                                    <p className="text-[11px] text-slate-400">Try adjusting your search query or add a new category.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            links={categories?.links}
                            from={categories?.from}
                            to={categories?.to}
                            total={categories?.total}
                            itemLabel="categories"
                        />
                    </div>

                </div>
            </div>

            {/* CONFIRM DELETE MODAL */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })}
                onConfirm={handleDeleteCategory}
                title="Delete Category?"
                message={
                    <p>
                        Are you sure you want to delete <span className="font-semibold text-slate-800">{deleteModal.categoryName}</span>?
                        Categories assigned to active courses cannot be deleted until courses are reassigned.
                    </p>
                }
                confirmText="Yes, Delete Category"
            />
        </AdminLayout>
    );
}
