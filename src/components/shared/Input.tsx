import { FaEye, FaEyeSlash, FaRegClipboard } from "react-icons/fa";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showPasswordToggle?: boolean;
  onToggleVisibility?: () => void;
  onCopyClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  showPasswordToggle,
  onToggleVisibility,
  onCopyClick,
  ...rest
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-heading"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full pl-4 pr-10 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 text-heading placeholder-muted focus:ring-primary"
          {...rest}
        />

        {showPasswordToggle && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-gray-500">
            <button type="button" onClick={onToggleVisibility}>
              {type === "password" ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
            </button>
            <button type="button" onClick={onCopyClick}>
              <FaRegClipboard size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
