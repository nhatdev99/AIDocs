// Test script for SEO Analysis Parser
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { parseSEOAnalysis } = require('./src/app/api/seo-analyze/route.ts')

const sampleText = `Báo cáo Phân tích SEO
Tổng quan
Báo cáo này phân tích đoạn văn bản được cung cấp để xác định các vấn đề SEO và đề xuất các cải tiến. Phân tích tập trung vào các yếu tố quan trọng như Meta Title, Meta Description, Cấu trúc Heading, Mật độ từ khóa, Liên kết, Cấu trúc nội dung, Tính thân thiện với thiết bị di động, Tối ưu hóa hình ảnh, Cấu trúc URL và SEO kỹ thuật.

Phân tích Chi tiết
Meta Title
Phân tích: Không có Meta Title. Điều này là một thiếu sót lớn vì Meta Title là yếu tố quan trọng nhất để Google hiểu nội dung trang và hiển thị trong kết quả tìm kiếm.

Nguyên nhân: Đoạn văn bản chỉ là nội dung bài viết, không bao gồm thẻ HTML để xác định Meta Title.

Đề xuất: Cần bổ sung Meta Title. Ví dụ: <title>Màn bay chào mừng Quốc khánh 2/9: Chuẩn bị kỹ lưỡng của Không quân</title>. Title cần ngắn gọn (dưới 60 ký tự), chứa từ khóa chính ("màn bay chào mừng Quốc khánh 2/9") và mang tính hấp dẫn.

Meta Description
Phân tích: Tương tự, không có Meta Description.

Nguyên nhân: Đoạn văn bản chỉ là nội dung bài viết, không bao gồm thẻ HTML để xác định Meta Description.

Đề xuất: Bổ sung Meta Description. Ví dụ: <meta name="description" content="Đại tá Ngô Quang Huy chia sẻ về quá trình chuẩn bị công phu, tính toán chính xác từng giây cho màn bay chào mừng Quốc khánh 2/9 của Không quân Nhân dân Việt Nam. Xem chi tiết!"></meta>. Description nên dưới 160 ký tự, chứa từ khóa chính, cung cấp tóm tắt nội dung và khuyến khích người dùng nhấp vào.

Cấu trúc Heading
Phân tích: Đoạn văn bản không có cấu trúc heading (H1, H2, H3...). Điều này gây khó khăn cho việc đọc và hiểu nội dung, đồng thời làm giảm khả năng SEO.

Nguyên nhân: Văn bản chỉ bao gồm các đoạn văn bản đơn thuần (<p>).

Đề xuất: Chia nội dung thành các phần có heading rõ ràng. Ví dụ:

<h1>Tính toán chính xác từng giây cho màn bay chào mừng Quốc khánh 2/9</h1>
<h2>Quá trình Chuẩn Bị</h2>
<h2>Tuyển Chọn và Huấn Luyện Phi Công</h2>
<h2>Phối Hợp và An Toàn Bay</h2>
Sử dụng từ khóa trong heading một cách tự nhiên.

Mật độ từ khóa và cách sử dụng
Phân tích: Từ khóa chính "màn bay chào mừng Quốc khánh 2/9" xuất hiện khá ít. Các từ khóa liên quan như "Không quân", "Quảng trường Ba Đình", "Sư đoàn 371" xuất hiện nhiều hơn. Cách sử dụng từ khóa tương đối tự nhiên, không có dấu hiệu nhồi nhét.

Nguyên nhân: Nội dung tập trung vào phỏng vấn, tường thuật quá trình, không tập trung tối ưu hóa cho từ khóa cụ thể.

Đề xuất: Tăng cường sử dụng từ khóa chính và các từ khóa liên quan một cách tự nhiên trong các đoạn văn, heading và alt text của hình ảnh. Đảm bảo mật độ từ khóa không quá cao (khoảng 1-2%).

Liên kết nội bộ/ngoại bộ
Phân tích: Không có liên kết nội bộ hoặc ngoại bộ nào trong đoạn văn bản này.

Nguyên nhân: Đoạn văn bản chỉ là một phần của bài viết, chưa được tích hợp vào website hoàn chỉnh.

Đề xuất:

Liên kết nội bộ: Liên kết đến các bài viết liên quan trên website (ví dụ: các bài viết về Không quân Việt Nam, các sự kiện lịch sử liên quan đến Quốc khánh 2/9).
Liên kết ngoại bộ: Liên kết đến các nguồn uy tín (ví dụ: trang web chính phủ, các báo lớn đưa tin về sự kiện).
Cấu trúc nội dung & mức độ dễ đọc
Phân tích: Nội dung được trình bày dưới dạng các đoạn văn bản dài, gây khó khăn cho việc đọc lướt và nắm bắt thông tin chính. Độ dài câu khá lớn, một số câu phức tạp.

Nguyên nhân: Nội dung là bản ghi phỏng vấn, nên mang tính tường thuật cao.

Đề xuất:

Chia các đoạn văn thành các đoạn ngắn hơn (3-4 câu).
Sử dụng bullet points hoặc numbered lists để liệt kê các thông tin quan trọng.
Viết câu ngắn gọn, rõ ràng, dễ hiểu.
Sử dụng các từ ngữ đơn giản, tránh thuật ngữ chuyên môn nếu không cần thiết.
Tính thân thiện với thiết bị di động
Phân tích: Không thể đánh giá trực tiếp vì chỉ có đoạn văn bản. Tuy nhiên, cấu trúc nội dung hiện tại (các đoạn văn dài) không thân thiện với thiết bị di động.

Nguyên nhân: Thiếu các yếu tố thiết kế responsive.

Đề xuất:

Đảm bảo website sử dụng thiết kế responsive, tự động điều chỉnh kích thước và bố cục cho phù hợp với các loại màn hình khác nhau.
Sử dụng font chữ dễ đọc trên thiết bị di động.
Tối ưu hóa kích thước hình ảnh để tải nhanh trên mạng di động.
Tối ưu hóa hình ảnh
Phân tích: Có nhắc đến hình ảnh (ví dụ: "Ảnh: Giang Huy"), nhưng không có thông tin về alt text, kích thước, định dạng.

Nguyên nhân: Đoạn văn bản không bao gồm mã HTML cho hình ảnh.

Đề xuất:

Sử dụng hình ảnh chất lượng cao, liên quan đến nội dung.
Tối ưu hóa kích thước hình ảnh để giảm thời gian tải trang.
Sử dụng định dạng ảnh phù hợp (JPEG cho ảnh chụp, PNG cho logo và hình ảnh có độ phân giải cao).
Thêm alt text cho tất cả các hình ảnh, mô tả nội dung hình ảnh bằng từ khóa liên quan. Ví dụ: <img src="duong-dan-anh.jpg" alt="Máy bay Su-30MK2 tham gia màn bay chào mừng Quốc khánh 2/9">
Cấu trúc URL
Phân tích: Không có URL để phân tích.

Nguyên nhân: Không có thông tin về URL.

Đề xuất:

Sử dụng URL ngắn gọn, dễ đọc và chứa từ khóa chính. Ví dụ: /man-bay-chao-mung-quoc-khanh-2-9
Sử dụng dấu gạch ngang (-) để phân tách các từ trong URL.
Tránh sử dụng các ký tự đặc biệt hoặc số ID trong URL.
SEO kỹ thuật
Phân tích: Không có thông tin để phân tích SEO kỹ thuật (tốc độ tải trang, sitemap, robots.txt, schema markup).

Nguyên nhân: Chỉ có đoạn văn bản.

Đề xuất: (Các đề xuất này áp dụng cho toàn bộ website)

Tốc độ tải trang: Tối ưu hóa hình ảnh, sử dụng caching, giảm thiểu HTTP requests, sử dụng Content Delivery Network (CDN).
Sitemap: Tạo sitemap XML và submit lên Google Search Console để giúp Google thu thập dữ liệu website hiệu quả hơn.
Robots.txt: Tạo file robots.txt để chỉ định các phần của website mà bạn không muốn Google thu thập dữ liệu.
Schema markup: Sử dụng schema markup để cung cấp cho Google thông tin chi tiết về nội dung trang (ví dụ: bài viết, sự kiện, sản phẩm). Điều này giúp Google hiểu rõ hơn nội dung và hiển thị kết quả tìm kiếm phong phú hơn.
HTTPS: Đảm bảo website sử dụng HTTPS để bảo mật dữ liệu.
Mobile-first indexing: Google ưu tiên lập chỉ mục các website thân thiện với thiết bị di động.
Kết luận & Chiến lược SEO Tổng thể
Đoạn văn bản này có tiềm năng SEO tốt, nhưng cần được tối ưu hóa đáng kể. Các vấn đề chính bao gồm:

Thiếu Meta Title và Meta Description.
Cấu trúc heading chưa hợp lý.
Thiếu liên kết nội bộ và ngoại bộ.
Cấu trúc nội dung chưa thân thiện với người đọc và thiết bị di động.
Chiến lược SEO tổng thể:

Nghiên cứu từ khóa: Xác định các từ khóa chính và từ khóa liên quan mà người dùng có thể sử dụng để tìm kiếm thông tin về "màn bay chào mừng Quốc khánh 2/9" và các chủ đề liên quan.
Tối ưu hóa nội dung:
Viết Meta Title và Meta Description hấp dẫn, chứa từ khóa.
Sử dụng cấu trúc heading (H1, H2, H3...) hợp lý, chứa từ khóa.
Tăng cường sử dụng từ khóa và các từ khóa liên quan trong nội dung.
Chia các đoạn văn thành các đoạn ngắn hơn.
Sử dụng bullet points hoặc numbered lists để liệt kê các thông tin quan trọng.
Xây dựng liên kết:
Xây dựng liên kết nội bộ đến các bài viết liên quan trên website.
Tìm kiếm cơ hội xây dựng liên kết ngoại bộ từ các website uy tín.
Tối ưu hóa SEO kỹ thuật:
Tối ưu hóa tốc độ tải trang.
Tạo sitemap XML và submit lên Google Search Console.
Sử dụng schema markup.
Đảm bảo website sử dụng HTTPS.
Theo dõi và đánh giá: Sử dụng Google Analytics và Google Search Console để theo dõi hiệu quả SEO và thực hiện các điều chỉnh cần thiết.`

try {
  const result = parseSEOAnalysis(sampleText)
  console.log('Parsed Result:')
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error('Error parsing:', error)
}
