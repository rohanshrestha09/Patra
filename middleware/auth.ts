import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token: any;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(400).json("Not authorised");

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      const user:
        | {
            _id: Types.ObjectId;
            fullname: string;
            email: string;
            createdAt: Date;
          }
        | undefined = await User.findById(decoded.id).select("-password");

      if (!user) return res.status(404).json("Not found");

      res.locals.user = user;
      next();
    } catch (err) {
      return res.status(401).json("Unauthorized");
    }
  }
);
