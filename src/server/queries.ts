'use server';

import { eq } from 'drizzle-orm';
import { db } from './db';
import { InsertRanking, InsertRankItem, pendingRankItems, rankings, rankItems, SelectRanking, votes } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

// RANKINGS

export async function createRanking(data: InsertRanking) {
  return await db.insert(rankings)
    .values(data)
    .returning({ insertedId: rankings.id });
}

export async function updateRanking(updates: { collaborative: boolean, title: string }) {
  return await db.update(rankings).set(updates);
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

// PENDING RANK ITEMS

export async function getPendingRankItems(rankingId: number) {
  return await db.select().from(pendingRankItems).where(eq(pendingRankItems.rankingId, rankingId));
}

export async function insertPendingRankItem(newRankItems: Omit<InsertRankItem, "userId">[]) {
  const { userId } = await auth();
  if (!userId) return;

  return await db.insert(pendingRankItems).values(newRankItems.map(item => ({
    userId,
    ...item
  })));
}

export async function deletePendingRankItem(rankItemId: number) {
  return await db.delete(pendingRankItems)
    .where(eq(pendingRankItems.id, rankItemId))
    .returning({ imageKey: pendingRankItems.imageKey });
}

// VOTES

export async function getVotes(rankingId: number) {
  return await db.select().from(votes).where(eq(votes.rankingId, rankingId));
}