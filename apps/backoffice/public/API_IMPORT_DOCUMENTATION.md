# API Documentation: Import Product CSV

## Tổng quan
API này cho phép import danh sách sản phẩm từ file CSV vào hệ thống.

## Endpoint
`POST /products/import`

## Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File CSV chứa dữ liệu sản phẩm (Required).

## Định dạng CSV
File CSV cần sử dụng encoding UTF-8 và có header như sau:

| Tên cột | Mô tả | Bắt buộc | Kiểu dữ liệu | Ví dụ |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Tên sản phẩm | Có | String | Áo thun nam |
| `sku` | Mã SKU (Duy nhất) | Có | String | SKU-001 |
| `slug` | Slug URL (Duy nhất) | Có | String | ao-thun-nam |
| `description` | Mô tả sản phẩm | Có | String | Áo thun cotton 100% |
| `price` | Giá bán | Có | Number | 150000 |
| `originPrice` | Giá gốc | Không | Number | 200000 |
| `status` | Trạng thái | Không | Enum (ACTIVE, DRAFT, INACTIVE) | ACTIVE |

**Lưu ý:**
- Nếu `status` để trống hoặc không hợp lệ, hệ thống sẽ mặc định là `DRAFT`.
- Các cột số (`price`, `originPrice`) không được chứa ký tự phân cách hàng nghìn (ví dụ: `100,000` là sai, `100000` là đúng).

## Example Request (cURL)
```bash
curl --location 'http://localhost:8080/products/import' \
--form 'file=@"/path/to/products.csv"'
```

## Response
- **200 OK**: Import thành công.
- **400 Bad Request**: File lỗi hoặc dữ liệu không hợp lệ.
- **500 Internal Server Error**: Lỗi hệ thống.

## Import Category CSV

### Endpoint
`POST /categories/import`

### Request
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File CSV chứa dữ liệu danh mục (Required).

### Định dạng CSV
File CSV cần sử dụng encoding UTF-8 và có header như sau:

| Tên cột | Mô tả | Bắt buộc | Kiểu dữ liệu | Ví dụ |
| :--- | :--- | :--- | :--- | :--- |
| `name` | Tên danh mục | Có | String | Áo Nam |
| `slug` | Slug URL (Duy nhất) | Có | String | ao-nam |
| `description` | Mô tả danh mục | Không | String | Các loại áo nam |
| `active` | Trạng thái kích hoạt | Không | Boolean (true/false) | true |
| `parentSlug` | Slug của danh mục cha | Không | String | thoi-trang-nam |

**Lưu ý:**
- Nếu `parentSlug` được cung cấp, hệ thống sẽ tìm danh mục cha tương ứng. Nếu không tìm thấy, danh mục sẽ được tạo mà không có cha (hoặc báo lỗi tùy logic).
- `active` mặc định là `false` nếu không có hoặc sai định dạng.

### Example Request (cURL)
```bash
curl --location 'http://localhost:8080/categories/import' \
--form 'file=@"/path/to/categories.csv"'
```

### Response
- **200 OK**: Import thành công.
- **400 Bad Request**: File lỗi hoặc dữ liệu không hợp lệ.
- **500 Internal Server Error**: Lỗi hệ thống.

## Cập nhật Import Product CSV (Thêm cột categorySlugs)

Bảng định dạng CSV sản phẩm được cập nhật thêm cột `categorySlugs`:

| Tên cột | Mô tả | Bắt buộc | Kiểu dữ liệu | Ví dụ |
| :--- | :--- | :--- | :--- | :--- |
| ... | ... | ... | ... | ... |
| `categorySlugs` | Danh sách slug danh mục, phân cách bởi dấu phẩy | Không | String | ao-nam,ao-thun |

