This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Quy chuẩn Kiến trúc MathDuo AI

### 1. Theme Dark/Light Mode
- **Cơ chế:** Kích hoạt qua class `.dark` trên `document.documentElement` (`<html class="dark">`).
- **Đồng bộ:** Khóa `math-duo-theme` trong `localStorage`. Tích hợp inline script trong `<head>` tại `src/app/layout.tsx` nhằm triệt tiêu FOUC.
- **Component:** `src/components/ThemeToggle.tsx` sử dụng `useSyncExternalStore` kết hợp `MutationObserver` lắng nghe biến đổi class trên thẻ `html` để tránh cascading render linter warning và hydration mismatch.
- **Background Depth:** `.ambient-grid-background` kết hợp radial gradient ambient glow (tím/xanh ngọc) và subtle grid dots cho cả Dark mode và Light mode.

### 2. Xử lý Công thức Toán KaTeX
- **Component:** `src/components/LatexText.tsx`.
- **Cú pháp:** `$formula$` cho inline math và `$$formula$$` cho display/block math.
- **Quy chuẩn màu sắc:** Luôn đặt `color: inherit` cho `.katex` và `.katex-display` trong `globals.css` để đảm bảo công thức toán tự động kế thừa màu chữ của container (kể cả trong bóng chat người dùng nền tím chữ trắng, hoặc banner cảnh báo đỏ/xanh).

### 3. Điều khiển hiển thị Nút Explain & Khung Chat AI NotebookLM
- **Cờ `isSubmitted`:**
  - `isSubmitted = false`: Ẩn hoàn toàn nút "Explain" ở thanh footer; chỉ giữ "Hint" và điều hướng Previous/Next.
  - `isSubmitted = true`: Hiển thị nút "Explain" kèm animation fade-in mượt mà (`.animate-fade-in`).
- **ExplainChatDrawer:**
  - Trượt từ lề phải với backdrop blur.
  - Tự động hiển thị tin nhắn chào mừng kèm phân tích đáp án của học sinh và câu hỏi gợi mở sâu sắc.
  - Hỗ trợ nhập và hiển thị KaTeX 2 chiều, typing indicator và kết nối API `/api/chat` (fallback sang local math tutor engine).
