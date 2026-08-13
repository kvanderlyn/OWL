import type { dbItemType } from "../../../db/src/index";
import { ApiError, fetchWrapper } from "./fetchWrapper";
import { ERROR_CODES, type newItem, type UpdateItemBody } from "./types";

export async function addItem(body: newItem) {
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

export async function getItems(wishlistId: number): Promise<{ items: dbItemType[] }> {
      const res = await fetchWrapper(`/api/items/get-items?wishlistId=${wishlistId}`);
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper getting items`, res.status);
      }
      return res.json();
}

export async function editItem(id: number, body: UpdateItemBody): Promise<{ item: dbItemType }> {
      const res = await fetchWrapper(`/api/items/update-item`, {
            method: "PUT",
            body: JSON.stringify({
                  id: id,
                  ...body,
            }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper  updating Item`, res.status);
      }
      return res.json();
}

export async function deleteItem(id: number) {
      const res = await fetchWrapper(`/api/items/delete-item`, {
            method: "DELETE",
            body: JSON.stringify({
                  id: id,
            }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper removing Item`, res.status);
      }
      return res.json();
}
