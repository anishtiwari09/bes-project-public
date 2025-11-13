import mongoConnection from "../../db/db-config";
import AuthSessionModel from "../../db/models/auth_session";
import {
  IAuthSession,
  IAuthToken,
  IAuthUser,
  ILoginDetails,
  PlainUserObject,
  UserObject,
} from "../../types";
import { CookiesService } from "../cookies-service";
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
    userDetails: IAuthUser,
    refreshToken: string
  ): Promise<string> {
    const { firstName, lastName, email, role, status } = userDetails;
    const jwtTokenService = new JwtTokenService();
    const jwtToken = await jwtTokenService.createTokenUsingRefresh(
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
        status: status,
      },
      refreshToken,
      "30m"
    );
    return jwtToken;
  }
  async createAuthSession(
    user: PlainUserObject,

    isAdmin: boolean,
    sessionData: Record<string, string | number | boolean>
  ): Promise<IAuthToken> {
    await mongoConnection.connect();
    const refreshTokenService = new CryptoToken();
    const refreshToken = refreshTokenService.generateToken(user.id, user.email);
    let day = isAdmin ? 1 : 7;

    const session = new AuthSessionModel({
      userId: user.id,
      token: refreshToken,
      loginMethod: "password",

      expiresAt: new Date(Date.now() + day * 24 * 60 * 60 * 1000), // 7 days
      ...sessionData,
    });

    await session.save();
    return {
      refreshToken,
      accessToken: await this.loginAccessToken(
        {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
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
  async logout() {
    try {
      const token = await CookiesService.getLoginCookies();
      await mongoConnection.connect();
      await AuthSessionModel.updateOne(
        { token: token?.refreshToken },
        {
          status: "signout",
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
      );
    } catch (e) {
      console.log("Signout error -1 ", e?.message);
    }
    try {
      let cookieManager = await CookiesService.deleteLoginCookies();
    } catch (e) {
      console.log("Signout error -2 ", e?.message);
    } finally {
      return true;
    }
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
    if (session.expiresAt < currentDate || session.status !== "active") {
      return null;
    }
    const userDetails = session.userId as any as UserObject;
    const newAccessToken = await this.loginAccessToken(
      {
        firstName: userDetails.first_name,
        lastName: userDetails.last_name,
        email: userDetails.email,
        role: userDetails.role,
        status: userDetails.status,
      },
      refreshToken
    );
    return { accessToken: newAccessToken };
  }
}
