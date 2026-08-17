import { ApiError, fetchWrapper } from "./fetchWrapper";
import type { dbFriend, friendListItem, friendResult } from "./types";

export async function searchUsers(data: { keyword: string; type: string }): Promise<{ rows: friendResult[] }> {
      const res = await fetchWrapper(`/api/friends/find-friends?${data.type}=${data.keyword}`);
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper searching users`, res.status);
      }
      return res.json();
}
export async function addFriend(id: string): Promise<{ rows: dbFriend[] }> {
      const res = await fetchWrapper(`/api/friends/add-friend`, { method: "POST", body: JSON.stringify({ id: id }) });
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper adding friend`, res.status);
      }
      return res.json();
}

export async function approveFriend(id: string): Promise<{ rows: dbFriend[] }> {
      const res = await fetchWrapper(`/api/friends/update-friend-request`, {
            method: "PUT",
            body: JSON.stringify({ id: id, isApproved: true }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper updating friend request`, res.status);
      }
      return res.json();
}

export async function removeFriend(id: string): Promise<{ rows: dbFriend[] }> {
      const res = await fetchWrapper(`/api/friends/remove-friend`, {
            method: "DELETE",
            body: JSON.stringify({ id: id }),
      });
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper removing friend`, res.status);
      }
      return res.json();
}
export async function getFriends(): Promise<{ rows: friendListItem[] }> {
      const res = await fetchWrapper(`/api/friends/get-friends`);
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper getting friends`, res.status);
      }
      return res.json();
}

export async function getFriendRequests(): Promise<{ rows: friendListItem[] }> {
      const res = await fetchWrapper(`/api/friends/get-friend-requests`);
      if (!res.ok) {
            throw new ApiError(`Error in in fetch wrapper getting friend requests`, res.status);
      }
      return res.json();
}
