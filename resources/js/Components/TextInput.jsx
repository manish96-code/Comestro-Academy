import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition ' +
                className
            }
            ref={localRef}
        />
    );
});
