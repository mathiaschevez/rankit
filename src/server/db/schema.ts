import { pgTableCreator, serial, text } from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `rankit_${name}`);

export const rankingsTable = createTable(
  'rankings',
  {
    id: serial('id').primaryKey(),
    name: text('title').notNull(),
  }
);

export type InsertRanking = typeof rankingsTable.$inferInsert;
export type SelectRanking = typeof rankingsTable.$inferSelect;
