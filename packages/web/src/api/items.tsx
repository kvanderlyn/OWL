import type { items } from "../../../db/src/index";
import { ApiError, fetchWrapper } from "./fetchWrapper";
import { ERROR_CODES, type ItemType } from "./types";

export async function addItem(body: ItemType) {
      const res = await fetchWrapper("/api/items/add-item", {
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

export async function getItems(wishlistId: number): Promise<{ items: (typeof items)[] }> {
      const res = await fetchWrapper(`/api/items/get-items?wishlistId=${wishlistId}`);
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper getting wishlists`, res.status);
      }
      return res.json();
}
