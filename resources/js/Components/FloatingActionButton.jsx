import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({
    href,
    onClick,
    label,
    icon: Icon = Plus,
    className = '',
    title,
    children,
    ...props
}) {
    const text = label || children;
    const baseClasses = `fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs border border-indigo-700/30 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group ${className}`;

    if (href) {
        return (
            <Link
                href={href}
                className={baseClasses}
                title={title || (typeof text === 'string' ? text : undefined)}
                {...props}
            >
                {Icon && (
                    <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-90" />
                )}
                {text && <span>{text}</span>}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={baseClasses}
            title={title || (typeof text === 'string' ? text : undefined)}
            {...props}
        >
            {Icon && (
                <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:rotate-90" />
            )}
            {text && <span>{text}</span>}
        </button>
    );
}
