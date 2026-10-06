import React from "react";
import { ORIGIN_LABELS } from "@/lib/constants";
import { OriginBadgeType } from "@/types";

interface OriginBadgeProps {
  type: OriginBadgeType;
  className?: string;
  showTooltip?: boolean;
}

export const OriginBadge: React.FC<OriginBadgeProps> = ({
  type,
  className = "",
  showTooltip = true,
}) => {
  const config = ORIGIN_LABELS[type];

  return (
    <span
      title={showTooltip ? config.description : undefined}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${config.badgeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {config.label}
    </span>
  );
};
