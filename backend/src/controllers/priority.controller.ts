import { PatientCase, Zone } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

type PQParams = {
  id: string;
  NEWS2: number;
  SI: number;
  resourceScore: number;
  age: number;
};

interface SectionCfg {
  wNEWS2: number;
  wSI: number;
  wT: number;
  wR: number;
  wA: number;
}

const queues: Record<Zone, PatientCase[]> = {
  RED: [],
  ORANGE: [],
  YELLOW: [],
  GREEN: [],
  BLUE: [],
};

const assignSection = (NEWS2: number, SI: number): Zone => {
  if (SI === 4 || NEWS2 >= 13) return "RED";
  if (SI === 3 || NEWS2 >= 7) return "ORANGE";
  if (SI === 2 || NEWS2 >= 4) return "YELLOW";
  if (SI === 1 || NEWS2 >= 1) return "GREEN";
  return "BLUE";
};

const Zones: Record<Zone, SectionCfg> = {
  RED: { wNEWS2: 0.4, wSI: 0.3, wT: 0.0, wR: 0.2, wA: 0.1 },
  ORANGE: { wNEWS2: 0.35, wSI: 0.25, wT: 0.05, wR: 0.25, wA: 0.1 },
  YELLOW: { wNEWS2: 0.25, wSI: 0.2, wT: 0.15, wR: 0.3, wA: 0.1 },
  GREEN: { wNEWS2: 0.1, wSI: 0.1, wT: 0.3, wR: 0.2, wA: 0.3 },
  BLUE: { wNEWS2: 0.05, wSI: 0.05, wT: 0.4, wR: 0.1, wA: 0.4 },
};

const getPriority = (
  NEWS2: number,
  SI: number,
  resourceScore: number,
  ageFactor: number,
  arrivalTime: Date,
  config: SectionCfg,
  currentTime: Date = new Date()
) => {
  const minutesWaited = Math.floor(
    (currentTime.getTime() - arrivalTime.getTime()) / 60000
  );
  const timeFactor = Math.min(4, Math.floor(minutesWaited));

  return (
    config.wNEWS2 * NEWS2 +
    config.wSI * SI +
    config.wT * timeFactor +
    config.wR * resourceScore +
    config.wA * ageFactor
  );
};

export const insertToPriorityQueue = async (req: Request, res: Response) => {
  try {
    const { id, NEWS2, SI, resourceScore, age }: PQParams = req.body;

    const zone: Zone = assignSection(NEWS2, SI);
    const arrival: Date = new Date();
    const ageFactor = age < 15 || age >= 65 ? 1 : 0;
    const weightConfig = Zones[zone];
    const priority = getPriority(
      NEWS2,
      SI,
      resourceScore,
      ageFactor,
      arrival,
      weightConfig
    );

    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientCase = await prisma.patientCase.create({
      data: {
        zone,
        si: SI,
        news2: NEWS2,
        resource_score: resourceScore,
        age_flag: age < 15 || age > 65 ? true : false,
        arrival_time: arrival,
        last_eval_time: arrival,
        priority,
        patient_id: id,
      },
    });

    queues[zone].push(patientCase);
    queues[zone].sort(
      (a: PatientCase, b: PatientCase) =>
        b.priority - a.priority ||
        a.arrival_time.getTime() - b.arrival_time.getTime()
    );

    if (req.io) {
      req.io.emit("queues_updated", queues);
    }

    return res.status(201).json({
      message: "Patient case inserted successfully",
      case: patientCase,
      assignedZone: zone,
    });
  } catch (error) {
    console.error("Error inserting to priority queue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const recomputeAllPriorities = async () => {
  const now = new Date();
  for (const zone of Object.keys(queues) as Zone[]) {
    const weightConfig = Zones[zone];
    queues[zone].forEach((pc: PatientCase) => {
      pc.priority = getPriority(
        pc.news2,
        pc.si,
        pc.resource_score,
        pc.age_flag ? 1 : 0,
        pc.arrival_time,
        weightConfig,
        now
      );
      pc.last_eval_time = now;
    });

    queues[zone].sort(
      (a: PatientCase, b: PatientCase) =>
        b.priority - a.priority ||
        a.arrival_time.getTime() - b.arrival_time.getTime()
    );
  }
};

export const getAllPriorityQueues = (_req: Request, res: Response) => {
  console.log("Fetching all priority queues");
  return res.status(200).json(queues);
};

export const initializePriorityQueueFromDB = async () => {
  try {
    Object.keys(queues).forEach((zone) => {
      queues[zone as Zone] = [];
    });
    const activeCases = await prisma.patientCase.findMany({
      where: {
        time_served: null,
      },
    });
    activeCases.forEach((pc) => {
      queues[pc.zone].push(pc);
    });
    await recomputeAllPriorities();
    console.log(
      `Initialized priority queues with ${activeCases.length} active cases`
    );
    return {
      message: "Priority queues initialized successfully",
      totalCases: activeCases.length,
      queues,
    };
  } catch (error) {
    console.error("Error initializing priority queues:", error);
    throw new Error("Failed to initialize priority queues from database");
  }
};

export const getPriorityQueue = (req: Request, res: Response) => {
  const zone = req.params.zone as Zone;
  if (!zone) {
    return res.status(400).json({ error: "Zone is required" });
  }
  const queue = queues[zone];
  if (!queue) {
    return res.status(404).json({ error: "Zone not found" });
  }
  return res.status(200).json(queue);
};

export const admitTopPriorityCase = async (req: Request, res: Response) => {
  const zone = req.params.zone as Zone;
  if (!zone) {
    return res.status(400).json({ error: "Zone is required" });
  }
  if (!queues[zone] || queues[zone].length === 0) {
    return res.status(404).json({ error: "No cases in this zone" });
  }

  const removedCase: PatientCase | undefined = queues[zone].shift();

  if (removedCase) {
    await prisma.patientCase.update({
      where: { id: removedCase.id },
      data: { time_served: new Date() },
    });

    if (req.io) {
      req.io.emit("queues_updated", queues);
    }

    return res.status(200).json({
      message: "Top priority case admitted successfully",
      case: removedCase,
    });
  }
  return res.status(500).json({ error: "Failed to admit top priority case" });
};

export const updateDetails = async (req: Request, res: Response) => {
  const { id, NEWS2, SI, resourceScore } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const existingCase = await prisma.patientCase.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return res.status(404).json({ error: "Patient case not found" });
    }

    if (existingCase.time_served) {
      return res
        .status(400)
        .json({ error: "Cannot update a case that has already been served" });
    }

    const patientCase = await prisma.patientCase.update({
      where: { id },
      data: {
        news2: NEWS2,
        si: SI,
        resource_score: resourceScore,
      },
    });

    recomputeAllPriorities();

    if (req.io) {
      req.io.emit("queues_updated", queues);
    }

    return res.status(200).json({
      message: "Patient case updated successfully",
      case: patientCase,
    });
  } catch (error) {
    console.error("Error updating patient case:", error);
    return res.status(500).json({ error: "Failed to update patient case" });
  }
};
