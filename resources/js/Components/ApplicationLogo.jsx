export default function ApplicationLogo({ className = '', dark, imgClassName = '', ...props }) {
    const isExplicit = typeof dark === 'boolean';
    const isDarkMode = isExplicit ? dark : false;
    const baseImgClass = "h-8 sm:h-9 w-auto object-contain select-none transition-opacity duration-200";

    return (
        <div className={`inline-flex items-center ${className}`} {...props}>
            {isExplicit ? (
                <img
                    src={isDarkMode ? '/images/logo-dark.png' : '/images/logo.png'}
                    alt="Comestro - Connect. Innovate. Achieve"
                    className={`${baseImgClass} ${imgClassName}`}
                />
            ) : (
                <>
                    <img
                        src="/images/logo.png"
                        alt="Comestro - Connect. Innovate. Achieve"
                        className={`${baseImgClass} ${imgClassName} dark:hidden`}
                    />
                    <img
                        src="/images/logo-dark.png"
                        alt="Comestro - Connect. Innovate. Achieve"
                        className={`${baseImgClass} ${imgClassName} hidden dark:block`}
                    />
                </>
            )}
        </div>
    );
}
