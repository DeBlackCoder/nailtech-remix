import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[14px] px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-[#222222] text-white",
        secondary: "bg-[#f2f2f2] text-[#222222]",
        outline:   "border border-[#c1c1c1] text-[#222222] bg-transparent",
        brand:     "bg-[#ff385c] text-white",
        success:   "bg-emerald-100 text-emerald-700",
        pending:   "bg-[#f2f2f2] text-[#6a6a6a]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
