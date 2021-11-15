import { adminFirebase } from "../config/fb";
import { Response, Request, NextFunction } from "express";

export const authentication = async (request: Request, response: Response, next: NextFunction) => {
  const authorized = request.headers["authorization"]!;

  try {
    await adminFirebase.auth().getUser(authorized);
    return next();
  } catch (err) {
    return response.status(401).send(err);
  }
};
