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
  {
    id: "q2",
    title: "Một chiếc bánh pizza 🍕 thơm ngon được cắt đều thành 8 miếng bằng nhau. Bạn Nam đã ăn hết 3 miếng. Phân số chỉ số phần bánh pizza Nam đã ăn là bao nhiêu?",
    context: "Toán lớp 4: Khái niệm phân số trực quan. Chiếc bánh chia thành 8 phần bằng nhau đóng vai trò là mẫu số (8). Nam đã ăn 3 phần đóng vai trò là tử số (3).",
    hints: [
      "Mẫu số là tổng số phần bằng nhau được chia ra (chiếc bánh được chia thành 8 miếng).",
      "Tử số là số phần đã được lấy đi (Nam đã ăn 3 miếng bánh)."
    ],
    options: [
      {
        key: "A",
        text: "$\\frac{5}{8}$ chiếc bánh",
        isCorrect: false,
        feedback: "Gần đúng rồi! $\\frac{5}{8}$ là số phần bánh còn lại chưa ăn ($8 - 3 = 5$ miếng). Đề bài đang hỏi số phần bánh Nam ĐÃ ĂN cơ bạn nhé!"
      },
      {
        key: "B",
        text: "$\\frac{3}{8}$ chiếc bánh",
        isCorrect: true,
        feedback: "Hoan hô, đúng rồi! 🍕 Chiếc bánh chia đều thành 8 phần (mẫu số là $8$), Nam ăn 3 phần (tử số là $3$), vậy phân số chỉ số phần bánh Nam đã ăn là $\\frac{3}{8}$."
      },
      {
        key: "C",
        text: "$\\frac{3}{5}$ chiếc bánh",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Mẫu số phải là tổng số miếng của chiếc bánh ban đầu ($8$ miếng), không phải số miếng còn lại ($5$ miếng) đâu nhé."
      },
      {
        key: "D",
        text: "$\\frac{8}{3}$ chiếc bánh",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Số phần đã ăn (tử số $3$) phải nằm ở trên, còn tổng số phần (mẫu số $8$) phải nằm ở dưới gạch ngang: $\\frac{3}{8}$."
      }
    ]
  },
  {
    id: "q3",
    title: "Bác Năm có một mảnh vườn trồng hoa hình chữ nhật 🏡🌻 có chiều dài $12\\text{ m}$ và chiều rộng $8\\text{ m}$. Chu vi của mảnh vườn đó là bao nhiêu mét?",
    context: "Toán lớp 5: Hình học phẳng - Chu vi hình chữ nhật. Công thức tính chu vi hình chữ nhật: P = (chiều dài + chiều rộng) × 2.",
    hints: [
      "Chu vi hình chữ nhật bằng tổng chiều dài cộng chiều rộng rồi nhân với 2 (cùng đơn vị đo).",
      "Công thức: $P = (a + b) \\times 2$ với $a = 12\\text{ m}$ và $b = 8\\text{ m}$."
    ],
    options: [
      {
        key: "A",
        text: "$20\\text{ m}$",
        isCorrect: false,
        feedback: "Chưa đúng rồi! $12 + 8 = 20\\text{ m}$ mới chỉ là nửa chu vi thôi, bạn nhớ nhân thêm 2 nữa nhé!"
      },
      {
        key: "B",
        text: "$96\\text{ m}$",
        isCorrect: false,
        feedback: "Chưa đúng rồi! $12 \\times 8 = 96\\text{ m}^2$ là DIỆN TÍCH của mảnh vườn, còn đề bài hỏi CHU VI cơ nha."
      },
      {
        key: "C",
        text: "$40\\text{ m}$",
        isCorrect: true,
        feedback: "Tuyệt vời, bạn giỏi lắm! ⭐ Chu vi mảnh vườn là: $(12 + 8) \\times 2 = 20 \\times 2 = 40\\text{ m}$."
      },
      {
        key: "D",
        text: "$48\\text{ m}$",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Hãy tính cẩn thận: $(12 + 8) = 20$, rồi $20 \\times 2 = 40\\text{ m}$ chứ không phải $48\\text{ m}$ đâu nhé."
      }
    ]
  },
  {
    id: "q4",
    title: "Trong một rổ quả có 15 quả táo đỏ 🍎 và số quả lê 🍐 gấp 2 lần số quả táo đỏ. Hỏi trong rổ có tất cả bao nhiêu quả táo và quả lê?",
    context: "Toán lớp 3: Bài toán giải bằng hai phép tính - Gấp một số lên nhiều lần. Bước 1 tìm số quả lê: 15 × 2 = 30 quả. Bước 2 tìm tổng số quả: 15 + 30 = 45 quả.",
    hints: [
      "Bước 1: Tính số quả lê bằng cách lấy số quả táo nhân với 2 ($15 \\times 2$).",
      "Bước 2: Cộng số quả táo và số quả lê lại với nhau để ra tất cả số quả trong rổ."
    ],
    options: [
      {
        key: "A",
        text: "30 quả",
        isCorrect: false,
        feedback: "Chưa đúng rồi! 30 quả mới chỉ là số quả lê thôi, bạn nhớ cộng thêm 15 quả táo ban đầu nữa nhé!"
      },
      {
        key: "B",
        text: "45 quả",
        isCorrect: true,
        feedback: "Xuất sắc luôn! 🍎🍐 Số quả lê trong rổ là: $15 \\times 2 = 30$ quả. Tổng số quả táo và quả lê là: $15 + 30 = 45$ quả."
      },
      {
        key: "C",
        text: "35 quả",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Hãy kiểm tra lại: số quả lê là $15 \\times 2 = 30$, rồi $15 + 30 = 45$ quả nha."
      },
      {
        key: "D",
        text: "60 quả",
        isCorrect: false,
        feedback: "Chưa đúng rồi! Bạn lấy $15 \\times 4$ rồi, hãy tính: 15 quả táo cộng 30 quả lê là 45 quả nhé."
      }
    ]
  }
];