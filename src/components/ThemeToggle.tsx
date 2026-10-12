"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

export interface ThemeToggleProps {
  className?: string;
}

const THEME_STORAGE_KEY = "math-duo-theme";

/**
 * =========================================================================
 * 👤 NHIỆM VỤ CỦA BẠN 1: Nút bấm chuyển đổi Theme Sáng / Tối (Dark / Light)
 * =========================================================================
 * Yêu cầu:
 * 1. Khi người dùng bấm nút:
 *    - Nếu đang là 'light' -> thêm class 'dark' vào thẻ <html class="dark">
 *    - Nếu đang là 'dark' -> gỡ class 'dark' khỏi thẻ <html>
 * 2. Lưu trạng thái vào `localStorage` với key 'math-duo-theme' để khi F5 tải lại trang
 *    vẫn giữ nguyên giao diện người dùng đã chọn.
 * 3. Hiển thị icon Mặt trời (Sun) khi ở Dark mode và icon Mặt trăng (Moon) khi ở Light mode.
 * =========================================================================
 */

// 👇 TODO [BẠN 1]: Hàm áp dụng theme vào thẻ <html> và lưu vào localStorage
function applyTheme(mode: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Bỏ qua nếu trình duyệt chặn localStorage
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "class") {
        callback();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("storage", callback);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  // Lắng nghe trạng thái class 'dark' trên <html>
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  // 👇 TODO [BẠN 1]: Viết hàm xử lý khi click nút đổi theme
  const handleToggle = () => {
    applyTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-2xl
        transition-all duration-200 border cursor-pointer
        bg-white/80 dark:bg-slate-900/80
        text-slate-700 dark:text-slate-200
        border-slate-200 dark:border-slate-800
        hover:border-violet-400 dark:hover:border-violet-500
        shadow-sm hover:shadow
        focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${className}`}
      aria-label="Chuyển đổi giao diện Sáng / Tối"
      title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
    >
      {/* Icon thay đổi theo trạng thái theme */}
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-5 h-5 text-violet-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
