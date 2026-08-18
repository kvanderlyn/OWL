import { faExternalLink, faStar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import { faHeartSlash, faStar as faStarFilled } from "@awesome.me/kit-25b3efc452/icons/classic/solid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@owl/lib/components/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { addClaim, deleteClaim, getClaims } from "@/api/claims";
import { getFriends } from "@/api/friends";
import type { dbClaimsList } from "@/api/types";
import { getUserByUsername } from "@/api/users";
import { getWishlistsByUser } from "@/api/wishlists";
import AlertError from "@/components/AlertError";
import { DataTable, SortableHeader } from "@/components/DataTable";
import UserAvatar from "@/components/UserAvatar";
import { router } from "@/router";

export const Route = createFileRoute("/_authenticated/friends/$username")({
      loader: async ({ params }) => {
            const data = (await getUserByUsername(params.username)).rows[0];
            const wishlist = (await getWishlistsByUser(data.id)).rows;
            return { data, wishlist, crumb: data.name };
      },
      component: RouteComponent,
});

function RouteComponent() {
      const {
            data: { name, id },
            wishlist,
      } = Route.useLoaderData();
      const [currentList, setCurrentList] = useState(wishlist[0]);
      useEffect(() => {
            setCurrentList(wishlist[0]);
      }, [wishlist]);

      const {
            data: claimsList,
            isLoading: claimsLoading,
            refetch,
      } = useQuery({
            queryKey: ["get-claims", currentList.id],
            queryFn: () => getClaims(Number(currentList.id)),
      });
      const { data: friendsList } = useQuery({
            queryKey: ["get-friends"],
            queryFn: () => getFriends(),
      });
      const { mutate: makeClaim, error } = useMutation({
            mutationKey: ["new-claim"],
            mutationFn: async (id: number) => addClaim(id),
            onSuccess: () => {
                  refetch();
            },
      });
      const { mutate: revokeClaim, error: deleteClaimError } = useMutation({
            mutationKey: ["revoke-claim"],
            mutationFn: async (id: number) => deleteClaim(id),
            onSuccess: () => {
                  refetch();
            },
      });
      const userWishlistCols: ColumnDef<dbClaimsList>[] = [
            {
                  accessorKey: "name",
                  header: ({ column }) => (
                        <SortableHeader
                              desc={column.getIsSorted()}
                              onClick={() =>
                                    column.toggleSorting(
                                          column.getIsSorted() === "desc" ? undefined : column.getIsSorted() === "asc",
                                    )
                              }
                              title="Item"
                        />
                  ),
            },
            {
                  accessorKey: "cost",
                  header: ({ column }) => (
                        <SortableHeader
                              desc={column.getIsSorted()}
                              onClick={() =>
                                    column.toggleSorting(
                                          column.getIsSorted() === "desc" ? undefined : column.getIsSorted() === "asc",
                                    )
                              }
                              title="Cost"
                        />
                  ),
                  cell: ({ cell, row }) => (
                        <div>
                              {row.original.currency !== "EUR" ? "$" : "€"}
                              {Number(cell.getValue()).toFixed(2)}
                        </div>
                  ),
            },
            {
                  accessorKey: "rating",
                  header: ({ column }) => (
                        <SortableHeader
                              desc={column.getIsSorted()}
                              onClick={() =>
                                    column.toggleSorting(
                                          column.getIsSorted() === "desc" ? undefined : column.getIsSorted() === "asc",
                                    )
                              }
                              title="Rating"
                        />
                  ),
                  cell: ({ cell }) => (
                        <div>
                              {Array.from({ length: 5 }, (_, index) => index).map((item) => (
                                    <span key={item}>
                                          <FontAwesomeIcon
                                                icon={Number(cell.getValue()) > item ? faStarFilled : faStar}
                                          />
                                    </span>
                              ))}
                        </div>
                  ),
            },
            {
                  accessorKey: "updatedAt",
                  header: ({ column }) => (
                        <SortableHeader
                              desc={column.getIsSorted()}
                              onClick={() =>
                                    column.toggleSorting(
                                          column.getIsSorted() === "desc" ? undefined : column.getIsSorted() === "asc",
                                    )
                              }
                              title="Updated"
                        />
                  ),
                  cell: ({ cell }) => {
                        return cell.getValue() ? new Date(String(cell.getValue())).toLocaleDateString() : "";
                  },
            },
            {
                  accessorKey: "itemUrl",
                  header: "Link",
                  cell: ({ cell }) => {
                        return cell.getValue() ? (
                              <div className="max-w-40 overflow-clip text-ellipsis">
                                    <a
                                          className="text-indigo-600 hover:underline"
                                          target="_blank"
                                          rel="noreferrer"
                                          href={String(cell.getValue())}
                                    >
                                          <FontAwesomeIcon icon={faExternalLink} /> {String(cell.getValue())}
                                    </a>
                              </div>
                        ) : (
                              ""
                        );
                  },
            },
            {
                  accessorKey: "notes",
                  header: "Notes",
                  cell: ({ cell }) => {
                        return (
                              <div style={{ whiteSpace: "normal" }} className="min-w-20">
                                    {String(cell.getValue())}
                              </div>
                        );
                  },
            },
            {
                  id: "Claim",
                  header: "Claim",
                  cell: ({ row }) => {
                        const itemData = row.original;
                        const claimedBy = itemData?.claims?.claimedBy;
                        switch (claimedBy) {
                              case "You":
                                    return (
                                          <Button
                                                variant={"outline"}
                                                onClick={() => revokeClaim(itemData.id)}
                                                className={"w-full"}
                                          >
                                                Remove Claim
                                          </Button>
                                    );
                              case "Unknown User":
                                    return (
                                          <Button variant={"outline"} disabled className={"w-full"}>
                                                {claimedBy}
                                          </Button>
                                    );
                              case undefined:
                                    return (
                                          <Button
                                                variant={"outline"}
                                                onClick={() => makeClaim(itemData.id)}
                                                className={"w-full"}
                                          >
                                                Claim
                                          </Button>
                                    );
                              default: {
                                    const friend = friendsList?.rows.find((friend) => friend.userId === claimedBy);
                                    if (friend) {
                                          return (
                                                <Button
                                                      variant={"link"}
                                                      className={"text-indigo-600 w-full"}
                                                      onClick={() =>
                                                            router.navigate({
                                                                  to: "/friends/$username",
                                                                  params: { username: friend?.username },
                                                            })
                                                      }
                                                >
                                                      {friend?.name}
                                                </Button>
                                          );
                                    }
                                    return (
                                          <Button variant={"outline"} className={"w-full"} disabled>
                                                {claimedBy}
                                          </Button>
                                    );
                              }
                        }
                  },
            },
      ];
      return (
            <div className="typeset typeset-docs px-2" key={id}>
                  <h2>
                        <div className="flex flex-row space-x-2">
                              <UserAvatar userId={id} userName={name} />
                              <div>{`${name}'s Wishlists`}</div>
                              <Button variant={"ghost"} className="px-0 py-0 hover:text-red-700">
                                    <div className="hover:w-fit w-6 overflow-clip px-2 py-1">
                                          <FontAwesomeIcon icon={faHeartSlash} className="mr-2" />
                                          <span className="text-black!">Remove Friend</span>
                                    </div>
                              </Button>
                        </div>
                  </h2>
                  {error && <AlertError error={error} />}
                  <div className="lg:flex space-y-4 lg:space-x-4">
                        <div className="w-full lg:w-1/4 lg:max-w-sm">
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Lists</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                          {wishlist.map((wl) => (
                                                <Button
                                                      onClick={() => {
                                                            setCurrentList(wl);
                                                      }}
                                                      key={String(wl.id)}
                                                      variant="ghost"
                                                      className={`w-full py-6 border ${Number(wl.id) === Number(currentList.id) ? "bg-zinc-100 text-indigo-600 hover:text-indigo-600" : "font-normal"}`}
                                                >
                                                      <div className="flex items-center w-full">
                                                            <div className="text-base w-full flex-1">
                                                                  {String(wl.name)}
                                                            </div>
                                                            <div className="flex items-center">
                                                                  <div className="mx-2"></div>
                                                            </div>
                                                      </div>
                                                </Button>
                                          ))}
                                    </CardContent>
                              </Card>
                        </div>
                        <Card className="w-full">
                              <CardHeader>
                                    <CardTitle className="flex justify-between">
                                          <span>{String(currentList.name)}</span>
                                          <div></div>
                                    </CardTitle>
                              </CardHeader>
                              <CardContent>
                                    {claimsLoading ? (
                                          <div>Loading</div>
                                    ) : (
                                          <DataTable
                                                columns={userWishlistCols}
                                                data={claimsList ? claimsList?.rows : []}
                                          />
                                    )}
                              </CardContent>
                        </Card>
                  </div>
            </div>
      );
}
