import { sql } from 'drizzle-orm';
import { pgTableCreator, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `rankit_${name}`);

export const rankings = createTable('rankings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  userId: varchar("userId", { length: 256 }).notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const rankItems = createTable('rankItems', {
  id: serial('id').primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  fileName: varchar("fileName", { length: 256 }).notNull(),
  rankingId: varchar('rankingId', { length: 256 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const votes = createTable('votes', {
  id: serial('id').primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  rankingId: varchar('rankingId', { length: 256 }).notNull(),
  rankItemId: varchar('rankItemId', { length: 256 }).notNull(),
  type: varchar('type', { length: 256 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertVote = typeof votes.$inferInsert
export type SelectVote = typeof votes.$inferSelect

export type InsertRankItem = typeof rankItems.$inferInsert
export type SelectRankItem = typeof rankItems.$inferSelect

export type InsertRanking = typeof rankings.$inferInsert;
export type SelectRanking = typeof rankings.$inferSelect;
