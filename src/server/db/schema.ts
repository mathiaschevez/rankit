import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const rankingsTable = pgTable('rankingsTable', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
});

export type InsertRanking = typeof rankingsTable.$inferInsert;
export type SelectRanking = typeof rankingsTable.$inferSelect;
