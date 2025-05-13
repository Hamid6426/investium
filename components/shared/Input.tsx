interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({
  label,
  name,
  type = "text",
  required,
  ...rest
}: InputProps) => {
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
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 text-heading  placeholder-muted focus:ring-primary"
        {...rest}
      />
    </div>
  );
};

export default Input;
