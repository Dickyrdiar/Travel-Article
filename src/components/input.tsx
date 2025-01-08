import React, { forwardRef } from 'react';

interface InputProps {
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  color?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  type?: string;
  className?: string;
  componentLeft?: React.ReactNode;
  componentRight?: React.ReactNode;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isError?: boolean;
}

const sizes = {
  xsmall: { input: 'h-7 rounded-sm', icon: 'h-5 w-5' },
  small: { input: 'h-8 rounded-sm', icon: 'h-5 w-5' },
  medium: { input: 'h-11 rounded-md', icon: 'h-5 w-5' },
  large: { input: 'h-14 rounded-md', icon: 'h-6 w-6' },
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  placeholder,
  value,
  onChange,
  onBlur,
  color = 'gray',
  size = 'medium',
  type = 'text',
  className = '',
  componentLeft,
  componentRight,
  disabled,
  onKeyDown,
  isError
}, ref) => {
  const height = sizes[size]?.input;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-lg focus:outline-none">
        {componentLeft}
      </div>

      <input
        type={type}
        className={`${height} w-full border border-${color}-500 p-4 ${
          componentLeft && type === 'tel' ? 'pl-[108px]' : componentLeft && type !== 'tel' ? 'pl-5xl' : 'pl-lg'
        } ${componentRight ? 'pr-5xl' : 'pr-lg'} ${className} text-text-primary px-sm py-xs justify-start items-center gap-xxs inline-flex focus:outline-none focus:border-primary-400 focus:ring focus:ring-primary-200 placeholder:text-text-placeholder
          ${isError ? 'border-red-500' : 'border-gray-300'}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        ref={ref}
      />

      <div className="absolute inset-y-0 right-[-1px] flex items-center pr-lg focus:outline-none">
        {componentRight}
      </div>
    </div>
  );
});

export default Input;
