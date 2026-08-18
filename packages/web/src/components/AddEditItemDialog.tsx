import { faStar } from "@awesome.me/kit-25b3efc452/icons/classic/light";
import { faPlus, faStar as faStarFilled } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@owl/lib/components/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@owl/lib/components/dialog";
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
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { addItem, editItem } from "@/api/items";
import type { newItem, UpdateItemBody, UserWishlist } from "@/api/types";
import type { dbItemType } from "../../../db/src";
import AlertError from "./AlertError";

interface ItemTypeForm {
      name: string;
      currency: {
            value: string;
            label: string;
            symbol: string;
      };
      cost: string;
      itemUrl: string;
      rating: number;
      notes: string;
}

export function AddItemDialog(props: { currentList: UserWishlist; onSubmit?: () => void }) {
      const [open, setOpen] = useState(false);

      const onSubmit: SubmitHandler<ItemTypeForm> = (data) => {
            const { cost, currency, ...rest } = data;
            const costNumber = Number(cost);
            const currencyVal = currency.value;
            const body = {
                  ...rest,
                  cost: costNumber,
                  currency: currencyVal,
                  wishlistId: Number(props.currentList.id),
                  isActive: true,
            };
            addNewItem(body);
      };
      const {
            mutate: addNewItem,
            error,
            reset: resetApiCall,
      } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (formData: newItem) => addItem(formData),
            onSuccess: () => {
                  setOpen(false);
                  props.onSubmit?.();
            },
      });
      const modalDetails = {
            title: "Add an Item",
            description:
                  " Add an item to your wishlist. Only item name is required but adding more details makes it easier for your friends and family to know what you want.",
            actionLabel: "Add Item",
      };

      return (
            <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        resetApiCall();
                  }}
            >
                  <DialogTrigger render={<Button variant="outline" className="mx-2" />}>
                        <FontAwesomeIcon icon={faPlus} /> Add Item
                  </DialogTrigger>
                  <DialogContent>
                        {error && <AlertError error={error} />}
                        <AddEditForm onSubmit={onSubmit} {...modalDetails} />
                  </DialogContent>
            </Dialog>
      );
}

export function EditItemDialog(props: {
      currentItem: dbItemType | undefined;
      onSubmit?: () => void;
      open: boolean;
      setOpen: (open: boolean) => void;
}) {
      const { open, setOpen, currentItem } = props;
      const onSubmit: SubmitHandler<ItemTypeForm> = (data) => {
            const { cost, currency, ...rest } = data;
            const costNumber = Number(cost);
            const currencyVal = currency.value;
            const body = {
                  ...rest,
                  cost: costNumber,
                  currency: currencyVal,
                  id: Number(props.currentItem?.id),
            };
            editItemMutation(body);
      };
      const {
            mutate: editItemMutation,
            error,
            reset: resetApiCall,
      } = useMutation({
            mutationKey: ["new-wishlist"],
            mutationFn: async (formData: UpdateItemBody) =>
                  props.currentItem ? editItem(props.currentItem.id, formData) : console.log("No item selected"),
            onSuccess: () => {
                  setOpen(false);
                  props.onSubmit?.();
            },
      });
      const modalDetails = {
            title: "Edit an Item",
            description:
                  "Edit an item on your wishlist. Any field value can be changed, but items must have a name in order to be saved.",
            actionLabel: "Save Changes",
      };
      return (
            <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        resetApiCall();
                  }}
            >
                  <DialogContent>
                        {error && <AlertError error={error} />}
                        <AddEditForm
                              onSubmit={onSubmit}
                              defaultValues={currentItem ? dbItemToFormItem(currentItem) : undefined}
                              {...modalDetails}
                        />
                  </DialogContent>
            </Dialog>
      );
}

const currencyOptions = [
      { label: "USD", value: "USD", symbol: "$" },
      { label: "EUR", value: "EUR", symbol: "€" },
];

export function AddEditForm(props: {
      onSubmit: (props: ItemTypeForm) => void;
      defaultValues?: ItemTypeForm;
      title: string;
      description: string;
      actionLabel: string;
}) {
      const {
            register,
            handleSubmit,
            formState: { errors, isValid },
            reset,
            watch,
            control,
      } = useForm<ItemTypeForm>({
            defaultValues: props.defaultValues ?? {
                  currency: currencyOptions[0],
                  cost: "0",
                  rating: 0,
            },
      });
      const onSubmit: SubmitHandler<ItemTypeForm> = (data) => {
            if (isValid) {
                  props.onSubmit(data);
                  reset();
            } else {
                  console.log(errors);
            }
      };
      return (
            <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldSet>
                        <FieldLegend>{props.title}</FieldLegend>
                        <FieldDescription>{props.description}</FieldDescription>
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
                                                                  field.onChange(Number(e.target.value).toFixed(2))
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
                                                                              {currencyOptions.map((currencyOption) => (
                                                                                    <SelectItem
                                                                                          value={currencyOption}
                                                                                          key={currencyOption.label}
                                                                                    >
                                                                                          {currencyOption.label}
                                                                                    </SelectItem>
                                                                              ))}
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
                                                                              star !== watch("rating") ? star : 0,
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
                                    <Input {...register("itemUrl")} aria-invalid={errors.itemUrl ? "true" : "false"} />
                                    {errors.itemUrl && <FieldError>{errors.itemUrl.message}</FieldError>}
                              </Field>
                              <Field>
                                    <FieldLabel>Notes:</FieldLabel>
                                    <Textarea {...register("notes")} aria-invalid={errors.itemUrl ? "true" : "false"} />
                              </Field>
                        </FieldGroup>
                        <div className="flex space-x-2 justify-end">
                              <DialogClose className="w-full lg:w-1/3" render={<Button variant="link" />}>
                                    Cancel
                              </DialogClose>
                              <Button className="w-full lg:w-1/3" type="submit">
                                    {props.actionLabel}
                              </Button>
                        </div>
                  </FieldSet>
            </form>
      );
}

function dbItemToFormItem(item: dbItemType): ItemTypeForm {
      const { currency, cost, itemUrl, rating, notes, ...rest } = item;
      const currencyObject = currencyOptions.find((opt) => opt.value === currency) ?? currencyOptions[0];
      const costString = String(cost);
      const itemUrlString = itemUrl ?? "";
      const ratingNumber = Number(rating ?? 0);

      const notesString = notes ?? "";
      return {
            currency: currencyObject,
            cost: costString,
            itemUrl: itemUrlString,
            rating: ratingNumber,
            notes: notesString,
            ...rest,
      };
}
