import { db, friends } from "@owl/db";
import { eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { user } from "../../../db/src/schema/auth-schema";
import type { AuthRequest } from "../middleware/authVerification";
import { ApiError } from "../middleware/error";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

export async function getUserByUsername(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      try {
            const username = req.query.username;
            const rows =
                  typeof username === "string"
                        ? await db
                                .select({ id: user.id, name: user.name, username: user.username })
                                .from(user)
                                .where(eq(user.username, username.toLowerCase()))
                        : [];
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to find matching users.", 500));
      }
}
