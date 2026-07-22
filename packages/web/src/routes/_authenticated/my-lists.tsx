import { faStar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import {
      faEllipsis,
      faExclamationTriangle,
      faPencil,
      faPlus,
      faStar as faStarFilled,
      faTrash,
} from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertDescription, AlertTitle } from "@owl/lib/components/alert";
import { Badge } from "@owl/lib/components/badge";
import { Button } from "@owl/lib/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@owl/lib/components/card";
import {
      Dialog,
      DialogClose,
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
import {
      Field,
      FieldDescription,
      FieldError,
      FieldGroup,
      FieldLabel,
      FieldLegend,
      FieldSet,
} from "@owl/lib/components/field";
import { Input } from "@owl/lib/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@owl/lib/components/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@owl/lib/components/select";
import { Textarea } from "@owl/lib/components/textarea";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { ApiError } from "@/api/fetchWrapper";
import { addItem, getItems } from "@/api/items";
import type { ItemType, UserWishlist } from "@/api/types";
import { createWishlist, getWishlists, removeWishlist, type WishlistObject } from "@/api/wishlists";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
export const Route = createFileRoute("/_authenticated/my-lists")({
      component: RouteComponent,
      loader: () => {
            return {
                  crumb: "My Wishlists",
            };
      },
});

function RouteComponent() {
      const [isOpen, setIsOpen] = useState(false);
      const { data, refetch } = useSuspenseQuery<WishlistObject, Error>({
            queryKey: ["get-wishlists"],
            queryFn: getWishlists,
      });
      const [currentList, setCurrentList] = useState(data.list[0]);
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
      return (
            <div>
                  <ConfirmDeleteDialog
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        onConfirm={() => removeWishlistMutation(String(currentList.id))}
                        onCancel={() => setIsOpen(false)}
                        confirmText="Are you sure you want to delete this wishlist?"
                  />
                  <title>OWL - My Wishlists</title>
                  <div className="lg:flex space-y-4 lg:space-x-4">
                        <div className="w-full lg:w-1/3 lg:max-w-md">
                              <Card>
                                    <CardHeader>
                                          <CardTitle>My Wishlists</CardTitle>
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
                                                                        onClick={() => setIsOpen(!isOpen)}
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
                                          <table>
                                                <thead>
                                                      <tr>
                                                            <th>Item</th>
                                                            <th>Cost</th>
                                                            <th>Rating</th>
                                                            <th>URL</th>
                                                            <th>Notes</th>
                                                      </tr>
                                                </thead>
                                                <tbody>
                                                      {ItemList?.items.map((item) => (
                                                            <tr key={`${item.id}`}>
                                                                  <td>{String(item.name)}</td>
                                                                  <td>{String(item.cost)}</td>
                                                                  <td>{String(item.itemUrl ?? "—")}</td>
                                                                  <td>{String(item.rating)}</td>
                                                                  <td>{String(item.notes)}</td>
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>
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
const currencyOptions = [
      { label: "USD", value: "USD", symbol: "$" },
      { label: "EUR", value: "EUR", symbol: "€" },
];

function AddItemDialog(props: { currentList: UserWishlist; onSubmit?: () => void }) {
      const [open, setOpen] = useState(false);

      interface ItemTypeForm {
            name: string;
            currency: {
                  value: string;
                  label: string;
                  symbol: string;
            };
            cost: string;
            url?: string;
            rating: number;
            notes?: string;
      }
      const {
            register,
            handleSubmit,
            formState: { errors, isValid },
            reset,
            watch,
            control,
      } = useForm<ItemTypeForm>({
            defaultValues: {
                  currency: currencyOptions[0],
                  cost: "0",
                  rating: 0,
            },
      });

      const onSubmit: SubmitHandler<ItemTypeForm> = (data) => {
            if (isValid) {
                  const { cost, currency, ...rest } = data;
                  const costNumber = Number(cost);
                  const currencyVal = currency.value;
                  const body = {
                        ...rest,
                        cost: costNumber,
                        currency: currencyVal,
                        wishlistId: Number(props.currentList.id),
                  };
                  addNewItem(body);
            } else {
                  console.log(errors);
            }
      };
      const {
            mutate: addNewItem,
            error,
            reset: resetApiCall,
      } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (formData: ItemType) => addItem(formData),
            onSuccess: () => {
                  setOpen(false);
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
                  <DialogTrigger render={<Button variant="outline" className="mx-2" />}>
                        <FontAwesomeIcon icon={faPlus} /> Add Item
                  </DialogTrigger>
                  <DialogContent>
                        {error && <AlertError error={error} />}
                        <form onSubmit={handleSubmit(onSubmit)}>
                              <FieldSet>
                                    <FieldLegend>Add an Item</FieldLegend>
                                    <FieldDescription>
                                          Add an item to your wishlist. Only item name is required but adding more
                                          details makes it easier for your friends and family to know what you want.
                                    </FieldDescription>
                                    <FieldGroup className="flex flex-row flex-wrap">
                                          <Field className="lg:min-w-1/2">
                                                <FieldLabel>Item name:</FieldLabel>
                                                <Input
                                                      {...register("name", { required: "All items must have a name." })}
                                                      aria-invalid={errors.cost ? "true" : "false"}
                                                />
                                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                          </Field>
                                          <Field className="w-1/2">
                                                <FieldLabel>Cost:</FieldLabel>
                                                <InputGroup>
                                                      <InputGroupAddon>
                                                            <InputGroupText>{watch("currency")?.symbol}</InputGroupText>
                                                      </InputGroupAddon>
                                                      <Controller
                                                            name="cost"
                                                            control={control}
                                                            render={({ field }) => (
                                                                  <InputGroupInput
                                                                        aria-invalid={errors.cost ? "true" : "false"}
                                                                        placeholder="0.00"
                                                                        value={field.value}
                                                                        onBlur={(e) =>
                                                                              field.onChange(
                                                                                    Number(e.target.value).toFixed(2),
                                                                              )
                                                                        }
                                                                        onChange={field.onChange}
                                                                  />
                                                            )}
                                                      />
                                                      <InputGroupAddon align="inline-end">
                                                            <Controller
                                                                  name="currency"
                                                                  control={control}
                                                                  render={({ field }) => (
                                                                        <Select
                                                                              items={currencyOptions}
                                                                              aria-label="currency"
                                                                              value={field.value}
                                                                              onValueChange={field.onChange}
                                                                        >
                                                                              <SelectTrigger className="border-none">
                                                                                    <SelectValue />
                                                                              </SelectTrigger>
                                                                              <SelectContent>
                                                                                    <SelectGroup>
                                                                                          {currencyOptions.map(
                                                                                                (currencyOption) => (
                                                                                                      <SelectItem
                                                                                                            value={
                                                                                                                  currencyOption
                                                                                                            }
                                                                                                            key={
                                                                                                                  currencyOption.label
                                                                                                            }
                                                                                                      >
                                                                                                            {
                                                                                                                  currencyOption.label
                                                                                                            }
                                                                                                      </SelectItem>
                                                                                                ),
                                                                                          )}
                                                                                    </SelectGroup>
                                                                              </SelectContent>
                                                                        </Select>
                                                                  )}
                                                            />
                                                      </InputGroupAddon>
                                                </InputGroup>
                                                {errors.cost && <FieldError>{errors.cost.message}</FieldError>}
                                          </Field>
                                          <Field className="w-1/4 flex-0">
                                                <FieldLabel htmlFor="rating">Rating:</FieldLabel>
                                                <Controller
                                                      name="rating"
                                                      control={control}
                                                      render={({ field }) => (
                                                            <div className="flex">
                                                                  {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Button
                                                                              aria-label={`${star} star(s)`}
                                                                              variant="ghost"
                                                                              size="icon"
                                                                              className="hover:bg-transparent"
                                                                              key={star}
                                                                              onClick={() =>
                                                                                    field.onChange(
                                                                                          star !== watch("rating")
                                                                                                ? star
                                                                                                : 0,
                                                                                    )
                                                                              }
                                                                        >
                                                                              <FontAwesomeIcon
                                                                                    icon={
                                                                                          Number(watch("rating")) < star
                                                                                                ? faStar
                                                                                                : faStarFilled
                                                                                    }
                                                                              />
                                                                        </Button>
                                                                  ))}
                                                            </div>
                                                      )}
                                                />
                                          </Field>
                                          <Field>
                                                <FieldLabel>Item URL:</FieldLabel>
                                                <Input
                                                      {...register("url")}
                                                      aria-invalid={errors.url ? "true" : "false"}
                                                />
                                                {errors.url && <FieldError>{errors.url.message}</FieldError>}
                                          </Field>
                                          <Field>
                                                <FieldLabel>Notes:</FieldLabel>
                                                <Textarea
                                                      {...register("notes")}
                                                      aria-invalid={errors.url ? "true" : "false"}
                                                />
                                          </Field>
                                    </FieldGroup>
                                    <div className="flex space-x-2 justify-end">
                                          <DialogClose className="w-full lg:w-1/3" render={<Button variant="link" />}>
                                                Cancel
                                          </DialogClose>
                                          <Button className="w-full lg:w-1/3" type="submit">
                                                Add Item
                                          </Button>
                                    </div>
                              </FieldSet>
                        </form>
                  </DialogContent>
            </Dialog>
      );
}

function AlertError(props: { error?: unknown }) {
      const { error } = props;
      const errorObject =
            error instanceof ApiError
                  ? { status: `Error Code ${error.code}`, message: error.message }
                  : {
                          name: "Unknown Error",
                          message: "There was an error trying to process this request, please try again",
                    };
      console.log(errorObject);

      return (
            <Alert className="bg-red-50 border border-red-400 w-11/12 text-red-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <AlertTitle>{errorObject.status}:</AlertTitle>
                  <AlertDescription className="text-red-950">{errorObject.message}</AlertDescription>
            </Alert>
      );
}
