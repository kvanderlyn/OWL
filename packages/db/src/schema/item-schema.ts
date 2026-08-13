import type { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, real, smallint, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { wishlist } from "./wishlist-schema";

export const items = pgTable("items", {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      ownerId: text("owner_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
      name: varchar({ length: 255 }).notNull(),
      cost: real(),
      rating: smallint(),
      itemUrl: text("item_url"),
      wishlistId: integer("wishlist_id")
            .notNull()
            .references(() => wishlist.id, { onDelete: "cascade" }),
      notes: text(),
      currency: varchar({ length: 3 }),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
});

export type dbItemType = InferSelectModel<typeof items>;
