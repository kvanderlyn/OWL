import { Request, Response, NextFunction } from "express";
import { db, client } from "@owl/db"
import { wishlist } from "@owl/db";
import { eq } from "drizzle-orm";
import { ApiError } from "../middleware/error";
import { validationResult } from "express-validator";
import { formatValidatorErrorMessage } from "../middleware/validator-functions";

// export async function createWishlist(req: Request, res: Response, next: NextFunction) {
//     const result = validationResult(req)
//     if (!result.isEmpty()) {
//         return next(new ApiError(JSON.stringify(result.array()), 400))
//     }
//     try {
//         const list = await db.insert(wishlist).values(req.body).returning();
//         res.status(200).json({ list })
//     } catch (error) {
//         next(new ApiError("Failed to create wishlist.", 500))
//     }
// }

export async function getWishlistByUser(req: Request<{}, {}, {}, { userId: string }>, res: Response, next: NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const validationErrorString = formatValidatorErrorMessage(result)
        return next(new ApiError(validationErrorString, 400))
    }
    try {
        const id = req.query.userId.replaceAll('\"', '')
        const list = await db.select().from(wishlist).where(eq(wishlist.ownerId, id))
        res.status(200).json({ list })
    } catch (error) {
        next(new ApiError("Failed to find wishlists for user.", 500))
    }
}

// export async function getWishlistByUser(req: Request, res: Response, next: NextFunction) {
//     const result = validationResult(req)
//     if (!result.isEmpty()) {
//         return next(new ApiError(JSON.stringify(result.array()), 400))
//     }
//     try {
//         const list = await db.select().from(wishlist).where(eq(wishlist.ownerId, +req.que));
//         res.status(200).json({ list })
//     } catch (error) {
//         next(new ApiError("Failed to fetch item.", 500))
//     }
// }
// export async function deleteItem(req: Request, res: Response, next: NextFunction) {
//     const result = validationResult(req)
//     if (!result.isEmpty()) {
//         return next(new ApiError(JSON.stringify(result.array()), 400))
//     }
//     try {
//         const item = await db.delete(testTable).where(eq(testTable.id, +req.params.id)).returning({
//             deleteItemId: testTable.id
//         });
//         res.status(200).json({ item })
//     } catch (error) {
//         next(new ApiError("Failed to remove item.", 500))
//     }
// }
// export async function updateItem(req: Request, res: Response, next: NextFunction) {
//     const result = validationResult(req)
//     if (!result.isEmpty()) {
//         return next(new ApiError(JSON.stringify(result.array()), 400))
//     }
//     try {
//         const item = await db.update(testTable).set(req.body).where(eq(testTable.id, +req.params.id)).returning();
//         res.status(200).json({ item })
//     } catch (error) {
//         next(new ApiError("Failed to update item.", 500))
//     }
// }