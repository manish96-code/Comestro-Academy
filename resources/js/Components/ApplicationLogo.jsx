export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div className={`flex items-center gap-2.5 font-mono ${className}`} {...props}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/30 bg-emerald-50 text-emerald-600 shadow-sm transition-all group-hover:border-emerald-600">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
            </div>
            <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold tracking-wider text-slate-900">
                    COMESTRO
                </span>
                <span className="text-[10px] font-bold tracking-widest text-emerald-600">
                    ACADEMY
                </span>
            </div>
        </div>
    );
}
