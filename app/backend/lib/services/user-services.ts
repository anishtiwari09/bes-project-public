import { expiryDate, sleep } from "../../helper/util";

import mongoConnection from "../db/db-config";
import UserModel, { UserStatus, IUser } from "../db/models/user-schema";
import { PlainUserObject, SignupData, UserData, UserObject } from "../types";
import bcrypt from "bcryptjs";
import { userToUser } from "./utils/user";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
export class UserService {
  private saltRounds: number = 5;
  async createUser(userData: SignupData) {
    await mongoConnection.connect();
    const existingUser = await UserModel.findOne({ email: userData.email });
    console.log({ existingUser, email: userData?.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const userObject = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      passwordHash: userData.passwordHash,
      unique: userData?.unique,
      verificationToken: userData?.unique,
      verificationTokenExpires:
        userData?.verificationTokenExpires || expiryDate(24), // 24 hours from now
    };
    const options = {
      new: true, // Return the updated document
      upsert: true, // Create the document if it doesn't exist
      setDefaultsOnInsert: true, // Apply schema defaults on insert
    };
    const result = await UserModel.findOneAndUpdate(
      { email: userData.email },
      { ...userObject },
      options
    ).lean();
    delete result.passwordHash;
    delete result.verificationToken;

    return { ...result };
  }
  async getUserByEmail(email: string): Promise<PlainUserObject | null> {
    await mongoConnection.connect();
    const result = await UserModel.findOne({ email }).lean();
    if (!result) return null;
    return userToUser(result as unknown as UserObject);
  }
  async validateAndUpdateToken(token: string): Promise<boolean> {
    await mongoConnection.connect();
    try {
      const result = await UserModel.findOne({
        verificationToken: token,
      }).lean();
      if (!result) return false;

      if (result?.verificationTokenExpires < new Date()) {
        return false;
      }
      if (result.status === UserStatus.PendingEmailVerification) {
        await UserModel.updateOne(
          { email: result.email },
          {
            $set: {
              status: UserStatus.EmailVerified,
              verificationToken: null,
              verificationTokenExpires: null,
            },
          }
        );
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  async resetPassword(
    email: string,
    verificationToken: string,
    expireInHour: number
  ) {
    await mongoConnection.connect();

    const result = await UserModel.findOneAndUpdate(
      { email },
      {
        verificationToken: verificationToken,
        verificationTokenExpires: expiryDate(expireInHour || 1), // expired for one hour
      }
    );

    return result;
  }
  async updatePassword(email: string, password: string, isHash = false) {
    let passwordHash = password;
    if (!isHash) {
      passwordHash = await bcrypt.hash(password, this.saltRounds);
    }
    return await UserModel.findOne({ email }).updateOne({
      passwordHash: passwordHash,
      verificationToken: null,
      verificationTokenExpires: null,
    });
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

  async getUserToken(token: string) {
    await mongoConnection.connect();

    if (!token) return null;
    const result = await UserModel.findOne({ verificationToken: token }).lean();

    if (!result) return null;
    return result;
  }
}
