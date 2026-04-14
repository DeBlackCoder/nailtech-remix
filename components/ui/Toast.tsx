"use client";
export type ToastType = "success" | "error" | "info";
interface ToastProps { message: string; type: ToastType; onDismiss: () => void; className?: string; }
export default function Toast({ message, type, onDismiss, className = "" }: ToastProps) {
  const colors = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-blue-500" };
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg ${colors[type]} ${className}`}>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-white/80 hover:text-white text-lg leading-none">×</button>
    </div>
  );
}
