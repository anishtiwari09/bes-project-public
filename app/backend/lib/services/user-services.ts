import { expiryDate, sleep } from "../../helper/util";

import mongoConnection from "../db/db-config";
import UserModel, { UserStatus, IUser } from "../db/models/user-schema";
import { SignupData, UserData, UserObject } from "../types";
import bcrypt from "bcryptjs";
export class UserService {
  private saltRounds: number = 5;
  async createUser(userData: SignupData) {
    await mongoConnection.connect();
    const existingUser = await UserModel.findOne({ email: userData.email });
    console.log({ existingUser, email: userData?.email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    await sleep(10000);
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
  async getUserByEmail(email: string): Promise<UserObject | null> {
    await mongoConnection.connect();
    const result = await UserModel.findOne({ email }).lean();
    return result as unknown as UserObject;
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
  async updateUser(email: string, updateData: Partial<UserData>) {
    const db = await mongoConnection.connect();
    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: updateData });
    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }
    return this.getUserByEmail(email);
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
