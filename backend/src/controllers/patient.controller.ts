import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { Patient } from "../types/patient.types.js";

export const addPatient = async (req: Request, res: Response) => {
  try {
    const { name, age, gender, phone, email, medical_history }: Patient =
      req.body;

    const newPatient: Patient | null = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        phone,
        email,
        medical_history,
      },
    });

    return res.status(201).json({
      message: "Patient added successfully",
      patient: newPatient,
    });
  } catch (error) {
    console.error("Error adding patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatients = async (_req: Request, res: Response) => {
  try {
    const patients: Patient[] = await prisma.patient.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json({
      message: "Patients fetched successfully",
      patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const patient: Patient | null = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({
      message: "Patient fetched successfully",
      patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, email, medical_history }: Patient =
      req.body;
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }
    const updatedPatient: Patient | null = await prisma.patient.update({
      where: { id },
      data: {
        name,
        age,
        gender,
        phone,
        email,
        medical_history,
      },
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientCases = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patientCases = await prisma.patientCase.findMany({
      where: { patient_id: id },
    });

    return res.status(200).json({
      message: "Patient cases fetched successfully",
      cases: patientCases,
    });
  } catch (error) {
    console.error("Error fetching patient cases:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchPatients = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10 } = req.query;
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: q as string, mode: "insensitive" } },
          { email: { contains: q as string, mode: "insensitive" } },
          { phone: { contains: q as string, mode: "insensitive" } },
        ],
      },
      take: parseInt(limit as string),
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({
      message: "Patients fetched successfully",
      patients,
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const deletePatient = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     if (!id) {
//       return res.status(400).json({ message: "Patient ID is required" });
//     }
//     const deletedPatient: Patient | null = await prisma.patient.delete({
//       where: { id },
//     });

//     return res.status(200).json({
//       message: "Patient deleted successfully",
//       patient: deletedPatient,
//     });
//   } catch (error) {
//     console.error("Error deleting patient:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
