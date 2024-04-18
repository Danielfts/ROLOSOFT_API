class ServerError extends Error {
    public httpStatusCode: number;
    public data: object;
    constructor(httpStatusCode: number, message: string, data: object = {}) {
      super(message);
      this.name = this.constructor.name;
      this.httpStatusCode = httpStatusCode;
      this.data = data;
    }
  }
  
  export default ServerError;
  