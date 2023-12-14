import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

export class AdminMiddleware {
  public isAdmin(req: Request, res: Response, next: NextFunction): any {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ message: "Please provide the token" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      } else {
        const tokenPayload = JSON.parse(JSON.stringify(user));
        if (tokenPayload.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
      }
    });

    next();
  }

  public authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    const token = req.header("Authorization");
    const userId = req.params.userId;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. Token not provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      } else {
        const tokenPayload = JSON.parse(JSON.stringify(user));
        if (tokenPayload.userId === userId || tokenPayload.role === "admin") {
          next();
        }
      }
    });
  }
}
