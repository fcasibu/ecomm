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
import { getPaginationNumbers } from '@ecomm/lib/get-pagination-numbers';

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

  const pageNumbers = getPaginationNumbers(totalPages, currentPage);

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
