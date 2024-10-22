import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ variant = "default", className, children, ...props }) => {
    let baseStyles = "px-4 py-2 font-semibold rounded-md transition duration-300 ";

    if (variant === "outline") {
        baseStyles += "bg-white bg-opacity-20 text-white hover:bg-opacity-30 border border-solid border-white ";
    } else {
        baseStyles += "bg-salmon-500 hover:bg-salmon-600 text-white ";
    }

    return (
        <button className={`${baseStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};
