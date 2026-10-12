"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export interface LatexTextProps {
  text: string;
  className?: string;
}

/**
 * LatexText parses and renders text with LaTeX formulas ($...$ for inline, $$...$$ for block)
 * and simple markdown enhancements (bold **text**, newlines, code spans).
 */
export function LatexText({ text, className = "" }: LatexTextProps) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== "string") return null;

    // Splits into math tokens ($$...$$ and $...$) while keeping non-math text
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$(?:[^\$\n]|\\\$)+?\$)/g;
    const parts = text.split(mathRegex);

    return parts.map((part, index) => {
      // 1. Block math: $$ ... $$
      if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
        const formula = part.slice(2, -2).trim();
        if (!formula) return <span key={`block-${index}`}>{part}</span>;
        try {
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

      // 2. Inline math: $ ... $
      if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
        const formula = part.slice(1, -1).trim();
        if (!formula) return <span key={`inline-${index}`}>{part}</span>;
        try {
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

      // 3. Plain text with basic markdown formatting (**bold**, *italic*, `code`, newlines)
      return (
        <span key={`text-${index}`} className="whitespace-pre-wrap">
          {formatMarkdownText(part, index)}
        </span>
      );
    });
  }, [text]);

  return <span className={`inline-block w-full ${className}`}>{renderedContent}</span>;
}

/**
 * Helper to render bold **text**, `code`, and bullet lists within plain text segments
 */
function formatMarkdownText(segment: string, parentIndex: number): React.ReactNode {
  // Regex to match **bold**, `code`, or *italic*
  const mdRegex = /(\*\*[\s\S]+?\*\*|`[^`]+`|\*[^\*\n]+?\*)/g;
  const segments = segment.split(mdRegex);

  return segments.map((item, i) => {
    if (item.startsWith("**") && item.endsWith("**") && item.length >= 4) {
      return (
        <strong key={`b-${parentIndex}-${i}`} className="font-semibold text-slate-900 dark:text-slate-100">
          {item.slice(2, -2)}
        </strong>
      );
    }
    if (item.startsWith("*") && item.endsWith("*") && item.length >= 2) {
      return (
        <em key={`em-${parentIndex}-${i}`} className="italic opacity-90">
          {item.slice(1, -1)}
        </em>
      );
    }
    if (item.startsWith("`") && item.endsWith("`") && item.length >= 2) {
      return (
        <code
          key={`c-${parentIndex}-${i}`}
          className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-violet-600 dark:text-violet-300 font-mono text-xs"
        >
          {item.slice(1, -1)}
        </code>
      );
    }
    return item;
  });
}

export default LatexText;
