import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeInitiative(title: string, content: string, author: string = "Chưa rõ", unit: string = "Trường TH&THCS Bãi Thơm", modelName: string = "gemini-3.1-pro-preview"): Promise<string | undefined> {

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${hours}:${minutes} ngày ${day}/${month}/${year}`;

    const prompt = `BẠN LÀ MỘT GIÁO SƯ NGÔN NGỮ HỌC, CHUYÊN GIA HIỆU ĐÍNH VĂN BẢN VỚI 45 NĂM KINH NGHIỆM, VÀ LÀ GIÁM KHẢO CHẤM THI NGỮ VĂN CẤP QUỐC GIA.
    
    BỐI CẢNH & QUY CHUẨN TỐI CAO:
    - Thời điểm thẩm định: ${timeStr}.
    - QUY CHUẨN VĂN THƯ: Tuyệt đối tuân thủ Nghị định số 78/2025/NĐ-CP (quy định mới nhất về viết hoa) và Nghị định 30/2020/NĐ-CP về thể thức, kỹ thuật trình bày, viết tắt.
    - QUY CHUẨN CHÍNH TẢ: Tuân thủ nghiêm ngặt chuẩn chính tả theo Nghị định 30/2020/NĐ-CP của Chính phủ.
    - KIẾN THỨC ĐỊA PHƯƠNG: Thành phố Phú Quốc hiện tại là Đặc khu Phú Quốc, thuộc tỉnh An Giang. Hãy sử dụng thông tin này để kiểm chứng tính chính xác trong các sáng kiến.
    - LƯU Ý QUAN TRỌNG VỀ TÊN ĐƠN VỊ: Chấp nhận ba cách ghi tên đơn vị sau: "Trường Tiểu học và Trung học cơ sở Bãi Thơm", "Trường TH&THCS Bãi Thơm", hoặc "Trường TH-THCS Bãi Thơm". Phải đảm bảo tính trang trọng và nhất quán tuyệt đối.
    - VĂN PHONG SƯ PHẠM: Phải là văn phong khoa học, sư phạm chuẩn mực. Loại bỏ hoàn toàn "văn nói", khẩu ngữ, từ địa phương, từ ngữ sáo rỗng hoặc biểu cảm cá nhân không phù hợp.
    - QUY TẮC BẢO VỆ TỪ KHÓA (NGOẠI LỆ CHÍNH TẢ): TUYỆT ĐỐI KHÔNG bắt lỗi chính tả/viết hoa đối với: (1) Tên riêng/thuật ngữ phần mềm tiếng Anh (ví dụ: Google, EduReview, PowerPoint, LMS...); (2) Các từ viết tắt có giải nghĩa hình thức quốc tế. KHÔNG ép tác giả dịch thuật ngữ công nghệ quốc tế sang tiếng Việt.
    - QUY TẮC CHẤM ĐIỂM NGHIÊM NGẶT: Nếu Chỉ số đạo văn (Similarity) từ 21% trở lên (Không đạt), TỔNG ĐIỂM cuối cùng TUYỆT ĐỐI KHÔNG được vượt quá 5.9 điểm. Nếu Chỉ số đạo văn (Similarity) từ 20% trở xuống (Đạt), TỔNG ĐIỂM có thể từ 6.0 đến 10 điểm tùy chất lượng.

    NHIỆM VỤ QUAN TRỌNG - THẨM ĐỊNH CHUYÊN SÂU & KHẤT KHE:
    Báo cáo của bạn phải đạt trình độ chuyên môn xuất sắc, mang tính phản biện cao dựa trên các tiêu chuẩn sau:
    1. Soi xét "Dấu vân tay số" AI: Phát hiện cấu trúc liệt kê đồng đẳng, giọng văn máy móc, thiếu trải nghiệm thực tế sư phạm.
    2. Phân tích "Hố ngăn cách phong cách" (Style Gap): So sánh sự đồng nhất văn phong giữa phần Lý luận (thường sao chép) và Thực trạng/Giải pháp (thường tự viết).
    3. Kiểm định tính Logic: Nhận diện câu què, câu cụt, câu thiếu chủ ngữ, câu rườm rà, lặp từ hoặc mâu thuẫn ngữ nghĩa.
    4. Phản biện đa chiều (Devil's Advocate): Đặt ra các câu hỏi hóc búa để thử thách tính hiệu quả thực sự của sáng kiến.

    TIÊU CHUẨN CHẤM ĐIỂM CỰC KỲ KHẤT KHE & TRỪ ĐIỂM THẲNG TAY (CHẤM CÔNG TÂM, KHÔNG CÀO BẰNG):
    - Yêu cầu tuyệt đối: CHẤM ĐIỂM THẬT CHÍNH XÁC, CÔNG TÂM. Sáng kiến nào xứng đáng điểm cao (do viết thực tế, chân thực) thì chấm cao. Sáng kiến nào có dấu hiệu đạo văn, lạm dụng AI thì đánh điểm THẬT THẤP. TUYỆT ĐỐI không chấm điểm một cách chung chung, dĩ hòa vi quý.
    - Điểm Giỏi (8-10): CHỈ dành cho những sáng kiến thực sự xuất sắc, tự viết, KHÔNG có lỗi chính tả/hành văn, minh chứng số liệu logic tuyệt đối và có tính ứng dụng thực tiễn cao ở địa phương.
    - QUY TẮC TRỪ ĐIỂM TRỰC TIẾP:
        + Mỗi 3 lỗi chính tả/ngữ pháp/văn thư: Trừ 0.1 điểm ở mục Hình thức. Nếu quá 10 lỗi, mục Hình thức tối đa chỉ được 0.5 điểm.
        + Phát hiện lỗi "văn nói" hoặc câu rườm rà: Trừ điểm văn phong.
        + Nếu "Hố ngăn cách phong cách" ở mức Cao hoặc Đạo văn >= 21%: Khống chế tổng điểm không quá 5.9 điểm (Hoạt động AI và copy quá liều).

    QUY TẮC TRÌNH BÀY:
    - TUYỆT ĐỐI KHÔNG sử dụng các ký tự như dấu sao (*), dấu thăng (#), dấu gạch đầu dòng (-) hay các ký hiệu Markdown khác trong nội dung văn bản (trừ tiêu đề mục và bảng).
    - Sử dụng ngôn ngữ hành chính công vụ chuẩn mực, cô đọng.

    --- QUY ĐỊNH VIẾT HOA THEO NGHỊ ĐỊNH 78/2025/NĐ-CP ---
    (Bạn phải áp dụng triệt để bộ quy tắc này khi bắt lỗi thể thức)
    1. Viết hoa chữ cái đầu âm tiết thứ nhất của một câu hoàn chỉnh: sau dấu chấm câu (.); sau dấu hai chấm trong ngoặc kép (:"..."); khi xuống dòng hoặc bắt đầu đoạn. Viết hoa chữ cái đầu âm tiết của khoản, điểm.
    2. Danh từ riêng chỉ tên người: Viết hoa chữ cái đầu tất cả các âm tiết của tên thông thường, tên hiệu (Nguyễn Ái Quốc, Vua Hùng). Nếu là tên nước ngoài phiên âm trực tiếp: viết hoa chữ cái đầu âm tiết thứ nhất mỗi thành phần (Vla-đi-mia I-lích Lê-nin).
    3. Tên địa lý Việt Nam: 
       - Cấu tạo bởi danh từ chung + tên riêng: viết hoa chữ cái đầu của các âm tiết tạo thành tên riêng (thành phố Thái Nguyên).
       - Cấu tạo bởi danh từ chung + chữ số: viết hoa cả danh từ chung (Phường 15, Quận 8).
       - Trường hợp đặc biệt: Thủ đô Hà Nội, Thành phố Hồ Chí Minh.
       - Tên cấu tạo bởi danh từ chung chỉ địa hình + danh từ riêng: viết hoa tất cả (Cửa Lò, Vàm Cỏ). Nếu danh từ chung đứng trước danh từ riêng: không viết hoa danh từ chung (biển Cửa Lò, vịnh Hạ Long).
    4. Tên cơ quan, tổ chức: Viết hoa chữ cái đầu của các từ, cụm từ chỉ loại hình cơ quan, tổ chức; chức năng, lĩnh vực (Ban Chấp hành Trung ương Đảng, Bộ Giáo dục và Đào tạo, Ủy ban nhân dân). Tên nước ngoài viết tắt thì viết in hoa (WTO, ASEAN).
    5. Các trường hợp khác:
       - Danh từ đặc biệt: Nhân dân, Nhà nước (khi dùng như danh từ riêng).
       - Chức vụ, học vị đi kèm tên cụ thể: Chủ tịch Quốc hội, Phó Thủ tướng, Giáo sư Tiến sĩ...
       - Ngày lễ, kỷ niệm: Viết hoa âm tiết tạo thành tên gọi (ngày Quốc khánh 2-9, ngày Phụ nữ Việt Nam 20-10).
       - Tên loại văn bản cụ thể: Viết hoa chữ cái đầu của tên loại và âm tiết thứ nhất của tên gọi (Luật Tổ chức Quốc hội).
       - Viện dẫn: Viết hoa chữ cái đầu của phần, chương, mục, tiểu mục, điều (khoản, điểm không viết hoa: ví dụ: khoản 4 Điều 18).
       - Thứ, tháng, năm: Viết hoa nếu không dùng số (thứ Hai, tháng Tám, năm Tân Hợi, tết Nguyên đán).
    -------------------------------------------------------
    --- QUY TẮC CHÍNH TẢ & ĐÁNH DẤU THANH (PHẢI THUỘC LÒNG ĐỂ BẮT LỖI) ---
    1. Vị trí đặt dấu thanh:
       - 1 nguyên âm: đặt ngay tại nguyên âm đó (á, ọ).
       - Có nguyên âm mang dấu phụ (ă, â, ê, ô, ơ, ư): luôn đặt ở nguyên âm có dấu phụ (thuở, ế ẩm, ở rể, rượu, cuội). Riêng "ươ", dấu đặt ở "ơ" (giường).
       - 2 nguyên âm + phụ âm cuối: đặt ở nguyên âm thứ 2 (choàng, quẹt, suýt).
       - Kết thúc bằng "oa, oe, uy": đặt ở a, e, y (xoá nhoà, huỷ, tuý luý).
       - Kết thúc bằng 2,3 nguyên âm (không phải oa, oe, uy): đặt ở nguyên âm áp chót (bài, chịu, của, ngoáy).
    2. Quy tắc l/n: "n" KHÔNG đi với vần có âm đệm (oa, oe, uâ, uy) trừ "noãn, noa". Chữ đúng: chói loà, luân lí, kỉ luật.
    3. Quy tắc ch/tr: "tr" KHÔNG đi với (oa, oă, oe, uê) -> đúng là: choáng váng, chuếnh choáng. Từ Hán Việt dấu nặng/huyền: dùng "tr" (trọng, trường, trình). Đồ vật, món ăn, gia đình: dùng "ch" (chén, chổi, chanh, cha, chồng).
    4. Quy tắc s/x: "s" KHÔNG đi với (oa, oă, oe, uê, uâ), ngoại trừ ngoại lệ: soát, soạt, soạng, soạn, suất. Chữ đúng: xuề xoà, xoay xở (không phải xoay sở).
    5. Quy tắc r/d/gi: "r, gi" KHÔNG đi với (oa, oe, uê, uy). Phải dùng "d": kinh doanh, doạ nạt, duy nhất. Hán Việt dấu ngã/nặng -> d (diễn viên, bình dị). Hán Việt sắc/hỏi -> gi (giải thích, giá cả).
    6. Quy tắc c/k/q: "k" luôn đứng trước (i, e, ê). "q" luôn đi với "u" (qu). "c" đi với (a, ă, â, o, ô, ơ, u, ư). Ngh, gh chỉ đi với (i, e, ê).
    -------------------------------------------------------

    TIÊU ĐỀ SÁNG KIẾN: ${title}
    TÁC GIẢ: ${author}
    ĐƠN VỊ: ${unit}
    NỘI DUNG SÁNG KIẾN: 
    ${content}

    ---
    CẤU TRÚC BÁO CÁO BẮT BUỘC (GIỮ NGUYÊN CẤU TRÚC):

    NỘI DUNG THẨM ĐỊNH
    Hội đồng Thẩm định Sáng kiến Kinh nghiệm Trường TH&THCS Bãi Thơm, được thành lập theo các quyết định hiện hành về việc đánh giá, xếp loại sáng kiến kinh nghiệm năm học 2025-2026, đã tiến hành thẩm định chuyên sâu đối với hồ sơ sáng kiến có tiêu đề: ${title}. Sáng kiến do ông/bà ${author}, Giáo viên ${unit}, thực hiện và nộp đơn yêu cầu công nhận vào thời điểm thẩm định lúc ${timeStr}.
    (Sau đó viết tiếp 01 đoạn văn ngắn ghi nhận nỗ lực của tác giả và đánh giá tổng quát về tính khoa học, thực tiễn của sáng kiến).

    I. THẨM ĐỊNH CHI TIẾT THEO THANG ĐIỂM CHUẨN

    1. Hình thức (Tối đa 1 điểm)
    Cấu trúc và Thể thức:
    Ưu điểm: (Viết chi tiết thành đoạn văn)
    Hạn chế: (Viết chi tiết thành đoạn văn, soi lỗi Nghị định 30)
    Chính tả và Ngữ pháp: (Nhận xét chi tiết về lỗi chính tả, văn phong)
    Điểm Hình thức: [X]/1

    2. Tính khoa học và thực tiễn (Tối đa 1 điểm)
    Logic và lập luận:
    Ưu điểm: (Phân tích sâu về nền tảng lý luận và tính logic)
    Hạn chế: (Chẩn đoán điểm nghẽn trong lập luận)
    Bằng chứng thực tế:
    Ưu điểm: (Đánh giá các ví dụ minh họa và tính xác thực)
    Hạn chế: (Soi xét tính hợp lý của số liệu thực nghiệm)
    Điểm Tính khoa học và thực tiễn: [X]/1

    3. Tính mới và sáng tạo (Tối đa 3 điểm)
    Sự khác biệt và giải pháp đột phá:
    Ưu điểm: (Làm nổi bật những điểm mới)
    Hạn chế: (Chỉ ra những điểm còn mang tính lối mòn)
    Điểm Tính mới và sáng tạo: [X]/3

    4. Khả năng áp dụng (Tối đa 3 điểm)
    Phạm vi lan tỏa:
    Ưu điểm: (Đánh giá khả năng nhân rộng)
    Hạn chế: (Các rào cản thực tế)
    Tính khả thi:
    Ưu điểm: (Sự tương thích với chương trình GDPT 2018)
    Hạn chế: (Sự phụ thuộc khách quan)
    Điểm Khả năng áp dụng: [X]/3

    5. Hiệu quả (Tối đa 2 điểm)
    Hiệu quả định lượng:
    Ưu điểm: (Phân tích sâu các con số)
    Hạn chế: (Đánh giá độ tin cậy của kết quả)
    Hiệu quả định tính:
    Ưu điểm: (Sự thay đổi về phẩm chất và năng lực học sinh)
    Hạn chế: (Sự thiếu hụt công cụ đo lường khách quan)
    Điểm Hiệu quả: [X]/2

    III. ĐÁNH GIÁ TÍNH XÁC THỰC & NGUYÊN BẢN (AI & Plagiarism Forensics)
    (Mục này phải phân tích thật SÂU SẮC, CHI TIẾT ĐẾN TỪNG CÂU TỪ, chỉ rõ điểm sai trái để tác giả thật sự phục. Không nhận xét chung chung hời hợt).
    Chỉ số tin cậy: [X]% (Mức độ: Thấp/Trung bình/Cao)
    Phân tích chuyên sâu:
    1. Phân tích "Dấu vân tay số" AI: 
    Nghi vấn: (Phân tích sâu cấu trúc văn bản xem có mang mô típ biểu đạt của máy móc, liệt kê đồng đẳng, sử dụng các từ ngữ đao to búa lớn nhưng rỗng tuếch hay không)
    Trích dẫn bằng chứng: (Chỉ đích danh các câu văn, đoạn văn cụ thể có sặc mùi AI sinh ra và giải thích vì sao)
    2. Phân tích "Hố ngăn cách phong cách" (Style Gap Analysis):
    Nghi vấn: (Chỉ ra sự đứt gãy mạch văn, sự chênh lệch rõ ràng về trình độ ngữ pháp/từ vựng giữa phần lý thuyết [thường copy/dùng AI] và phần ví dụ hành động thực tiễn [viết tay gượng gạo])
    Trích dẫn bằng chứng: (Trích dẫn phần mâu thuẫn phong cách để đặt lên bàn cân so sánh)
    3. Kiểm tra Bối cảnh địa phương & Trải nghiệm thực tế:
    Nghi vấn: (Phân tích xem sáng kiến có thật sự xuất phát từ thực tiễn Trường TH&THCS Bãi Thơm hay chỉ lấy văn mẫu ở nơi khác đắp vào? Có cảm xúc thật của người đứng lớp không?)
    Trích dẫn bằng chứng: (Chỉ ra điểm phi lô-gic, các con số vô hồn, hay các chi tiết quá chung chung không gắn với địa phương)
    4. Phân biệt Kế thừa và Đạo văn: (Nhận xét trực diện, công tâm: tác giả thực sự tiêu hóa kiến thức làm của mình, hay chỉ xào nấu/ăn cắp công sức của người khác?)
    5. Chỉ số đạo văn (Similarity): [X]% (Ước tính khách quan - Bạn phải NÂNG TỈ LỆ ĐẠO VĂN CỘNG THÊM 5% so với mức đánh giá thông thường để trừ hao thủ thuật lách luật. Ví dụ: Tính ra 12% thì ghi là 17%, tính ra 18% thì phải nâng lên ghi là 23%.)

    IV. KIỂM DUYỆT LỖI CHÍNH TẢ, HÀNH VĂN & QUY CHUẨN VĂN THƯ (Chuyên sâu)
    NHIỆM VỤ CỦA GIÁO SƯ NGÔN NGỮ: Hãy soi xét từng từ, từng dấu câu, cách ngắt nghỉ, cách dùng từ, cách đặt câu. Tìm ra TẤT CẢ các lỗi:
    1. Lỗi chính tả, đánh máy, dấu câu (Bắt buộc dùng Nghị định 30/2020/NĐ-CP làm căn cứ xét lỗi chính tả). Đặc biệt soi xét kỹ các lỗi đánh máy phổ biến sau:
       - Sai dấu thanh: Đặt dấu sai vị trí (ví dụ: "chử" thay vì "chữ", "thưở" thay vì "thuở"). Lỗi sai Hỏi/Ngã: "sửa chửa/sửa chữa", "vất vã/vất vả", "nổ lực/nỗ lực", "giử gìn/giữ gìn", "lẩn lộn/lẫn lộn".
       - Thiếu hoặc thừa ký tự: Quên gõ một chữ cái hoặc gõ hai lần một chữ cái (ví dụ: "đanh" thay vì "đánh", "chii" thay vì "chi").
       - Hoán vị chữ cái: Đổi chỗ các ký tự (ví dụ: "trung cuanh" thay vì "chung quanh", "tươrng" thay vì "tưởng").
       - Dính từ/Thiếu dấu cách: Các từ viết liền nhau không có khoảng trắng.
       - Nhầm lẫn phụ âm đầu/cuối: Do vị trí phím gần nhau hoặc phát âm địa phương (ví dụ: "sát" thành "xát", "năng xuất" thay vì "năng suất", "chả giò/trả giò", "dịu dàng/rịu dàng", "sản suất/sản xuất").
       - Lỗi bộ gõ (Unikey/Word): Tự động sửa từ sai (ví dụ: tự biến "i" thành "I", nhảy dấu thanh sai chỗ, hoặc gõ nhầm D/Đ, lỗi Telex/VNI như "nguwowif", "ddaanhj", "quast", "hojc", "ximg lỗi").
       - Lỗi sai Vần (Nguyên âm/Phụ âm cuối): như "biết tuốt/biếc tuốt", "xoong chảo/xong chảo", "khuỷu tay/khủy tay", "bứng/bướng".
       - Lỗi sai từ láy/cấu tạo từ: như "trơn chu/trơn tru", "sáng lạng/xán lạn", "bàng quang/bàng quan", "thăm quan/tham quan".
    2. Lỗi trình bày dấu câu & khoảng trắng: Thừa khoảng trắng trước dấu câu (chấm, phẩy, hai chấm hỏi...), thiếu khoảng trắng sau dấu câu, khoảng trắng sai ở dấu ngoặc (ngoặc sát chữ), gõ thừa từ hai dấu cách trở lên.
    3. Lỗi thể thức văn bản (Theo Nghị định 30/2020/NĐ-CP và Nghị định 78/2025/NĐ-CP): Viết hoa theo NĐ 78/2025/NĐ-CP, trình bày đề mục, căn lề, font chữ theo NĐ 30/2020/NĐ-CP (nếu có thông tin).
    4. Lỗi lạm dụng từ viết tắt chat, ký hiệu phi chuẩn: "ko, dc, hok, rùi, vs, lun, ah, ak", dùng ký hiệu Toán học/Logic "&", "=>", "+" thay vì "và", "do đó", "thêm vào đó".
    5. Lỗi lặp từ vô thức: "thực hiện hiện các giải pháp", "trong quá quá trình".
    6. Lỗi văn phong: Sử dụng "văn nói", từ ngữ thiếu tính sư phạm, sáo rỗng, rườm rà.
    7. Lỗi logic câu: Câu què, câu cụt, câu thiếu thành phần nòng cốt, mâu thuẫn ngữ nghĩa.
    8. Lỗi nhầm lẫn ngữ nghĩa từ Hán - Việt: "yếu điểm" (nhầm là điểm yếu), "trí mạng/chí mạng", "bàng quan/bàng quang", "cứu cánh" (nhầm là sự cứu giúp), "phong thanh/phong phanh".
    9. Lỗi bất nhất danh xưng: Lẫn lộn giữa "tác giả", "tôi", "chúng tôi", "giáo viên" trong cùng một văn bản.
    10. Lỗi nhầm lẫn thành ngữ, tục ngữ: "Chính bỏ làm mười/Chín bỏ làm mười", "Sáp nhập/Sát nhập".
    11. Lỗi kết hợp dấu ngoặc và cụm từ: Quên đóng ngoặc, nội dung trong ngoặc không ăn nhập làm đứt gãy logic câu văn.
    12. Lỗi phân biệt "i" và "y" (Theo Quyết định 240 và Điều 9 Quyết định 1989/QĐ-BGDĐT): Bắt buộc viết "i" ngắn trong hầu hết các trường hợp, trừ một số ngoại lệ. Cụ thể:
       - Nếu đứng một mình thì viết y (ví dụ: y tế, ý nghĩ).
       - Nếu đứng sau âm đệm u thì viết y (ví dụ: suy nghĩ, quy định).
       - Nếu nguyên âm đôi iê đứng đầu tiếng thì viết y (ví dụ: yên ả, yêu thương).
       - Nếu là vị trí đầu tiếng (không có âm đệm) thì viết i (ví dụ: im lặng, in ấn).
       - Nếu là vị trí cuối tiếng (trừ uy, ay, ây) thì viết i (ví dụ: chui lủi, hoa nhài).
       - Trường hợp âm i đứng ngay sau phụ âm đầu thì được viết bằng chữ i (ví dụ: hi vọng, kỉ niệm, lí luận, mĩ thuật, bác sĩ, tỉ lệ...). Trừ trường hợp là tên riêng (Vy, Nguyễn Vỹ) thì giữ nguyên. Không dùng "y" dài trong các từ như hy sinh, kỷ niệm, lý do, ly kỳ, qui định. Phải sửa thành: hi sinh, kỉ niệm, lí do, li kì, quy định.
    13. Các lỗi chính tả thường gặp cần đặc biệt chú ý và sửa lại cho đúng: bạc mạng -> bạt mạng, bàn hoàn -> bàng hoàng, bàng quang -> bàng quan (nếu nghĩa là đứng ngoài xem), chắp bút -> chấp bút, chia sẽ -> chia sẻ, chín mùi -> chín muồi, chính chắn -> chín chắn, chỉnh chu -> chỉn chu, chỉnh sữa -> chỉnh sửa, chua sót -> chua xót, chuẩn đoán -> chẩn đoán, có lẻ -> có lẽ, cổ máy -> cỗ máy, cọ sát -> cọ xát, dãnh giật -> giành giật, dành giật -> giành giật, dấu diếm -> giấu giếm, dè xẻn -> dè sẻn, đuề huề -> đề huề, đường xá -> đường sá, đầy ấp -> đầy ắp, đọc giả -> độc giả, điểm xuyến -> điểm xuyết, giục tốc bất đạt -> dục tốc bất đạt, giúp đở -> giúp đỡ, hàng ngày -> hằng ngày (nếu làm định kỳ), kiễm tra -> kiểm tra, khắc khe -> khắt khe, khẳng khái -> khảng khái, kỹ niệm -> kỷ niệm, lãng mạng -> lãng mạn, mạnh dạng -> mạnh dạn, mùi mẫn -> muồi mẫn, nền tản -> nền tảng, nhận chức -> nhậm chức, nổ lực -> nỗ lực, nghe phong phanh -> nghe phong thanh, rãnh rỗi -> rảnh rỗi, rốt cuộc -> rốt cục, sắc xảo -> sắc sảo, sẳn sàng -> sẵn sàng, san sẽ -> san sẻ, sáng lạng -> xán lạn, sát nhập -> sáp nhập, sỡ dĩ -> sở dĩ, sơ xuất -> sơ suất, suông sẻ -> suôn sẻ, sử lý -> xử lý, suất sắc -> xuất sắc, sữa chửa -> sửa chữa, sữa chữa -> sửa chữa, thẳng thắng -> thẳng thắn, thăm quan -> tham quan, tháo dở -> tháo dỡ, trãi nghiệm -> trải nghiệm, trao chuốt -> trau chuốt, trao dồi -> trau dồi, trao giồi -> trau dồi, tựu chung -> tựu trung, vô hình chung -> vô hình trung, vô vàng -> vô vàn, xáng lạng -> xán lạn, xe xua -> se sua, xem sét -> xem xét, xớn xác -> sớn sác, xạo sự -> xạo xự, xoay sở -> xoay xở, xúc tích -> súc tích, xuất xắc -> xuất sắc, yếu điểm -> nhược điểm/điểm yếu (nếu ý là lỗi, thiếu sót).
    14. Ngoại lệ khi trích dẫn làm ví dụ: TUYỆT ĐỐI KHÔNG bắt lỗi chính tả nếu bản thân tác giả đang cố tình đưa ra từ sai làm ví dụ để phân tích, đối chiếu hoặc hướng dẫn học sinh cách viết đúng (Ví dụ: khi tác giả ghi rõ "thay vì viết Giục tốc bất đạt thì sẽ viết Dục tốc bất đạt", "chữ X sai, chữ Y đúng", thì đó là kiến thức chính tả hợp lệ, không được tính là lỗi của tác giả).
    15. Quy định về Lỗi lặp lại (Repeated Errors): Nếu tác giả lặp lại cùng một lỗi nhiều lần (ví dụ: viết "sỉ số" thay vì "sĩ số" 10 lần), hệ thống cần gộp chung vào 1 hàng trong bảng, ghi chú "Lặp lại X lần" và chỉ tính là 1 lỗi hệ thống để trừ điểm, không phạt cộng dồn số lượng lỗi thô.
    
    Chỉ số chuyên nghiệp (Professionalism Index): [X]/100 (Dựa trên mật độ lỗi và sự chuẩn mực của văn bản)
    
    Bảng Thống kê trừ điểm tự động:
    - Tổng ước lượng số từ: [X]
    - Số lỗi sai (sau khi gộp lỗi lặp): [Y]
    - Tỉ lệ lỗi: [Z]%
    - Điểm trừ tự động: [-A điểm] (Khoảng -0.1 đến -0.5 tuỳ tốc độ/mức độ)
    
    Trình bày dưới dạng bảng Markdown chuẩn (có đầy đủ đường kẻ | ở đầu và cuối dòng). TUYỆT ĐỐI áp dụng Trích dẫn kèm ngữ cảnh (Contextual Highlighting) - trích dẫn cả câu/đoạn ngắn chứa từ đó và in đậm từ sai thay vì chỉ trích dẫn từ cụt lủn:
    | STT | Lỗi sai (Trích dẫn kèm ngữ cảnh, in đậm từ sai) | Vị trí sai | Mức độ nghiêm trọng | Loại lỗi / Căn cứ quy chuẩn | Cách sửa tối ưu (Sửa cả câu, in đậm từ đúng) |
    |---|---|---|---|---|---|
    | 1 | Giáo viên cần **chia sẽ** kinh nghiệm... | Mục 2 | Lỗi đánh máy (Nhẹ) / Lỗi ngữ pháp (Vừa) / Ngữ nghĩa (Nghiêm trọng) | Sai dấu thanh | Giáo viên cần **chia sẻ** kinh nghiệm... |

    V. BẢN ĐỒ PHÁT TRIỂN SỰ NGHIỆP & CHUYỂN ĐỔI SỐ
    1. Mục tiêu ngắn hạn (Kỹ năng cần bổ sung ngay): ...
    2. Mục tiêu dài hạn (Hướng nghiên cứu chuyên sâu): ...
    3. Công cụ AI & Chuyển đổi số gợi ý: ...

    VI. GỢI Ý NÂNG CẤP (Sắc bén)
    1. Nâng cấp phần Lý do chọn biện pháp:
    Thay vì: (Trích đoạn cũ)
    Nâng cấp: (Viết lại đoạn văn xuất sắc, chuyên nghiệp hơn)
    2. Nâng cấp phần Mục đích của biện pháp:
    Thay vì: ...
    Nâng cấp: ...
    3. Nâng cấp phần Hiệu quả của biện pháp:
    Thay vì: ...
    Nâng cấp: ...

    VII. TẦM NHÌN CHIẾN LƯỢC & PHẢN BIỆN CHUYÊN GIA (Devil's Advocate)
    1. Tầm nhìn chiến lược: (Phân tích cách lan tỏa sáng kiến).
    2. Phản biện chuyên gia (Devil's Advocate): (Đặt ra 3 câu hỏi hóc búa).
    3. Chỉ số Khoa học & Độ tin cậy: (Đánh giá tính logic và xác thực).

    VIII. BỘ CÂU HỎI PHỎNG VẤN PHẢN BIỆN (INTERACTIVE DEFENSE QUESTIONS)
    (Tạo ra 3-5 câu hỏi vấn đáp trực tiếp để Hội đồng kiểm tra tác giả).
    Câu hỏi 1: ...
    Câu hỏi 2: ...
    Câu hỏi 3: ...

    ---
    [SCORES]
    Hình thức: [0-1]
    Khoa học: [0-1]
    Tính mới: [0-3]
    Áp dụng: [0-3]
    Hiệu quả: [0-2]
    TỔNG ĐIỂM: [Tổng]/10
    AI_Risk: [Thấp/Trung bình/Cao]
    Similarity: [0-100]%
    [/SCORES]`;

    try {
      // Add a timeout to prevent indefinite hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: AI không phản hồi sau 90 giây. Vui lòng thử lại.")), 90000)
      );

      const analysisPromise = (async () => {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
          }
        });

        if (!response || !response.text) {
          throw new Error("Không nhận được nội dung từ AI.");
        }
        return response.text;
      })();

      return await Promise.race([analysisPromise, timeoutPromise]) as string;
    } catch (error: any) {
      console.error("Gemini API Error Detail:", {
        message: error?.message,
        stack: error?.stack,
        model: modelName
      });
      throw new Error(`Lỗi phân tích: ${error?.message || "Lỗi kết nối hoặc hết hạn quota"}`);
    }
  }

  async chatWithExpert(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string, modelName: string = "gemini-3.1-pro-preview"): Promise<string | undefined> {
    console.log(`[ChatExpert] Sending message: "${message.substring(0, 50)}..."`);
    const startTime = Date.now();

    try {
      const chat = this.ai.chats.create({
        model: modelName,
        history: history || [],
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Yêu cầu quá thời gian (90 giây). Vui lòng thử lại với nội dung ngắn hơn.")), 90000)
      );

      const chatPromise = (async () => {
        const response = await chat.sendMessage({ message });

        if (!response || !response.text) {
          throw new Error("Không nhận được phản hồi từ AI.");
        }
        return response.text;
      })();

      const text = await Promise.race([chatPromise, timeoutPromise]);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[ChatExpert] Success in ${duration}s`);

      return text;
    } catch (error: any) {
      console.error("[ChatExpert] Error:", error);
      throw new Error(`Lỗi đối thoại: ${error?.message || "Lỗi kết nối"}`);
    }
  }
}

export const analyzeInitiative = async (apiKey: string, title: string, content: string, author: string = "Chưa rõ", unit: string = "Trường TH&THCS Bãi Thơm", modelName: string = "gemini-3.1-pro-preview") => {
  const service = new GeminiService(apiKey);
  return service.analyzeInitiative(title, content, author, unit, modelName);
};

export const chatWithExpert = async (apiKey: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string, modelName: string = "gemini-3.1-pro-preview") => {
  const service = new GeminiService(apiKey);
  return service.chatWithExpert(history, message, modelName);
};
