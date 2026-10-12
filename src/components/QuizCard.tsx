"use client";

import React, { useState, useMemo } from "react";
import "katex/dist/katex.min.css";
import {
  Lightbulb,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Question, Option, mockQuestions } from "@/data/mockQuiz";
import { LatexText } from "@/components/LatexText";
import { ExplainChatDrawer } from "@/components/ExplainChatDrawer";

// Re-export LatexText for external consumers
export { LatexText };

export interface QuizCardProps {
  question?: Question;
  questions?: Question[];
  initialQuestionIndex?: number;
  onComplete?: (score: number, total: number) => void;
  onSubmit?: (selectedOptionKey: string, isCorrect: boolean) => void;
  className?: string;
}

interface QuestionAnswerState {
  selectedOption: string | null;
  isSubmitted: boolean;
}

/**
 * =========================================================================
 * 👤 NHIỆM VỤ CỦA BẠN 3: Kỹ sư Giao diện Thẻ Bài tập Trắc nghiệm (QuizCard)
 * =========================================================================
 * Yêu cầu:
 * 1. Hiển thị đề bài câu hỏi và danh sách 4 lựa chọn A, B, C, D (bo tròn, chữ to dễ đọc).
 * 2. Trạng thái CHƯA nộp bài:
 *    - Cho phép học sinh click chọn 1 đáp án.
 *    - Nút "Explain" ở thanh footer dưới cùng phải HOÀN TOÀN ẨN ĐI.
 * 3. Trạng thái ĐÃ nộp bài:
 *    - Đáp án đúng: Viền xanh lá (#22c55e), hiện badge "✓ Đúng rồi!".
 *    - Đáp án sai đã chọn: Viền đỏ (#ef4444), hiện badge "✕ Chưa chính xác".
 *    - Hiển thị dòng giải thích (feedback) của từng lựa chọn.
 *    - Nút "Explain" ở thanh footer xuất hiện mượt mà để học sinh mở khung chat AI.
 * =========================================================================
 */
export function QuizCard({
  question,
  questions,
  initialQuestionIndex = 0,
  onComplete,
  onSubmit,
  className = "",
}: QuizCardProps) {
  // Normalize question list to support both single `question` and multiple `questions`
  const activeQuestions = useMemo(() => {
    if (questions && questions.length > 0) return questions;
    if (question) return [question];
    return mockQuestions;
  }, [questions, question]);

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(
      Math.max(0, initialQuestionIndex),
      Math.max(0, activeQuestions.length - 1)
    )
  );

  const [answers, setAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [showHints, setShowHints] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion: Question | undefined = activeQuestions[currentIndex];

  const currentAnswerState: QuestionAnswerState = currentQuestion
    ? answers[currentQuestion.id] || { selectedOption: null, isSubmitted: false }
    : { selectedOption: null, isSubmitted: false };

  const selectedOption = currentAnswerState.selectedOption;
  const isSubmitted = currentAnswerState.isSubmitted;

  // Handle selecting an option
  const handleSelectOption = (key: string) => {
    if (isSubmitted || !currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption: key,
        isSubmitted: false,
      },
    }));
  };

  // Submit the selected option
  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion || isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOption,
        isSubmitted: true,
      },
    }));

    const chosenOpt = currentQuestion.options.find((o) => o.key === selectedOption);
    const isCorrect = chosenOpt?.isCorrect ?? false;
    onSubmit?.(selectedOption, isCorrect);
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowHints(false);
      setIsChatDrawerOpen(false);
      setIsCompleted(false);
    }
  };

  // Navigate to next question or submit answer
  const handleNext = () => {
    if (!currentQuestion) return;

    // If not submitted yet, clicking Next evaluates and submits the selected answer
    if (!isSubmitted && selectedOption) {
      handleSubmit();
      return;
    }

    // If already submitted and there are more questions, proceed to next
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowHints(false);
      setIsChatDrawerOpen(false);
      setIsCompleted(false);
      return;
    }

    // If on the last question and already submitted, complete the quiz
    if (isSubmitted) {
      const correctCount = activeQuestions.reduce((count, q) => {
        const ans = answers[q.id];
        const correctOpt = q.options.find((o) => o.isCorrect);
        return ans?.selectedOption === correctOpt?.key ? count + 1 : count;
      }, 0);

      setIsCompleted(true);
      onComplete?.(correctCount, activeQuestions.length);
    }
  };

  // Reset the active question to retake
  const handleResetCurrent = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
    setShowHints(false);
    setIsChatDrawerOpen(false);
    setIsCompleted(false);
  };

  // Restart all questions in quiz
  const handleRestartAll = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowHints(false);
    setIsChatDrawerOpen(false);
    setIsCompleted(false);
  };

  // Fallback if no questions are present
  if (!currentQuestion || activeQuestions.length === 0) {
    return (
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13171f] text-slate-700 dark:text-slate-200 text-center border border-slate-200 dark:border-[#262d3d] shadow-xl">
        <p>Không có câu hỏi nào để hiển thị.</p>
      </div>
    );
  }

  const selectedOptObj = currentQuestion.options.find((o) => o.key === selectedOption);
  const isCorrectChoice = selectedOptObj?.isCorrect ?? false;

  // Completion summary screen
  if (isCompleted) {
    const totalCount = activeQuestions.length;
    const correctCount = activeQuestions.reduce((count, q) => {
      const ans = answers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      return ans?.selectedOption === correctOpt?.key ? count + 1 : count;
    }, 0);
    const scorePercent = Math.round((correctCount / totalCount) * 100);

    return (
      <div
        className={`w-full max-w-4xl lg:max-w-5xl mx-auto bg-white dark:bg-[#13171f] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-[#262d3d] shadow-xl dark:shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center font-sans relative overflow-hidden transition-colors ${className}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400" />
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Chúc mừng em đã hoàn thành bài luyện tập! 🎉
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-md mb-6">
          Em đã trả lời đúng{" "}
          <strong className="text-emerald-600 dark:text-emerald-400">{correctCount}</strong> /{" "}
          {totalCount} câu hỏi ({scorePercent}%). Em giỏi lắm! ⭐
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestartAll}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all cursor-pointer active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại từ đầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-full max-w-4xl lg:max-w-5xl mx-auto bg-white dark:bg-[#13171f] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200/90 dark:border-[#262d3d] shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 p-6 sm:p-10 flex flex-col font-sans transition-all duration-300 relative overflow-hidden ${
          isChatDrawerOpen
            ? "xl:-translate-x-52 2xl:-translate-x-64 xl:max-w-3xl 2xl:max-w-4xl"
            : ""
        } ${className}`}
      >
        {/* Decorative notebook top border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400" />

        {/* Header section: Notebook title & progress counter */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-[#262d3d]/80 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-[#181c24] text-amber-800 dark:text-amber-400 border border-amber-200/80 dark:border-[#2a3449] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Toán Tiểu Học • Lớp 3-5
            </span>
            <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
              Luyện tập vui nhộn ⭐
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 font-mono font-medium">
              Câu <strong className="text-slate-800 dark:text-slate-200">{currentIndex + 1}</strong> /{" "}
              {activeQuestions.length}
            </span>
            {isSubmitted && (
              <button
                type="button"
                onClick={handleResetCurrent}
                title="Làm lại câu này"
                aria-label="Làm lại câu hỏi này"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181c24] dark:hover:bg-[#222836] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-[#262d3d] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Question Title Prompt with KaTeX */}
        <div className="py-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed tracking-normal">
            <LatexText text={currentQuestion.title} />
          </h2>
        </div>

        {/* Danh sách 4 lựa chọn (A, B, C, D) dạng button bo góc tròn (rounded-2xl) */}
        <div className="space-y-4" role="group" aria-label="Danh sách các lựa chọn">
          {currentQuestion.options.map((option: Option) => {
            const isSelected = selectedOption === option.key;

            // 1. Trạng thái chưa nộp: Cho phép người dùng click chọn 1 đáp án
            if (!isSubmitted) {
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelectOption(option.key)}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-150 flex flex-col gap-2.5 outline-none cursor-pointer group active:scale-[0.99] ${
                    isSelected
                      ? "bg-violet-50/90 dark:bg-[#1f1e38] border-violet-500 dark:border-violet-500 shadow-md shadow-violet-100 dark:shadow-violet-950/40 ring-1 ring-violet-500/40"
                      : "bg-slate-50 hover:bg-slate-100/80 dark:bg-[#181c24] dark:hover:bg-[#1d232e] border-slate-200/90 hover:border-slate-300 dark:border-[#262d3d] dark:hover:border-slate-500"
                  }`}
                >
                  <span className="flex items-start gap-4 w-full">
                    <span
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold flex items-center justify-center text-base sm:text-lg border shrink-0 transition-colors ${
                        isSelected
                          ? "bg-violet-600 text-white border-violet-400 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 dark:bg-[#222836] dark:text-slate-300 dark:border-[#30384a] group-hover:border-slate-400 dark:group-hover:border-slate-500"
                      }`}
                    >
                      {option.key}
                    </span>
                    <span className="flex-1 font-medium text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed pt-0.5">
                      <LatexText text={option.text} />
                    </span>
                  </span>
                </button>
              );
            }

            // 2. Trạng thái đã nộp:
            // 2.1 Lựa chọn sai được chọn: Viền đỏ, hiển thị tag ✕ Not quite và dòng feedback bên dưới
            if (isSelected && !option.isCorrect) {
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full text-left p-4 md:p-5 rounded-2xl border-2 border-red-500 dark:border-[#ef4444] bg-red-50/80 dark:bg-[#ef4444]/10 shadow-lg shadow-red-100/50 dark:shadow-red-950/30 flex flex-col gap-3 transition-all cursor-default"
                >
                  <span className="flex items-start justify-between gap-3 w-full">
                    <span className="flex items-start gap-4 flex-1 min-w-0">
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold flex items-center justify-center text-base sm:text-lg border shrink-0 bg-red-500 dark:bg-[#ef4444] text-white border-red-400 shadow-xs">
                        {option.key}
                      </span>
                      <span className="flex-1 font-medium text-slate-900 dark:text-slate-100 text-base md:text-lg leading-relaxed pt-0.5">
                        <LatexText text={option.text} />
                      </span>
                    </span>
                    <span className="shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-red-700 dark:text-[#ef4444] bg-red-100 dark:bg-red-950/90 border border-red-300 dark:border-[#ef4444]/60 flex items-center gap-1 shadow-xs">
                      ✕ Chưa đúng
                    </span>
                  </span>

                  {/* Feedback dòng chữ màu xám bên dưới */}
                  <span className="block w-full pt-2.5 border-t border-red-200 dark:border-red-500/20 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pl-1 sm:pl-14">
                    <LatexText text={option.feedback} />
                  </span>
                </button>
              );
            }

            // 2.2 Lựa chọn đúng: Viền xanh lá, hiển thị tag ✓ Đúng rồi ⭐ và dòng feedback bên dưới
            if (option.isCorrect) {
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full text-left p-4 md:p-5 rounded-2xl border-2 border-emerald-500 dark:border-[#22c55e] bg-emerald-50/80 dark:bg-[#22c55e]/10 shadow-lg shadow-emerald-100/50 dark:shadow-emerald-950/30 flex flex-col gap-3 transition-all cursor-default"
                >
                  <span className="flex items-start justify-between gap-3 w-full">
                    <span className="flex items-start gap-4 flex-1 min-w-0">
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold flex items-center justify-center text-base sm:text-lg border shrink-0 bg-emerald-500 dark:bg-[#22c55e] text-white border-emerald-400 shadow-xs">
                        {option.key}
                      </span>
                      <span className="flex-1 font-medium text-slate-900 dark:text-slate-100 text-base md:text-lg leading-relaxed pt-0.5">
                        <LatexText text={option.text} />
                      </span>
                    </span>
                    <span className="shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-700 dark:text-[#22c55e] bg-emerald-100 dark:bg-emerald-950/90 border border-emerald-300 dark:border-[#22c55e]/60 flex items-center gap-1 shadow-xs">
                      ✓ Đúng rồi ⭐
                    </span>
                  </span>

                  {/* Feedback dòng chữ màu xám bên dưới */}
                  <span className="block w-full pt-2.5 border-t border-emerald-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pl-1 sm:pl-14">
                    <LatexText text={option.feedback} />
                  </span>
                </button>
              );
            }

            // 2.3 Các lựa chọn còn lại: Làm mờ nhẹ và hiển thị giải thích đi kèm
            return (
              <button
                key={option.key}
                type="button"
                disabled
                aria-disabled="true"
                className="w-full text-left p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-[#262d3d] bg-slate-50/70 dark:bg-[#181c24]/80 opacity-85 hover:opacity-100 transition-opacity flex flex-col gap-2.5 cursor-default"
              >
                <span className="flex items-start gap-4 w-full">
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold flex items-center justify-center text-base sm:text-lg border shrink-0 bg-slate-200/80 dark:bg-[#222836] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-[#30384a]">
                    {option.key}
                  </span>
                  <span className="flex-1 font-normal text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed pt-0.5">
                    <LatexText text={option.text} />
                  </span>
                </span>

                {/* Feedback giải thích đi kèm */}
                <span className="block w-full pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed pl-1 sm:pl-14">
                  <LatexText text={option.feedback} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Result feedback banner when submitted */}
        {isSubmitted && (
          <div
            className={`mt-6 p-4 sm:p-5 rounded-2xl border flex items-center gap-3.5 transition-all ${
              isCorrectChoice
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-500/40 text-red-800 dark:text-red-200"
            }`}
          >
            {isCorrectChoice ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="text-sm sm:text-base font-medium leading-relaxed">
              {isCorrectChoice
                ? "Xuất sắc! Bạn nhỏ đã chọn đúng rồi đó 🌟"
                : "Chưa đúng rồi nè. Đọc phần giải thích bên trên hoặc bấm nút Explain bên dưới để Gia sư Cú Vàng hướng dẫn nhé!"}
            </span>
          </div>
        )}

        {/* Giao diện Hint expandable drawer */}
        {showHints && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/25 border border-amber-300/80 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Gợi ý giải bài ({currentQuestion.hints?.length ?? 0})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHints(false)}
                className="text-amber-700/80 hover:text-amber-900 dark:text-amber-400/80 dark:hover:text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-md hover:bg-amber-200/50 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>
            {currentQuestion.hints && currentQuestion.hints.length > 0 ? (
              <div className="space-y-2.5 text-xs sm:text-sm text-amber-950/90 dark:text-amber-100/90 pl-1">
                {currentQuestion.hints.map((hint, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-300 dark:border-amber-500/30">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <LatexText text={hint} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-700 dark:text-amber-300/80 italic pl-1">
                Không có gợi ý cho câu hỏi này.
              </p>
            )}
          </div>
        )}

        {/* 2. Thanh footer điều hướng */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-[#262d3d] flex flex-wrap items-center justify-between gap-4">
          {/* Bên trái: Nút "Hint" (luôn có) và nút "Explain" (CHỈ hiển thị sau khi nộp bài) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowHints((prev) => !prev)}
              className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                showHints
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/50 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200 dark:bg-[#181c24] dark:hover:bg-[#222836] dark:text-slate-300 dark:border-[#2b3548]"
              }`}
              title="Gợi ý"
            >
              <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Hint</span>
              {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[11px] bg-amber-200 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 font-mono">
                  {currentQuestion.hints.length}
                </span>
              )}
            </button>

            {/* Điều khiển hiển thị nút Explain: Ẩn hoàn toàn khi isSubmitted = false, xuất hiện với fade-in mượt mà khi isSubmitted = true */}
            {isSubmitted && (
              <button
                type="button"
                onClick={() => setIsChatDrawerOpen(true)}
                className="animate-fade-in px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/40 shadow-xs active:scale-95"
                title="Hỏi Gia sư AI giải thích chi tiết"
                aria-label="Mở khung giải thích AI"
              >
                <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Explain 🦉</span>
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              </button>
            )}
          </div>

          {/* Bên phải: Nút "Previous" và nút "Next" */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                currentIndex === 0
                  ? "bg-slate-50 dark:bg-[#141821] text-slate-400 dark:text-slate-600 border-slate-200 dark:border-[#1f2635] cursor-not-allowed opacity-50"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-[#222836] dark:hover:bg-[#2c3447] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60 shadow-xs cursor-pointer active:translate-y-0.5"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isSubmitted && !selectedOption}
              className={`px-5 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white transition-all ${
                !isSubmitted && !selectedOption
                  ? "bg-slate-300 dark:bg-slate-800/80 text-slate-500 border border-slate-200 dark:border-slate-700/40 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:from-violet-700 active:to-indigo-700 shadow-lg shadow-violet-600/25 dark:shadow-violet-900/30 cursor-pointer active:translate-y-0.5"
              }`}
            >
              <span>{isSubmitted ? (currentIndex < activeQuestions.length - 1 ? "Câu tiếp" : "Hoàn thành") : "Nộp bài"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* NotebookLM Side Chat Drawer */}
      <ExplainChatDrawer
        key={`${currentQuestion.id}-${selectedOption ?? "none"}-${isSubmitted}`}
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        question={currentQuestion}
        selectedOptionKey={selectedOption}
        isSubmitted={isSubmitted}
      />
    </>
  );
}

export default QuizCard;
