# Tài Liệu API - Blog (Bài Viết)

## Tổng Quan

API Blog cung cấp các chức năng quản lý bài viết cho hệ thống Social Marketing. Được chia thành 2 nhóm:
- **Admin API** (`/blogs`): Dành cho quản trị viên (CRUD, quản lý bài viết)
- **Storefront API** (`/storefront/blogs`): Dành cho người dùng cuối (Xem danh sách, xem chi tiết)

---

## 📋 Mục Lục

1. [Models](#models)
2. [Admin API](#admin-api)
3. [Storefront API](#storefront-api)
4. [Error Handling](#error-handling)

---

## Models

### BlogPostResponse

Response model chi tiết cho bài viết:

```json
{
  "id": 1,
  "title": "Hướng dẫn Social Marketing 2025",
  "slug": "huong-dan-social-marketing-2025",
  "content": "<p>Nội dung bài viết...</p>",
  "shortDescription": "Tóm tắt nội dung bài viết...",
  "thumbnail": {
    "id": 10,
    "url": "https://example.com/image.jpg",
    "name": "Thumbnail Image"
  },
  "isVisible": true,
  "publishedAt": "2025-12-01T10:00:00",
  "createdDate": "2025-12-01T09:00:00",
  "lastModifiedDate": "2025-12-01T09:30:00"
}
```

### BlogPostListResponse

Response model rút gọn cho danh sách bài viết:

```json
{
  "id": 1,
  "title": "Hướng dẫn Social Marketing 2025",
  "slug": "huong-dan-social-marketing-2025",
  "shortDescription": "Tóm tắt nội dung bài viết...",
  "thumbnail": {
    "id": 10,
    "url": "https://example.com/image.jpg"
  },
  "isVisible": true,
  "publishedAt": "2025-12-01T10:00:00",
  "createdDate": "2025-12-01T09:00:00"
}
```

### CreateBlogPostRequest

Request body để tạo bài viết mới:

```json
{
  "title": "Tiêu đề bài viết mới",
  "slug": "tieu-de-bai-viet-moi", // Bắt buộc, unique
  "content": "Nội dung HTML...",
  "shortDescription": "Mô tả ngắn...",
  "thumbnailId": 10, // ID của Media
  "isVisible": true // true để publish ngay
}
```

### UpdateBlogPostRequest

Request body để cập nhật bài viết (tất cả các trường đều optional):

```json
{
  "title": "Tiêu đề mới",
  "slug": "slug-moi",
  "content": "Nội dung mới...",
  "shortDescription": "Mô tả mới...",
  "thumbnailId": 11,
  "isVisible": false
}
```

---

## Admin API

Base URL: `/blogs`

### 1. Lấy Danh Sách Bài Viết

**Endpoint:** `GET /blogs`

**Mô tả:** Lấy danh sách bài viết với phân trang.

**Parameters:**
- `page` (query, optional): Số trang (mặc định: 0)
- `size` (query, optional): Số items mỗi trang (mặc định: 20)

**Response:** `Page<BlogPostListResponse>`

### 2. Lấy Chi Tiết Bài Viết

**Endpoint:** `GET /blogs/{id}`

**Path Parameters:**
- `id`: ID của bài viết

**Response:** `BlogPostResponse`

### 3. Tạo Bài Viết Mới

**Endpoint:** `POST /blogs`

**Body:** `CreateBlogPostRequest`

**Response:** `BlogPostResponse`

### 4. Cập Nhật Bài Viết

**Endpoint:** `PUT /blogs/{id}`

**Path Parameters:**
- `id`: ID của bài viết

**Body:** `UpdateBlogPostRequest`

**Response:** `BlogPostResponse`

### 5. Xóa Bài Viết

**Endpoint:** `DELETE /blogs/{id}`

**Path Parameters:**
- `id`: ID của bài viết

**Response:** `200 OK`

---

## Storefront API

Base URL: `/storefront/blogs`

### 1. Lấy Danh Sách Bài Viết (Public)

**Endpoint:** `GET /storefront/blogs`

**Mô tả:** Lấy danh sách bài viết đã được publish (`isVisible = true`).

**Parameters:**
- `page` (query, optional): Số trang
- `size` (query, optional): Số items

**Response:** `Page<BlogPostListResponse>`

### 2. Lấy Chi Tiết Bài Viết Theo Slug

**Endpoint:** `GET /storefront/blogs/{slug}`

**Mô tả:** Lấy chi tiết bài viết để hiển thị trang đọc bài.

**Path Parameters:**
- `slug`: Slug của bài viết

**Response:** `BlogPostResponse`

---

## Error Handling

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ (trùng slug, thiếu title...).
- `404 Not Found`: Không tìm thấy bài viết.
- `500 Internal Server Error`: Lỗi hệ thống.
