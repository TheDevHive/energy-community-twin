export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}

export enum ErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    DUPLICATE_RESOURCE = 'DUPLICATE_RESOURCE',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
