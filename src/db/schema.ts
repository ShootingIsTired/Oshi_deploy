import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  text,
  unique,
  uuid,
  varchar,
  //boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "_users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials", "google"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);

// Oshi Information Table
export const oshiInfoTable = pgTable(
  "_oshi_info",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    igUrl: text("ig_url").notNull(),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    countryIndex: index("country_index").on(table.country),
  }),
);

// User "Keep" Table
export const keepTable = pgTable(
  "_keep",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    oshiId: uuid("oshi_id")
    .notNull()
    .references(() => oshiInfoTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    // This is a unique constraint on the combination of userId and documentId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.userId, table.oshiId),
    oshiIdIndex:index("oshi_id_index").on(table.oshiId),
  }),
);

// User "Like" Table
export const likeTable = pgTable(
  "_like",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    picId: uuid("pic_id")
    .notNull()
    .references(() => picTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => ({
    // This is a unique constraint on the combination of userId and documentId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.userId, table.picId),
  }),
);

// Picture Table
export const picTable = pgTable(
  "_pic",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    oshiId: uuid("oshi_id")
    .notNull()
    .references(() => oshiInfoTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    imageUrl: text("image_url")
  },
  (table) => ({
    oshiIdIndex: index("oshi_id_index").on(table.oshiId),
  }),
);

// Tag Table
export const tagTable = pgTable(
  "_oshi_tag",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    oshiId: uuid("oshi_id")
    .notNull()
    .references(() => oshiInfoTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    tag: varchar("tag", { length: 100 }).notNull(),
  },
  (table) => ({
    // Indexes or unique constraints can be added here if needed
    oshiIdIndex: index("oshi_id_index").on(table.oshiId), // New index on oshiId
  }),
);

// Comment Table
export const commentTable = pgTable(
  "_comment",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    oshiId: uuid("oshi_id")
    .notNull()
    .references(() => oshiInfoTable.displayId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    comment: text("comment").notNull(),
    timestamp: timestamp("timestamp").notNull(),
  },
  (table) => ({
    oshiIdIndex: index("oshi_id_index").on(table.oshiId),
    timestampIndex: index("timestamp_index").on(table.timestamp),
  }),
);

// Define relationships between tables
export const keepRelations = relations(usersTable, ({ many }) => ({
  keepTable: many(keepTable),
}));

export const likeRelations = relations(usersTable, ({ many }) => ({
  likeTable: many(likeTable),
}));

export const picRelations = relations(oshiInfoTable, ({ many }) => ({
  picTable: many(picTable),
}));

export const tagRelations = relations(oshiInfoTable, ({ many }) => ({
  tagTable: many(tagTable),
}));

// relations of keep table
export const keepOshiRelations = relations(keepTable, ({ one }) => ({
  oshi: one(oshiInfoTable, {
    fields: [keepTable.oshiId],
    references: [oshiInfoTable.displayId],
  }),
}));

export const userToPicRelations = relations(
  likeTable,
  ({ one }) => ({
    pic: one(picTable, {
      fields: [likeTable.picId],
      references: [picTable.displayId],
    }),
    user: one(usersTable, {
      fields: [likeTable.userId],
      references: [usersTable.displayId],
    }),
  }),
);

export const userToOshiRelations = relations(
  keepTable,
  ({ one }) => ({
    oshi: one(oshiInfoTable, {
      fields: [keepTable.oshiId],
      references: [oshiInfoTable.displayId],
    }),
    user: one(usersTable, {
      fields: [keepTable.userId],
      references: [usersTable.displayId],
    }),
  }),
);

export const commentsRelations = relations(commentTable, ({ one }) => ({
  project: one(oshiInfoTable, {
    fields: [commentTable.oshiId],
    references: [oshiInfoTable.displayId],
  }),
}));