import { db, items } from "@owl/db";
import { and, eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import type { AuthRequest } from "../middleware/authVerification";
import { ApiError } from "../middleware/error";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const item = await db
                  .insert(items)
                  .values({
                        ownerId: userId,
                        ...req.body,
                  })
                  .returning();
            res.status(200).json({ item });
      } catch {
            next(new ApiError("Failed to add item.", 500));
      }
}

export async function getItems(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      try {
            const selectedWishlist = Number(req?.query?.wishlistId);
            const itemList = await db.select().from(items).where(eq(items.wishlistId, selectedWishlist));
            res.status(200).json({ items: itemList });
      } catch {
            next(new ApiError("Failed to get items.", 500));
      }
}

export async function updateItem(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      try {
            const { id, ownerId, wishlistId, createdAt, updatedAt, ...bodyValues } = req.body;
            const item = await db
                  .update(items)
                  .set({ ...bodyValues })
                  .where(eq(items.id, id))
                  .returning();
            res.status(200).json({ item });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}

export async function deleteItem(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const item = await db
                  .delete(items)
                  .where(and(eq(items.id, +req.body.id), eq(items.ownerId, userId)))
                  .returning();
            res.status(200).json({ item });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}
