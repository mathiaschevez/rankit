'use server';

import { eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, InsertRankItem, rankings, rankItems, SelectRanking, votes } from './db/schema';
import { auth } from '@clerk/nextjs/server';

export async function createRanking(data: InsertRanking) {
  return await db.insert(rankings).values(data);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankings);
}

export async function fetchRankingById(rankingId: number) {
  return await db.select().from(rankings).where(eq(rankings.id, rankingId));
}

export async function getRankItems(rankingId: string) {
  return await db.select().from(rankItems).where(eq(rankItems.rankingId, rankingId));
}

export async function InsertRankItems(newRankItems: Omit<InsertRankItem, "userId">[]) {
  const { userId } = await auth();
  if (!userId) return;

  return await db.insert(rankItems).values(newRankItems.map(item => ({
    userId,
    ...item
  })));
}

export async function getVotes(rankingId: string) {
  return await db.select().from(votes).where(eq(votes.rankingId, rankingId));
}