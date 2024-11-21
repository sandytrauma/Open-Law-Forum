import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const forumSchema = pgTable('forum', {
    id: serial('id').primaryKey(),
    post_title: text('title').notNull(),
    content: text('content').notNull(),
    post_author: text('author').notNull(),
    timestamp: text('timestamp').notNull(),
});

export const commentsSchema = pgTable('comments', {
    id: serial('id').primaryKey(),
    forum_id: integer('forum_id').notNull().references(() => forumSchema.id),
    content: text('content').notNull(),
    commenter: text('commenter').notNull(),
    timestamp: text('timestamp').notNull(),
});

