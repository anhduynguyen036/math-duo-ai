export interface Option {
  key: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Question {
  id: string;
  title: string;
  options: Option[];
  hints: string[];
  context: string;
}

export const mockQuestions: Question[] = [
  {
    id: "q1",
    title: "Bạn An có 4 hộp bút chì ✏️, mỗi hộp có 6 chiếc bút. An tặng cho bạn Bình 5 chiếc. Hỏi An còn lại bao nhiêu chiếc bút chì?",
    context: "Toán lớp 3: Bài toán giải bằng hai phép tính (Phép nhân và phép trừ). Bước 1 tính tổng số bút An có lúc đầu: 4 × 6 = 24 chiếc. Bước 2 tính số bút còn lại sau khi cho: 24 - 5 = 19 chiếc.",
    hints: [
      "Bước 1: Hãy tính xem cả 4 hộp bút có tất cả bao nhiêu chiếc bút chì? (Ta lấy $4 \\times 6$)",
      "Bước 2: Sau khi tặng bạn Bình 5 chiếc, hãy lấy tổng số bút vừa tìm được trừ đi 5 chiếc nhé!"
    ],
    options: [
      {
        key: "A",
        text: "19 chiếc bút chì",
        isCorrect: true,
        feedback: "Chính xác rồi! 🌟 Tổng số bút chì An có là: $4 \\times 6 = 24$ chiếc. Sau khi tặng bạn Bình 5 chiếc, An còn lại: $24 - 5 = 19$ chiếc bút chì."
      },
      {
        key: "B",
        text: "20 chiếc bút chì",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Nếu lấy $24 - 5$ thì phải bằng $19$ chiếc cơ, bạn hãy kiểm tra lại phép trừ một chút nhé."
      },
      {
        key: "C",
        text: "15 chiếc bút chì",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Bạn lấy $4 \\times 5$ mất rồi. Mỗi hộp có 6 chiếc bút nên cả 4 hộp phải là $4 \\times 6 = 24$ chiếc nha."
      },
      {
        key: "D",
        text: "29 chiếc bút chì",
        isCorrect: false,
        feedback: "Chưa đúng rồi! An tặng bạn Bình 5 chiếc thì số bút của An phải ít đi (làm phép trừ $24 - 5$), chứ không phải cộng thêm 5 đâu nè."
      }
    ]
  },

  // =========================================================================
  // 👤 NHIỆM VỤ CỦA BẠN 4: Soạn thêm ngân hàng đề bài Toán Tiểu học vui nhộn!
  // =========================================================================
  // Yêu cầu:
  // 1. Soạn thêm 3 đến 4 câu hỏi Toán vui cho học sinh Tiểu học (Lớp 1 đến Lớp 5).
  // 2. Ý tưởng gợi ý:
  //    - Câu 2: Bài toán phân số trực quan (chia bánh pizza 🍕, chia cam 🍊).
  //    - Câu 3: Bài toán hình học (chu vi mảnh vườn hình chữ nhật 🌳, chu vi sân chơi).
  //    - Câu 4: Bài toán đếm con vật hoặc đồ vật (gấp một số lên nhiều lần 🍎🍐).
  // 3. Mỗi câu hỏi gồm:
  //    - id: mã định danh câu hỏi (ví dụ: "q2", "q3", "q4")
  //    - title: đề bài dễ thương, gần gũi
  //    - context: tóm tắt lý thuyết để AI Cú Vàng hiểu bài toán
  //    - hints: mảng các câu gợi ý nhẹ nhàng
  //    - options: 4 đáp án A, B, C, D (đúng 1 đáp án isCorrect = true) kèm feedback giải thích
  // =========================================================================

  /* 👇 BỎ CHÚ THÍCH VÀ VIẾT TIẾP CÁC CÂU HỎI MỚI DƯỚI ĐÂY 👇
  {
    id: "q2",
    title: "Một chiếc bánh pizza 🍕 được cắt đều thành 8 miếng. Nam đã ăn 3 miếng. Phân số chỉ số phần bánh Nam đã ăn là bao nhiêu?",
    context: "Toán lớp 4: Phân số trực quan. Tổng số miếng là mẫu số (8), số miếng đã ăn là tử số (3).",
    hints: [
      "Mẫu số là tổng số miếng được chia đều (8 miếng).",
      "Tử số là số miếng Nam đã ăn (3 miếng)."
    ],
    options: [
      { key: "A", text: "$\\frac{3}{8}$ chiếc bánh", isCorrect: true, feedback: "Chính xác rồi! 🍕 Nam đã ăn 3 trong tổng số 8 miếng." },
      { key: "B", text: "$\\frac{5}{8}$ chiếc bánh", isCorrect: false, feedback: "Gần đúng rồi! Đây là số bánh còn lại chưa ăn nha." },
      { key: "C", text: "$\\frac{3}{5}$ chiếc bánh", isCorrect: false, feedback: "Mẫu số phải là tổng số miếng của chiếc bánh ban đầu (8 miếng) nhé." },
      { key: "D", text: "$\\frac{8}{3}$ chiếc bánh", isCorrect: false, feedback: "Tử số phải ở trên và mẫu số ở dưới: $\\frac{3}{8}$ nha." }
    ]
  }
  */
];