'use client';

import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@ecomm/ui/pagination';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

export function QueryPagination({ totalPages = 1 }: { totalPages?: number }) {
  const [page, setPage] = useQueryState('page', {
    defaultValue: '1',
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  const currentPage = parseInt(page, 10);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      startTransition(() => {
        setPage(newPage.toString());
      });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPageNumbers = 5;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; ++i) {
        pageNumbers.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - 2, 2);
      const rightSiblingIndex = Math.min(currentPage + 2, totalPages - 1);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      pageNumbers.push(1);

      if (shouldShowLeftDots) {
        pageNumbers.push(0);
      } else {
        for (let i = 2; i < leftSiblingIndex; ++i) {
          pageNumbers.push(i);
        }
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; ++i) {
        pageNumbers.push(i);
      }

      if (shouldShowRightDots) {
        pageNumbers.push(0);
      } else {
        for (let i = rightSiblingIndex + 1; i <= totalPages - 1; ++i) {
          pageNumbers.push(i);
        }
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 0) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Number(pageNumber));
                }}
                isActive={pageNumber === currentPage}
                className={isPending ? 'opacity-50' : ''}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
