export function getPaginationNumbers(totalPages: number, currentPage: number) {
  const pageNumbers: number[] = [];
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
}
