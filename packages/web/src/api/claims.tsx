import { ApiError, fetchWrapper } from "./fetchWrapper";
import { type dbClaimsList, ERROR_CODES } from "./types";

export async function addClaim(id: number) {
      const res = await fetchWrapper("/api/claims/add-claim", {
            method: "POST",
            body: JSON.stringify({ id: id }),
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

export async function getClaims(wishlistId: number): Promise<{ rows: dbClaimsList[] }> {
      const res = await fetchWrapper(`/api/claims/get-claims-by-wishlist?wishlistId=${wishlistId}`);
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
export async function deleteClaim(id: number) {
      const res = await fetchWrapper(`/api/claims/delete-claim`, {
            method: "DELETE",
            body: JSON.stringify({
                  id: id,
            }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in fetchWrapper removing claim`, res.status);
      }
      return res.json();
}
