import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { Request, Response } from "express";
import generateJWT from "../utils/generateJWT.js";
import { UserType } from "@prisma/client";

type UserWithPassword = {
  id: string;
  name: string;
  email: string;
  password: string;
  hospital: string;
  type: UserType;
};

type PublicUser = {
  id: string;
  name: string;
  email: string;
  hospital: string;
  type: UserType;
};

type SignupProps = {
  name: string;
  email: string;
  password: string;
  hospital: string;
  type: UserType;
};

type LoginProps = {
  email: string;
  password: string;
};

const signup = async (req: Request, res: Response) => {
  try {
    console.log("Signup request received:", req.body);
    const { name, email, password, hospital, type }: SignupProps = req.body;
    if (!name || !email || !password || !hospital || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Object.values(UserType).includes(type)) {
      return res.status(400).json({ message: "Invalid user type provided" });
    }

    // Add email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Add password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: PublicUser = await prisma.user.create({
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
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginProps = req.body;
    console.log("login request");
    console.log(email, password);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user: UserWithPassword | null = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("isPasswordvalid", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
  console.log(req.user);
  const userId = req.user?.id;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(req.user);
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (_req: Request, res: Response) => {
  try {
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
};

export { signup, login, profile, logout };
