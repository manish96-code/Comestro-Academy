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
    Video,
    Radio,
    Filter
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Published
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Draft
                    </span>
                );
            case 'archived':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                            Courses & Curriculums
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            Manage curriculum, pricing, instructor allocations, and video content
                        </p>
                    </div>
                    <Link
                        href={route('admin.courses.create')}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition shrink-0"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Course</span>
                    </Link>
                </div>
            }
        >
            <Head title="Course Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">

                    {/* Header Filter Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl bg-white p-3.5 sm:p-4 border border-slate-200 shadow-2xs">
                        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses, slugs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 shadow-2xs"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Category Filter */}
                            <select
                                value={categoryId}
                                onChange={handleCategoryChange}
                                className="text-xs rounded-lg border border-slate-300 bg-white text-slate-700 py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
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
                                className="text-xs rounded-lg border border-slate-300 bg-white text-slate-700 py-1.5 px-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs"
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
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <X className="h-3 w-3" />
                                    <span>Reset</span>
                                </button>
                            )}

                            <div className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                                Total: <strong className="text-slate-900 font-bold ml-0.5">{courses?.total || 0}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left">
                                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider font-mono">
                                    <tr>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Course</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Category</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Instructor</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Pricing</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Duration</th>
                                        <th scope="col" className="py-2.5 px-4 font-semibold">Status</th>
                                        <th scope="col" className="py-2.5 px-4 text-right font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                                    {courses?.data && courses.data.length > 0 ? (
                                        courses.data.map((course) => (
                                            <tr key={course.id} className="hover:bg-slate-50/70 transition">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {course.thumbnail ? (
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="h-10 w-14 rounded-md object-cover border border-slate-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-14 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                                                                <BookOpen className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                        <div className="space-y-0.5 min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Link
                                                                    href={route('admin.courses.show', course.id)}
                                                                    className="font-bold text-slate-900 hover:text-indigo-600 transition truncate max-w-xs"
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
                                                            <p className="font-mono text-[10px] text-slate-400 truncate">/{course.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.category ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                            <FolderTree className="h-3 w-3 text-slate-500" />
                                                            <span>{course.category.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-[11px]">None</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {course.instructor?.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {course.instructor.user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900 leading-tight">{course.instructor.user.name}</p>
                                                                <p className="text-[10px] text-slate-400">{course.instructor.designation || 'Instructor'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-slate-400 italic text-[11px]">
                                                            <User className="h-3 w-3 text-slate-300" />
                                                            <span>Unassigned</span>
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {Number(course.price) === 0 ? (
                                                        <span className="font-semibold text-emerald-600 font-mono">Free</span>
                                                    ) : course.discount_price ? (
                                                        <div className="space-y-0.2">
                                                            <span className="font-bold text-slate-900 font-mono">
                                                                ₹{Number(course.discount_price).toLocaleString()}
                                                            </span>
                                                            <span className="text-[10px] line-through text-slate-400 block font-mono">
                                                                ₹{Number(course.price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-slate-900 font-mono">
                                                            ₹{Number(course.price).toLocaleString()}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                                                    {course.duration ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono">
                                                            <Clock className="h-3 w-3 text-slate-400" />
                                                            <span>{course.duration}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 font-mono">-</span>
                                                    )}
                                                </td>

                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {getStatusBadge(course.status)}
                                                </td>

                                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {course.type === 'recorded' ? (
                                                            <Link
                                                                href={route('admin.courses.content', course.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-md border border-sky-200 transition shadow-2xs"
                                                                title="Upload Videos & Lecture Notes"
                                                            >
                                                                <Video className="h-3 w-3 text-sky-600" />
                                                                <span>Videos & Notes</span>
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={route('admin.courses.content', course.id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition shadow-2xs"
                                                                title="Live Sessions & Content"
                                                            >
                                                                <Radio className="h-3 w-3 text-rose-600" />
                                                                <span>Live Content</span>
                                                            </Link>
                                                        )}

                                                        <Link
                                                            href={route('admin.courses.show', course.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition shadow-2xs"
                                                        >
                                                            <Edit3 className="h-3 w-3 text-slate-500" />
                                                            <span>Edit</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 border border-slate-200">
                                                        {hasActiveFilters ? <Search className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">
                                                            {hasActiveFilters ? 'No matching courses found' : 'No courses found'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                                            {hasActiveFilters
                                                                ? 'Try adjusting your search query or category filter.'
                                                                : 'Get started by creating your first course curriculum.'}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters ? (
                                                        <button
                                                            type="button"
                                                            onClick={clearFilters}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
                                                        >
                                                            <X className="h-3 w-3 text-slate-400" />
                                                            <span>Clear filters</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={route('admin.courses.create')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition"
                                                        >
                                                            <Plus className="h-3.5 w-3.5" />
                                                            <span>Create course</span>
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
                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                                <div className="text-[11px] text-slate-500 font-mono">
                                    Showing <span className="font-semibold text-slate-900">{courses.from || 0}</span> to <span className="font-semibold text-slate-900">{courses.to || 0}</span> of <span className="font-semibold text-slate-900">{courses.total}</span> courses
                                </div>
                                <div className="flex space-x-1">
                                    {courses.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            preserveState
                                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${link.active
                                                    ? 'bg-indigo-600 text-white font-bold'
                                                    : link.url
                                                        ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
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

