interface PaginationDetails {
  total: number;
  perPage: number;
  nextPage: number;
  previousPage: number;
  page: number;
}

export const calculatePaginationMetaData = (
  total: number,
  page: number,
  perPage: number,
) => {
  const validatedTotal = Math.max(0, total);
  const validatedPerPage = Math.max(1, perPage);
  const validatedPage = Math.max(1, page);
  const totalPages = Math.ceil(validatedTotal / validatedPerPage);
  const calculatedPage = Math.min(validatedPage, totalPages);

  return {
    total: validatedTotal,
    perPage: validatedPerPage,
    page: calculatedPage,
    previousPage: calculatedPage > 1 ? calculatedPage - 1 : calculatedPage,
    nextPage: calculatedPage < totalPages ? calculatedPage + 1 : calculatedPage,
  };
};
