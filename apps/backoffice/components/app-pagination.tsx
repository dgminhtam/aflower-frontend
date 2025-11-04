'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface AppPaginationProps {
  totalElements: number;
  itemsPerPage: number;
}

export function AppPagination({ totalElements, itemsPerPage }: AppPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalElements / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Add previous page if applicable
    if (currentPage > 1) {
      if (currentPage > 2) {
        pages.push('...');
      }
      pages.push(currentPage - 1);
    }

    // Add current page
    pages.push(currentPage);

    // Add next page if applicable
    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
      if (currentPage < totalPages - 1) {
        pages.push('...');
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (<></>);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className="border"
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                size="sm"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                className={`border ${currentPage === page
                  ? 'border-primary bg-primary text-primary-foreground'
                  : ''
                  }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className="border"
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}