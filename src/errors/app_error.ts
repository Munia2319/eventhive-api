
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    //! Pass the message to the built-in Error class
    super(message);

    //! Identify this as our custom error
    this.name = "AppError";
    this.statusCode = statusCode;

    //! Maintain the correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
