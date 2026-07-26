/**
 * Reusable Button Component supporting icons, loaders, and custom styling
 */

export function Button({
    children,
    type = "button",
    disabled = false,
    isLoading = false,
    className = "",
    onClick,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`btn-custom ${className}`}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <span className="btn-flex">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
