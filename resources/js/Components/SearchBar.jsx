import { RotateCcw, Search, X } from 'lucide-react';
import { forwardRef } from 'react';

const SearchBar = forwardRef(function SearchBar(
    {
        value = '',
        onChange,
        onClear,
        onReset,
        onSubmit,
        onSearch,
        placeholder = 'Search...',
        containerClassName = '',
        inputContainerClassName = 'relative flex-1',
        inputClassName = '',
        className = '',
        iconClassName = 'h-3.5 w-3.5 text-slate-400',
        size = 'sm', // 'sm' | 'md' | 'lg'
        clearable = false,
        disabled = false,
        loading = false,
        showButton = true,
        buttonText = 'Search',
        buttonClassName = '',
        buttonIcon: ButtonIcon = null,
        children,
        ...props
    },
    ref
) {
    const handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClear) {
            onClear();
        } else if (onChange) {
            onChange({ target: { value: '' } });
        }
    };

    const handleFormSubmit = (e) => {
        if (onSubmit) {
            e.preventDefault();
            onSubmit(e);
        } else if (onSearch) {
            e.preventDefault();
            onSearch(e);
        }
    };

    const showClear = (clearable || Boolean(onClear)) && Boolean(value);

    const sizeClasses =
        {
            sm: 'pl-9 py-1.5 text-xs',
            md: 'pl-9 py-2 text-xs',
            lg: 'pl-10 py-2.5 text-xs sm:text-sm',
        }[size] || 'pl-9 py-1.5 text-xs';

    const buttonSizeClasses =
        {
            sm: 'px-3.5 py-1.5 text-xs rounded-lg',
            md: 'px-4 py-2 text-xs rounded-xl',
            lg: 'px-5 py-2.5 text-xs sm:text-sm rounded-xl',
        }[size] || 'px-3.5 py-1.5 text-xs rounded-lg';

    const defaultInputClasses =
        'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-2xs';

    const defaultButtonClasses =
        'font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shrink-0 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const rightPaddingClass = showClear ? (size === 'lg' ? 'pr-9' : 'pr-8') : 'pr-3.5';

    const Wrapper = onSubmit ? 'form' : 'div';
    const wrapperProps = onSubmit
        ? { onSubmit: handleFormSubmit, className: `flex items-center gap-2.5 ${containerClassName}`.trim() }
        : { className: containerClassName ? `flex items-center gap-2.5 ${containerClassName}`.trim() : 'flex items-center gap-2.5 flex-1' };

    return (
        <Wrapper {...wrapperProps}>
            <div className={inputContainerClassName}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={iconClassName} />
                </div>

                <input
                    ref={ref}
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${defaultInputClasses} ${sizeClasses} ${rightPaddingClass} ${inputClassName} ${className}`.trim()}
                    {...props}
                />

                {showClear && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title="Clear search"
                    >
                        <X className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                    </button>
                )}
            </div>

            {showButton && (
                <button
                    type={onSubmit ? 'submit' : onSearch ? 'button' : 'submit'}
                    onClick={!onSubmit && onSearch ? onSearch : undefined}
                    disabled={disabled || loading}
                    className={`${defaultButtonClasses} ${buttonSizeClasses} ${buttonClassName}`.trim()}
                >
                    {loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : ButtonIcon ? (
                        <ButtonIcon className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
                    ) : null}
                    <span>{buttonText}</span>
                </button>
            )}

            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                    title="Reset search"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>
            )}

            {children}
        </Wrapper>
    );
});

export default SearchBar;
