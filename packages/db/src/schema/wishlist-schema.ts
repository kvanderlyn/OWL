import type { InferSelectModel } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const wishlist = pgTable(
      "wishlist",
      {
            id: serial("wishlist_id").primaryKey(),
            name: text("name").notNull(),
            ownerId: text("owner_id")
                  .notNull()
                  .references(() => user.id, { onDelete: "cascade" })
                  .notNull(),
            createdAt: timestamp("created_at").defaultNow().notNull(),
            updatedAt: timestamp("updated_at")
                  .defaultNow()
                  .$onUpdate(() => /* @__PURE__ */ new Date())
                  .notNull(),
      },
      (table) => [index("wishlist_idx").on(table.ownerId)],
);

export type dbWishlistType = InferSelectModel<typeof wishlist>;
