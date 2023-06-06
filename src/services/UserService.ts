import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { UserData, UserDataUpdate } from "../interfaces/UserData";
import { compare, hash } from "bcrypt";
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid";
import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async create({ name, email, password }: UserData) {
    const user2 = await this.userRepository.findUserByEmail(email);

    if (user2) {
      throw new Error("User already exists");
    }

    const cryptedPassword = await hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: cryptedPassword,
    });

    return user;
  }

  async update({
    name,
    oldPassword,
    newPassword,
    avatar,
    user_id,
  }: UserDataUpdate) {
    let password;

    if (oldPassword && newPassword) {
      const user = await this.userRepository.findUserById(user_id);
      if (!user) {
        throw new Error("User not found.");
      }
      const passwordMatch = compare(oldPassword, user.password);
      if (!passwordMatch) {
        throw new Error("Password invalid.");
      }
      password = await hash(newPassword, 10);
      await this.userRepository.updatePassword(newPassword, user_id);
    }

    if (avatar) {
      const avatarImageProfile = avatar?.buffer;
      const uploadS3 = await s3
        .upload({
          Bucket: "avatar-profile-images",
          Key: `${uuid()}-${avatar?.originalname}`,
          Body: avatarImageProfile,
        })
        .promise();

      console.log("URL imagem =>", uploadS3.Location);

      await this.userRepository.update(name, uploadS3.Location, user_id);
    }
    return {
      message: "User updated successfully.",
    };
  }

  async auth(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User or password invalid.");
    }
    const passwordMatch = compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("User or password invalid.");
    }

    const secretKey = this.getSecretKey();

    const token = this.getSign("token", email, secretKey, user.id);

    const refreshToken = this.getSign(
      "refreshToken",
      email,
      secretKey,
      user.id
    );

    return {
      token,
      refresh_token: refreshToken,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    const secretKey = this.getSecretKey();

    const verifyRefreshToken = verify(refreshToken, secretKey);

    const { sub } = verifyRefreshToken;

    const newToken = sign({ sub }, secretKey, {
      expiresIn: 60 * 15,
    });
    return {token: newToken};
  }

  getSign(
    key: string,
    email: string,
    secretKey: string,
    userId: string
  ): string {
    let expiresIn = 0;

    if (key === "token") {
      expiresIn = 60 * 15;
    } else if (key === "refreshToken") {
      expiresIn = 10080;
    }

    const token = sign({ email }, secretKey, {
      subject: userId,
      expiresIn: expiresIn,
    });
    return token;
  }

  getSecretKey(): string {
    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKE;
    if (!secretKey) {
      throw new Error("There is no token or refreshToken key");
    }
    return secretKey;
  }
}

export { UserService };
