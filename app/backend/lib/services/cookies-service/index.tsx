import { cookies } from "next/headers";
import { IAuthToken, IAuthUser } from "../../types";
import { CookieTokenName } from "./types";
import { isDeveopment } from "@/app/backend/constant";
import JwtTokenService from "../jwt-service";
import { mapAuthUserToAuthUser, userToUser } from "../utils/user";

export class CookiesService {
  constructor() {}
  static async setSecureCookie(key: string, value: string) {
    let cookie = await cookies();
    cookie.set(key, value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  }
  static async setSecureCookies(cookiesData: { key: string; value: string }[]) {
    let cookie = await cookies();
    cookiesData.forEach((co) => {
      cookie.set(co.key, co.value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    });
  }
  static async deleteCoookies(keys: string[]) {
    let cookie = await cookies();
    keys.forEach((key) => {
      cookie.delete(key);
    });
  }
  static async setLoginCookies(accessToken: string, refreshToken: string) {
    let [header, payload, signature] = accessToken.split(".");
    if (!isDeveopment) {
    }
    this.setSecureCookies([
      { key: CookieTokenName.header, value: header },
      { key: CookieTokenName.payload, value: payload },
      { key: CookieTokenName.signature, value: signature },
      { key: CookieTokenName.refreshToken, value: refreshToken },
    ]);
  }
  static async deleteLoginCookies() {
    this.deleteCoookies([
      CookieTokenName.header,
      CookieTokenName.payload,
      CookieTokenName.signature,
      CookieTokenName.refreshToken,
    ]);
  }
  static async getLoginCookies(): Promise<IAuthToken> {
    let cookie = await cookies();
    if (!isDeveopment) {
    }
    const refreshToken = cookie.get(CookieTokenName.refreshToken);
    const header = cookie.get(CookieTokenName.header)?.value;
    const payload = cookie.get(CookieTokenName.payload)?.value;
    const signature = cookie.get(CookieTokenName.signature)?.value;

    if (!header || !payload || !signature || !refreshToken?.value) {
      return {
        accessToken: "",
        refreshToken: "",
      };
    }

    return {
      accessToken: `${header}.${payload}.${signature}`,
      refreshToken: refreshToken?.value || "",
    };
  }

  static async getUserDetailsFromAccessToken(): Promise<IAuthUser | null> {
    const token = await this.getLoginCookies();
    const jwtService = new JwtTokenService();

    const user = await jwtService.decodeToken(token?.accessToken);
    let parseUser: IAuthUser;
    if (!user) {
      return null;
    }
    parseUser = mapAuthUserToAuthUser(user as IAuthUser);
    return {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      ...parseUser,
    };
  }
}
