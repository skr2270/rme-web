import React from 'react';

interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, className, maxLength, inputRef }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      maxLength={maxLength}
      ref={inputRef}
      aria-label={placeholder || 'Input field'}
    />
  );
};