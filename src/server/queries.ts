'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, InsertRankItem, rankings, rankItems, SelectRanking, votes } from './db/schema';
import { auth } from '@clerk/nextjs/server';

// RANKINGS

export async function createRanking(data: InsertRanking) {
  return await db.insert(rankings).values(data);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankings);
}

export async function fetchRankingById(rankingId: number) {
  return await db.select().from(rankings).where(eq(rankings.id, rankingId));
}

// RANK ITEMS

export async function getRankItems(rankingId: string) {
  return await db.select().from(rankItems).where(eq(rankItems.rankingId, rankingId));
}

export async function insertRankItems(newRankItems: Omit<InsertRankItem, "userId">[]) {
  const { userId } = await auth();
  if (!userId) return;

  return await db.insert(rankItems).values(newRankItems.map(item => ({
    userId,
    ...item
  })));
}

// VOTES

export async function getVotes(rankingId: string) {
  return await db.select().from(votes).where(eq(votes.rankingId, rankingId));
}

export async function insertVote({ userId, rankingId, rankItemId, type }: { userId: string, rankingId: string, rankItemId: string, type: 'upvote' | 'downvote' }) {
  const exists = (await db.select().from(votes).where(and(eq(votes.rankItemId, rankItemId), eq(votes.userId, userId)))).length > 0

  if (exists) {
    return await db.update(votes)
      .set({ type })
      .where(and(eq(votes.rankItemId, rankItemId), eq(votes.userId, userId)))
  } else {
    return await db.insert(votes)
      .values({ userId, rankingId, rankItemId, type })
  }
}