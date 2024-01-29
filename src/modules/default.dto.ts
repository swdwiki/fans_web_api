export class ListQueryDto {
  pageSize?: number | string;
  current?: number | string;
}

export class ListDataDto<T> {
  list: Array<T>;
  total?: number;
}
