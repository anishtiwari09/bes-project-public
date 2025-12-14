export default class CustomError extends Error {
  statusCode: number;
  newMessage: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 401;
    this.newMessage = message;
    this.name = "customError";
  }
}
