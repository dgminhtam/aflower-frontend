# Tài Liệu API - Product Collection (Bộ Sưu Tập Sản Phẩm)

## Tổng Quan

API Product Collection cung cấp các chức năng quản lý bộ sưu tập sản phẩm cho hệ thống Social Marketing. Được chia thành 2 nhóm:
- **Admin API** (`/product-collections`): Dành cho quản trị viên (CRUD, quản lý sản phẩm trong collection)
- **Storefront API** (`/storefront/product-collections`): Dành cho người dùng cuối (Xem danh sách, xem chi tiết)

---

## 📋 Mục Lục

1. [Models](#models)
2. [Admin API](#admin-api)
3. [Storefront API](#storefront-api)
4. [Error Handling](#error-handling)

---

## Models

### ProductCollectionResponse

Response model cơ bản cho collection:

```json
{
  "id": 1,
  "name": "Bộ sưu tập mùa hè",
  "slug": "bo-suu-tap-mua-he",
  "description": "Các sản phẩm hot nhất mùa hè này",
  "metaTitle": "Summer Collection 2025",
  "metaDescription": "Mua sắm bộ sưu tập mùa hè...",
  "metaKeywords": "summer, fashion, 2025",
  "isFeatured": true,
  "image": {
    "id": 10,
    "url": "https://example.com/image.jpg",
    "caption": "Summer Banner"
  },
  "status": "ACTIVE",
  "createdDate": "2025-11-27T10:00:00+07:00",
  "lastModifiedDate": "2025-11-27T11:00:00+07:00"
}
```

### ProductCollectionDetailResponse

Response model chi tiết (bao gồm danh sách sản phẩm):

```json
{
  "id": 1,
  "name": "Bộ sưu tập mùa hè",
  "slug": "bo-suu-tap-mua-he",
  "description": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "metaKeywords": "...",
  "isFeatured": true,
  "image": {...},
  "status": "ACTIVE",
  "products": [
    {
      "id": 101,
      "name": "Áo thun",
      "sku": "TSHIRT-001",
      "price": 150000,
      "image": "..."
    }
  ],
  "createdDate": "...",
  "lastModifiedDate": "..."
}
```

### Create/Update Request

Request body để tạo hoặc cập nhật collection:

```json
{
  "name": "Bộ sưu tập mùa hè",
  "slug": "bo-suu-tap-mua-he", // Optional, nếu null sẽ tự động tạo từ name
  "description": "Mô tả...",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "metaKeywords": "SEO Keywords",
  "isFeatured": true,
  "imageId": 10,
  "status": "ACTIVE" // ACTIVE hoặc INACTIVE
}
```

---

## Admin API

Base URL: `/product-collections`

### 1. Lấy Danh Sách Collection

**Endpoint:** `GET /product-collections`

**Mô tả:** Lấy danh sách collection với phân trang và tìm kiếm.

**Parameters:**
- `page` (query, optional): Số trang (mặc định: 0)
- `size` (query, optional): Số items mỗi trang (mặc định: 20)
- `search` (query, optional): Từ khóa tìm kiếm (theo name, description...)

**Response:** `Page<ProductCollectionResponse>`

### 2. Lấy Chi Tiết Collection

**Endpoint:** `GET /product-collections/{id}`

**Path Parameters:**
- `id`: ID của collection

**Response:** `ProductCollectionDetailResponse`

### 3. Tạo Collection Mới

**Endpoint:** `POST /product-collections`

**Body:** `CreateProductCollectionRequest`

**Response:** `ProductCollectionDetailResponse`

### 4. Cập Nhật Collection

**Endpoint:** `PUT /product-collections/{id}`

**Path Parameters:**
- `id`: ID của collection

**Body:** `UpdateProductCollectionRequest`

**Response:** `ProductCollectionDetailResponse`

### 5. Xóa Collection

**Endpoint:** `DELETE /product-collections/{id}`

**Path Parameters:**
- `id`: ID của collection

**Response:** `200 OK`

### 6. Thêm Sản Phẩm Vào Collection

**Endpoint:** `POST /product-collections/{id}/products`

**Path Parameters:**
- `id`: ID của collection

**Body:** Danh sách ID sản phẩm cần thêm
```json
[101, 102, 103]
```

**Response:** `200 OK`

### 7. Xóa Sản Phẩm Khỏi Collection

**Endpoint:** `DELETE /product-collections/{id}/products`

**Path Parameters:**
- `id`: ID của collection

**Body:** Danh sách ID sản phẩm cần xóa
```json
[101]
```

**Response:** `200 OK`

---

## Storefront API

Base URL: `/storefront/product-collections`

### 1. Lấy Danh Sách Collection

**Endpoint:** `GET /storefront/product-collections`

**Mô tả:** Lấy danh sách collection (thường dùng để hiển thị trang danh sách các bộ sưu tập).

**Parameters:**
- `page` (query, optional): Số trang
- `size` (query, optional): Số items

**Response:** `Page<ProductCollectionResponse>`

### 2. Lấy Chi Tiết Collection Theo Slug

**Endpoint:** `GET /storefront/product-collections/{slug}`

**Mô tả:** Lấy chi tiết collection và danh sách sản phẩm bên trong để hiển thị trang chi tiết bộ sưu tập.

**Path Parameters:**
- `slug`: Slug của collection (ví dụ: `bo-suu-tap-mua-he`)

**Response:** `ProductCollectionDetailResponse`

---

## Error Handling

Tương tự như các API khác trong hệ thống:
- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ (trùng slug, thiếu trường bắt buộc...)
- `404 Not Found`: Không tìm thấy collection hoặc sản phẩm.
- `500 Internal Server Error`: Lỗi hệ thống.
