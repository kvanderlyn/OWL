import { db, friends, items, wishlist } from "@owl/db";
import { and, count, eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import type { AuthRequest } from "../middleware/authVerification";
import { ApiError } from "../middleware/error";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

export async function createWishlist(req: AuthRequest, res: Response, next: NextFunction) {
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
            const list = await db.insert(wishlist).values({ ownerId: userId, name: req.body.name }).returning();
            res.status(200).json({ list });
      } catch {
            next(new ApiError("Failed to create wishlist.", 500));
      }
}

export async function getWishlistByUser2(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const list = await db.select().from(wishlist).where(eq(wishlist.ownerId, userId));
            res.status(200).json({ list });
      } catch {
            next(new ApiError("Failed to find wishlists for user.", 500));
      }
}

export async function deleteWishlistByUserAndId(req: AuthRequest, res: Response, next: NextFunction) {
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
            const list = await db
                  .delete(wishlist)
                  .where(and(eq(wishlist.ownerId, userId), eq(wishlist.id, req.body.id)));
            res.status(200).json({ list });
      } catch {
            next(new ApiError("Failed to remove wishlists for user.", 500));
      }
}

export async function updateWishlist(req: AuthRequest, res: Response, next: NextFunction) {
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
            const list = await db
                  .update(wishlist)
                  .set({ name: req.body.name })
                  .where(and(eq(wishlist.ownerId, userId), eq(wishlist.id, req.body.id)));
            res.status(200).json({ list });
      } catch {
            next(new ApiError("Failed to remove wishlists for user.", 500));
      }
}

export async function getCurrentUserWishlists(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const list = await db
                  .select({
                        id: wishlist.id,
                        name: wishlist.name,
                        item_count: count(items.id),
                  })
                  .from(wishlist)
                  .where(eq(wishlist.ownerId, userId))
                  .leftJoin(items, eq(wishlist.id, items.wishlistId))
                  .groupBy(wishlist.id);
            res.status(200).json({ list });
      } catch {
            next(new ApiError("Failed to find wishlists for user.", 500));
      }
}

export async function getWishlistByUserId(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      try {
            const friendId = String(req.query.id);
            const friendRow = await db
                  .select()
                  .from(friends)
                  .where(and(eq(friends.uid1, userId), eq(friends.uid2, friendId), eq(friends.isApproved, true)));
            const rows =
                  friendRow.length > 0 ? await db.select().from(wishlist).where(eq(wishlist.ownerId, friendId)) : [];
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to find wishlists for user.", 500));
      }
}
