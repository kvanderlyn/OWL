import { claims, db, friends, items, wishlist } from "@owl/db";
import { and, eq } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import type { AuthRequest } from "../middleware/authVerification";
import { ApiError } from "../middleware/error";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

export async function createClaim(req: AuthRequest, res: Response, next: NextFunction) {
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
            const sixMonthsOut = () => {
                  const date = new Date();
                  date.setMonth(date.getMonth() + 6);
                  return date;
            };

            const ownerId = await getUserFromItemId(req?.body.id);
            const areFriends = await getUserFriendshipApproved(userId, ownerId ?? "");
            if (areFriends) {
                  const claimDetails = {
                        itemId: req?.body.id,
                        claimedBy: userId,
                        closeOn: req?.body.closeOn ? req.body.closeOn : sixMonthsOut(),
                  };
                  const row = await db.insert(claims).values(claimDetails).returning();
                  res.status(200).json({ row });
            } else {
                  next(new ApiError("Cannot process this claim, users are not friends.", 403));
            }
      } catch {
            next(new ApiError("Failed to add claim.", 500));
      }
}

export async function getClaimsByWishlist(req: AuthRequest, res: Response, next: NextFunction) {
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
            const wishlistId = Number(req?.query.wishlistId);
            const selectedWishlist = (await db.select().from(wishlist).where(eq(wishlist.id, wishlistId)))[0];
            const areFriends = await getUserFriendshipApproved(userId, selectedWishlist.ownerId);
            if (areFriends && selectedWishlist.ownerId !== userId) {
                  const rows = await db
                        .select({
                              id: items.id,
                              name: items.name,
                              cost: items.cost,
                              currency: items.currency,
                              itemUrl: items.itemUrl,
                              rating: items.rating,
                              notes: items.notes,
                              updatedAt: items.updatedAt,
                              claims: {
                                    claimedBy: claims.claimedBy,
                                    purchasedOn: claims.purchasedOn,
                                    createdAt: claims.createdAt,
                              },
                        })
                        .from(items)
                        .where(and(eq(items.wishlistId, wishlistId), eq(items.isActive, true)))
                        .fullJoin(claims, eq(claims.itemId, items.id));
                  const friendsList = await db
                        .select({ id: friends.uid2 })
                        .from(friends)
                        .where(and(eq(friends.uid1, userId), eq(friends.isApproved, true)));
                  const cleanedRows = rows.map((result) => {
                        const claims = result.claims;
                        if (claims) {
                              const claimId =
                                    friendsList.findIndex((item) => item.id === result.claims?.claimedBy) > -1
                                          ? result.claims?.claimedBy
                                          : result.claims?.claimedBy === userId
                                            ? "You"
                                            : "Unknown User";
                              claims.claimedBy = String(claimId);
                        }
                        return { ...result, claims };
                  });
                  return res.status(200).json({ rows: cleanedRows });
            }
            return next(
                  new ApiError(
                        "Cannot process this request, user does not have permission to view wishlist claims.",
                        403,
                  ),
            );
      } catch {
            next(new ApiError("Failed to get claims.", 500));
      }
}

export async function updateClaim(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      try {
            const { id, ...bodyValues } = req.body;
            if (bodyValues.purchasedOn) {
                  const t = new Date(Date.now());
                  bodyValues.purchasedOn = t;
            }
            const rows = await db
                  .update(claims)
                  .set({ ...bodyValues })
                  .where(eq(claims.id, id))
                  .returning();
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}

export async function deleteClaim(req: AuthRequest, res: Response, next: NextFunction) {
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
            const rows = await db
                  .delete(items)
                  .where(and(eq(claims.id, +req.body.id), eq(claims.claimedBy, userId)))
                  .returning();
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}

async function getUserFriendshipApproved(userId: string, friendId: string) {
      try {
            const row = await db
                  .select({ isApproved: friends.isApproved })
                  .from(friends)
                  .where(and(eq(friends.uid1, userId), eq(friends.uid2, friendId), eq(friends.isApproved, true)));
            return row[0].isApproved === true;
      } catch {
            return false;
      }
}

async function getUserFromItemId(itemId: number) {
      const row = await db.select({ id: items.ownerId }).from(items).where(eq(items.id, itemId));
      return row[0].id;
}
