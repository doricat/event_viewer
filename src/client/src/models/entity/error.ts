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
            return `server returned code ${this.httpStatus}`;
        }

        return `server returned content ${contentType}`;
    }
}