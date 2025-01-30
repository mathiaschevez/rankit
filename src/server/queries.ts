'use server';

import { eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, rankings, RankItem, SelectRanking } from './db/schema';

export async function createRanking(data: InsertRanking) {
  return await db.insert(rankings).values(data);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankings);
}

export async function fetchRankingById(rankingId: number) {
  return await db.select().from(rankings).where(eq(rankings.id, rankingId));
}

export async function createRankItems(rankingIdToUpdate: string, newRankItems: RankItem[]) {
  return await db.update(rankings)
    .set({ rankItems: newRankItems })
    .where(eq(rankings.id, Number(rankingIdToUpdate)));
}
