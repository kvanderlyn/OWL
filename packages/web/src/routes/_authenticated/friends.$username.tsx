import { faStar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import { faHeartSlash, faStar as faStarFilled } from "@awesome.me/kit-25b3efc452/icons/classic/solid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@owl/lib/components/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getItems } from "@/api/items";
import { getUserByUsername } from "@/api/users";
import { getWishlistsByUser } from "@/api/wishlists";
import { DataTable, SortableHeader } from "@/components/DataTable";
import UserAvatar from "@/components/UserAvatar";
import type { dbItemType } from "../../../../db/src";

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
            data: { name, username, id },
            wishlist,
      } = Route.useLoaderData();
      const [currentList, setCurrentList] = useState(wishlist[0]);
      useEffect(() => {
            setCurrentList(wishlist[0]);
      }, [wishlist]);

      const { data: ItemList, isLoading: itemsLoading } = useQuery({
            queryKey: ["get-items", currentList.id],
            queryFn: () => getItems(Number(currentList.id)),
      });

      const userWishlistCols: ColumnDef<dbItemType>[] = [
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
                              <a className="text-indigo-600 hover:underline" href={String(cell.getValue())}>
                                    {String(cell.getValue())}
                              </a>
                        ) : (
                              ""
                        );
                  },
            },
            {
                  accessorKey: "notes",
                  header: "Notes",
                  cell: ({ cell }) => {
                        return <div style={{ whiteSpace: "normal" }}>{String(cell.getValue())}</div>;
                  },
            },
            {
                  id: "Claim",
                  header: "Claim Item",
                  cell: ({ row }) => {
                        const itemData = row.original;
                        return <div>Claim {itemData.id}!</div>;
                  },
            },
            {
                  id: "claimed_by",
                  header: "Claimed By",
                  cell: () => {
                        return <div>{username}</div>;
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
                                    {itemsLoading ? (
                                          <div>Loading</div>
                                    ) : (
                                          <DataTable
                                                columns={userWishlistCols}
                                                data={ItemList ? ItemList?.items : []}
                                          />
                                    )}
                              </CardContent>
                        </Card>
                  </div>
            </div>
      );
}
