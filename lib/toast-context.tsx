"use client";
import { createContext, useCallback, useContext } from "react";
import { toast } from "sonner";
import { ToastType } from "@/components/ui/Toast";
interface ToastContextValue { showToast: (message: string, type: ToastType) => void; }
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback((message: string, type: ToastType) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
  }, []);
  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>;
}
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
