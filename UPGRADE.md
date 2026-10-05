# Nâng cấp bản animation (05/10/2026)

Bản này xây từ bộ Campus Space đã gửi trước đó. Vì đã tách App.tsx thành nhiều màn hình/components/hooks, nên dùng toàn bộ folder mới.

## Áp dụng nhanh

1. Giải nén ZIP vào **thư mục mới** để giữ bản cũ làm dự phòng.
2. Sao chép **chỉ file `.env` của bạn** từ bản cũ sang folder mới (cùng cấp `package.json`). Không cần tạo lại Firebase hoặc xóa lịch đã đặt.
3. Mở terminal trong folder mới:

   ```bash
   npm ci
   npx expo start --clear
   ```

4. Quét QR bằng Expo Go hỗ trợ **SDK 57**. Nếu mạng nội bộ bị chặn:

   ```bash
   npx expo start --tunnel --clear
   ```

5. Nếu đã có 15 phòng thì dùng luôn. Nếu thiếu, nút tạo/bổ sung mẫu chỉ thêm phòng chưa có. Lệnh `npm run seed:more` vẫn thêm 10 phòng bổ sung bằng ID cố định.

**Không chỉ chép riêng App.tsx**: file này hiện là điểm ghép các provider, toàn bộ màn hình đã chuyển vào `src/screens`.

## Reanimated 3 trong slide của thầy

Dự án có Expo **57**, React Native **0.86.3**, Reanimated **4.5.1** và Worklets **0.10.1** theo bộ phiên bản Expo hỗ trợ. Những kiến thức Layout Animations được nêu ở slide (entering, exiting, layout transition, shared values, spring) vẫn được áp dụng. Không ép Reanimated 3 vào SDK 57. Nếu thầy bắt buộc đúng major 3, cần đổi cả bộ Expo/React Native/Expo Go tương ứng; đây không phải thay một số phiên bản trong package.json.

Không cần thêm plugin Babel thủ công: Expo cấu hình worklets qua babel-preset-expo. Không dùng debugger Remote JS cũ với Reanimated; dùng Hermes inspector.

Nguồn phiên bản: https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/

## Những thay đổi thấy được

- Thẻ phòng xuất hiện lần lượt, có chuyển bố cục khi lọc bằng Animated.FlatList.
- Chip chuyển màu; nút và thẻ co nhẹ khi nhấn rồi nảy trở lại.
- Bộ lọc trượt lên với nền mờ. Kéo **thanh nắm phía trên** xuống để đóng; nội dung vẫn cuộn độc lập.
- Bộ lọc có bản nháp: đóng bảng không áp dụng; nhấn “Xem … phòng” mới áp dụng vào Zustand.
- Ảnh minh họa phòng dịch chuyển nhẹ theo cuộn (parallax).
- Ô giờ có chuyển trạng thái; chọn một ô được đúng 30 phút, tối đa 4 giờ.
- Chỉ sau khi Firestore xác nhận thành công mới mở màn hình thành công, có vòng checkmark và hạt trang trí.
- Icon tab chuyển động khi chuyển tab; trạng thái tải có skeleton.
- Tôn trọng Reduce Motion của hệ điều hành; không chạy vòng animation trang trí liên tục khi bật giảm chuyển động.

## Đối chiếu rubric

| Tiêu chí | Phần triển khai |
| --- | --- |
| UI/UX 25% | Shared components, loading/error/empty states, spring, stagger, layout transitions, parallax, success animation, gesture sheet |
| Features 30% | Tìm có/không dấu; lọc kết hợp; 15 phòng mẫu; chọn ngày/giờ; đặt/hủy; lịch cá nhân; chặn trùng bằng transaction |
| Navigation 15% | Native Stack + Bottom Tabs; `RootStackParamList`, `TabParamList`, typed screen props; route detail chỉ truyền `roomId` |
| State 15% | Zustand chứa tiêu chí lọc và ngày; TanStack Query chứa phòng, lịch, ô đã đặt và mutations; Firestore snapshot cập nhật Query cache |
| Code Quality 15% | TypeScript strict; App.tsx nhỏ; screens/components/hooks/utils riêng; không `any` trong source; 12 kiểm tra logic |

Các mục này là bằng chứng triển khai, không phải cam kết điểm chấm hoặc 60 fps trên mọi thiết bị.

## Demo cho thầy trong 3 phút

1. Tìm `phong hoc` không dấu, mở lọc, kết hợp tòa/tầng/số chỗ/tiện ích. Chọn chip và xem số phòng thay đổi.
2. Kéo thanh nắm để đóng bảng, mở lại, áp dụng; quan sát chuyển bố cục danh sách.
3. Vào chi tiết, cuộn để xem parallax, chọn ngày mai và một ô 30 phút. Đặt thành công, chuyển sang Lịch của tôi.
4. Hủy lịch để trả lại khung giờ.
5. Trên hai thiết bị: cùng phòng/ngày/khoảng giờ, xác nhận gần đồng thời. Transaction commit trước được phòng; thiết bị còn lại báo hết chỗ. Trường hợp giao nhau một phần cũng bị chặn; hai khoảng nối tiếp nhau được phép.
6. Thử mất mạng khi đặt: không được báo thành công giả. Kiểm tra lịch sau khi kết nối trở lại.

## Kiểm tra đã thực hiện

- `npm run typecheck`: kiểm tra TypeScript strict.
- `npm run lint`: kiểm tra hooks và lỗi lint.
- `npm test`: 12 kiểm tra logic bộ lọc, 30 phút, giới hạn 4 giờ, giờ đã qua, khoảng đi qua ô bận, khoảng nối tiếp và dữ liệu slot thay đổi.
- `npx expo export --platform android --platform ios`: kiểm tra bundle native và worklet transformation.

Chưa đo fps hoặc chạy gesture trên điện thoại thật trong môi trường tạo file; chưa chạy tranh chấp trên Firebase thật vì không có `.env` của bạn. Các bước demo ở trên là checklist xác nhận trên thiết bị.
