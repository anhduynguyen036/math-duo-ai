import React from "react";
import QuizCard from "@/components/QuizCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="ambient-grid-background min-h-screen w-full flex flex-col justify-between transition-colors duration-300 relative overflow-x-hidden">
      {/* Top Navigation Bar with Logo and ThemeToggle at top-right */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/25">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 bg-clip-text text-transparent">
                MathDuo AI
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                Toán Tiểu Học
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Nền tảng luyện tập Toán Tiểu Học vui nhộn cùng Gia sư AI thông minh 🦉
            </p>
          </div>
        </div>

        {/* ThemeToggle at the top-right corner */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Quiz Section */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8 relative z-10">
        <QuizCard />
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-600 relative z-10">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          MathDuo AI • Toán Tiểu Học Trực Quan & Gia Sư Trí Tuệ Nhân Tạo Thông Minh ⭐
        </p>
      </footer>
    </div>
  );
}
