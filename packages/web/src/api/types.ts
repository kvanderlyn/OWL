import type { dbFriendType, dbItemType, dbWishlistType } from "../../../db/src";

export const ERROR_CODES = {
      400: "There was a problem with your request",
      401: "User is not authorized to access this resource",
      403: "User is forbidden",
      404: "Not found",
      408: "Request timed out, please try again",
};

export interface newItem extends Omit<dbItemType, "ownerId" | "id" | "createdAt" | "updatedAt"> {
      currency: string;
}
export interface UpdateItemBody {
      name?: string | null;
      cost?: number | null;
      currency?: string | null;
      rating?: number | null;
      itemUrl?: string | null;
      notes?: string | null;
}
export interface ClaimItem extends dbItemType {
      claimed: boolean;
      clamedBy?: string;
      dateClaimed?: Date;
      claimExp?: Date;
}

export interface UserWishlist {
      id: string;
      name: string;
      item_count: number;
}

export interface friendResult {
      id: string;
      name: string;
      username: string;
      isApproved: boolean | null;
      friendRequest: number | string | null;
      requesterId: string | null;
}

export interface userDetails {
      id: string;
      name: string;
      username: string;
}

export type dbFriend = dbFriendType;

export type dbWishlist = dbWishlistType;

export interface friendListItem extends userDetails {
      userId: string;
      isApproved: boolean;
}
