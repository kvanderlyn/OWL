import { faExternalLink, faStar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import {
      faEllipsis,
      faPencil,
      faPlus,
      faStar as faStarFilled,
      faTrash,
} from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@owl/lib/components/badge";
import { Button } from "@owl/lib/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@owl/lib/components/card";
import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
} from "@owl/lib/components/dialog";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuGroup,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@owl/lib/components/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@owl/lib/components/field";
import { Input } from "@owl/lib/components/input";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { deleteItem, getItems } from "@/api/items";
import { createWishlist, getWishlists, removeWishlist, type WishlistObject } from "@/api/wishlists";
import { AddItemDialog, EditItemDialog } from "@/components/AddEditItemDialog";
import AlertError from "@/components/AlertError";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { DataTable, SortableHeader } from "@/components/DataTable";
import EditItemMenu from "@/components/EditItemMenu";
import UserAvatar from "@/components/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import type { dbItemType } from "../../../../db/src";

export const Route = createFileRoute("/_authenticated/my-lists")({
      component: RouteComponent,
      beforeLoad: () => ({
            getTitle: () => "My Wishlists",
      }),
      loader: () => {
            return {
                  crumb: "My Wishlists",
            };
      },
});

function RouteComponent() {
      const { user } = useAuthStore();
      const [deleteWishlistIsOpen, setDeleteWishlistIsOpen] = useState(false);
      const [editItemIsOpen, setEditItemIsOpen] = useState(false);
      const [deleteItemIsOpen, setDeleteItemIsOpen] = useState(false);
      const { data, refetch } = useSuspenseQuery<WishlistObject, Error>({
            queryKey: ["get-wishlists"],
            queryFn: getWishlists,
      });
      const [currentList, setCurrentList] = useState(data.list[0]);
      const [currentItem, setCurrentItem] = useState<dbItemType>();
      const { mutate: removeWishlistMutation } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: (id: string | number) => removeWishlist(id),
            onSuccess: refetch,
      });
      const {
            data: ItemList,
            isLoading: itemsLoading,
            refetch: itemRefetch,
      } = useQuery({
            queryKey: ["get-items", currentList.id],
            queryFn: () => getItems(Number(currentList.id)),
      });
      const { mutate: removeItem } = useMutation({
            mutationKey: ["remove-item"],
            mutationFn: (id: number) => deleteItem(id),
            onSuccess: () => {
                  refetch();
                  itemRefetch();
            },
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
                              <div className="md:max-w-40 overflow-clip text-ellipsis">
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
                        return <div style={{ whiteSpace: "normal" }}>{String(cell.getValue())}</div>;
                  },
            },
            {
                  id: "actions",
                  cell: ({ row }) => {
                        const itemData = row.original;
                        return (
                              <EditItemMenu
                                    item={itemData}
                                    onEdit={() => {
                                          setCurrentItem(itemData);
                                          setEditItemIsOpen(true);
                                    }}
                                    onDelete={() => {
                                          setCurrentItem(itemData);
                                          setDeleteItemIsOpen(true);
                                    }}
                              />
                        );
                  },
            },
      ];

      return (
            <div className="typeset typeset-docs px-2">
                  <h2>
                        <div className="flex flex-row space-x-2">
                              <UserAvatar userId={user?.id} userName={user?.name} />
                              <div>My Wishlists</div>
                        </div>
                  </h2>
                  <ConfirmDeleteDialog
                        isOpen={deleteWishlistIsOpen}
                        setIsOpen={setDeleteWishlistIsOpen}
                        onConfirm={() => removeWishlistMutation(String(currentList.id))}
                        onCancel={() => setDeleteWishlistIsOpen(false)}
                        confirmText="Are you sure you want to delete this wishlist?"
                  />
                  <ConfirmDeleteDialog
                        isOpen={deleteItemIsOpen}
                        setIsOpen={setDeleteItemIsOpen}
                        onConfirm={() => {
                              if (currentItem !== undefined) {
                                    removeItem(currentItem.id);
                              }
                              setDeleteItemIsOpen(false);
                        }}
                        onCancel={() => setDeleteItemIsOpen(false)}
                        confirmText={`Are you sure you want to delete ${currentItem?.name ?? "this item"}?`}
                  />
                  <EditItemDialog
                        open={editItemIsOpen}
                        setOpen={setEditItemIsOpen}
                        currentItem={currentItem}
                        onSubmit={() => {
                              refetch();
                              itemRefetch();
                        }}
                  />
                  <title>OWL - My Wishlists</title>
                  <div className="lg:flex space-y-4 lg:space-x-4">
                        <div className="w-full lg:w-1/4 lg:max-w-sm">
                              <Card>
                                    <CardHeader>
                                          <CardTitle>Lists</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                          {data.list.map((wl) => (
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
                                                                  <div className="mx-2">
                                                                        <Badge
                                                                              className={`px-3 ${Number(wl.id) === Number(currentList.id) ? "bg-indigo-700" : ""}`}
                                                                        >
                                                                              {wl.item_count}
                                                                        </Badge>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </Button>
                                          ))}
                                    </CardContent>
                                    <CardFooter>
                                          <AddWishlistDialog onSubmit={refetch} />
                                    </CardFooter>
                              </Card>
                        </div>
                        <Card className="w-full">
                              <CardHeader>
                                    <CardTitle className="flex justify-between">
                                          <span>{String(currentList.name)}</span>
                                          <div>
                                                <AddItemDialog
                                                      currentList={currentList}
                                                      onSubmit={() => {
                                                            refetch();
                                                            itemRefetch();
                                                      }}
                                                />
                                                <DropdownMenu>
                                                      <DropdownMenuTrigger
                                                            title="Wishlist Options"
                                                            className="text-indigo-600 focus:bg-white"
                                                      >
                                                            <FontAwesomeIcon icon={faEllipsis} />
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuGroup>
                                                                  <DropdownMenuItem className="hover:cursor-pointer">
                                                                        <FontAwesomeIcon icon={faPencil} />
                                                                        Rename Wishlist
                                                                  </DropdownMenuItem>
                                                                  <DropdownMenuSeparator />
                                                                  <DropdownMenuItem
                                                                        className="hover:cursor-pointer"
                                                                        onClick={() =>
                                                                              setDeleteWishlistIsOpen(
                                                                                    !deleteWishlistIsOpen,
                                                                              )
                                                                        }
                                                                  >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                        Delete Wishlist
                                                                  </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                      </DropdownMenuContent>
                                                </DropdownMenu>
                                          </div>
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

function AddWishlistDialog(props: { onSubmit?: () => void }) {
      interface NewWishlistInterface {
            name: string;
      }
      const [open, setOpen] = useState(false);

      const {
            register,
            handleSubmit,
            formState: { errors, isValid },
            reset,
      } = useForm<NewWishlistInterface>({ mode: "onBlur" });
      const onSubmit: SubmitHandler<NewWishlistInterface> = (data) => {
            if (isValid) {
                  makeWishlist(data);
            } else {
                  console.log(errors);
            }
      };

      const {
            mutate: makeWishlist,
            error,
            reset: resetApiCall,
      } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (wishlistData: NewWishlistInterface) => createWishlist(wishlistData),
            onSuccess: () => {
                  setOpen(false);
                  reset();
                  props.onSubmit?.();
            },
      });

      return (
            <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        reset();
                        resetApiCall();
                  }}
            >
                  <DialogTrigger onClick={() => setOpen(!open)} render={<Button className="w-full" />}>
                        <span>
                              <FontAwesomeIcon icon={faPlus} /> Add New Wishlist
                        </span>
                  </DialogTrigger>
                  <DialogContent>
                        {error && <AlertError error={error} />}

                        <form onSubmit={handleSubmit(onSubmit)}>
                              <DialogHeader>
                                    <DialogTitle>Add a new Wishlist</DialogTitle>
                                    <DialogDescription>
                                          Create a new wishlist to populate with items you would like.
                                    </DialogDescription>
                              </DialogHeader>
                              <FieldGroup className="my-2">
                                    <Field>
                                          <FieldLabel htmlFor="name">Wishlist name:</FieldLabel>
                                          <Input
                                                {...register("name", { required: "Wishlist name is required" })}
                                                type="text"
                                                autoComplete="off"
                                          />
                                          {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                    </Field>
                              </FieldGroup>
                              <DialogFooter>
                                    <Button type="submit" className={"w-full"}>
                                          Create Wishlist
                                    </Button>
                              </DialogFooter>
                        </form>
                  </DialogContent>
            </Dialog>
      );
}
