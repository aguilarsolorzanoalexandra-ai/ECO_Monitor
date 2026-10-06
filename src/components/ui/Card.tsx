import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-eco-border shadow-sm p-5 transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  action,
  className = "",
}) => {
  return (
    <div className={cn("flex items-start justify-between mb-4 border-b border-eco-border/60 pb-3", className)}>
      <div>
        <h3 className="text-base font-semibold text-eco-text leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-eco-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
