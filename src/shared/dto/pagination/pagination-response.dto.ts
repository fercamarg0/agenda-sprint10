export class LinksDto {
  first?: string;
  prev?: string;
  self: string;
  next?: string;
  last?: string;
}
export class PaginationMetaDto {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
  links?: LinksDto;
  constructor(data: T[], meta: PaginationMetaDto, links?: LinksDto) {
    this.data = data;
    this.meta = meta;
    this.links = links;
  }
  static create<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
    path = "",
    query: Record<string, any> = {},
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const meta: PaginationMetaDto = {
      totalItems,
      itemsPerPage,
      currentPage,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
    let links: LinksDto | undefined;
    if (path) {
      const buildUrl = (page: number) => {
        const queryParams = { ...query, page: String(page) };
        const queryString = Object.entries(queryParams)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
          )
          .join("&");
        return `${path}?${queryString}`;
      };
      links = {
        self: buildUrl(currentPage),
      };
      if (meta.hasPreviousPage) {
        links.prev = buildUrl(currentPage - 1);
        links.first = buildUrl(1);
      }
      if (meta.hasNextPage) {
        links.next = buildUrl(currentPage + 1);
        links.last = buildUrl(totalPages);
      }
    }
    return new PaginatedResponseDto(data, meta, links);
  }
}
