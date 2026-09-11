import { Link } from '@inertiajs/react';

export function getRelativeUrl(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url, window.location.origin);
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return url;
    }
}

export default function Pagination({ links = [], from = 0, to = 0, total = 0, itemLabel = 'items' }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500 font-mono">
                Showing <span className="font-semibold text-slate-900">{from || 0}</span> to{' '}
                <span className="font-semibold text-slate-900">{to || 0}</span> of{' '}
                <span className="font-semibold text-slate-900">{total}</span> {itemLabel}
            </div>
            <div className="flex space-x-1">
                {links.map((link, idx) => {
                    const relativeUrl = getRelativeUrl(link.url);

                    if (!relativeUrl) {
                        return (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs rounded-md font-medium bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 select-none"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={relativeUrl}
                            preserveState
                            preserveScroll
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                                link.active
                                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
