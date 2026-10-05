export function errorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  if (code.includes("permission-denied"))
    return "Chưa có quyền truy cập. Kiểm tra Firestore Rules theo README.";
  if (code.includes("unavailable") || code.includes("network"))
    return "Mất kết nối. Kiểm tra Internet rồi thử lại.";
  if (code.includes("operation-not-allowed"))
    return "Hãy bật Anonymous Authentication trong Firebase Console.";
  if (code.includes("aborted"))
    return "Có nhiều lượt đặt cùng lúc. Tải lại khung giờ rồi thử lại.";
  return error instanceof Error
    ? error.message
    : "Có lỗi xảy ra. Vui lòng thử lại.";
}
