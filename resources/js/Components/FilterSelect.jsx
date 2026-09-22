import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

const FilterSelect = forwardRef(function FilterSelect(
    {
        value = '',
        onChange,
        options = [],
        placeholder = '',
        defaultOptionLabel = '',
        defaultOptionValue = '',
        valueKey = 'id',
        labelKey = 'title',
        icon: Icon = null,
        size = 'sm', // 'sm' | 'md' | 'lg'
        disabled = false,
        containerClassName = '',
        selectClassName = '',
        className = '',
        children,
        ...props
    },
    ref
) {
    const sizeConfig = {
        sm: {
            padding: Icon ? 'pl-8.5 pr-8 py-1.5 text-xs' : 'pl-3 pr-8 py-1.5 text-xs',
            iconClass: 'h-3.5 w-3.5',
            chevronClass: 'h-3.5 w-3.5',
        },
        md: {
            padding: Icon ? 'pl-9 pr-8.5 py-2 text-xs' : 'pl-3.5 pr-8.5 py-2 text-xs',
            iconClass: 'h-4 w-4',
            chevronClass: 'h-4 w-4',
        },
        lg: {
            padding: Icon ? 'pl-10 pr-9 py-2.5 text-xs sm:text-sm' : 'pl-4 pr-9 py-2.5 text-xs sm:text-sm',
            iconClass: 'h-4.5 w-4.5',
            chevronClass: 'h-4.5 w-4.5',
        },
    }[size] || {
        padding: Icon ? 'pl-8.5 pr-8 py-1.5 text-xs' : 'pl-3 pr-8 py-1.5 text-xs',
        iconClass: 'h-3.5 w-3.5',
        chevronClass: 'h-3.5 w-3.5',
    };

    const getOptionValue = (opt) => {
        if (typeof opt === 'object' && opt !== null) {
            if (valueKey && opt[valueKey] !== undefined) return opt[valueKey];
            if (opt.value !== undefined) return opt.value;
            if (opt.id !== undefined) return opt.id;
            if (opt.key !== undefined) return opt.key;
        }
        return opt;
    };

    const getOptionLabel = (opt) => {
        if (typeof opt === 'object' && opt !== null) {
            if (labelKey && opt[labelKey] !== undefined) return opt[labelKey];
            if (opt.label !== undefined) return opt.label;
            if (opt.name !== undefined) return opt.name;
            if (opt.title !== undefined) return opt.title;
            if (opt.text !== undefined) return opt.text;
        }
        return String(opt);
    };

    const defaultSelectClasses =
        'appearance-none rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const defaultLabel = placeholder || defaultOptionLabel;

    return (
        <div className={`relative inline-flex items-center ${containerClassName}`.trim()}>
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Icon className={sizeConfig.iconClass} />
                </div>
            )}

            <select
                ref={ref}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`${defaultSelectClasses} ${sizeConfig.padding} ${selectClassName} ${className}`.trim()}
                {...props}
            >
                {defaultLabel && (
                    <option
                        value={defaultOptionValue}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                        {defaultLabel}
                    </option>
                )}

                {Array.isArray(options) &&
                    options.map((opt, index) => {
                        const val = getOptionValue(opt);
                        const label = getOptionLabel(opt);
                        const key = (typeof opt === 'object' && opt !== null)
                            ? (opt.id ?? opt.value ?? `${val}-${index}`)
                            : `${val}-${index}`;

                        return (
                            <option
                                key={key}
                                value={val}
                                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            >
                                {label}
                            </option>
                        );
                    })}

                {children}
            </select>

            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <ChevronDown className={sizeConfig.chevronClass} />
            </div>
        </div>
    );
});

export default FilterSelect;
