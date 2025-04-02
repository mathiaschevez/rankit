import { env } from "@/env";
import { RankItemType } from "./rankItems";

export async function fetchPendingRankItems(rankingId: string): Promise<RankItemType[]> {
  const rankItems = await fetch(`${env.NEXT_PUBLIC_API_URL}/pendingRankItems`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rankingId })
  }).then(res => res.json());

  return rankItems;
}

export async function insertPendingRankItems(rankItems: Omit<RankItemType, "_id">[]) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/pendingRankItems/insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankItems }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to insert rank items: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error inserting rank items:", error);
  }
}