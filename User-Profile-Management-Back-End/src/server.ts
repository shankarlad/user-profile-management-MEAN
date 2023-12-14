import app from "./app";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

class Server {
  private app;

  constructor() {
    this.app = app;
    dotenv.config();
    this.connectToDatabase();
    this.setupRoutes();
  }

  private connectToDatabase(): void {
    const mongoUri = process.env.MONGO_CONNECTION || "";

    mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Connected to MongoDB");
        this.app.listen(process.env.PORT, () => {
          console.log(`Server is running at port ${process.env.PORT}`);
        });
      })
      .catch((err) => {
        console.log("Error while connecting MongoDB");
      });
  }

  private setupRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send("Hiiii");
    });
  }
}

new Server();
