# Hướng Dẫn Thiết Lập Gemini API

## Lấy Khóa API

1. Truy cập [Google AI Studio](https://ai.google.dev/aistudio)
2. Đăng nhập bằng tài khoản Google của bạn
3. Tạo khóa API mới
4. Sao chép khóa API

## Biến Môi Trường

Tạo file `.env.local` trong thư mục gốc của dự án với nội dung sau:

```env
# Khóa API Google Gemini
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

## Mô Hình Có Sẵn

Ứng dụng sử dụng các mô hình Gemini theo thứ tự ưu tiên sau:

1. `gemini-1.5-flash` - Nhanh và hiệu quả (khuyên dùng)
2. `gemini-1.5-pro` - Mô hình hiệu suất cao
3. `gemini-1.5-flash-8b` - Mô hình nhẹ

## Xử Lý Lỗi

Ứng dụng bao gồm logic dự phòng tự động sẽ thử các mô hình khác nhau nếu một mô hình thất bại. Điều này đảm bảo độ tin cậy tốt hơn khi xử lý tài liệu.

## Khắc Phục Sự Cố

Nếu bạn gặp lỗi API:

1. Kiểm tra khóa API của bạn có hợp lệ và còn hạn mức không
2. Xác minh mô hình bạn đang sử dụng có sẵn trong khu vực của bạn không
3. Kiểm tra Google Cloud Console để biết vấn đề về thanh toán hoặc hạn mức
4. Thử chuyển sang mô hình khác nếu mô hình hiện tại không khả dụng

## Giới Hạn Tốc Độ

- Cấp miễn phí: Giới hạn số yêu cầu mỗi ngày
- Cấp trả phí: Giới hạn cao hơn dựa trên gói thanh toán

Theo dõi việc sử dụng của bạn trong Google Cloud Console để tránh đạt đến giới hạn tốc độ.
