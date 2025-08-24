import { Gender } from "@prisma/client";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  medical_history: any;
};
