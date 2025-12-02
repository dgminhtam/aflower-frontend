# Tài Liệu API - Alternative Product (Sản Phẩm Thay Thế)

## Tổng Quan

API Alternative Product cung cấp chức năng quản lý các sản phẩm thay thế cho một sản phẩm chính. Tính năng này cho phép hiển thị các sản phẩm tương tự hoặc thay thế trên trang chi tiết sản phẩm.

---

## 📋 Mục Lục

1. [Admin API](#admin-api)
2. [Storefront API](#storefront-api)

---

## Admin API

Base URL: `/products`

### 1. Thêm Sản Phẩm Thay Thế

**Endpoint:** `POST /products/{id}/alternatives/{alternativeId}`

**Mô tả:** Liên kết một sản phẩm (`alternativeId`) làm sản phẩm thay thế cho sản phẩm chính (`id`).

**Path Parameters:**
- `id`: ID của sản phẩm chính.
- `alternativeId`: ID của sản phẩm thay thế.

**Response:** `200 OK`

### 2. Xóa Sản Phẩm Thay Thế

**Endpoint:** `DELETE /products/{id}/alternatives/{alternativeId}`

**Mô tả:** Xóa liên kết sản phẩm thay thế.

**Path Parameters:**
- `id`: ID của sản phẩm chính.
- `alternativeId`: ID của sản phẩm thay thế cần xóa.

**Response:** `200 OK`

---

## Storefront API

Base URL: `/storefront/products`

### 1. Lấy Chi Tiết Sản Phẩm (Bao gồm Alternative Products)

**Endpoint:** `GET /storefront/products/{sku}`

**Mô tả:** API lấy chi tiết sản phẩm hiện tại đã được cập nhật để bao gồm danh sách `alternativeProducts`.

**Response Model (StorefrontProductDetailResponse):**

```json
{
  "id": 1,
  "sku": "SKU-001",
  "name": "Sản phẩm A",
  "price": 100000,
  "image": {...},
  "categories": [...],
  "alternativeProducts": [
    {
      "id": 2,
      "sku": "SKU-002",
      "name": "Sản phẩm B (Thay thế)",
      "price": 120000,
      "image": {...}
    }
  ]
}
```
