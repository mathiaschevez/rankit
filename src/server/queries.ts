import { db } from './db';
import { InsertRanking, rankingsTable, SelectRanking } from './db/schema';

export async function createRanking(data: InsertRanking) {
  await db.insert(rankingsTable).values(data);
}

export async function getRankings(): Promise<SelectRanking[]> {
  return db.selectDistinct().from(rankingsTable);
}