'use server';

import { env } from "@/env";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export type RankItemType = {
  _id: string,
  userId: string,
  userEmail: string,
  fileName: string,
  rankingId: string,
  imageUrl: string,
  name: string,
  imageKey: string,
  upvotes: number,
  downvotes: number,
}

export async function fetchRankItems(rankingId: string): Promise<RankItemType[]> {
  const rankItems = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rankingId })
  }).then(res => res.json());

  return rankItems;
}

export async function insertRankItems(rankItems: Omit<RankItemType, "_id">[]) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems/insert`, {
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

export async function updateRankItem(
  rankItemId: string,
  updates: {
    name: string
    imageUrl: string,
    imageKey: string,
    fileName: string,
  }
) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems/update`, {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ rankItemId, updates }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update ranking: ${response.status} - ${errorText}`
      );
    }

    const updatedRankItem = await response.json();
    return updatedRankItem;
  } catch (error) {
    console.error("Error updating ranking:", error);
    throw error;
  }
}

export async function deleteRankItem(rankItemId: string) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankItemId }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to delete:", result.message);
      throw new Error(result.message);
    }

    console.log("Deleted rank item:", result);
    await utapi.deleteFiles(result.deletedDoc.imageKey);

    return result;
  } catch (error) {
    console.error("Error deleting rank item:", error);
    throw error;
  }
}

