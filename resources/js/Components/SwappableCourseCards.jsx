import { Link } from '@inertiajs/react';
import { ArrowRight, Star } from 'lucide-react';

const getCourseImage = (course) => {
    if (course.thumbnail && typeof course.thumbnail === 'string' && (course.thumbnail.startsWith('http') || course.thumbnail.startsWith('/'))) {
        return course.thumbnail;
    }
    if (course.image) return course.image;
    const cat = (course.category_slug || course.category || '').toLowerCase();
    if (cat.includes('cloud') || cat.includes('devops')) return '/images/courses/course-devops.svg';
    if (cat.includes('ai') || cat.includes('python')) return '/images/courses/course-ai.svg';
    if (cat.includes('laravel') || cat.includes('web')) return '/images/courses/course-nextjs.svg';
    if (cat.includes('mobile') || cat.includes('flutter') || cat.includes('java')) return '/images/courses/course-java.svg';
    return '/images/courses/course-system-design.svg';
};

export default function SwappableCourseCards({
    courses = [],
    theme = 'dark',
}) {
    const isDark = theme === 'dark';

    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* 5 Course Cards in One Responsive Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5">
                {courses.map((course) => (
                    <Link
                        key={course.id || course.slug}
                        href={course.slug ? route('courses.show', course.slug) : route('courses.index')}
                        className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden select-none ${
                            isDark
                                ? 'border-slate-800/80 bg-[#0c101c] hover:border-blue-500/50 hover:bg-[#0f1526] hover:shadow-lg hover:shadow-blue-500/5'
                                : 'border-slate-200/90 bg-white hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5'
                        }`}
                    >
                        {/* Card Visual Header */}
                        <div className="relative w-full h-32 overflow-hidden bg-slate-950 border-b border-slate-100 dark:border-slate-800/60">
                            <img
                                src={getCourseImage(course)}
                                alt={course.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-3.5">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 dark:text-sky-400">
                                    {course.category}
                                </p>
                                <h3 className="text-[14px] sm:text-[15px] font-semibold tracking-normal line-clamp-2 leading-[1.35] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors min-h-[2.5rem]">
                                    {course.title}
                                </h3>

                                {/* Instructor Info & Rating */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 truncate">
                                        <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700/80 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                                            {course.instructor?.avatar || 'CA'}
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                            {course.instructor?.name || 'Comestro Faculty'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 font-semibold text-amber-500 shrink-0">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-slate-800 dark:text-slate-200 text-xs">{course.rating || '4.9'}</span>
                                    </div>
                                </div>

                                {/* Duration & Level */}
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span>{course.duration || '10 Weeks'}</span>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span>{course.level || 'All Levels'}</span>
                                </div>
                            </div>

                            {/* Price & Action Footer */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                        {course.price}
                                    </span>
                                    {course.originalPrice && (
                                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                                            {course.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-sky-400 group-hover:text-blue-700 dark:group-hover:text-sky-300 transition-colors">
                                    <span>Explore</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
