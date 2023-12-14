import express, { Express } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

export class App {
  public express: Express;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.json());
  }

  private routes(): void {
    this.express.use("/api/users", userRoutes);
    this.express.use("/api/auth", authRoutes);
  }
}

export default new App().express;
