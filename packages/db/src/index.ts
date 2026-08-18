export { db, pool as client } from "./client";
export * as authSchema from "./schema/auth-schema";
export { claims, type dbClaimsType } from "./schema/claims-schema";
export { type dbFriendType, friends } from "./schema/friend-schema";
export { type dbItemType, items } from "./schema/item-schema";
export { type dbWishlistType, wishlist } from "./schema/wishlist-schema";
