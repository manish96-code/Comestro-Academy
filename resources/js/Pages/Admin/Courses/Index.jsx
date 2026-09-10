import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    Edit3,
    Plus,
    BookOpen,
    FolderTree,
    Clock,
    Sparkles,
    User,
    X,
    Video
} from 'lucide-react';

export default function CourseIndex({ courses, categories = [], filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryId, setCategoryId] = useState(filters?.category_id || '');
    const [status, setStatus] = useState(filters?.status || '');

    const hasActiveFilters = Boolean(search || categoryId || status);

    const clearFilters = () => {
        setSearch('');
        setCategoryId('');
        setStatus('');
        router.get(route('admin.courses.index'), {}, { preserveState: false });
    };

    const handleFilter = (newSearch, newCat, newStat) => {
        router.get(
            route('admin.courses.index'),
            {
                search: newSearch || undefined,
                category_id: newCat || undefined,
                status: newStat || undefined,
            },
            { preserveState: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilter(search, categoryId, status);
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setCategoryId(val);
        handleFilter(search, val, status);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        handleFilter(search, categoryId, val);
    };

    const getStatusBadge = (courseStatus) => {
        switch (courseStatus) {
            case 'published':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                        Published
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
                        Draft
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-400"></span>
                        Archived
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            Courses
                        </h1>
                        <p className="text-xs text-gray-500">
                            Manage curriculum, pricing, instructor allocations, and course visibility
                        </p>
                    </div>
                    <Link
                        href={route('admin.courses.create')}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Course</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Management" />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Header Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg bg-white p-4 border border-gray-200 shadow-xs">

                        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses, instructors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-xs"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Category Filter */}
                            <select
                                value={categoryId}
                                onChange={handleCategoryChange}
                                className="text-xs sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-700 py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-xs"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter */}
                            <select
                                value={status}
                                onChange={handleStatusChange}
                                className="text-xs sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-700 py-2 px-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-xs"
                            >
                                <option value="">All Statuses</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1.5 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reset Filters</span>
                                </button>
                            )}

                            <div className="text-xs text-gray-600 font-medium shrink-0 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg">
                                Total: <strong className="text-gray-900 font-bold ml-1">{courses?.total || 0}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="rounded-lg bg-white border border-gray-200 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-left">
                                <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th scope="col" className="py-3 px-4">Course</th>
                                        <th scope="col" className="py-3 px-4">Category</th>
                                        <th scope="col" className="py-3 px-4">Instructor</th>
                                        <th scope="col" className="py-3 px-4">Pricing</th>
                                        <th scope="col" className="py-3 px-4">Duration</th>
                                        <th scope="col" className="py-3 px-4">Status</th>
                                        <th scope="col" className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white text-xs">
                                    {courses?.data && courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <tr key={course.id} className="hover:bg-gray-50/70 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="h-10 w-14 rounded-md object-cover border border-gray-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-14 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                                                                <BookOpen className="h-5 w-5" />
                                                            </div>
                                                        )}
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                                                                <Link
                                                                    href={route('admin.courses.show', course.id)}
                                                                    className="font-bold text-gray-900 hover:text-indigo-600 transition"
                                                                >
                                                                    {course.title}
                                                                </Link>
                                                                {course.type === 'live' ? (
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                                        <span className="relative flex h-1.5 w-1.5">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                                                        </span>
                                                                        <span>Live</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                                        <Video className="h-2.5 w-2.5 text-slate-500" />
                                                                        <span>Recorded</span>
                                                                    </span>
                                                                )}
                                                                {course.is_featured && (
                                                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                                        <Sparkles className="h-2.5 w-2.5" />
                                                                        <span>Featured</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="font-mono text-[11px] text-gray-400">/{course.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.category ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                            <FolderTree className="h-3 w-3 text-gray-500" />
                                                            <span>{course.category.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">None</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.instructor?.user ? (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {course.instructor.user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{course.instructor.user.name}</p>
                                                                <p className="text-[10px] text-gray-400">{course.instructor.designation || 'Instructor'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-gray-400 italic text-xs">
                                                            <User className="h-3.5 w-3.5 text-gray-300" />
                                                            <span>Unassigned</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {Number(course.price) === 0 ? (
                                                        <span className="font-semibold text-emerald-600">Free</span>
                                                    ) : course.discount_price ? (
                                                        <div className="space-y-0.5">
                                                            <span className="font-bold text-gray-900">
                                                                ₹{Number(course.discount_price).toLocaleString()}
                                                            </span>
                                                            <span className="text-[11px] line-through text-gray-400 block">
                                                                ₹{Number(course.price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-gray-900">
                                                            ₹{Number(course.price).toLocaleString()}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                                                    {course.duration ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span>{course.duration}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {getStatusBadge(course.status)}
                                                </td>

                                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                                    <Link
                                                        href={route('admin.courses.show', course.id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-900 bg-indigo-50/60 hover:bg-indigo-100 rounded-md border border-indigo-200/60 transition"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="p-3 bg-gray-100 rounded-xl text-gray-400">
                                                        {hasActiveFilters ? <Search className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {hasActiveFilters ? 'No matching courses found' : 'No courses found'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {hasActiveFilters
                                                                ? 'Try adjusting your search query or filter selection.'
                                                                : 'Get started by creating your first course in the academy.'}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters ? (
                                                        <button
                                                            type="button"
                                                            onClick={clearFilters}
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition"
                                                        >
                                                            <X className="h-3.5 w-3.5 text-gray-400" />
                                                            <span>Clear all filters</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={route('admin.courses.create')}
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                            <span>Create the first course</span>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {courses?.links && courses.links.length > 3 && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    Showing <span className="font-semibold text-gray-900">{courses.from || 0}</span> to <span className="font-semibold text-gray-900">{courses.to || 0}</span> of <span className="font-semibold text-gray-900">{courses.total}</span> courses
                                </div>
                                <div className="flex space-x-1">
                                    {courses.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            preserveState
                                            className={`px-3 py-1 text-xs rounded-md font-medium transition ${link.active
                                                    ? 'bg-indigo-600 text-white font-bold'
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
