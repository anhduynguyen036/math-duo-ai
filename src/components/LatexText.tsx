"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export interface LatexTextProps {
  text: string;
  className?: string;
}

/**
 * =========================================================================
 * 👤 NHIỆM VỤ CỦA BẠN 2: Hiển thị công thức Toán học bằng KaTeX
 * =========================================================================
 * Mục tiêu:
 * Nhận vào một chuỗi `text` có thể chứa công thức toán nằm giữa dấu $...$
 * (ví dụ: "Bạn có $1/2$ chiếc bánh pizza") và dùng thư viện `katex` để hiển thị
 * ra phân số, dấu nhân $\times$, số mũ đẹp mắt.
 * 
 * Các bước thực hiện:
 * 1. Dùng biểu thức chính quy Regex tách chuỗi thành các phần:
 *    - Đoạn toán nội dòng: nằm giữa dấu $...$
 *    - Đoạn toán khối: nằm giữa dấu $$...$$
 *    - Đoạn chữ bình thường
 * 2. Gọi hàm `katex.renderToString(formula, { displayMode: boolean, throwOnError: false })`
 * 3. Trả về thẻ <span dangerouslySetInnerHTML={{ __html: html }} />
 * =========================================================================
 */
export function LatexText({ text, className = "" }: LatexTextProps) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== "string") return null;

    // 👇 TODO [BẠN 2]: Dùng Regex để tách chuỗi chứa công thức toán
    // Gợi ý: const mathRegex = /(\$\$[\s\S]*?\$\$|\$(?:[^\$\n]|\\\$)+?\$)/g;
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$(?:[^\$\n]|\\\$)+?\$)/g;
    const parts = text.split(mathRegex);

    return parts.map((part, index) => {
      // 1. Khối toán học lớn: $$ ... $$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
        const formula = part.slice(2, -2).trim();
        try {
          // 👇 TODO [BẠN 2]: Gọi katex.renderToString với displayMode: true
          const html = katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={`block-${index}`}
              className="my-2 block overflow-x-auto py-1 text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={`block-err-${index}`}>{part}</span>;
        }
      }

      // 2. Công thức toán nội dòng: $ ... $
      if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
        const formula = part.slice(1, -1).trim();
        try {
          // 👇 TODO [BẠN 2]: Gọi katex.renderToString với displayMode: false
          const html = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={`inline-${index}`}
              className="inline-block mx-0.5 align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={`inline-err-${index}`}>{part}</span>;
        }
      }

      // 3. Chữ thường (Text thông thường)
      return (
        <span key={`text-${index}`} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  }, [text]);

  return <span className={`inline-block w-full ${className}`}>{renderedContent}</span>;
}

export default LatexText;
