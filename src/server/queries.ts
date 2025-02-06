'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, InsertRankItem, rankings, rankItems, SelectRanking, votes } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

// RANKINGS

export async function createRanking(data: InsertRanking) {
  return await db.insert(rankings)
    .values(data)
    .returning({ insertedId: rankings.id });
}

export async function deleteRanking(idToDelete: number) {
  const rankItemList = await db.select().from(rankItems).where(eq(rankItems.rankingId, idToDelete));
  const imagesToDelete = rankItemList.map(item => item.imageKey);

  const coverImageKeysToDelete = await db.delete(rankings)
    .where(eq(rankings.id, idToDelete))
    .returning({ coverImageKey: rankings.coverImageFileKey })

  await utapi.deleteFiles([...imagesToDelete, coverImageKeysToDelete[0].coverImageKey]);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankings);
}

export async function fetchRankingById(rankingId: number) {
  return await db.select().from(rankings).where(eq(rankings.id, rankingId));
}

// RANK ITEMS

export async function getRankItems(rankingId: number) {
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

export async function deleteRankItem(rankItemId: number) {
  const imageKeyToDelete = await db.delete(rankItems)
    .where(eq(rankItems.id, rankItemId))
    .returning({ imageKey: rankItems.imageKey });

  await utapi.deleteFiles(imageKeyToDelete[0].imageKey);
}

// VOTES

export async function getVotes(rankingId: number) {
  return await db.select().from(votes).where(eq(votes.rankingId, rankingId));
}

export async function insertVote({ userId, rankingId, rankItemId, type }: { userId: string, rankingId: number, rankItemId: number, type: 'upvote' | 'downvote' }) {
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