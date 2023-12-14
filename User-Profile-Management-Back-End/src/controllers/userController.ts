import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";

export class UserController {
  // This methid will create the new user
  createUser = async (req: Request, res: Response) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      req.body.role = "user";
      const user = await User.create(req.body);
      if (user) {
        res.status(200).json(user);
      } else {
        throw new Error("Internel server error");
      }
    } catch (error) {
      res.status(500).json({
        message: `Class:${this.constructor.name} Method:createUser ` + error,
      });
    }
  };

  // This Method will update the user
  updateUser = async (req: Request, res: Response) => {
    try {
      // Implementation for updating a user
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "Please provide the userId" });
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        throw new Error("Internel server error");
      }
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:updateUser ` + error,
      });
    }
  };

  //
  getUser = async (req: Request, res: Response) => {
    try {
      // Implementation for getting a single user
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "Please provide the userId" });
      }
      const user = await User.findById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:getUser ` + error,
      });
    }
  };

  // Method to get all users
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      let users = await User.find({ role: { $ne: "admin" } })
        .select("-password -__v")
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();

      users.map((element) => {
        element.strength = element.strength.join(",");
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:getAllUsers ` + error,
      });
    }
  };

  // Method to delete single user
  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "Please provide the userId" });
      }
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:deleteUser ` + error,
      });
    }
  };
}
