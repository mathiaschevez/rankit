import { sql } from 'drizzle-orm';
import { boolean, foreignKey, integer, pgTableCreator, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `rankit_${name}`);

export const rankings = createTable('rankings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  userId: varchar("userId", { length: 256 }).notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }).notNull(),
  coverImageFileKey: varchar("imageKey", { length: 1024 }).notNull(),
  collaborative: boolean("collaborative").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const rankItems = createTable('rankItems', {
  id: serial('id').primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  fileName: varchar("fileName", { length: 256 }).notNull(),
  rankingId: integer("rankingId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  imageKey: varchar("imageKey", { length: 1024 }).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
}, (table) => ([
  foreignKey({
    name: "rankingId_fk",
    columns: [table.rankingId],
    foreignColumns: [rankings.id],
  })
    .onDelete('cascade')
    .onUpdate('cascade')
  ])
);

export const votes = createTable('votes', {
  id: serial('id').primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  rankingId: integer("rankingId").notNull(),
  rankItemId:  integer("rankItemId").notNull(),
  type: varchar('type', { length: 256 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}, (table) => ([
    foreignKey({
      name: "rankingId_fk",
      columns: [table.rankingId],
      foreignColumns: [rankings.id],
    }).onDelete('cascade').onUpdate('cascade'),
    foreignKey({
      name: "rankItem",
      columns: [table.rankItemId],
      foreignColumns: [rankItems.id],
    }).onDelete('cascade').onUpdate('cascade')
  ])
);

export const pendingRankItems = createTable('pendingRankItems',{
  id: serial('id').primaryKey(),
  userId: varchar("userId", { length: 256 }).notNull(),
  fileName: varchar("fileName", { length: 256 }).notNull(),
  rankingId: integer("rankingId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  imageKey: varchar("imageKey", { length: 1024 }).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
}, (table) => ([
  foreignKey({
    name: "rankingId_fk",
    columns: [table.rankingId],
    foreignColumns: [rankings.id],
  })
    .onDelete('cascade')
    .onUpdate('cascade')
  ])
);

export type InsertVote = typeof votes.$inferInsert
export type SelectVote = typeof votes.$inferSelect

export type InsertRankItem = typeof rankItems.$inferInsert
export type SelectRankItem = typeof rankItems.$inferSelect

export type InsertRanking = typeof rankings.$inferInsert;
export type SelectRanking = typeof rankings.$inferSelect;
