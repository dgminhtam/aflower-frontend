"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from "@workspace/ui/components/pagination";
import { useMemo, useTransition } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DOTS = '...';

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
    totalElements,
    itemsPerPage,
    siblingCount = 1,
    currentPage,
}: {
    totalElements: number;
    itemsPerPage: number;
    siblingCount?: number;
    currentPage: number;
}) => {
    const totalPageCount = Math.ceil(totalElements / itemsPerPage);

    const paginationRange = useMemo(() => {
        const totalPageNumbers = siblingCount + 5;
        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
            return [...leftRange, DOTS, totalPageCount];
        }
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
        return [];
    }, [totalElements, itemsPerPage, siblingCount, currentPage]);

    return paginationRange;
};

interface StorefrontPaginationProps {
    totalElements: number;
    itemsPerPage: number;
}

export function StorefrontPagination({ totalElements, itemsPerPage }: StorefrontPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const currentPage = Number(searchParams.get('page')) || 1;
    const totalPages = Math.ceil(totalElements / itemsPerPage);

    const paginationRange = usePagination({
        currentPage,
        totalElements,
        itemsPerPage,
        siblingCount: 1
    });

    const handlePageChange = (page: number | string) => {
        if (page === DOTS || page === currentPage || isPending) return;

        const pageNumber = Number(page);
        if (pageNumber < 1 || pageNumber > totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-disabled={currentPage === 1 || isPending}
                        size="icon-lg"
                        className={`border cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                            } ${isPending ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>

                {paginationRange.map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                        {page === DOTS ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                size="icon-lg"
                                className={`border cursor-pointer ${currentPage === page
                                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                                    : ''
                                    } ${isPending ? 'pointer-events-none opacity-50' : ''}`}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-disabled={currentPage === totalPages || isPending}
                        size="icon-lg"
                        className={`border cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                            } ${isPending ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
