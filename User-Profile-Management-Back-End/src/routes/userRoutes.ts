import express from "express";
import { UserController } from "../controllers/userController";
import { AdminMiddleware } from "../middleware/authMiddleware";

class UserRoutes {
  private userController: UserController;
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      new AdminMiddleware().isAdmin,
      this.userController.getAllUsers
    );
    this.router.post(
      "/create-user",
      new AdminMiddleware().isAdmin,
      this.userController.createUser
    );
    this.router.put(
      "/update-user/:userId",
      new AdminMiddleware().authenticateToken,
      this.userController.updateUser
    );
    this.router.get(
      "/get-user/:userId",
      new AdminMiddleware().authenticateToken,
      this.userController.getUser
    );
    this.router.delete(
      "/delete-user/:userId",
      new AdminMiddleware().isAdmin,
      this.userController.deleteUser
    );
  }
}

export default new UserRoutes().router;
