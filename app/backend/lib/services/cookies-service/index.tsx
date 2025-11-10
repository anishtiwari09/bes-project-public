import { cookies } from "next/headers";
import { IAuthToken } from "../../types";

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
    const [header, payload, signature] = accessToken.split(".");
    this.setSecureCookies([
      { key: "_hdr", value: header },
      { key: "_pld", value: payload },
      { key: "_sig", value: signature },
      { key: "__z9x7k2m", value: refreshToken },
    ]);
  }
  static async deleteLoginCookies() {
    this.deleteCoookies(["_hdr", "_pld", "_sig", "__z9x7k2m"]);
  }
  static async getLoginCookies(): Promise<IAuthToken> {
    let cookie = await cookies();
    const refreshToken = cookie.get("__z9x7k2m");
    const header = cookie.get("_hdr");
    const payload = cookie.get("_pld");
    const signature = cookie.get("_sig");
    return {
      accessToken: `${header}.${payload}.${signature}`,
      refreshToken: refreshToken?.value || "",
    };
  }
}
