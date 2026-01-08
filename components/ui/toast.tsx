"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function Toast({ show, title, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      // Schedule state updates asynchronously to avoid cascading renders
      setTimeout(() => {
        setIsVisible(true);
        setIsExiting(false);
      }, 0);
      
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsExiting(true), 0);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-4 shadow-lg transition-all duration-300 ${
      isExiting ? 'animate-slide-down opacity-0' : 'animate-slide-up'
    }`}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-900">{title}</p>
          <p className="text-xs text-emerald-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
