/*
响应数据类型
*/
export interface ApiResult<T> {
  code: number;
  message: string;
  ttl: number;
  data: T;
}

export interface Owner {
  face: string;
  mid: number;
  name: string;
  [property: string]: any;
}
