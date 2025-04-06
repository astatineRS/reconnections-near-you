
import * as React from "react";
import { cn } from "@/lib/utils";

interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "green" | "blue" | "purple" | "amber" | "red";
}

const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ className, size = "md", color = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-1.5 w-1.5",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
    };
    
    const colorClasses = {
      primary: "bg-primary",
      secondary: "bg-secondary-foreground",
      green: "bg-emerald-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      amber: "bg-amber-500",
      red: "bg-red-500",
    };
    
    return (
      <span className="relative flex h-3 w-3">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            colorClasses[color]
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex rounded-full", 
            sizeClasses[size],
            colorClasses[color],
            className
          )}
          ref={ref}
          {...props}
        ></span>
      </span>
    );
  }
);

Pulse.displayName = "Pulse";

export { Pulse };
