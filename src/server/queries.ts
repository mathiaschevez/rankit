'use server';

import { eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, rankings, SelectRanking } from './db/schema';

export async function createRanking(data: InsertRanking) {
  await db.insert(rankings).values(data);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankings);
}

export async function fetchRankingById(rankingId: number) {
  return await db.select().from(rankings).where(eq(rankings.id, rankingId));
}
