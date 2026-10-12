import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateLocalAIResponse, QuestionContext } from "@/lib/aiChatService";

/**
 * =========================================================================
 * 👤 NHIỆM VỤ CỦA BẠN 5: Kết nối Trí tuệ Nhân tạo Gemini AI (Backend API)
 * =========================================================================
 * Yêu cầu:
 * 1. Lấy API Key miễn phí tại: https://aistudio.google.com/
 * 2. Tạo file `.env.local` ở thư mục gốc của dự án và điền:
 *    GEMINI_API_KEY=khóa_api_của_bạn_ở_đây
 * 3. Khởi tạo GoogleGenAI SDK từ `@google/genai`:
 *    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
 * 4. Gọi model `gemini-2.5-flash` với lời nhắc hệ thống (System Instruction):
 *    - Đóng vai "Gia sư Cú Vàng", tính tình ấm áp, kiên nhẫn.
 *    - Giải thích toán tiểu học bằng đồ vật gần gũi (chia kẹo 🍬, cắt bánh 🍕, que tính).
 *    - Khích lệ bé dù làm đúng hay sai.
 * 5. Trả về kết quả JSON dạng: { status: "online", text: responseText }
 * =========================================================================
 */

interface ChatTurn {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

// Hàm hỗ trợ gom lịch sử tin nhắn chuẩn cấu trúc Gemini
function buildGeminiContents(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  questionTitle: string
): ChatTurn[] {
  const contents: ChatTurn[] = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const role: "user" | "model" = m.role === "assistant" ? "model" : "user";
    const text = m.content?.trim();
    if (!text) continue;

    if (contents.length === 0 && role === "model") {
      contents.push({
        role: "user",
        parts: [{ text: `Em đang học bài toán: "${questionTitle || "Toán Tiểu Học"}". Bạn Cú Vàng hãy chào em nhé!` }],
      });
    }

    const lastTurn = contents[contents.length - 1];
    if (lastTurn && lastTurn.role === role) {
      lastTurn.parts.push({ text });
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }

  const lastTurn = contents[contents.length - 1];
  if (!lastTurn || lastTurn.role !== "user") {
    contents.push({
      role: "user",
      parts: [{ text: "Hãy giải thích thêm cho em hiểu bài toán này nhé!" }],
    });
  }

  return contents;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, questionContext } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      questionContext: QuestionContext;
    };

    const apiKey = process.env.GEMINI_API_KEY;

    // 👇 TODO [BẠN 5]: Kiểm tra khóa API và gọi model Gemini thật
    if (!apiKey) {
      console.warn("⚠️ [Bạn 5 ơi] Chưa tìm thấy GEMINI_API_KEY trong file .env.local!");
      // Fallback thông minh để trang web không bị sập nếu Bạn 5 chưa kịp điền key
      const lastUserMsg = messages?.filter(m => m.role === "user").pop()?.content || "";
      const fallbackText = generateLocalAIResponse(lastUserMsg, questionContext);
      const warnMsg = `🦉 *[Thông báo từ Cú Vàng]*: Bạn 5 ơi, hãy tạo file \`.env.local\` và điền \`GEMINI_API_KEY\` để kích hoạt AI thật nhé!\n\n${fallbackText}`;
      return NextResponse.json({
        status: "no_api_key",
        isLiveAI: false,
        reply: warnMsg,
        text: warnMsg,
      });
    }

    // Khởi tạo Gemini AI Client
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const systemInstruction = `Bạn là "Cú Vàng" 🦉 - Gia sư Toán tiểu học vui vẻ, kiên nhẫn và tận tâm dành cho học sinh Lớp 1 - Lớp 5.
Bối cảnh bài toán hiện tại:
- Đề bài: ${questionContext?.title || "Toán tiểu học"}
- Lý thuyết: ${questionContext?.context || "Phép tính cơ bản"}
Quy tắc trả lời:
1. Luôn dùng hình ảnh thực tế dễ hiểu: chia kẹo 🍬, quả cam 🍊, lát bánh pizza 🍕, que tính.
2. Xưng hô thân mật: "Cú Vàng" và "Em" hoặc "Bạn nhỏ".
3. Khi bé hỏi "vì sao lại vậy", hãy giải thích từng bước chậm rãi từ đầu như đang kể chuyện.
4. Trình bày công thức bằng KaTeX (đặt trong $...$).`;

    const contents = buildGeminiContents(messages, questionContext?.title || "");

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const candidateText = response?.text?.trim() || "Cú Vàng đang lắng nghe em đây! Em hãy hỏi Cú Vàng về bài toán này nhé! ⭐";

    return NextResponse.json({
      status: "online",
      isLiveAI: true,
      reply: candidateText,
      text: candidateText,
      model,
    });
  } catch (error: unknown) {
    console.error("Lỗi API Gemini:", error);
    const errorMsg = "Ôi, Cú Vàng đang bị mất sóng một chút xíu. Bạn 5 hãy kiểm tra lại kết nối mạng hoặc API Key nhé!";
    return NextResponse.json(
      {
        status: "api_error",
        isLiveAI: false,
        reply: errorMsg,
        text: errorMsg,
      },
      { status: 200 }
    );
  }
}
