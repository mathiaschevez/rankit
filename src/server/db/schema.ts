import { sql } from 'drizzle-orm';
import { jsonb, pgTableCreator, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

type RankItem = {
  name: string,
  image: string,
  upvotes: number,
  downvotes: number,
  rank: number,
}

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

  rankItems: jsonb().$type<RankItem>().array()
});

export type InsertRanking = typeof rankings.$inferInsert;
export type SelectRanking = typeof rankings.$inferSelect;
