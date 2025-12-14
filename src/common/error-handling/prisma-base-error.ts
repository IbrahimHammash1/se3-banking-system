export class PrismaBaseError {
  message: string | string[] | object;
  error: string;
  statusCode: number;
  constructor({
    message,
    error,
    statusCode,
  }: {
    message: string | string[] | object;
    error: string;
    statusCode: number;
  }) {
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
  }
}
