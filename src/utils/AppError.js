export class AppError {
  constructor({ message, messageCode = 'generic.error', statusCode = 400 }) {
    this.message = message;
    this.messageCode = messageCode;
    this.statusCode = statusCode;
  }
}
