import express from "express";
import { AuthController } from "../controllers/authController";

class AuthRoutes {
  private authController: AuthController;
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/login-user", this.authController.loginUser);
    this.router.post("/login-with-google", this.authController.loginWithGoogle);
  }
}

export default new AuthRoutes().router;
