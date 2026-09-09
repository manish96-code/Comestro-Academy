export default function ApplicationLogo({ className = '', dark = false, ...props }) {
    return (
        <div className={`flex items-center gap-2.5 font-mono ${className}`} {...props}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-all ${
                dark
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-emerald-500/10'
                    : 'border-emerald-600/30 bg-emerald-50 text-emerald-600'
            }`}>
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
            </div>
            <div className="flex flex-col leading-tight">
                <span className={`text-[13px] font-extrabold tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>
                    COMESTRO
                </span>
                <span className={`text-[10px] font-bold tracking-widest ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ACADEMY
                </span>
            </div>
        </div>
    );
}
