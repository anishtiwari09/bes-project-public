import CustomError from "..";

export class LoginError {
  static resendOrSendOtpEmail() {
    return new CustomError(
      "Invalid Verification or session expired please try again",
      401
    );
  }
}
