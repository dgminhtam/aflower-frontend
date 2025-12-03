# Tài Liệu API - User (Người Dùng)

## Tổng Quan

API User cung cấp các chức năng liên quan đến người dùng cho hệ thống Social Marketing.
- **User API** (`/users`): Dành cho người dùng đã đăng nhập.

---

## 📋 Mục Lục

1. [Models](#models)
2. [User API](#user-api)
3. [Error Handling](#error-handling)

---

## Models

### UserResponse

Response model chi tiết cho thông tin người dùng:

```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "https://example.com/image.jpg"
}
```

---

## User API

Base URL: `/users`

### 1. Lấy Thông Tin Profile

**Endpoint:** `GET /users/profile`

**Mô tả:** Lấy thông tin chi tiết của người dùng hiện tại (đang đăng nhập).

**Yêu cầu Authentication:** Có (Bearer Token)

**Response:** `UserResponse`

**Example Response:**
```json
{
  "id": 123,
  "email": "nguyenvana@example.com",
  "firstName": "Nguyen Van",
  "lastName": "A",
  "picture": "https://example.com/avatar.jpg"
}
```

---

## Error Handling

- `401 Unauthorized`: Người dùng chưa đăng nhập hoặc token không hợp lệ.
- `404 Not Found`: Không tìm thấy thông tin người dùng (trường hợp hiếm gặp khi token hợp lệ nhưng user không tồn tại trong DB).
- `500 Internal Server Error`: Lỗi hệ thống.
