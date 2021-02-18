import { ApiError, ApiErrorResult, ApiResult } from "../apiResult";

export interface HttpErrorMessage {
    serviceName: string;
    operation: string;
    httpStatus: number;
    data: any;
    headers: Headers;
    eventId: number;
}

export class ErrorMessage {
    serviceName!: string;
    operation!: string;
    httpStatus!: number;
    headers!: Headers;
    data: any;

    static fromMessage(message: HttpErrorMessage): ErrorMessage {
        const error = new ErrorMessage();
        error.serviceName = message.serviceName;
        error.operation = message.operation;
        error.httpStatus = message.httpStatus;
        error.data = message.data;
        error.headers = message.headers;
        return error;
    }

    getMessage(): string {
        const contentType = this.headers.get('content-type') || '';
        if (contentType.startsWith('application/json')) {
            if (this.httpStatus >= 200 && this.httpStatus < 300) {
                const result = this.data as ApiResult<ApiError>;
                return result.value.message;
            }

            const apiError = this.data as ApiErrorResult<ApiError>;
            return apiError.error.message;
        }

        return `server returned content type ${contentType}`;
    }

    getServerValidationResult(): ApiError | undefined {
        if (this.httpStatus !== 400) {
            return undefined;
        }

        return (this.data as ApiErrorResult<ApiError>).error;
    }
}