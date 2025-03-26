import { usePagination } from 'react-instantsearch-core';
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@ecomm/ui/pagination';
import { getPaginationNumbers } from '@ecomm/lib/get-pagination-numbers';

export function ProductListingPagination() {
  const { currentRefinement, nbPages, refine, isFirstPage, isLastPage } =
    usePagination();

  const currentPage = currentRefinement + 1;
  const totalPages = nbPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      refine(newPage - 1);
    }
  };

  if (totalPages === 1) return null;

  const pageNumbers = getPaginationNumbers(totalPages, currentPage);

  return (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isFirstPage) {
                handlePageChange(currentPage - 1);
              }
            }}
            className={isFirstPage ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={isFirstPage}
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
                  handlePageChange(pageNumber);
                }}
                isActive={pageNumber === currentPage}
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
              if (!isLastPage) {
                handlePageChange(currentPage + 1);
              }
            }}
            className={isLastPage ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={isLastPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
