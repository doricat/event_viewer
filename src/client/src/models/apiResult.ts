export interface ApiError {
    code: string;
    message: string;
}

export interface ApiResult<T> {
    value: T;
}

export interface ApiErrorResult<T> {
    error: T;
}

export interface CreatedResult {
    id: number;
    location: string;
}

export interface PagedResult<T> extends ApiResult<T> {
    nextLink?: string;
    sorts?: string[];
    count?: number;
    maxPageSize?: number;
    value: T;
}