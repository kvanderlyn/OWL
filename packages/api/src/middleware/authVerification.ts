import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth";
import { ApiError } from "./error";

export interface AuthRequest extends Request {
      user?: (typeof auth.$Infer.Session)["user"];
      session?: (typeof auth.$Infer.Session)["session"];
}
export const getUserData = async (req: AuthRequest, __res: Response, next: NextFunction) => {
      try {
            const session = await auth.api.getSession({
                  headers: fromNodeHeaders(req.headers),
            });
            if (!session) {
                  next(new ApiError("Unauthorized: Invalid session", 401));
            }
            req.user = session?.user;
            req.session = session?.session;
            next();
      } catch {
            return new ApiError("Internal Server Error", 500);
      }
};
