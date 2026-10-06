import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-eco-primary text-white hover:bg-eco-primary-hover focus:ring-eco-primary border border-transparent shadow-sm",
    secondary:
      "bg-eco-primary-light text-eco-primary hover:bg-emerald-100 border border-eco-primary-border",
    outline:
      "bg-white text-eco-text border border-eco-border hover:bg-slate-50 focus:ring-slate-300",
    danger:
      "bg-eco-danger text-white hover:bg-red-700 focus:ring-red-500 border border-transparent shadow-sm",
    ghost:
      "bg-transparent text-eco-text hover:bg-slate-100 focus:ring-slate-200",
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
