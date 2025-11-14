import { SearchParams, Sort } from "./definitions";

/**
 * Định dạng số thành tiền tệ VND.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Định dạng chuỗi ngày tháng (an toàn).
 * Trả về "N/A" nếu ngày không hợp lệ thay vì làm crash app.
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
function sanitize(term: string): string {
  return term.replace(/'/g, "''");
}

export const convertSearchCondition = (key: string, operator: string, term: string | string[]) => {
  const supportedOperators = [
    'eq', 'ne', 'gt', 'ge', 'lt', 'le',
    'contains', 'containsIgnoreCase',
    'startsWith', 'startsWithIgnoreCase',
    'endsWith', 'endsWithIgnoreCase',
    'null', 'notNull', 'empty', 'notEmpty',
    'in', 'nin',
  ];

  if (!supportedOperators.includes(operator)) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  let safeTerm: string;

  switch (operator) {
    case 'in':
    case 'nin':
      if (Array.isArray(term)) {
        safeTerm = term.map(t => `'${sanitize(t)}'`).join(',');
      } else {
        safeTerm = String(term).split(',').map(t => `'${sanitize(t)}'`).join(',');
      }
      return `${key} ${operator} (${safeTerm})`;

    case 'contains':
    case 'containsIgnoreCase':
    case 'startsWith':
    case 'startsWithIgnoreCase':
    case 'endsWith':
    case 'endsWithIgnoreCase':
      safeTerm = Array.isArray(term) ? term[0] ?? "" : term; 
      return `${operator}(${key}, '${sanitize(safeTerm)}')`;
    case 'null':
    case 'notNull':
    case 'empty':
    case 'notEmpty':
      return `${key} ${operator}`;

    default:
      safeTerm = Array.isArray(term) ? (term[0] ?? "") : term;
      if (['gt', 'ge', 'lt', 'le'].includes(operator) && !isNaN(Number(safeTerm))) {
        return `${key} ${operator} ${safeTerm}`;
      }
      
      return `${key} ${operator} '${sanitize(safeTerm)}'`;
  }
};


/**
 * Phân tích (parse) chuỗi sort từ URL (dạng name_asc,createdDate_desc)
 * thành một mảng object Sort.
 * (Code này của bạn đã đúng với yêu cầu 'name_asc')
 */
export const buildSortQuery = (sortString: string | string[] | undefined): Sort[] => {
  if (!sortString) return [];
  
  const sortArray = (typeof sortString === 'string' ? sortString : sortString.join(","))
    .split(",")
    // THÊM BỘ LỌC (FILTER) NÀY VÀO
    .filter(Boolean) // Lọc ra các chuỗi rỗng (ví dụ: từ "name_asc,,date_desc")
    .map((item) => {
      const [field, direction] = item.split("_");
      const validDirection: 'asc' | 'desc' = (direction === 'asc' || direction === 'desc') ? direction : 'asc';
      
      // Chúng ta ép kiểu (cast) field thành string,
      // vì filter(Boolean) đã đảm bảo item không rỗng,
      // nên field sẽ luôn là một string.
      return { field: field as string, direction: validDirection };
    });
    
  return sortArray;
};

/**
 * Xây dựng chuỗi query string từ object SearchParams.
 * ĐÃ SỬA LỖI LOGIC: Dùng định dạng 'field_direction' cho sort.
 */
export const queryParamsToString = ({ filter, page, size, sort }: SearchParams): string => {
  const query = new URLSearchParams();

  if (filter) {
    query.append("$filter", filter);
  }

  if (page !== undefined) {
    query.append("page", page.toString());
  }

  if (size !== undefined) {
    query.append("size", size.toString());
  }

  if (sort && sort.length > 0) {
    // SỬA Ở ĐÂY:
    // Chuyển {field: 'name', direction: 'asc'} thành 'name_asc'
    const sortStrings = sort.map(({ field, direction }) => `${field},${direction}`);
    // Nối nhiều điều kiện sort bằng dấu phẩy
    query.append("sort", sortStrings.join(','));
  }
  return query.toString();
};

/**
 * Xây dựng chuauỗi $filter từ các searchFields (dạng field[operator]=value).
 * (Code này của bạn đã đúng)
 */
export const buildFilterQuery = (searchFields: { [key: string]: string | string[] | undefined; }): string => {
  const query: string[] = [];
  
  Object.entries(searchFields).forEach(([key, value]) => {
    // Tìm kiếm các key có dạng: name[contains]=abc
    const matches = key.match(/^([\w\.]+)\[(\w+)\]$/); 
    
    if (matches) {
      const field = matches[1];
      const operator = matches[2];

      // Thêm điều kiện 'field && operator' vào đây
      if (field && operator && value !== undefined && value !== '') {
        query.push(convertSearchCondition(field, operator, value)); 
      }
    }
  });

  return query.join(' and ');
}