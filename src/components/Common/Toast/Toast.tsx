"use client";

import React, { useEffect } from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useToastStore } from "@/stores/useToastStore";

const toastConfigMap: Record<string, ToastOptions & { icon?: React.ReactNode }> = {
  success: {
    icon: <img src="/assets/toastcheck.svg" width={24} height={24} alt="성공 알림 아이콘" />,
    style: {
      background: "#141415",
      color: "#f7f7f7",
      fontWeight: "500",
      border: "1px solid #c3e88d",
      wordBreak: "keep-all",
      borderRadius: "12px",
    },
    progressStyle: { background: "#c3e88d" },
    closeButton: true,
  },
  error: {
    icon: <Image src="/assets/toastcancel.svg" width={24} height={24} alt="에러 알림 아이콘" />,
    style: {
      background: "#141415",
      color: "#f7f7f7",
      fontWeight: "500",
      border: "1px solid #FF3F02",
      wordBreak: "keep-all",
      borderRadius: "12px",
    },
    progressStyle: { background: "#FF3F02" },
    closeButton: true,
  },
  warn: {
    style: {
      background: "#141415",
      color: "#f7f7f7",
      fontWeight: "500",
      border: "1px solid #fac66a",
      wordBreak: "keep-all",
      borderRadius: "12px",
    },
    progressStyle: { background: "#fac66a" },
    closeButton: true,
  },
  info: {
    style: {
      background: "#141415",
      color: "#f7f7f7",
      fontWeight: "500",
      border: "1px solid #82aaff",
      wordBreak: "keep-all",
      borderRadius: "12px",
    },
    progressStyle: { background: "#82aaff" },
    closeButton: true,
  },
  custom: {
    icon: <Image src="/assets/toastcheck.svg" width={24} height={24} alt="커스텀 알림 아이콘" />,
    position: "bottom-right",
    style: {
      background: "#141415",
      color: "#f7f7f7",
      fontSize: "16px",
      wordBreak: "keep-all",
      borderRadius: "12px",
    },
    progressStyle: { background: "#faa6c9", borderStyle: "none" },
    closeButton: true,
  },
};

const Toast = () => {
  const { message, type, show, clearToast } = useToastStore();

  useEffect(() => {
    if (!message || !show) return;

    const config = toastConfigMap[type];

    try {
      if (type === "custom") {
        toast(message, config);
      } else {
        toast[type](message, config);
      }
    } catch (error) {
      console.error("Toast 오류:", error);
    }

    const timer = setTimeout(() => clearToast(), 3000);
    return () => clearTimeout(timer);
  }, [message, type, show, clearToast]);

  return (
    <ToastContainer
      className="custom-toast-position"
      limit={1}
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Toast;