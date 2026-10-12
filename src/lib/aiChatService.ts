import { Question, Option } from "@/data/mockQuiz";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp?: number;
}

let messageCounter = 0;
export function generateMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

export interface QuestionContext {
  id: string;
  title: string;
  context: string;
  hints: string[];
  selectedOptionKey: string | null;
  selectedOption?: Option;
  correctOption?: Option;
  options: Option[];
}

/**
 * Builds the automated welcome message tailored to the student's submission
 */
export function getInitialWelcomeMessage(
  question: Question,
  selectedOptionKey: string | null
): string {
  const selected = question?.options?.find((o) => o.key === selectedOptionKey);
  const correct = question?.options?.find((o) => o.isCorrect);

  if (selected?.isCorrect) {
    return `👋 Chào em nhé! Gia sư Cú Vàng đây 🦉✨

🌟 **Hoan hô em, rất xuất sắc!** Em đã trả lời hoàn toàn chính xác đáp án **${selected.key}**:
*"${selected.text}"*

📚 **Vì sao lại đúng nhỉ?**
${selected.feedback}

💡 **Góc học tập vui:**
Toán học thật ra rất gần gũi với cuộc sống hàng ngày! Chỉ cần tưởng tượng ra những đồ vật thân quen như hộp bút ✏️, lát bánh pizza 🍕 hay quả táo 🍎 là em sẽ giải được mọi bài toán.

Em có muốn Cú Vàng đố thêm một câu tương tự, hay hướng dẫn cách tính nhẩm siêu tốc không nào? Hãy chọn gợi ý bên dưới hoặc hỏi Cú Vàng nhé! 😊`;
  }

  // When incorrect or no answer
  const chosenKey = selected ? selected.key : "chưa chọn đáp án";
  const chosenFeedback = selected?.feedback ?? "Hãy đọc kỹ đề bài và xem lại các bước tính toán nhé.";

  return `👋 Chào bạn nhỏ thân mến! Gia sư Cú Vàng đây 🦉

Lựa chọn **${chosenKey}** chưa hoàn toàn chính xác rồi nè. Nhưng **đừng lo lắng nhé!** Học toán là phải thử nghiệm và sai để nhớ lâu hơn mà! ❤️

🔍 **Cùng Cú Vàng xem lại một chút:**
${chosenFeedback}

✅ **Đáp án đúng của bài này là ${correct?.key ?? "A"}:**
*"${correct?.text ?? ""}"*

📖 **Bí kíp ghi nhớ:**
${question?.context ?? "Học toán thật vui và bổ ích!"}

Em cứ thoải mái bấm gợi ý bên dưới hoặc hỏi Cú Vàng *"vì sao lại vậy"* để Cú Vàng kể câu chuyện ví dụ chia kẹo giải thích cho em nhé! 🍬`;
}

/**
 * Elementary school mathematical explanation engine providing step-by-step visual answers
 */
export function generateLocalAIResponse(
  query: string,
  ctx?: QuestionContext
): string {
  const q = query.toLowerCase().trim();
  const safeId = ctx?.id || "q1";
  const safeTitle = ctx?.title || "Toán Tiểu Học";
  const safeContext = ctx?.context || "Luyện tập toán tiểu học cùng Gia sư Cú Vàng";

  // 1. "Vì sao lại vậy" / "Tại sao"
  if (
    q.includes("vì sao") ||
    q.includes("tại sao") ||
    q.includes("giải thích lại") ||
    q.includes("sao lại thế")
  ) {
    if (safeId === "q1") {
      return `🦉 **Cú Vàng giải thích từng bước cho em nghe như một câu chuyện nhé!**

1. **Bước 1 - Lúc đầu An có bao nhiêu bút?**
   - An có 4 hộp bút ✏️.
   - Mỗi hộp đựng 6 chiếc bút.
   - Phép nhân: $4 \\times 6 = 24$ chiếc bút chì.

2. **Bước 2 - An tặng bạn Bình:**
   - An đem tặng bạn Bình 5 chiếc bút. Tặng đi tức là bớt đi, nên ta làm phép tính TRỪ:
   - Phép trừ: $24 - 5 = 19$ chiếc bút chì.

✨ Vậy An còn lại đúng **19 chiếc bút chì** đấy em!`;
    }

    if (safeId === "q2") {
      return `🦉 **Cú Vàng kể chuyện chiếc bánh pizza cho em dễ hiểu nè!** 🍕

1. **Chiếc bánh chia thành 8 phần:**
   - Cả chiếc bánh tròn xoe được cắt thành **8 miếng bằng nhau**.
   - Con số 8 này chính là **mẫu số** (ở bên dưới gạch ngang), đại diện cho toàn bộ chiếc bánh.

2. **Nam đã ăn 3 miếng:**
   - Nam ăn 3 miếng, tức là đã lấy đi 3 phần trong 8 phần đó.
   - Con số 3 này chính là **tử số** (ở bên trên gạch ngang).

✨ Viết thành phân số: $\\frac{3}{8}$ (đọc là ba phần tám). Rất dễ nhớ đúng không em!`;
    }

    if (safeId === "q3") {
      return `🦉 **Cú Vàng dắt em đi dạo quanh mảnh vườn nhé!** 🏡🌻

- **Chu vi là gì nhỉ?** Chu vi chính là tổng độ dài hàng rào bao quanh cả mảnh vườn hình chữ nhật.
- Mảnh vườn có:
  + 2 cạnh chiều dài ($12\\text{ m} + 12\\text{ m} = 24\\text{ m}$)
  + 2 cạnh chiều rộng ($8\\text{ m} + 8\\text{ m} = 16\\text{ m}$)
- Đi hết một vòng quanh hàng rào:
  $$P = (12 + 8) \\times 2 = 20 \\times 2 = 40\\text{ m}$$

✨ Nhớ nhé: Chu vi hình chữ nhật bằng **(Dài + Rộng) rồi nhân 2**!`;
    }

    if (safeId === "q4") {
      return `🦉 **Cú Vàng cùng em đếm táo và lê nhé!** 🍎🍐

1. **Số quả táo:** Đề bài cho là có **15 quả táo đỏ**.
2. **Số quả lê:** Lê gấp 2 lần táo, tức là lấy số táo nhân 2:
   $$15 \\times 2 = 30\\text{ (quả lê)}$$
3. **Cả rổ có tất cả bao nhiêu quả?**
   Ta cộng cả táo và lê lại với nhau:
   $$15 + 30 = 45\\text{ (quả)}$$

✨ Bé đừng quên cộng cả số táo ban đầu vào nha!`;
    }

    return `🦉 **Cú Vàng giải thích từng bước cho em nghe nè:**

Bài toán hỏi: *"${safeTitle}"*
- **Ý chính của bài:** ${safeContext}
- Để giải bài này, em hãy làm theo 2 bước:
  1. Đọc kỹ đề bài để xem đề cho cái gì và hỏi cái gì.
  2. Dùng phép tính tương ứng (cộng, trừ, nhân hoặc chia) để tìm ra đáp số.

Em có thắc mắc ở bước tính nào không? Cứ hỏi tiếp Cú Vàng nhé! 🌟`;
  }

  // 2. "Ví dụ bằng hình ảnh" / "Chia kẹo" / "Hình ảnh" / "Đồ vật trực quan"
  if (
    q.includes("hình ảnh") ||
    q.includes("chia kẹo") ||
    q.includes("quả táo") ||
    q.includes("kẹo") ||
    q.includes("que tính") ||
    q.includes("pizza") ||
    q.includes("đồ vật")
  ) {
    if (safeId === "q2") {
      return `🍕 **Hình ảnh chiếc bánh pizza trực quan cho em đây:**

Hãy tưởng tượng một chiếc bánh pizza tròn xoe thơm nức:
- Chiếc bánh được cắt thành **8 miếng bằng nhau**:
  🍕🍕🍕🍕🍕🍕🍕🍕 (Cả chiếc bánh = 8 miếng)
- Nam đã ăn hết **3 miếng**:
  ❌❌❌ (3 miếng biến mất vào bụng Nam rồi)
  🍕🍕🍕🍕🍕 (Còn lại 5 miếng)
- Bây giờ ta viết thành phân số:
  + Mẫu số (ở dưới): Là tổng số 8 miếng lúc đầu.
  + Tử số (ở trên): Là 3 miếng Nam đã ăn.
  $$\\frac{3}{8}\\text{ chiếc bánh pizza}$$

Nhìn hình ảnh những miếng bánh thế này em thấy phân số thật dễ hiểu đúng không nào! 🎉`;
    }

    if (safeId === "q3") {
      return `🏡 **Hình ảnh mảnh vườn hoa rực rỡ sắc màu đây em:**

Hãy tưởng tượng em đang đứng ở góc cổng mảnh vườn hình chữ nhật:
- Em bắt đầu đi bộ dọc theo hàng rào hoa:
  1. Đi cạnh chiều dài thứ nhất: $12\\text{ m}$ 🌻
  2. Rẽ sang cạnh chiều rộng thứ nhất: $8\\text{ m}$ 🌷
  3. Đi tiếp cạnh chiều dài thứ hai đối diện: $12\\text{ m}$ 🌻
  4. Rẽ về cạnh chiều rộng thứ hai để về lại cổng: $8\\text{ m}$ 🌷
- Quãng đường em vừa đi đúng 1 vòng quanh mảnh vườn chính là **chu vi**:
  $$12 + 8 + 12 + 8 = (12 + 8) \\times 2 = 40\\text{ m}$$

Chu vi chính là độ dài đường viền bao quanh hình chữ nhật đó em! 🌟`;
    }

    if (safeId === "q4") {
      return `🍎🍐 **Hình ảnh những giỏ trái cây thơm ngon đây em:**

Hãy tưởng tượng trên bàn có các giỏ quả nhỏ xinh:
- **Táo đỏ:** Em có 1 giỏ đựng **15 quả táo đỏ** 🍎.
- **Lê:** Vì số quả lê gấp 2 lần số quả táo, nên em cần xếp **2 giỏ lê** giống hệt giỏ táo (mỗi giỏ 15 quả):
  + Giỏ lê 1: 15 quả lê 🍐
  + Giỏ lê 2: 15 quả lê 🍐
- Bây giờ cả rổ có tất cả:
  $$1\\text{ giỏ táo} + 2\\text{ giỏ lê} = 3\\text{ giỏ quả tất cả}$$
  $$15 \\times 3 = 45\\text{ (quả)}$$

Xếp thành từng giỏ như vậy em sẽ thấy phép nhân và phép cộng thật kỳ diệu! 🎈`;
    }

    // Default or q1 (Hộp bút / Kẹo)
    return `🍬 **Ví dụ trực quan sinh động dành cho em đây:**

Hãy tưởng tượng em có một túi kẹo ngọt ngào:
- Em xếp kẹo thành các nhóm đều nhau: 4 hàng kẹo, mỗi hàng có 6 cái:
  🍬🍬🍬🍬🍬🍬 (Hàng 1)
  🍬🍬🍬🍬🍬🍬 (Hàng 2)
  🍬🍬🍬🍬🍬🍬 (Hàng 3)
  🍬🍬🍬🍬🍬🍬 (Hàng 4)
- Tổng cộng em có $4 \\times 6 = 24$ cái kẹo.
- Bây giờ em chia cho bạn thân 5 cái kẹo, em bớt đi 5 cái:
  $$24 - 5 = 19\\text{ cái kẹo}$$

Nhìn hình ảnh kẹo xếp hàng như thế này em thấy bài toán dễ hiểu hơn nhiều rồi đúng không nào! 🎉`;
  }

  // 3. "Cách tính nhanh" / "Tính nhẩm" / "Mẹo"
  if (
    q.includes("tính nhanh") ||
    q.includes("tính nhẩm") ||
    q.includes("mẹo")
  ) {
    if (safeId === "q2") {
      return `⚡ **Mẹo nhớ phân số siêu nhanh của Cú Vàng:**

💡 **Bí kíp "Mẹ cõng con":**
- **Mẫu số** (chữ "Mẫu" nghĩa là Mẹ): Mẹ luôn ở dưới nâng đỡ, đại diện cho **tất cả các phần chia đều** ($8$ miếng bánh).
- **Tử số** (chữ "Tử" nghĩa là Con): Con ngồi trên lưng mẹ, đại diện cho **số phần đã lấy đi** ($3$ miếng đã ăn).
- Cứ nhớ "Mẹ ở dưới, con ở trên", ta viết ngay: $\\frac{\\text{Con}}{\\text{Mẹ}} = \\frac{3}{8}$ trong 1 giây! 🚀`;
    }

    if (safeId === "q3") {
      return `⚡ **Mẹo tính nhẩm chu vi siêu tốc:**

Với hình chữ nhật có kích thước $12\\text{ m}$ và $8\\text{ m}$:
1. **Bước 1 - Ghép tròn chục:**
   $12 + 8 = 20$ (ghép lại ra số tròn chục rất đẹp).
2. **Bước 2 - Nhân đôi số tròn chục:**
   $20 \\times 2 = 40\\text{ m}$ siêu nhanh!
Không cần đặt bút tính nháp, nhẩm trong đầu là ra ngay đáp số $40\\text{ m}$! 🚀`;
    }

    if (safeId === "q4") {
      return `⚡ **Mẹo gộp số phần để tính siêu nhanh:**

Thay vì tính 2 bước ($15 \\times 2 = 30$, rồi $15 + 30 = 45$), ta dùng mẹo:
- Táo đỏ là **1 phần**.
- Lê gấp 2 lần nên lê là **2 phần**.
- Tổng số quả là: $1 + 2 = 3$ phần bằng nhau!
- Em chỉ cần lấy: $15 \\times 3 = 45$ quả chỉ trong một nốt nhạc! 🚀`;
    }

    // Default or q1
    return `⚡ **Mẹo tính nhẩm siêu tốc của Cú Vàng:**

1. **Mẹo trừ nhanh cho số gần tròn chục:**
   - Khi tính $24 - 5$, em có thể tách $5 = 4 + 1$:
   - Lấy $24 - 4 = 20$, rồi trừ tiếp $1$ còn $19$! Nhẩm trong đầu chỉ mất 1 giây thôi!

2. **Bảng cửu chương nhân 6:**
   - Muốn nhớ $4 \\times 6$, em hãy nhớ $2 \\times 6 = 12$, rồi nhân đôi $12 \\times 2 = 24$!

Em thử áp dụng ngay vào bài tập xem có thấy nhanh bất ngờ không nhé! 🚀`;
  }

  // 4. "Bài tương tự" / "Đố em" / "Bài khác"
  if (
    q.includes("tương tự") ||
    q.includes("bài khác") ||
    q.includes("đố em") ||
    q.includes("bài tập")
  ) {
    if (safeId === "q2") {
      return `🎲 **Cú Vàng đố em một bài phân số tương tự nhé:**

**Đề bài:**
*"Một thanh sô-cô-la 🍫 chia đều thành 6 ô vuông nhỏ bằng nhau. Bạn Lan đã ăn mất 2 ô vuông. Hỏi phân số chỉ số phần sô-cô-la Lan đã ăn là bao nhiêu?"*

💡 **Gợi ý cho em:**
- Thanh kẹo chia làm mấy ô tất cả? (Đó là mẫu số ở dưới).
- Lan đã ăn mấy ô? (Đó là tử số ở trên).

Em thử đoán xem đáp án là phân số nào rồi nhắn cho Cú Vàng nhé! ⭐`;
    }

    if (safeId === "q3") {
      return `🎲 **Cú Vàng đố em một bài chu vi tương tự nè:**

**Đề bài:**
*"Bé Hoa có một chiếc khung ảnh hình chữ nhật 🖼️ có chiều dài $20\\text{ cm}$ và chiều rộng $10\\text{ cm}$. Chu vi của chiếc khung ảnh đó là bao nhiêu xăng-ti-mét?"*

💡 **Gợi ý cho em:**
- Em nhớ công thức: $\\text{Chu vi} = (\\text{Dài} + \\text{Rộng}) \\times 2$.
- Em tính: $(20 + 10) \\times 2 = ?$

Hãy tính nhẩm và gửi đáp số cho Cú Vàng xem em tính đúng không nhé! 🌸`;
    }

    if (safeId === "q4") {
      return `🎲 **Cú Vàng đố em một bài toán gấp số lần tương tự nè:**

**Đề bài:**
*"Bạn Huy có 10 viên bi xanh 🔵. Số viên bi đỏ 🔴 gấp 3 lần số viên bi xanh. Hỏi Huy có tất cả bao nhiêu viên bi cả xanh và đỏ?"*

💡 **Gợi ý cho em:**
- Bước 1: Tính số bi đỏ ($10 \\times 3 = ?$).
- Bước 2: Cộng cả bi xanh và bi đỏ lại với nhau!

Em hãy tính thử và khoe đáp án với Cú Vàng nhé! 🎯`;
    }

    // Default or q1
    return `🎲 **Cú Vàng đố em một bài toán tương tự cực kỳ thú vị nhé:**

**Đề bài:**
*"Bé Mai có 3 túi bánh quy 🍪, mỗi túi có 5 chiếc bánh. Mai cho em trai 4 chiếc. Hỏi Mai còn lại bao nhiêu chiếc bánh quy?"*

💡 **Gợi ý cho em:**
- Bước 1: Tính xem lúc đầu Mai có tất cả bao nhiêu chiếc bánh ($3 \\times 5 = ?$)?
- Bước 2: Lấy số bánh đó trừ đi 4 chiếc bánh đã cho em trai.

Em hãy tính thử và gõ kết quả cho Cú Vàng xem em tính đúng không nào! Chúc em làm đúng nhé! ⭐`;
  }

  // 5. Default friendly elementary tutor response
  return `🦉 **Gia sư Cú Vàng lắng nghe câu hỏi của em:** *" ${query} "*

Với bài toán: **"${safeTitle.replace(/\$/g, "")}"**
- **Điểm mấu chốt:** ${safeContext}
- **Gợi ý nhớ nhanh:** ${ctx?.hints?.[0] || "Làm từng bước cẩn thận em nhé!"}

Em muốn Cú Vàng:
1. 🍎 Lấy ví dụ đồ vật thực tế?
2. ⚡ Chỉ mẹo tính nhẩm nhanh?
3. 🎲 Cho một bài tập tương tự để thử tài?

Cứ gõ cho Cú Vàng biết nhé, Cú Vàng luôn sẵn sàng đồng hành cùng em! 🥰`;
}

export interface ChatResponse {
  reply: string;
  isLiveAI: boolean;
  model?: string;
  status?: string;
}

/**
 * Calls Next.js API route /api/chat with fallback to local intelligent math engine
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  questionContext: QuestionContext
): Promise<ChatResponse> {
  const lastUserMsg =
    [...messages].reverse().find((m) => m.role === "user")?.content ||
    messages[messages.length - 1]?.content ||
    "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        questionContext,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const replyText =
        typeof data?.reply === "string"
          ? data.reply
          : typeof data?.text === "string"
          ? data.text
          : "";

      if (replyText.trim().length > 0) {
        return {
          reply: replyText,
          isLiveAI:
            data.isLiveAI !== undefined
              ? Boolean(data.isLiveAI)
              : data.status === "online",
          model: data.model,
          status: data.status || "online",
        };
      }
    }
  } catch (error) {
    console.warn("AI Chat API call failed or offline, switching to local engine:", error);
  }

  // Local AI engine fallback
  const fallbackReply = generateLocalAIResponse(lastUserMsg, questionContext);
  return {
    reply: `${fallbackReply}\n\n> 💡 *Chế độ ngoại tuyến: Đang sử dụng gia sư AI dự phòng.*`,
    isLiveAI: false,
    status: "offline_fallback",
  };
}
