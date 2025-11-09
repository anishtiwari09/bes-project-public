import AuthSessionModel from "../../db/models/auth_session";
import { UserObject } from "../../types";
import JwtTokenService from "../jwt-service";
import { CryptoToken } from "../jwt-service/crypto-token";
import { UserService } from "../user-services";

export default class UserAuthService {
  private user: UserService;
  constructor() {
    this.user = new UserService();
  }
  async createAuthSession(
    user: UserObject,

    isAdmin: boolean,
    sessionData: Record<string, string | number | boolean>
  ) {
    const refreshTokenService = new CryptoToken();
    const jwtTokenService = new JwtTokenService();
    const refreshToken = refreshTokenService.generateToken(user.id, user.email);
    let day = isAdmin ? 1 : 7;
    const jwtToken = jwtTokenService.createTokenUsingRefresh(
      JSON.stringify({ name: user?.first_name, email: user?.email }),
      refreshToken,
      "30Minutes"
    );
    const session = new AuthSessionModel({
      userId: user.id,
      refreshToken,
      loginMethod: "password",

      expiresAt: new Date(Date.now() + day * 24 * 60 * 60 * 1000), // 7 days
      ...sessionData,
    });

    await session.save();
    return {
      refreshToken,
      jwtToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.user.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.user.comparePassword(
      user.passwordHash,
      password
    );
    if (!isPasswordValid) {
      return null;
    }

    if (user.role === "admin") {
      const cryptoTokenService = new CryptoToken();
      let payloadToken = cryptoTokenService.encryptEmailPasswordPayload(
        user.email,
        password
      );
      return {
        user,
        verifyUsingOtp: false,
        payloadToken,
      };
    }
    let tokens = await this.createAuthSession(user, false, {});

    return tokens;
  }
  async otpLogin(otp: string, payload: string) {
    // verify otp
    const cryptoTokenService = new CryptoToken();
    const { email, password } =
      cryptoTokenService.decryptEmailPasswordPayload(payload);
    const user = await this.user.getUserByEmail(email);
    const isPasswordValid = await this.user.comparePassword(
      user.passwordHash,
      password
    );
    if (!isPasswordValid) {
      return null;
    }
    let tokens = await this.createAuthSession(user, user.role === "admin", {});
    return {
      login: true,
      tokens,
    };
  }
}
