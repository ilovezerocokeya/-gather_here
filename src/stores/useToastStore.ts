import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warn" | "custom";

interface ToastState {
  message: string | null;
  type: ToastType;
  show: boolean;
  showToast: (message: string, type: ToastType) => void;
  clearToast: () => void;
}

let toastTimer: NodeJS.Timeout | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "info",
  show: false,
  showToast: (message, type) => {
    if (toastTimer) clearTimeout(toastTimer);

    set({ message, type, show: true });

    toastTimer = setTimeout(() => {
      set({ show: false, message: null });
      toastTimer = null;
    }, 3000);
  },
  clearToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ message: null, show: false });
  },
}));