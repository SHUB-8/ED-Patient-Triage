import jwt from "jsonwebtoken";

import { Response } from "express";

const generateJWT = (userId: string, res: Response): void => {
  const secret: string = process.env.JWT_SECRET || "";
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export default generateJWT;
