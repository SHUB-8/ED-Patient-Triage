import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { Zone } from "@prisma/client";

export const getBeds = async (_req: Request, res: Response) => {
  try {
    const beds = await prisma.beds.findMany();
    if (!beds || beds.length === 0) {
      return res.status(404).json({ message: "No beds found" });
    }
    return res.status(200).json({ message: "Beds found!", beds: beds });
  } catch (error) {
    console.error("Error fetching beds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBedByZone = async (req: Request, res: Response) => {
  try {
    const { zone } = req.params as { zone: Zone };
    if (!zone) {
      return res.status(400).json({ message: "Zone parameter is required" });
    }

    const beds = await prisma.beds.findMany({ where: { zone: zone } });
    if (!beds || beds.length === 0) {
      return res
        .status(404)
        .json({ message: "No beds found for the specified zone" });
    }

    return res.status(200).json({ message: "Beds found!", beds: beds });
  } catch (error) {
    console.error("Error fetching beds by zone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBedById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      return res.status(400).json({ message: "Bed ID parameter is required" });
    }

    const bed = await prisma.beds.findUnique({ where: { id: id } });
    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    return res.status(200).json({ message: "Bed found!", bed: bed });
  } catch (error) {
    console.error("Error fetching bed by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addToBed = async (req: Request, res: Response) => {
  try {
    const { case_id, bed_id } = req.body as { case_id: string; bed_id: string };
    if (!case_id || !bed_id) {
      return res
        .status(400)
        .json({ message: "Both case ID and bed ID are required" });
    }

    const updatedBed = await prisma.beds.update({
      where: { id: bed_id },
      data: { case_id: case_id },
      include: { patient_case: true },
    });

    if (req.io) {
      req.io.emit("bed_updated", updatedBed);
    }

    return res.status(200).json({
      message: "Patient assigned to bed successfully",
      bed: updatedBed,
    });
  } catch (error) {
    console.error("Error assigning patient to bed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const dischargeFromBed = async (req: Request, res: Response) => {
  try {
    const { bed_id } = req.body as { bed_id: string };

    const updatedBed = await prisma.beds.update({
      where: { id: bed_id },
      data: { case_id: null },
      include: { patient_case: true },
    });

    if (req.io) {
      req.io.emit("bed_updated", updatedBed);
    }

    return res.status(200).json({
      message: "Patient discharged from bed successfully",
      bed: updatedBed,
    });
  } catch (error) {
    console.error("Error discharging patient from bed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createBed = async (req: Request, res: Response) => {
  try {
    const { zone, bed_number } = req.body;

    if (!zone || !bed_number) {
      return res.status(400).json({ message: "Zone and bed number are required" });
    }

    const newBed = await prisma.beds.create({
      data: {
        zone,
        bed_number,
      },
    });

    return res.status(201).json({
      message: "Bed created successfully",
      bed: newBed,
    });
  } catch (error) {
    console.error("Error creating bed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
