export const ERROR_CODES = {
      400: "There was a problem with your request",
      401: "User is not authorized to access this resource",
      403: "User is forbidden",
      404: "Not found",
      408: "Request timed out, please try again",
};

export interface ItemType {
      name: string;
      currency: string;
      cost: number;
      url?: string;
      rating?: number;
      notes?: string;
      wishlistId: number;
}

export interface UserWishlist {
      id: string;
      name: string;
      item_count: number;
}
