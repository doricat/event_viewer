import { ApiError, ApiErrorResult } from "../apiResult";

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

    getMessage(): string | undefined {
        if (this.isJsonResult && this.httpStatus >= 400) {
            const apiError = this.data as ApiErrorResult<ApiError>;
            return apiError.error.message;
        }

        return undefined;
    }

    getServerValidationResult(): ApiError | undefined {
        if (this.httpStatus !== 400) {
            return undefined;
        }

        return (this.data as ApiErrorResult<ApiError>).error;
    }

    public get isServerSideException(): boolean {
        return this.httpStatus >= 500;
    }

    public get isUnauthorized(): boolean {
        return this.httpStatus === 403;
    }

    public get isUnauthenticated(): boolean {
        return this.httpStatus === 401;
    }

    public get isJsonResult(): boolean {
        const contentType = this.headers.get('content-type') || '';
        return contentType.startsWith('application/json');
    }
}
