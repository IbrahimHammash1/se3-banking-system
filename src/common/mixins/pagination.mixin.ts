import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaData {
  @ApiProperty({ type: Number })
  page: number;
  @ApiProperty({ type: Number })
  perPage: number;
  @ApiProperty({ type: Number })
  nextPage: number;
  @ApiProperty({ type: Number })
  previousPage: number;
  @ApiProperty({ type: Number })
  total: number;
}

export const PaginationMixin = <T extends object>(EntityClass: {
  new (...args: never[]): T;
}) => {
  class PaginationClass {
    @ApiProperty({ type: EntityClass, isArray: true })
    data: T[] | T;
    @ApiProperty({ type: PaginationMetaData })
    meta: PaginationMetaData;
    constructor(data: T[] | T, meta: PaginationMetaData) {
      this.data = data;
      this.meta = meta;
    }
    static createInstance({
      data,
      meta,
    }: {
      data: T[] | T;
      meta: PaginationMetaData;
    }): PaginationClass {
      return new PaginationClass(data, meta);
    }
  }
  return PaginationClass;
};
