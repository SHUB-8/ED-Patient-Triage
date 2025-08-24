import "express";
import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        email?: string;
        hospital?: string;
        type?: UserType;
      };
      io?: Server;
    }
  }
}
