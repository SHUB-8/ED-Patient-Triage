import { PatientsData, PatientVitals } from "../types/patient";

// Mock data generation for demonstration
const generateMockPatientsData = (): PatientsData => {
  const zones = ["red", "orange", "yellow", "green"] as const;
  const data: PatientsData = {
    red: { waitingQueue: [], treatmentQueue: [], totalBeds: 6 },
    orange: { waitingQueue: [], treatmentQueue: [], totalBeds: 8 },
    yellow: { waitingQueue: [], treatmentQueue: [], totalBeds: 10 },
    green: { waitingQueue: [], treatmentQueue: [], totalBeds: 12 },
  };

  zones.forEach((zone, zoneIndex) => {
    // Generate waiting queue patients
    const waitingCount = Math.floor(Math.random() * 8) + 1;
    for (let i = 0; i < waitingCount; i++) {
      data[zone].waitingQueue.push({
        patientId: `P${String(zoneIndex * 100 + i + 1).padStart(4, "0")}`,
        priorityScore: Math.floor(Math.random() * 40) + (100 - zoneIndex * 20),
        arrivalTime: new Date(
          Date.now() - Math.random() * 120 * 60 * 1000
        ).toISOString(),
      });
    }

    // Sort waiting queue by priority score (descending - max heap)
    data[zone].waitingQueue.sort((a, b) => b.priorityScore - a.priorityScore);

    // Generate treatment queue patients
    const treatmentCount = Math.min(
      Math.floor(Math.random() * data[zone].totalBeds) + 1,
      data[zone].totalBeds
    );
    for (let i = 0; i < treatmentCount; i++) {
      data[zone].treatmentQueue.push({
        patientId: `P${String(zoneIndex * 100 + waitingCount + i + 1).padStart(
          4,
          "0"
        )}`,
        bedNumber: `${zone.toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
        remainingTime: Math.floor(Math.random() * 180) + 15,
      });
    }

    // Sort treatment queue by remaining time (ascending - min heap)
    data[zone].treatmentQueue.sort((a, b) => a.remainingTime - b.remainingTime);
  });

  return data;
};

export const fetchAllPatientsData = async (): Promise<PatientsData> => {
  // Simulate API call delay
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  // In a real application, this would make an API call to PostgreSQL
  return generateMockPatientsData();
};

export const fetchPatientVitals = async (
  patientId: string
): Promise<PatientVitals> => {
  // Simulate API call delay
  await new Promise((resolve) =>
    setTimeout(resolve, 200 + Math.random() * 300)
  );

  // Generate mock vitals data
  const baseVitals = {
    heartRate: 70 + Math.floor(Math.random() * 50),
    systolicBP: 110 + Math.floor(Math.random() * 40),
    diastolicBP: 70 + Math.floor(Math.random() * 20),
    temperature: 36.5 + Math.random() * 2,
    respiratoryRate: 16 + Math.floor(Math.random() * 8),
    oxygenSaturation: 95 + Math.floor(Math.random() * 5),
    news2Score: Math.floor(Math.random() * 12),
    lastUpdated: new Date(
      Date.now() - Math.random() * 30 * 60 * 1000
    ).toISOString(),
  };

  // Add some realistic variations based on patient priority
  const priorityVariation = patientId.includes("P00") ? 1.2 : 1;

  return {
    ...baseVitals,
    heartRate: Math.round(baseVitals.heartRate * priorityVariation),
    systolicBP: Math.round(baseVitals.systolicBP * priorityVariation),
    temperature:
      Math.round(baseVitals.temperature * priorityVariation * 10) / 10,
    news2Score: Math.min(
      Math.round(baseVitals.news2Score * priorityVariation),
      20
    ),
  };
};
