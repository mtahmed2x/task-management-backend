export class AppError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false; 
    this.name = this.constructor.name; 

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
