import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //BASIC FILE INFO
  name: text("name").notNull(),
  path: text("path").notNull(), // /document/file/resume
  type: text("type").notNull(),
  size: integer("size").notNull(),

  //STORAGE INFO
  fileUrl: text("file_url").notNull(), // Url to access file
  imagekitFileId:text("file_id").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  //OWNERSHIP
  userId: text("user_id").notNull(),
  parentId: text("parent_id"), // Parent folder id (null for root folder)

  //FILE/FOLDER FLAGS
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  //TIMESTAMP
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),

  children: many(files),
}));

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;