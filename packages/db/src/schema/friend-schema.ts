import type { InferSelectModel } from "drizzle-orm";
import { boolean, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const friends = pgTable(
      "friends",
      {
            id: serial("id").primaryKey(),
            uid1: text()
                  .notNull()
                  .references(() => user.id, { onDelete: "cascade" })
                  .notNull(),
            uid2: text()
                  .notNull()
                  .references(() => user.id, { onDelete: "cascade" })
                  .notNull(),
            isApproved: boolean().default(false),
            requesterId: text()
                  .notNull()
                  .references(() => user.id, { onDelete: "cascade" })
                  .notNull(),
            createdAt: timestamp("created_at").defaultNow().notNull(),
      },
      (table) => [index("friend1_idx").on(table.uid1), index("friend2_idx").on(table.uid1)],
);
export type dbFriendType = InferSelectModel<typeof friends>;
