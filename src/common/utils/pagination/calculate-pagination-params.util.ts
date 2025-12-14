export const calculatePaginationParams = (page: number, perPage: number) => {
  return {
    skip: (page - 1) * perPage,
    take: perPage,
  };
};
