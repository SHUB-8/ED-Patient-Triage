type Zone = 'RED_ZONE' | 'ORANGE_ZONE' | 'YELLOW_ZONE' | 'GREEN_ZONE' | 'BLUE_ZONE';

interface SectionCfg {
  wNEWS2: number;
  wSI: number;
  wT: number;
  wR: number;
  wA: number;
}

interface Patient {
  pid: string;
  section: Zone;
  NEWS2: number;
  SI: number;
  R: number;
  A: number;
  arrival: number;
  priority: number;
}

const Zones: Record<Zone, SectionCfg> = {
  RED_ZONE:    { wNEWS2: 0.40, wSI: 0.30, wT: 0.00, wR: 0.20, wA: 0.10 },
  ORANGE_ZONE: { wNEWS2: 0.35, wSI: 0.25, wT: 0.05, wR: 0.25, wA: 0.10 },
  YELLOW_ZONE: { wNEWS2: 0.25, wSI: 0.20, wT: 0.15, wR: 0.30, wA: 0.10 },
  GREEN_ZONE:  { wNEWS2: 0.10, wSI: 0.10, wT: 0.30, wR: 0.20, wA: 0.30 },
  BLUE_ZONE:   { wNEWS2: 0.05, wSI: 0.05, wT: 0.40, wR: 0.10, wA: 0.40 },
};

class TriageEngine {
  private queues: Record<Zone, Patient[]> = {
    RED_ZONE: [],
    ORANGE_ZONE: [],
    YELLOW_ZONE: [],
    GREEN_ZONE: [],
    BLUE_ZONE: [],
  };

  insert(pid: string, NEWS2: number, SI: number, R: number, A: number): Zone {
    const section = this.assignSection(NEWS2, SI);
    const arrival = Date.now();
    const patient: Patient = {
      pid,
      section,
      NEWS2,
      SI,
      R,
      A,
      arrival,
      priority: 0,
    };
    this.updatePriority(patient, section, arrival);
    this.queues[section].push(patient);
    this.sortQueue(section);
    return section;
  }

  recomputeAll() {
    const now = Date.now();
    for (const section of Object.keys(this.queues) as Zone[]) {
      this.queues[section].forEach(p => this.updatePriority(p, section, now));
      this.sortQueue(section);
    }
  }

  dump() {
    for (const section of Object.keys(this.queues) as Zone[]) {
      const queue = this.queues[section];
      console.log(`Section ${section} (${queue.length})`);
      for (const p of queue) {
        console.log(`  ${p.pid} prio=${p.priority.toFixed(2)}`);
      }
    }
  }

  private assignSection(NEWS2: number, SI: number): Zone {
    if (SI === 4 || NEWS2 >= 13) return 'RED_ZONE';
    if (SI === 3 || NEWS2 >= 7)  return 'ORANGE_ZONE';
    if (SI === 2 || NEWS2 >= 4)  return 'YELLOW_ZONE';
    if (SI === 1 || NEWS2 >= 1)  return 'GREEN_ZONE';
    return 'BLUE_ZONE';
  }

  private updatePriority(p: Patient, section: Zone, now: number) {
    const cfg = Zones[section];
    const secondsElapsed = Math.floor((now - p.arrival) / 1000);
    const T = Math.min(4, Math.floor(secondsElapsed / 5)); // capped decay factor
    p.priority =
      cfg.wNEWS2 * p.NEWS2 +
      cfg.wSI * p.SI +
      cfg.wT * T +
      cfg.wR * p.R +
      cfg.wA * p.A;
  }

  private sortQueue(section: Zone) {
    // Max-heap behavior: higher priority first
    this.queues[section].sort((a, b) => b.priority - a.priority);
  }
}

export { TriageEngine };
