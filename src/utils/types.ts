export interface PaginationParams {
  page: number;
  size: number;
}

export class PaginatedResponse<T> {
  constructor(
    public data: T[],
    public pagination: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    },
  ) {
  }
}