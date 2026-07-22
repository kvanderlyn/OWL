import type { ColumnDef } from "@tanstack/react-table";
import type { dbItemType } from "../../../db/src";

export const userWishlistCols: ColumnDef<dbItemType>[] = [
      { accessorKey: "name", header: "Item" },
      { accessorKey: "cost", header: "Cost" },
      { accessorKey: "rating", header: "Rating" },
      { accessorKey: "itemUrl", header: "Link" },
      { accessorKey: "notes", header: "Notes" },
];
