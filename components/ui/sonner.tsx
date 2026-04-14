"use client";
import { Toaster as Sonner } from "sonner";
type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner theme="light" className="toaster group"
    toastOptions={{ classNames: {
      toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#222222] group-[.toaster]:border-[#c1c1c1] group-[.toaster]:shadow-lg group-[.toaster]:rounded-[14px]",
      description: "group-[.toast]:text-[#6a6a6a]",
      success: "group-[.toast]:text-emerald-700",
      error: "group-[.toast]:text-[#c13515]",
    }}} {...props} />
);
export { Toaster };
