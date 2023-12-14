import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export class AuthController {
  loginUser = async (req: Request, res: Response) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordCheck = await bcrypt.compare(password, user.password);

      if (!passwordCheck) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        // config.jwtSecret,
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        userId: user._id,
        name: user.name,
        role: user.role,
        jwtToken: token,
      });
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:loginUser ` + error,
      });
    }
  };

  loginWithGoogle = async (req: Request, res: Response) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        userId: user._id,
        name: user.name,
        role: user.role,
        jwtToken: token,
      });
    } catch (error) {
      res.status(500).json({
        message: `Class: ${this.constructor.name} Method:loginUser ` + error,
      });
    }
  };
}
