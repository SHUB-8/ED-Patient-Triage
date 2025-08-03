import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Request, Response } from "express";
import generateJWT from "../utils/generateJWT";

type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  hospital: string;
  type: UserRoleType;
};

type PublicUserType = {
  id: string;
  name: string;
  email: string;
  hospital: string;
  type: UserRoleType;
};

type SignupProps = {
  name: string;
  email: string;
  password: string;
  hospital: string;
  type: UserRoleType;
};

enum UserRoleType {
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  ADMIN = "ADMIN",
  RECEPTIONIST = "RECEPTIONIST",
}

const signup = async (req: Request, res: Response) => {
  const { name, email, password, hospital, type }: SignupProps = req.body;
  try {
    if (!name || !email || !password || !hospital) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Object.values(UserRoleType).includes(type)) {
      return res.status(400).json({ message: "Invalid user type provided" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: PublicUserType = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        hospital,
        type,
      },
      select: {
        id: true,
        name: true,
        email: true,
        hospital: true,
        type: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta.target.includes("email")) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

type LoginProps = {
  email: string;
  password: string;
};

const login = async (req: Request, res: Response) => {
  const { email, password }: LoginProps = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user: UserType | null = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateJWT(user.id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hospital: user.hospital,
        type: user.type,
      },
      token: token,
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const profile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user: PublicUserType | null = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        hospital: true,
        type: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (_req: Request, res: Response) => {
    try{
        res.cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { signup, login, profile, logout };
