/**
 * Reusable Form Input Component with icon and focus ring
 */

export function Input({
    type = "text",
    value,
    placeholder,
    icon,
    onChange,
    required = false,
    ...props
}) {
    return (
        <div className="input-box">
            {icon && <i className={icon}></i>}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                {...props}
            />
        </div>
    );
}
