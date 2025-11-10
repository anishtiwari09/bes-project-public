import mongoConnection from "../../db/db-config";
import AuthSessionModel from "../../db/models/auth_session";
import {
  IAuthSession,
  IAuthToken,
  ILoginDetails,
  UserObject,
} from "../../types";
import JwtTokenService from "../jwt-service";
import { CryptoToken } from "../jwt-service/crypto-token";
import { UserService } from "../user-services";

export default class UserAuthService {
  private user: UserService;
  constructor() {
    this.user = new UserService();
  }
  createLoginAccessToken;
  async loginAccessToken(
    name: string,
    email: string,
    role: string,
    refreshToken: string
  ): Promise<string> {
    const jwtTokenService = new JwtTokenService();
    const jwtToken = await jwtTokenService.createTokenUsingRefresh(
      JSON.stringify({ name: name, email: email }),
      refreshToken,
      "30Minutes"
    );
    return jwtToken;
  }
  async createAuthSession(
    user: UserObject,

    isAdmin: boolean,
    sessionData: Record<string, string | number | boolean>
  ): Promise<IAuthToken> {
    await mongoConnection.connect();
    const refreshTokenService = new CryptoToken();

    const refreshToken = refreshTokenService.generateToken(user.id, user.email);
    let day = isAdmin ? 1 : 7;

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
      accessToken: await this.loginAccessToken(
        user.first_name,
        user.email,
        user.role,
        refreshToken
      ),
    };
  }

  async login(email: string, password: string): Promise<ILoginDetails | null> {
    await mongoConnection.connect();
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
        verifyUsingOtp: false,
        payloadToken,
        isLogin: false,
      };
    }
    let tokens = await this.createAuthSession(user, false, {});

    return {
      ...tokens,
      isLogin: true,
      verifyUsingOtp: false,
    };
  }
  async otpLogin(otp: string, payload: string) {
    await mongoConnection.connect();
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
  async regenerateAccessToken(
    refreshToken: string
  ): Promise<IAuthSession | null> {
    await mongoConnection.connect();

    const session = await AuthSessionModel.findOne({
      token: refreshToken,
    })
      .populate("userId")
      .exec();
    if (!session) return null;
    const currentDate = new Date();
    if (session.expiresAt < currentDate) {
      return null;
    }
    const userDetails = session.userId as any as UserObject;
    const newAccessToken = await this.loginAccessToken(
      userDetails.first_name,
      userDetails.email,
      userDetails.role,
      refreshToken
    );
    return { accessToken: newAccessToken };
  }
}
