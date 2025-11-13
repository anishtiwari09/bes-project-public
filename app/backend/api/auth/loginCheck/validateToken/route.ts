import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import { CookiesService } from "@/app/backend/lib/services/cookies-service";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

export async function POST(request: Request) {
  try {
    const loginCookies = await CookiesService.getLoginCookies();
    const accessToken = loginCookies?.accessToken;
    const refreshToken = loginCookies?.refreshToken;
    if (!accessToken || !refreshToken) {
      throw new Error("Missing credentials");
    }

    const jwtService = new JwtTokenService();
    const tokenValidation = await jwtService.verifyLoginTokenWithExpiry(
      accessToken,
      refreshToken
    );

    const userDetails = await CookiesService.getUserDetailsFromAccessToken();
    if (tokenValidation.valid && !tokenValidation.expired) {
      return new Response(
        JSON.stringify({
          message: "Valid Credential",
          loginStatus: true,
          data: { ...userDetails },
        }),
        { status: 200 }
      );
    }

    if (tokenValidation.valid && tokenValidation.expired) {
      const authService = new UserAuthService();
      const authDetails = await authService.regenerateAccessToken(refreshToken);

      if (authDetails?.accessToken) {
        await CookiesService.setLoginCookies(
          authDetails.accessToken,
          refreshToken
        );

        const userDetails =
          await CookiesService.getUserDetailsFromAccessToken();
        return new Response(
          JSON.stringify({
            message: "Valid Credential",
            loginStatus: true,
            data: { ...userDetails },
          }),
          { status: 200 }
        );
      }
    }

    throw new Error("Invalid credentials");
  } catch (e) {
    //await CookiesService.deleteLoginCookies();
    return new Response(
      JSON.stringify({ message: "Not Valid Credential", loginStatus: false }),
      { status: 401 }
    );
  }
}
