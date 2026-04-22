export interface ApiResponseSuccess<T> {
  status: number;
  data: T;
}

export interface ApiResponseError {
  status: number;
  error: string;
}