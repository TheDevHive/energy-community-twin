export interface ResponseEntity<T> {
    body: T;
    statusCode: number;
    statusCodeValue: number;
    headers?: {
        [key: string]: string[];
    };
}
