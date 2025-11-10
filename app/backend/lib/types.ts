import { FlattenMaps } from "mongoose";
import { IUser } from "./db/models/user-schema";

export interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export interface SignupData extends UserData {
  passwordHash: string;
  unique: string;
  verificationToken: string;
  verificationTokenExpires: Date;
}

export type UserObject = FlattenMaps<IUser> & { _id: string };
export interface ILoginDetails {
  refreshToken?: string;
  accessToken?: string;
  isLogin: boolean;
  verifyUsingOtp: boolean;
  payloadToken?: string;
}

export interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthSession {
  accessToken: string;
}
