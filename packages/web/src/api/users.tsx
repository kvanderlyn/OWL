import { ApiError, fetchWrapper } from "./fetchWrapper";
import type { userDetails } from "./types";

export async function getUserByUsername(username: string): Promise<{ rows: userDetails[] }> {
      const normalized_un = username.toLowerCase();
      const res = await fetchWrapper(`/api/users/get-user-by-username?username=${normalized_un}`);
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper getting users`, res.status);
      }
      return res.json();
}
