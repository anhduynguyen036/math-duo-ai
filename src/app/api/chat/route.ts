import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateLocalAIResponse, QuestionContext } from "@/lib/aiChatService";

interface ChatTurn {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

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

    // Ensure the conversation starts with a user turn
    if (contents.length === 0 && role === "model") {
      contents.push({
        role: "user",
        parts: [{ text: `Em đang tìm hiểu bài toán: "${questionTitle || "Toán Tiểu Học"}". Bạn AI hãy chào em và đồng hành cùng em nhé!` }],
      });
    }

    // Merge consecutive turns with the same role to strictly alternate turns
    const lastTurn = contents[contents.length - 1];
    if (lastTurn && lastTurn.role === role) {
      lastTurn.parts.push({ text });
    } else {
      contents.push({
        role,
        parts: [{ text }],
      });
    }
  }

  // Ensure conversation ends with a user turn for Gemini generation
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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Tin nhắn không được để trống." },
        { status: 400 }
      );
    }

    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ||
      messages[messages.length - 1]?.content ||
      "";
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

        const systemInstruction = `Bạn là Gia sư Cú Vàng 🦉 - một gia sư Toán tiểu học vui vẻ, kiên nhẫn và tận tâm. Nhiệm vụ của bạn là giải thích các bài toán lớp 1-5 cho học sinh nhỏ tuổi hiểu bản chất.
Nguyên tắc sư phạm:
1. Ngôn ngữ: Tiếng Việt trong sáng, ngắn gọn, xưng hô "Thầy/Cô - Em" hoặc "Cú Vàng - Bạn nhỏ".
2. Giải thích bản chất bằng ví dụ thực tế (cái kẹo 🍬, quả cam, quả táo 🍎, que tính, lát bánh pizza 🍕, hộp bút ✏️) thay vì công thức hàn lâm.
3. Luôn động viên, khích lệ khi bé làm đúng hoặc sai. Nói chuyện nhẹ nhàng, ấm áp.
4. Khi bé hỏi "vì sao lại vậy", hãy giải thích từng bước chậm rãi từ đầu như đang kể một câu chuyện vui.
5. Mọi công thức hoặc phép tính nếu có hãy định dạng KaTeX: dùng $...$ cho công thức nội dòng (ví dụ: $4 \\times 6 = 24$, $\\frac{3}{8}$) và $$...$$ cho công thức khối nổi bật.

Ngữ cảnh bài toán hiện tại:
- Đề bài: ${questionContext?.title || "Toán Tiểu Học"}
- Kiến thức trọng tâm: ${questionContext?.context || ""}
- Học sinh đã chọn: ${questionContext?.selectedOption?.key || "Chưa rõ"} - ${questionContext?.selectedOption?.text || ""} (${questionContext?.selectedOption?.isCorrect ? "ĐÚNG" : "CHƯA ĐÚNG"})
- Nhận xét phương án: ${questionContext?.selectedOption?.feedback || ""}`;

        const contents = buildGeminiContents(messages, questionContext?.title || "Toán Tiểu Học");

        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const generatedText = response.text;
        if (!generatedText || generatedText.trim().length === 0) {
          throw new Error("Phản hồi từ Gemini API rỗng");
        }

        return NextResponse.json({
          reply: generatedText.trim(),
          isLiveAI: true,
          model: modelName,
          status: "online",
        });
      } catch (geminiError) {
        console.warn("Lỗi gọi Gemini API qua @google/genai, chuyển sang fallback:", geminiError);
        const errorMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
        const localReply = generateLocalAIResponse(lastUserMessage, questionContext);
        return NextResponse.json({
          reply: `${localReply}\n\n> ⚠️ *Chế độ ngoại tuyến: Không thể kết nối với Gemini (${errorMsg.slice(0, 120)}...). Gia sư Cú Vàng tự động trả lời bằng dữ liệu bài học.*`,
          isLiveAI: false,
          status: "api_error",
        });
      }
    }

    // Fallback thông minh khi chưa có GEMINI_API_KEY
    const localReply = generateLocalAIResponse(lastUserMessage, questionContext);
    return NextResponse.json({
      reply: `${localReply}\n\n> 💡 *Chế độ ngoại tuyến: Chưa cấu hình GEMINI_API_KEY. Hãy thêm khóa API vào file \`.env.local\` để trò chuyện trực tiếp cùng Gemini AI siêu thông minh!*`,
      isLiveAI: false,
      status: "no_api_key",
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý tin nhắn." },
      { status: 500 }
    );
  }
}
