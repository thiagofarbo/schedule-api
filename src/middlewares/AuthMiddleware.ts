import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { IPayload } from "../interfaces/IPayload";

class AuthMiddleware {
  auth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({
        code: "token.missing",
        message: "Token is missing",
      });
    }
    const [, token] = authHeader.split(" ");
    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKE;
    if (!secretKey) {
      throw new Error("There is no token key");
    }
    try {
      const { sub } = verify(token, secretKey) as IPayload;
      request.user_id = sub;
      return next()
    } catch (error) {
      return response.status(401).json({
        code: 'token.expired',
        message: 'Token expired'
      });
    }
  }
}

export { AuthMiddleware };
