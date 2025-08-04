import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("ProtectRoute middleware triggered");
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Token received:", req.cookies);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        hospital: true,
        type: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User doesnt exist!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
