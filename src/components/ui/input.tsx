import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            className={`w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400 focus:border-transparent ${className}`}
            {...props}
        />
    );
};
