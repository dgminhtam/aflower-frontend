# Tài Liệu API - Cart (Giỏ Hàng)

## Tổng Quan

API Cart cung cấp đầy đủ các chức năng quản lý giỏ hàng cho hệ thống Social Marketing. Được chia thành 2 nhóm:
- **Admin API** (`/carts`): Dành cho quản trị viên
- **Storefront API** (`/storefront/carts`): Dành cho người dùng cuối

---

## 📋 Mục Lục

1. [Models](#models)
2. [Admin API](#admin-api)
3. [Storefront API](#storefront-api)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)

---

## Models

### CartResponse

Response model chính cho giỏ hàng:

```json
{
  "id": 1,
  "email": "customer@example.com",
  "link": "unique-cart-link",
  "status": null,
  "subTotal": 500000,
  "grandTotal": 500000,
  "totalItems": 3,
  "entries": [
    {
      "id": 1,
      "sku": "PRODUCT-001",
      "name": "Sản phẩm 1",
      "description": "Mô tả sản phẩm",
      "price": 150000,
      "quantity": 2,
      "subTotal": 300000,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T11:00:00+07:00"
}
```

**Các trường:**
- `id`: ID của giỏ hàng
- `email`: Email khách hàng (có thể null)
- `link`: Link unique để truy cập giỏ hàng
- `subTotal`: Tổng tiền chưa bao gồm thuế/phí
- `grandTotal`: Tổng tiền cuối cùng
- `totalItems`: Tổng số items trong giỏ
- `entries`: Danh sách sản phẩm trong giỏ
- `createDate`: Ngày tạo
- `lastModifiedDate`: Ngày cập nhật cuối

### CartEntryResponse

Response model cho từng sản phẩm trong giỏ:

```json
{
  "id": 1,
  "sku": "PRODUCT-001",
  "name": "Tên sản phẩm",
  "description": "Mô tả",
  "price": 150000,
  "quantity": 2,
  "subTotal": 300000,
  "imageUrl": "https://example.com/image.jpg"
}
```

### AddToCartRequest

Request để thêm sản phẩm vào giỏ:

```json
{
  "sku": "PRODUCT-001",
  "quantity": 2,
  "description": "Ghi chú cho sản phẩm (optional)"
}
```

**Validation:**
- `sku`: Bắt buộc, không được trống
- `quantity`: Bắt buộc, phải > 0
- `description`: Tùy chọn

### UpdateCartEntryRequest

Request để cập nhật số lượng sản phẩm:

```json
{
  "quantity": 5
}
```

**Validation:**
- `quantity`: Bắt buộc, phải > 0

### UpdateCartEmailRequest

Request để cập nhật email:

```json
{
  "email": "customer@example.com"
}
```

**Validation:**
- `email`: Bắt buộc, định dạng email hợp lệ

---

## Admin API

Base URL: `/carts`

### 1. Lấy Danh Sách Giỏ Hàng

**Endpoint:** `GET /carts`

**Mô tả:** Lấy danh sách tất cả giỏ hàng với phân trang (Admin only)

**Parameters:**
- `page` (query, optional): Số trang (mặc định: 0)
- `size` (query, optional): Số items mỗi trang (mặc định: 20)
- `sort` (query, optional): Sắp xếp theo field (ví dụ: `id,desc`)

**Request Example:**
```http
GET /carts?page=0&size=10&sort=createdDate,desc
```

**Response Example:**
```json
{
  "content": [
    {
      "id": 1,
      "email": "customer@example.com",
      "link": "cart-link-1",
      "subTotal": 500000,
      "grandTotal": 500000,
      "totalItems": 3,
      "entries": [...],
      "createDate": "2025-11-26T10:00:00+07:00",
      "lastModifiedDate": "2025-11-26T11:00:00+07:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 50,
  "totalPages": 5
}
```

**Status Codes:**
- `200 OK`: Thành công

---

### 2. Lấy Chi Tiết Giỏ Hàng

**Endpoint:** `GET /carts/{id}`

**Mô tả:** Lấy chi tiết giỏ hàng theo ID (Admin only)

**Path Parameters:**
- `id` (required): ID của giỏ hàng

**Request Example:**
```http
GET /carts/1
```

**Response Example:**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "link": "cart-link-1",
  "subTotal": 500000,
  "grandTotal": 500000,
  "totalItems": 3,
  "entries": [
    {
      "id": 1,
      "sku": "PRODUCT-001",
      "name": "Sản phẩm 1",
      "price": 150000,
      "quantity": 2,
      "subTotal": 300000,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T11:00:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Thành công
- `404 Not Found`: Không tìm thấy giỏ hàng

---

### 3. Xóa Giỏ Hàng

**Endpoint:** `DELETE /carts/{id}`

**Mô tả:** Xóa giỏ hàng theo ID (Admin only)

**Path Parameters:**
- `id` (required): ID của giỏ hàng

**Request Example:**
```http
DELETE /carts/1
```

**Response:** No content

**Status Codes:**
- `200 OK`: Xóa thành công
- `404 Not Found`: Không tìm thấy giỏ hàng

---

## Storefront API

Base URL: `/storefront/carts`

> **Lưu ý:** Tất cả các API Storefront đều yêu cầu parameter `link` để xác định giỏ hàng cho **Anonymous User** (người dùng chưa đăng nhập).
>
> Đối với **Authenticated User** (người dùng đã đăng nhập):
> - Hệ thống sẽ tự động xác định giỏ hàng dựa trên User ID.
> - Parameter `link` vẫn nên được gửi lên để hỗ trợ trường hợp người dùng vừa đăng nhập (merge giỏ hàng anonymous vào giỏ hàng user).
> - Nếu `link` được gửi lên, hệ thống sẽ kiểm tra và merge giỏ hàng anonymous (nếu có) vào giỏ hàng của User.

### 1. Lấy Giỏ Hàng

**Endpoint:** `GET /storefront/carts`

**Mô tả:** Lấy thông tin giỏ hàng.
- Nếu người dùng **đã đăng nhập**: Trả về giỏ hàng gắn với User. Nếu có `link` anonymous cart, sẽ thực hiện merge.
- Nếu người dùng **chưa đăng nhập**: Trả về giỏ hàng theo `link`. Nếu chưa có, tạo mới với `link` đó.

**Query Parameters:**
- `link` (optional for logged-in user, required for anonymous): Link unique của giỏ hàng (thường là UUID generate từ client)

**Request Example:**
```http
GET /storefront/carts?link=user-session-123
```

**Response Example:**
```json
{
  "id": 1,
  "email": null,
  "link": "user-session-123",
  "subTotal": 0,
  "grandTotal": 0,
  "totalItems": 0,
  "entries": [],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:00:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Thành công

---

### 2. Thêm Sản Phẩm Vào Giỏ

**Endpoint:** `POST /storefront/carts/items`

**Mô tả:** Thêm một sản phẩm vào giỏ hàng. Nếu sản phẩm đã tồn tại, số lượng sẽ được cộng dồn.

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Request Body:**
```json
{
  "sku": "PRODUCT-001",
  "quantity": 2,
  "description": "Size M, màu đỏ"
}
```

**Request Example:**
```http
POST /storefront/carts/items?link=user-session-123
Content-Type: application/json

{
  "sku": "PRODUCT-001",
  "quantity": 2,
  "description": "Size M"
}
```

**Response Example:**
```json
{
  "id": 1,
  "email": null,
  "link": "user-session-123",
  "subTotal": 300000,
  "grandTotal": 300000,
  "totalItems": 1,
  "entries": [
    {
      "id": 1,
      "sku": "PRODUCT-001",
      "name": "Áo thun",
      "description": "Size M",
      "price": 150000,
      "quantity": 2,
      "subTotal": 300000,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:05:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Thêm thành công
- `400 Bad Request`: SKU không tồn tại hoặc dữ liệu không hợp lệ

---

### 3. Thêm Nhiều Sản Phẩm (Legacy)

**Endpoint:** `POST /storefront/carts`

**Mô tả:** Thêm nhiều sản phẩm cùng lúc vào giỏ (Legacy method, tương thích ngược)

**Request Body:**
```json
{
  "link": "user-session-123",
  "email": "customer@example.com",
  "entries": [
    {
      "sku": "PRODUCT-001",
      "quantity": 2,
      "description": "Size M"
    },
    {
      "sku": "PRODUCT-002",
      "quantity": 1,
      "description": "Size L"
    }
  ],
  "description": "Đơn hàng test"
}
```

**Request Example:**
```http
POST /storefront/carts
Content-Type: application/json

{
  "link": "user-session-123",
  "email": "customer@example.com",
  "entries": [
    { "sku": "PRODUCT-001", "quantity": 2 }
  ]
}
```

**Response:** CartResponse với đầy đủ entries

**Status Codes:**
- `200 OK`: Thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

### 4. Cập Nhật Số Lượng Sản Phẩm

**Endpoint:** `PUT /storefront/carts/entries/{entryId}`

**Mô tả:** Cập nhật số lượng của một sản phẩm trong giỏ

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Path Parameters:**
- `entryId` (required): ID của cart entry cần cập nhật

**Request Body:**
```json
{
  "quantity": 5
}
```

**Request Example:**
```http
PUT /storefront/carts/entries/1?link=user-session-123
Content-Type: application/json

{
  "quantity": 5
}
```

**Response Example:**
```json
{
  "id": 1,
  "email": null,
  "link": "user-session-123",
  "subTotal": 750000,
  "grandTotal": 750000,
  "totalItems": 1,
  "entries": [
    {
      "id": 1,
      "sku": "PRODUCT-001",
      "name": "Áo thun",
      "price": 150000,
      "quantity": 5,
      "subTotal": 750000,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:10:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Cập nhật thành công
- `404 Not Found`: Không tìm thấy entry trong giỏ
- `400 Bad Request`: Quantity không hợp lệ

---

### 5. Xóa Sản Phẩm Khỏi Giỏ

**Endpoint:** `DELETE /storefront/carts/entries/{entryId}`

**Mô tả:** Xóa một sản phẩm khỏi giỏ hàng

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Path Parameters:**
- `entryId` (required): ID của cart entry cần xóa

**Request Example:**
```http
DELETE /storefront/carts/entries/1?link=user-session-123
```

**Response Example:**
```json
{
  "id": 1,
  "email": null,
  "link": "user-session-123",
  "subTotal": 0,
  "grandTotal": 0,
  "totalItems": 0,
  "entries": [],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:15:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Xóa thành công
- `404 Not Found`: Không tìm thấy entry trong giỏ

---

### 6. Xóa Tất Cả Sản Phẩm

**Endpoint:** `DELETE /storefront/carts`

**Mô tả:** Xóa tất cả sản phẩm trong giỏ hàng (clear cart)

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Request Example:**
```http
DELETE /storefront/carts?link=user-session-123
```

**Response Example:**
```json
{
  "id": 1,
  "email": null,
  "link": "user-session-123",
  "subTotal": 0,
  "grandTotal": 0,
  "totalItems": 0,
  "entries": [],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:20:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Xóa thành công

---

### 7. Cập Nhật Email

**Endpoint:** `PUT /storefront/carts/email`

**Mô tả:** Cập nhật email cho giỏ hàng (thường dùng trước khi checkout)

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Request Example:**
```http
PUT /storefront/carts/email?link=user-session-123
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

**Response Example:**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "link": "user-session-123",
  "subTotal": 300000,
  "grandTotal": 300000,
  "totalItems": 1,
  "entries": [...],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:25:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Cập nhật thành công
- `400 Bad Request`: Email không hợp lệ

---

### 8. Checkout

**Endpoint:** `POST /storefront/carts/checkout`

**Mô tả:** Checkout giỏ hàng và tạo order. Sau khi checkout, giỏ hàng sẽ được làm trống.

**Query Parameters:**
- `link` (required): Link unique của giỏ hàng

**Request Example:**
```http
POST /storefront/carts/checkout?link=user-session-123
```

**Response Example:**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "link": "user-session-123",
  "subTotal": 0,
  "grandTotal": 0,
  "totalItems": 0,
  "entries": [],
  "createDate": "2025-11-26T10:00:00+07:00",
  "lastModifiedDate": "2025-11-26T10:30:00+07:00"
}
```

**Status Codes:**
- `200 OK`: Checkout thành công
- `400 Bad Request`: Giỏ hàng rỗng hoặc dữ liệu không hợp lệ

---

### 9. Place Order (One-Step)

**Endpoint:** `POST /storefront/carts/place-order`

**Mô tả:** Thêm sản phẩm vào giỏ và checkout luôn trong một bước (tiện cho quick order)

**Request Body:**
```json
{
  "link": "user-session-123",
  "email": "customer@example.com",
  "entries": [
    {
      "sku": "PRODUCT-001",
      "quantity": 2,
      "description": "Size M"
    }
  ],
  "description": "Quick order"
}
```

**Request Example:**
```http
POST /storefront/carts/place-order
Content-Type: application/json

{
  "link": "quick-order-456",
  "email": "customer@example.com",
  "entries": [
    { "sku": "PRODUCT-001", "quantity": 2 }
  ]
}
```

**Response:** CartResponse (giỏ đã trống sau khi checkout)

**Status Codes:**
- `200 OK`: Order thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

## Error Handling

### Error Response Format

Tất cả các lỗi đều trả về theo format:

```json
{
  "timestamp": "2025-11-26T10:00:00+07:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Không tìm thấy sản phẩm: PRODUCT-999",
  "path": "/storefront/carts/items"
}
```

### Common Error Codes

| Status Code | Mô tả | Nguyên nhân thường gặp |
|-------------|-------|------------------------|
| `400 Bad Request` | Dữ liệu không hợp lệ | - SKU không tồn tại<br>- Quantity <= 0<br>- Email format sai<br>- Giỏ hàng rỗng khi checkout |
| `404 Not Found` | Không tìm thấy resource | - Cart ID không tồn tại<br>- Entry ID không tồn tại trong giỏ |
| `500 Internal Server Error` | Lỗi server | Lỗi hệ thống, cần liên hệ admin |

### Error Messages (Tiếng Việt)

- `"SKU không được để trống"`
- `"Số lượng phải lớn hơn 0"`
- `"Email không hợp lệ"`
- `"Không tìm thấy sản phẩm: {sku}"`
- `"Giá sản phẩm không hợp lệ cho SKU: {sku}"`
- `"Không tìm thấy sản phẩm trong giỏ hàng"`
- `"Giỏ hàng rỗng"`
- `"Không tìm thấy giỏ hàng với ID: {id}"`

---

## Best Practices

### 1. Quản Lý Cart Link & User Session

```javascript
// Frontend nên lưu cart link vào localStorage
const cartLink = localStorage.getItem('cartLink') || generateUniqueLink();
localStorage.setItem('cartLink', cartLink);

// Khi gọi API, luôn gửi kèm link
// Nếu user đã đăng nhập, token sẽ được gửi qua Header (Authorization: Bearer ...)
// Backend sẽ ưu tiên xử lý theo User Token, và dùng link để merge cart nếu cần.
```

### 2. Thêm Sản Phẩm Vào Giỏ

```javascript
// Recommend: Dùng POST /storefront/carts/items
async function addToCart(sku, quantity) {
  const cartLink = getCartLink();
  const response = await fetch(`/storefront/carts/items?link=${cartLink}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, quantity })
  });
  
  if (response.ok) {
    const cart = await response.json();
    updateCartUI(cart);
  }
}
```

### 3. Cập Nhật Số Lượng

```javascript
async function updateQuantity(entryId, newQuantity) {
  const cartLink = getCartLink();
  const response = await fetch(
    `/storefront/carts/entries/${entryId}?link=${cartLink}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    }
  );
  
  if (response.ok) {
    const cart = await response.json();
    updateCartUI(cart);
  }
}
```

### 4. Xóa Sản Phẩm

```javascript
async function removeItem(entryId) {
  const cartLink = getCartLink();
  const response = await fetch(
    `/storefront/carts/entries/${entryId}?link=${cartLink}`,
    { method: 'DELETE' }
  );
  
  if (response.ok) {
    const cart = await response.json();
    updateCartUI(cart);
  }
}
```

### 5. Hiển Thị Cart Badge

```javascript
// Lấy giỏ hàng và hiển thị số lượng items
async function updateCartBadge() {
  const cartLink = getCartLink();
  const response = await fetch(`/storefront/carts?link=${cartLink}`);
  
  if (response.ok) {
    const cart = await response.json();
    document.getElementById('cart-badge').textContent = cart.totalItems;
  }
}
```

### 6. Checkout Flow

```javascript
async function checkout() {
  const cartLink = getCartLink();
  
  // Bước 1: Cập nhật email (nếu chưa có)
  await fetch(`/storefront/carts/email?link=${cartLink}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail })
  });
  
  // Bước 2: Checkout
  const response = await fetch(
    `/storefront/carts/checkout?link=${cartLink}`,
    { method: 'POST' }
  );
  
  if (response.ok) {
    // Redirect to success page
    window.location.href = '/order-success';
  }
}
```

### 7. Error Handling

```javascript
async function handleCartOperation(operation) {
  try {
    const response = await operation();
    
    if (!response.ok) {
      const error = await response.json();
      showError(error.message);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    showError('Có lỗi xảy ra, vui lòng thử lại');
    console.error('Cart operation error:', error);
    return null;
  }
}

// Sử dụng
const cart = await handleCartOperation(() => 
  fetch('/storefront/carts/items?link=...', {...})
);
```

### 8. Optimistic UI Updates

```javascript
// Cập nhật UI ngay lập tức, rollback nếu API fail
function optimisticUpdateQuantity(entryId, newQuantity) {
  const oldCart = { ...currentCart };
  
  // Update UI immediately
  updateCartUILocally(entryId, newQuantity);
  
  // Call API
  updateQuantity(entryId, newQuantity)
    .catch(() => {
      // Rollback on error
      updateCartUI(oldCart);
      showError('Không thể cập nhật, vui lòng thử lại');
    });
}
```

---

## React/Vue Integration Examples

### React Hook Example

```typescript
// useCart.ts
import { useState, useEffect } from 'react';

interface Cart {
  id: number;
  totalItems: number;
  subTotal: number;
  grandTotal: number;
  entries: CartEntry[];
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  
  const cartLink = localStorage.getItem('cartLink') || 
    `cart-${Date.now()}-${Math.random()}`;
  
  useEffect(() => {
    localStorage.setItem('cartLink', cartLink);
    fetchCart();
  }, []);
  
  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch(`/storefront/carts?link=${cartLink}`);
      const data = await res.json();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }
  
  async function addItem(sku: string, quantity: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/storefront/carts/items?link=${cartLink}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku, quantity })
        }
      );
      const data = await res.json();
      setCart(data);
      return data;
    } finally {
      setLoading(false);
    }
  }
  
  async function updateItem(entryId: number, quantity: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/storefront/carts/entries/${entryId}?link=${cartLink}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity })
        }
      );
      const data = await res.json();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }
  
  async function removeItem(entryId: number) {
    setLoading(true);
    try {
      const res = await fetch(
        `/storefront/carts/entries/${entryId}?link=${cartLink}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }
  
  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    refresh: fetchCart
  };
}
```

### Vue Composable Example

```typescript
// useCart.ts
import { ref, onMounted } from 'vue';

export function useCart() {
  const cart = ref(null);
  const loading = ref(false);
  
  const cartLink = localStorage.getItem('cartLink') || 
    `cart-${Date.now()}-${Math.random()}`;
  
  onMounted(() => {
    localStorage.setItem('cartLink', cartLink);
    fetchCart();
  });
  
  async function fetchCart() {
    loading.value = true;
    try {
      const res = await fetch(`/storefront/carts?link=${cartLink}`);
      cart.value = await res.json();
    } finally {
      loading.value = false;
    }
  }
  
  async function addItem(sku, quantity) {
    loading.value = true;
    try {
      const res = await fetch(
        `/storefront/carts/items?link=${cartLink}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku, quantity })
        }
      );
      cart.value = await res.json();
    } finally {
      loading.value = false;
    }
  }
  
  return {
    cart,
    loading,
    addItem,
    fetchCart
  };
}
```

---

## Changelog

### Version 1.0.0 (2025-11-26)

- ✅ Initial release
- ✅ Admin CRUD APIs
- ✅ Storefront cart management APIs
- ✅ Add/Update/Remove items
- ✅ Email update
- ✅ Checkout flow
- ✅ Full validation
- ✅ Vietnamese error messages

---

## Support

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ team Backend.
