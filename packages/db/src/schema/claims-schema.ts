import type { InferSelectModel } from "drizzle-orm";
import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { items } from "./item-schema";

export const claims = pgTable(
      "claims",
      {
            id: serial("id").primaryKey(),
            itemId: integer("item_id")
                  .notNull()
                  .references(() => items.id, { onDelete: "cascade" })
                  .notNull(),
            claimedBy: text("claimed_by")
                  .notNull()
                  .references(() => user.id, { onDelete: "cascade" })
                  .notNull(),
            purchasedOn: timestamp(),
            closeOn: timestamp("close_on").notNull(),
            createdAt: timestamp("created_at").defaultNow().notNull(),
      },
      (table) => [index("claims_idx").on(table.itemId)],
);
export type dbClaimsType = InferSelectModel<typeof claims>;
