import { JWT_SECRET_KEY } from "@/app/backend/config/constant";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
export default class JwtTokenService {
  private secretKey: string;
  constructor() {
    this.secretKey = JWT_SECRET_KEY;
    if (!this.secretKey) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in environment variables."
      );
    }
  }
  async createToken(
    payload: string | object,
    duration: SignOptions["expiresIn"]
  ): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: duration });
  }
  async createTokenUsingRefresh(
    payload: string,
    refreshToken: string,
    duration: SignOptions["expiresIn"]
  ) {
    return jwt.sign(payload, this.secretKey + refreshToken, {
      expiresIn: duration,
    });
  }
  async decodeTokenUsingRefresh(token: string, refreshToken: string) {
    try {
      return !!jwt.verify(token, this.secretKey + refreshToken);
    } catch (e) {
      return false;
    }
  }
  async verifyToken(token: string): Promise<boolean> {
    try {
      return !!jwt.verify(token, this.secretKey);
    } catch (e) {
      return false;
    }
  }
  async comparePassword(
    passwordHash: string,
    password: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, passwordHash);
    } catch (e) {
      return false;
    }
  }
}
