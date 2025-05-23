interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "error" | "success";
  children: React.ReactNode;
}

const variantMap = {
  primary: "bg-primary hover:bg-primary/80 text-white",
  secondary: "bg-accent hover:bg-accent/80 text-white",
  success: "bg-success hover:bg-success/80 text-white",
  error: "bg-error hover:bg-error/80 text-white",
};

const Button = ({
  variant = "primary",
  children,
  type = "button",
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full py-2 px-4 font-semibold rounded transition duration-200 ${variantMap[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
