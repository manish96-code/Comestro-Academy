import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    BookPlus,
    Edit3,
    ArrowLeft,
    Save,
    BookOpen,
    Image,
    Sparkles,
    FolderTree,
    Clock,
    IndianRupee,
    UserCheck,
    Plus,
    Trash2,
    CheckCircle2,
    ListChecks,
    Layers,
    Upload,
    UploadCloud
} from 'lucide-react';

export default function CourseCreate({ course = null, categories = [], instructors = [] }) {
    const isEdit = Boolean(course);
    const [imagePreview, setImagePreview] = useState(course?.thumbnail || null);
    const fileInputRef = useRef(null);

    const { data, setData, post, patch, processing, errors, transform } = useForm({
        title: course?.title || '',
        subtitle: course?.subtitle || '',
        category_id: course?.category_id || '',
        instructor_id: course?.instructor_id || '',
        description: course?.description || '',
        curriculum: Array.isArray(course?.curriculum)
            ? course.curriculum.map((item) => {
                let initialSubtitles = [''];
                if (Array.isArray(item.subtitles) && item.subtitles.length > 0) {
                    initialSubtitles = item.subtitles;
                } else if (Array.isArray(item.subtitle) && item.subtitle.length > 0) {
                    initialSubtitles = item.subtitle;
                } else if (typeof item.subtitle === 'string' && item.subtitle.trim().length > 0) {
                    if (item.subtitle.includes('\n')) {
                        initialSubtitles = item.subtitle.split('\n').map((s) => s.trim()).filter(Boolean);
                    } else if (item.subtitle.includes(',')) {
                        initialSubtitles = item.subtitle.split(',').map((s) => s.trim()).filter(Boolean);
                    } else {
                        initialSubtitles = [item.subtitle.trim()];
                    }
                }
                return {
                    ...item,
                    title: (item.title || '').replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim(),
                    subtitles: initialSubtitles.length > 0 ? initialSubtitles : [''],
                };
            })
            : [],
        course_includes: Array.isArray(course?.course_includes) && course.course_includes.length > 0
            ? course.course_includes
            : (!course ? [
                '12 Weeks of intensive training',
                'Real-world capstone project codebases',
                'Downloadable starter kits & slide decks',
                'Official Certificate of Completion',
                'Full lifetime access on mobile & web',
            ] : []),
        thumbnail: course?.thumbnail || '',
        thumbnail_image: null,
        price: course?.price ?? '',
        discount_price: course?.discount_price ?? '',
        duration: course?.duration || '',
        is_featured: Boolean(course?.is_featured),
        status: course?.status || 'draft',
    });

    // Automatically transform curriculum module title, subtitles array, and clean course_includes
    transform((formData) => ({
        ...formData,
        curriculum: Array.isArray(formData.curriculum)
            ? formData.curriculum.map((item) => {
                const cleanedSubtitles = Array.isArray(item.subtitles)
                    ? item.subtitles.map((s) => (s || '').trim()).filter(Boolean)
                    : (typeof item.subtitle === 'string'
                        ? item.subtitle.split(',').map((s) => s.trim()).filter(Boolean)
                        : []);
                return {
                    title: (item.title || '').replace(/^Module\s*\d+\s*[:\-–—]?\s*/i, '').trim(),
                    subtitles: cleanedSubtitles,
                    subtitle: cleanedSubtitles.join(', '),
                };
            })
            : [],
        course_includes: Array.isArray(formData.course_includes)
            ? formData.course_includes.map((s) => (s || '').trim()).filter(Boolean)
            : [],
    }));

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail_image', file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            thumbnail_image: null,
            thumbnail: '',
        }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addCurriculumItem = () => {
        setData('curriculum', [
            ...data.curriculum,
            { title: '', subtitles: [''] },
        ]);
    };

    const updateCurriculumTitle = (index, value) => {
        const updated = [...data.curriculum];
        updated[index] = { ...updated[index], title: value };
        setData('curriculum', updated);
    };

    const removeCurriculumItem = (index) => {
        const updated = data.curriculum.filter((_, i) => i !== index);
        setData('curriculum', updated);
    };

    const addModuleSubtitle = (moduleIndex) => {
        const updated = [...data.curriculum];
        const currentSubtitles = updated[moduleIndex].subtitles || [''];
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: [...currentSubtitles, ''],
        };
        setData('curriculum', updated);
    };

    const updateModuleSubtitle = (moduleIndex, subIndex, value) => {
        const updated = [...data.curriculum];
        const currentSubtitles = [...(updated[moduleIndex].subtitles || [''])];
        currentSubtitles[subIndex] = value;
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: currentSubtitles,
        };
        setData('curriculum', updated);
    };

    const removeModuleSubtitle = (moduleIndex, subIndex) => {
        const updated = [...data.curriculum];
        const currentSubtitles = (updated[moduleIndex].subtitles || ['']).filter((_, i) => i !== subIndex);
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            subtitles: currentSubtitles.length > 0 ? currentSubtitles : [''],
        };
        setData('curriculum', updated);
    };

    const addCourseIncludeItem = () => {
        setData('course_includes', [
            ...(data.course_includes || []),
            '',
        ]);
    };

    const updateCourseIncludeItem = (index, value) => {
        const updated = [...(data.course_includes || [])];
        updated[index] = value;
        setData('course_includes', updated);
    };

    const removeCourseIncludeItem = (index) => {
        const updated = (data.course_includes || []).filter((_, i) => i !== index);
        setData('course_includes', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.courses.update', course.id), {
                forceFormData: true,
            });
        } else {
            post(route('admin.courses.store'), {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {isEdit ? 'Edit Course' : 'Create New Course'}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {isEdit
                                ? `Updating course details and syllabus for ${course.title}`
                                : 'Configure curriculum, allocate instructors, and set pricing'}
                        </p>
                    </div>
                    <Link
                        href={route('admin.courses.index')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Courses</span>
                    </Link>
                </div>
            }
        >
            <Head title={isEdit ? `Edit Course - ${course.title}` : 'Create Course'} />

            <div className="py-6 bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* If Edit Mode: Top Course Summary Badge */}
                    {isEdit && (
                        <div className="rounded-lg bg-white p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="h-14 w-20 rounded-lg object-cover border border-gray-200 shrink-0"
                                    />
                                ) : (
                                    <div className="h-14 w-20 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h2 className="text-base font-bold text-gray-900">{course.title}</h2>
                                        {course.is_featured && (
                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Sparkles className="h-2.5 w-2.5" />
                                                <span>Featured</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-mono text-gray-500">Slug: /{course.slug}</p>
                                </div>
                            </div>

                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 ${course.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : course.status === 'draft'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                        </div>
                    )}

                    {/* Main Form Card */}
                    <div className="rounded-lg bg-white p-6 border border-gray-200 shadow-xs">
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                {isEdit ? <Edit3 className="h-5 w-5" /> : <BookPlus className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {isEdit ? 'Edit Course Information' : 'Course Information'}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {isEdit ? 'Modify the course specifications below' : 'Fill in the course specifications below'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Course Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Course Title *" />
                                <TextInput
                                    id="title"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Master Full-Stack Laravel & React Bootcamp"
                                />
                                <InputError className="mt-1.5" message={errors.title} />
                            </div>

                            {/* Course Subtitle */}
                            <div>
                                <InputLabel htmlFor="subtitle" value="Course Subtitle (Short Catchy Overview)" />
                                <TextInput
                                    id="subtitle"
                                    className="w-full text-xs sm:text-sm py-2 px-3.5"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g. Build production-ready web apps from scratch with modern architecture and deployment"
                                />
                                <InputError className="mt-1.5" message={errors.subtitle} />
                            </div>

                            {/* Category & Instructor */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <InputLabel htmlFor="category_id" value="Category *" />
                                    <div className="relative mt-1">
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError className="mt-1.5" message={errors.category_id} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="instructor_id" value="Assigned Instructor (Optional)" />
                                    <div className="relative mt-1">
                                        <select
                                            id="instructor_id"
                                            value={data.instructor_id}
                                            onChange={(e) => setData('instructor_id', e.target.value)}
                                            className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                        >
                                            <option value="">No Instructor Assigned</option>
                                            {instructors.map((inst) => (
                                                <option key={inst.id} value={inst.id}>
                                                    {inst.user?.name} {inst.designation ? `(${inst.designation})` : ''}{inst.user?.status && inst.user.status !== 'active' ? ` — [${inst.user.status.toUpperCase()}]` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <InputError className="mt-1.5" message={errors.instructor_id} />
                                </div>
                            </div>

                            {/* Pricing & Duration */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <InputLabel htmlFor="price" value="Regular Price (₹) *" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    <InputError className="mt-1" message={errors.price} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="discount_price" value="Discounted Price (₹)" />
                                    <TextInput
                                        id="discount_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.discount_price}
                                        onChange={(e) => setData('discount_price', e.target.value)}
                                        placeholder="Leave empty if no discount"
                                    />
                                    <InputError className="mt-1" message={errors.discount_price} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="duration" value="Duration" />
                                    <TextInput
                                        id="duration"
                                        className="w-full text-xs sm:text-sm py-2 px-3.5"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g. 12 Weeks, 40 Hours"
                                    />
                                    <InputError className="mt-1" message={errors.duration} />
                                </div>
                            </div>

                            {/* Course Thumbnail Image */}
                            <div className="space-y-2">
                                <InputLabel value="Course Thumbnail Banner Image *" />

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-3.5 sm:p-4 transition hover:border-indigo-300">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-900 shrink-0 shadow-xs group">
                                                <img
                                                    src={imagePreview}
                                                    alt="Course Thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-[10px] text-white font-semibold px-2 py-0.5 rounded shadow-xs">
                                                    {data.thumbnail_image ? 'New File Selected' : 'Current Thumbnail'}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-1.5 min-w-0">
                                                <h5 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                                    {data.thumbnail_image
                                                        ? data.thumbnail_image.name
                                                        : (data.thumbnail?.split('/').pop() || 'Current Course Thumbnail')}
                                                </h5>
                                                <p className="text-[11px] text-gray-500">
                                                    {data.thumbnail_image
                                                        ? `${(data.thumbnail_image.size / (1024 * 1024)).toFixed(2)} MB · Ready to upload`
                                                        : 'Saved course thumbnail'}
                                                </p>
                                                <div className="flex items-center gap-2 pt-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        <span>Change Image</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/20 p-6 text-center cursor-pointer transition group"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 group-hover:bg-indigo-100 transition duration-200">
                                                <UploadCloud className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                                    Click to upload course banner image
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">
                                                    PNG, JPG, WEBP, or SVG up to 5MB
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                                Browse from device
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <InputError className="mt-1" message={errors.thumbnail_image || errors.thumbnail} />
                            </div>

                            {/* Course Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Course Description & Overview (About Tab)" />
                                <textarea
                                    id="description"
                                    rows={5}
                                    className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2.5 px-3.5 shadow-xs transition"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Detail what students will learn, curriculum outline, prerequisites..."
                                />
                                <InputError className="mt-1.5" message={errors.description} />
                            </div>

                            {/* Course Curriculum (Modules & Subtitles) */}
                            <div className="pt-2 border-t border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Layers className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                                Course Curriculum (Modules & Chapters)
                                            </h4>
                                            <p className="text-[11px] text-gray-500">
                                                Add module titles and topics/subtitles for the student syllabus view
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addCurriculumItem}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/60 transition"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Add Module</span>
                                    </button>
                                </div>

                                {data.curriculum && data.curriculum.length > 0 ? (
                                    <div className="space-y-3">
                                        {data.curriculum.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2.5 relative group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                                                        Module {idx + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCurriculumItem(idx)}
                                                        className="text-gray-400 hover:text-rose-600 transition p-1"
                                                        title="Remove Module"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {/* Module Title */}
                                                    <div>
                                                        <div className="flex rounded-lg shadow-xs">
                                                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-xs font-bold select-none shrink-0">
                                                                Module {idx + 1}:
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => updateCurriculumTitle(idx, e.target.value)}
                                                                placeholder="e.g. HTML Fundamentals"
                                                                className="w-full text-xs rounded-r-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 shadow-xs"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Subtitles / Topics list */}
                                                    <div className="space-y-2 pt-2 border-t border-gray-200/70">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                                                                    Subtitles / Topics ({Array.isArray(item.subtitles) ? item.subtitles.length : 1})
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => addModuleSubtitle(idx)}
                                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                                <span>Add Subtitle</span>
                                                            </button>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {(Array.isArray(item.subtitles) ? item.subtitles : [item.subtitle || '']).map((sub, sIdx) => (
                                                                <div key={sIdx} className="flex items-center gap-2">
                                                                    <div className="flex-1 flex rounded-lg shadow-xs">
                                                                        <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-[11px] font-mono font-semibold select-none shrink-0">
                                                                            {idx + 1}.{sIdx + 1}
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            value={sub}
                                                                            onChange={(e) => updateModuleSubtitle(idx, sIdx, e.target.value)}
                                                                            placeholder={`e.g. Topic ${sIdx + 1} (e.g. Introduction to HTML)`}
                                                                            className="w-full text-xs rounded-r-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-1.5 px-3 shadow-xs"
                                                                        />
                                                                    </div>
                                                                    {(Array.isArray(item.subtitles) ? item.subtitles.length : 1) > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeModuleSubtitle(idx, sIdx)}
                                                                            className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                                                                            title="Remove Subtitle"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center space-y-1">
                                        <p className="text-xs text-gray-500">
                                            No curriculum modules added yet.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addCurriculumItem}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            + Click here to add the first module
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* What This Course Includes (Features / Perks) */}
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                            <ListChecks className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900">
                                                This Course Includes (Highlights)
                                            </h3>
                                            <p className="text-[11px] text-gray-400">
                                                Key features and perks shown on the course sidebar (e.g. Certificate, Lifetime Access)
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addCourseIncludeItem}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Add Feature</span>
                                    </button>
                                </div>

                                {Array.isArray(data.course_includes) && data.course_includes.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {data.course_includes.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="flex-1 flex rounded-lg shadow-xs">
                                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs font-medium select-none shrink-0">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={(e) => updateCourseIncludeItem(idx, e.target.value)}
                                                        placeholder="e.g. Official Certificate of Completion"
                                                        className="w-full text-xs rounded-r-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3 shadow-xs"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCourseIncludeItem(idx)}
                                                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                                                    title="Remove Feature"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center space-y-1">
                                        <p className="text-xs text-gray-500">
                                            No course features added yet.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addCourseIncludeItem}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                        >
                                            + Click here to add a feature perk
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Status & Featured Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                                <div>
                                    <InputLabel htmlFor="status" value="Course Status *" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => {
                                            const nextStatus = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                status: nextStatus,
                                                is_featured: nextStatus === 'published' ? prev.is_featured : false,
                                            }));
                                        }}
                                        className="w-full text-xs sm:text-sm rounded-lg border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 py-2 px-3.5 shadow-xs transition"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    <InputError className="mt-1.5" message={errors.status} />
                                </div>

                                <div className="flex items-center sm:pt-6">
                                    <label className={`relative flex items-center space-x-3 select-none ${data.status !== 'published' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            disabled={data.status !== 'published'}
                                            checked={data.status === 'published' && data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
                                        />
                                        <div>
                                            <span className="text-xs sm:text-sm font-semibold text-gray-900">Mark as Featured Course</span>
                                            <p className="text-[11px] text-gray-400">
                                                {data.status === 'published'
                                                    ? 'Featured courses are highlighted on the top landing page showcase'
                                                    : 'Only published courses can be featured on the showcase'}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                                <Link
                                    href={route('admin.courses.index')}
                                    className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-xs transition"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing} className="px-5 py-2 text-xs font-semibold shadow-xs">
                                    <Save className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{processing ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}</span>
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
