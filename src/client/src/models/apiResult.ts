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
