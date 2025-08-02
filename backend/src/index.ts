import express from "express";
import prisma from "./lib/prisma";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api");

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("");
  server.close(() => {
    console.log("Server closed and Prisma client disconnected");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed and Prisma client disconnected");
    process.exit(0);
  });
});
