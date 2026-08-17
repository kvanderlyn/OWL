import { db, friends } from "@owl/db";
import { and, asc, eq, ilike, or, type SQLWrapper } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { user } from "../../../db/src/schema/auth-schema";
import type { AuthRequest } from "../middleware/authVerification";
import { ApiError } from "../middleware/error";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

export async function addFriend(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const friendId = req?.body.id;
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      const friendList = await db
            .select()
            .from(friends)
            .where(and(eq(friends.uid1, userId), eq(friends.uid2, friendId)));
      if (friendList.length > 0) {
            throw new ApiError("Already sent friend request to that user", 422);
      }
      try {
            const rows = await db
                  .insert(friends)
                  .values([
                        {
                              uid1: userId,
                              uid2: friendId,
                              requesterId: userId,
                        },
                        {
                              uid2: userId,
                              uid1: friendId,
                              requesterId: userId,
                        },
                  ])
                  .returning();
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to add item.", 500));
      }
}

export async function getFriendList(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const rows = await db
                  .select({
                        id: friends.id,
                        userId: friends.uid2,
                        isApproved: friends.isApproved,
                        name: user.name,
                        username: user.username,
                  })
                  .from(friends)
                  .where(and(eq(friends.uid1, userId), eq(friends.isApproved, true)))
                  .leftJoin(user, eq(friends.uid2, user.id));
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to find matching users.", 500));
      }
}

export async function getPendingFriends(req: AuthRequest, res: Response, next: NextFunction) {
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const rows = await db
                  .select({
                        id: friends.id,
                        userId: friends.uid2,
                        isApproved: friends.isApproved,
                        name: user.name,
                        username: user.username,
                  })
                  .from(friends)
                  .where(and(eq(friends.uid1, userId), eq(friends.isApproved, false)))
                  .leftJoin(user, eq(friends.uid2, user.id));
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to find matching users.", 500));
      }
}

export async function updateFriend(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const friendId = req.body.id;
      const userId = req?.user?.id;
      const isApproved = req.body?.isApproved === true;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const rows = await db
                  .update(friends)
                  .set({ isApproved })
                  .where(
                        or(
                              and(eq(friends.uid1, userId), eq(friends.uid2, friendId)),
                              and(eq(friends.uid1, friendId), eq(friends.uid2, userId)),
                        ),
                  )
                  .returning();
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}

export async function removeFriend(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const friendId = req.body.id;
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      try {
            const rows = await db
                  .delete(friends)
                  .where(
                        or(
                              and(eq(friends.uid1, userId), eq(friends.uid2, friendId)),
                              and(eq(friends.uid1, friendId), eq(friends.uid2, userId)),
                        ),
                  )
                  .returning();
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to update item.", 500));
      }
}

export async function findFriend(req: AuthRequest, res: Response, next: NextFunction) {
      const result = validationResult(req);
      const userId = req?.user?.id;
      if (!userId) {
            return next(new ApiError("User is not authenticated or is missing user ID", 400));
      }
      if (!result.isEmpty()) {
            const validationErrorString = formatValidatorErrorMessage(result);
            return next(new ApiError(validationErrorString, 400));
      }
      const name =
            typeof req.query.name === "string" && req?.query.name.length >= 3 ? `%${req.query.name}%` : undefined;
      const username =
            typeof req.query.username === "string" && req.query.username.length >= 3
                  ? `%${req.query.username}%`
                  : undefined;
      const whereClauses: SQLWrapper[] = [];
      if (name) {
            whereClauses.push(ilike(user.name, name));
      }
      if (username) {
            whereClauses.push(ilike(user.username, username));
      }
      try {
            const rows = whereClauses.length
                  ? await db
                          .select({
                                username: user.username,
                                name: user.name,
                                id: user.id,
                                isApproved: friends.isApproved,
                                friendRequest: friends.id,
                                requesterId: friends.requesterId,
                          })
                          .from(user)
                          .where(or(...whereClauses))
                          .leftJoin(friends, and(eq(friends.uid1, user.id), eq(friends.uid2, userId)))
                          .orderBy(asc(user.id))
                  : [];
            res.status(200).json({ rows });
      } catch {
            next(new ApiError("Failed to find any users.", 500));
      }
}
