"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  Sparkles,
  User,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { Question } from "@/data/mockQuiz";
import { LatexText } from "@/components/LatexText";
import {
  ChatMessage,
  QuestionContext,
  getInitialWelcomeMessage,
  sendChatMessage,
  generateMessageId,
} from "@/lib/aiChatService";

export interface ExplainChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  selectedOptionKey: string | null;
  isSubmitted: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Vì sao lại vậy hả bạn AI? 🤔",
  "Ví dụ bằng hình ảnh 🍎",
  "Chỉ em cách tính nhanh ⚡",
  "Cho em một bài tương tự 🎲",
];

const MATH_SNIPPETS = ["+", "-", "×", "÷", "=", "🍎", "🍕"];

function createInitialWelcomeMessage(
  question: Question,
  selectedOptionKey: string | null
): ChatMessage {
  return {
    id: `welcome-${question.id}-${selectedOptionKey ?? "none"}`,
    role: "assistant",
    content: getInitialWelcomeMessage(question, selectedOptionKey),
  };
}

/**
 * =========================================================================
 * 👤 NHIỆM VỤ CỦA BẠN 6: Kỹ sư Giao diện Khung Chat AI (ExplainChatDrawer)
 * =========================================================================
 * Yêu cầu:
 * 1. Khung Drawer trượt ra từ mép phải màn hình khi học sinh bấm "Explain".
 * 2. Giữ màn hình bài tập bên trái rõ ràng, KHÔNG dùng backdrop-blur để học sinh
 *    vừa quan sát đề bài vừa nhắn tin với Cú Vàng.
 * 3. Danh sách tin nhắn chat hai chiều (học sinh và Cú Vàng), hỗ trợ KaTeX.
 * 4. Ô nhập tin nhắn tự co giãn chiều cao linh hoạt, ẩn thanh cuộn dọc (scrollbar).
 * 5. Bổ sung thanh nút chèn ký hiệu nhanh (+, -, ×, ÷, 🍎, 🍕) và gửi request đến
 *    API /api/chat của Bạn 5.
 * =========================================================================
 */
export function ExplainChatDrawer({
  isOpen,
  onClose,
  question,
  selectedOptionKey,
}: ExplainChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createInitialWelcomeMessage(question, selectedOptionKey),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiConnectionStatus, setAiConnectionStatus] = useState<"idle" | "live" | "offline">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input and conditionally lock background scroll only on mobile screens
  useEffect(() => {
    if (isOpen) {
      // On desktop/tablet, leave body scrollable so students can scroll and inspect the exercise on the left
      if (typeof window !== "undefined" && window.innerWidth < 640) {
        document.body.style.overflow = "hidden";
      }
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, scrollToBottom]);

  // Reset chat back to initial state
  const handleResetChat = () => {
    setMessages([createInitialWelcomeMessage(question, selectedOptionKey)]);
    setAiConnectionStatus("idle");
  };

  // Build question context for AI
  const buildContext = (): QuestionContext => {
    const selected = question.options.find((o) => o.key === selectedOptionKey);
    const correct = question.options.find((o) => o.isCorrect);
    return {
      id: question.id,
      title: question.title,
      context: question.context,
      hints: question.hints || [],
      selectedOptionKey,
      selectedOption: selected,
      correctOption: correct,
      options: question.options,
    };
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend ?? inputValue).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId("user"),
      role: "user",
      content: prompt,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "";
    }
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessages, buildContext());
      setAiConnectionStatus(response.isLiveAI ? "live" : "offline");
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("ai"),
          role: "assistant",
          content: response.reply,
        },
      ]);
    } catch {
      setAiConnectionStatus("offline");
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("err"),
          role: "assistant",
          content:
            "Rất tiếc, đã có lỗi xảy ra khi xử lý phản hồi. Bạn hãy thử đặt lại câu hỏi nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const insertSnippet = (snippet: string) => {
    if (inputRef.current) {
      const el = inputRef.current;
      const start = el.selectionStart ?? inputValue.length;
      const end = el.selectionEnd ?? inputValue.length;
      const before = inputValue.slice(0, start);
      const after = inputValue.slice(end);
      const needSpaceBefore = before.length > 0 && !before.endsWith(" ");
      const insertText = `${needSpaceBefore ? " " : ""}${snippet} `;
      const newValue = `${before}${insertText}${after}`;
      setInputValue(newValue);
      setTimeout(() => {
        el.focus();
        const newPos = start + insertText.length;
        el.setSelectionRange(newPos, newPos);
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
      }, 0);
    } else {
      setInputValue((prev) => (prev ? `${prev} ${snippet} ` : `${snippet} `));
    }
  };

  return (
    <>
      {/* 1. Backdrop Overlay (No blur so student can observe question clearly) */}
      <div
        className={`fixed inset-0 bg-slate-950/25 sm:bg-slate-900/15 dark:bg-black/40 dark:sm:bg-black/25 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Side Drawer (Elementary AI Tutor style) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label="Khung thảo luận Gia sư AI Tiểu Học"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] md:w-[540px] lg:w-[580px] bg-white dark:bg-[#10141d] border-l border-slate-200 dark:border-[#222938] shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 visible opacity-100"
            : "translate-x-full invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Header (No blur applied) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-[#222938] flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#131824]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0 text-xl">
              🦉
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  Gia sư AI Tiểu Học 🤖
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  Toán Lớp 1-5
                </span>
                {aiConnectionStatus === "live" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/50 flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Gemini AI Trực tuyến
                  </span>
                )}
                {aiConnectionStatus === "offline" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50 flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Gia sư Ngoại tuyến
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-3 h-3 text-slate-400" />
                Giải thích trực quan bằng ví dụ thực tế 🍎
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="Khởi động lại cuộc trò chuyện"
              aria-label="Khởi động lại cuộc trò chuyện"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1a2130] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Đóng khung chat (Esc)"
              aria-label="Đóng khung chat"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1a2130] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-sans text-base">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-lg shadow-xs">
                    🦉
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 leading-relaxed text-base ${
                    isUser
                      ? "bg-violet-600 text-white rounded-tr-sm shadow-md shadow-violet-600/20 font-medium"
                      : "bg-slate-100 dark:bg-[#181d28] border border-slate-200 dark:border-[#273042] text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <LatexText
                    text={msg.content}
                    className={
                      isUser
                        ? "text-white [&_strong]:text-white [&_.katex]:text-white"
                        : "text-slate-800 dark:text-slate-200"
                    }
                  />
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-violet-600/15 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3.5 justify-start items-center">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 text-lg shadow-xs">
                🦉
              </div>
              <div className="bg-slate-100 dark:bg-[#181d28] border border-slate-200 dark:border-[#273042] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                </div>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Gia sư Cú Vàng đang suy nghĩ và viết lời giải dễ hiểu cho em...
                </span>
              </div>
            </div>
          )}

          {/* Suggested Prompts (shown when history has only 1 message) */}
          {messages.length === 1 && !isLoading && (
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Gợi ý câu hỏi nhanh:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-left text-xs px-3 py-2 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-[#181d28] dark:hover:bg-[#202738] border border-slate-200 hover:border-amber-300 dark:border-[#273042] dark:hover:border-amber-700/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 transition-all cursor-pointer shadow-xs"
                  >
                    <LatexText text={q} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (always accessible for elementary kids when messages > 1) */}
        {messages.length > 1 && !isLoading && (
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-[#1d2332] bg-slate-50/70 dark:bg-[#131824]/60 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-xs shrink-0">
            <span className="text-xs text-amber-600 dark:text-amber-400 shrink-0 font-medium flex items-center gap-1 mr-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              Gợi ý:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#19202f] border border-slate-200 hover:border-amber-300 dark:border-[#293448] dark:hover:border-amber-700/60 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs cursor-pointer transition-colors shrink-0 shadow-xs whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Math Snippets Quick Bar */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-[#1d2332] bg-slate-50/60 dark:bg-[#111622]/60 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-xs shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium mr-1">
            Chèn nhanh:
          </span>
          {MATH_SNIPPETS.map((snippet) => (
            <button
              key={snippet}
              type="button"
              onClick={() => insertSnippet(snippet)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#19202f] border border-slate-200 dark:border-[#293448] hover:border-amber-400 dark:hover:border-amber-500/60 text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-sm sm:text-base cursor-pointer transition-all shrink-0 shadow-xs active:scale-95"
              title={`Chèn ${snippet}`}
            >
              {snippet}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-[#222938] bg-white dark:bg-[#10141d] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2.5"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi Cú Vàng (ví dụ: 'Vì sao lại như vậy nè?')..."
                rows={1}
                className="w-full resize-none overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden outline-none max-h-32 min-h-[46px] px-4 py-3 rounded-2xl bg-slate-100 dark:bg-[#181d28] border border-slate-200 dark:border-[#273042] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Gửi câu hỏi"
              className={`p-3 rounded-2xl text-white transition-all duration-200 shrink-0 cursor-pointer shadow-md ${
                !inputValue.trim() || isLoading
                  ? "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 hover:opacity-90 shadow-amber-500/30 active:scale-95"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 text-center mt-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Nhấn <strong>Enter</strong> để gửi câu hỏi cho Cú Vàng nhé! ✨</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default ExplainChatDrawer;
