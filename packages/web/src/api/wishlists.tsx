import { ApiError, fetchWrapper } from "./fetchWrapper";
import { type dbWishlist, ERROR_CODES, type UserWishlist } from "./types";

export interface WishlistObject {
      list: UserWishlist[];
}

export async function getWishlists() {
      const res = await fetchWrapper("/api/wishlists/get-wishlists");
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper getting wishlists`, res.status);
      }
      return res.json();
}

export async function createWishlist(body: { name: string }) {
      const res = await fetchWrapper("/api/wishlists/create-wishlist", {
            method: "POST",
            body: JSON.stringify(body),
      });
      if (!res.ok) {
            let message = "Error in fetchWrapper getting request";
            if (Object.keys(ERROR_CODES).includes(String(res.status))) {
                  const code = res.status as keyof typeof ERROR_CODES;
                  message = ERROR_CODES[code];
            }
            throw new ApiError(message, res.status);
      }
      return res.json();
}

export async function removeWishlist(id: string | number) {
      const res = await fetchWrapper("/api/wishlists/remove-wishlist", {
            method: "DELETE",
            body: JSON.stringify({ id: id }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper deleting wishlist`, res.status);
      }
      return res.json();
}

export async function getWishlistsByUser(id: string): Promise<{ rows: dbWishlist[] }> {
      const res = await fetchWrapper(`/api/wishlists/get-friend-wishlist?id=${id}`);
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper getting wishlists`, res.status);
      }
      return res.json();
}
