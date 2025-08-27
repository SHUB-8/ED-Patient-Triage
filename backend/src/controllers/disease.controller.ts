import prisma from "../lib/prisma.js";
import { Request, Response } from "express";

export const getDiseases = async (_req: Request, res: Response) => {
  try {
    const diseases = await prisma.disease.findMany();
    res.status(200).json(diseases);
  } catch (error) {
    console.error("Error fetching diseases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDisease = async (req: Request, res: Response) => {
  const { name, description, treatment_time, max_wait_time, severity } =
    req.body;

  if (
    !name ||
    !treatment_time ||
    max_wait_time === undefined ||
    severity === undefined
  ) {
    return res.status(400).json({
      error:
        "Name, treatment_time, max_wait_time, and severity are required fields",
    });
  }

  try {
    const newDisease = await prisma.disease.create({
      data: {
        name,
        description,
        treatment_time,
        max_wait_time,
        severity,
      },
    });
    res.status(201).json(newDisease);
  } catch (error) {
    console.error("Error creating disease:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDisease = async (req: Request, res: Response) => {
  const { id, name, description, treatment_time, max_wait_time, severity } =
    req.body;

  try {
    const updatedDisease = await prisma.disease.update({
      where: { id },
      data: {
        name,
        description,
        treatment_time,
        max_wait_time,
        severity,
      },
    });
    res.status(200).json(updatedDisease);
  } catch (error) {
    console.error("Error updating disease:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
