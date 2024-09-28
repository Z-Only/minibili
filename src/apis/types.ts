export interface ApiResult<T> {
  code: number;
  message: string;
  ttl: number;
  data: T;
}
