'use server';

import { env } from "@/env";
import { RankItemType } from "./rankItems";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export type Ranking = {
  _id: string,
  userId: string,
  userEmail: string,
  title: string,
  coverImageUrl: string,
  imageKey: string,
  collaborative: boolean,
  privateMode: boolean,
  updatedAt?: string | null,
}

export async function fetchRankings(): Promise<Ranking[]> {
  const rankings = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankings`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
  }).then(res => res.json());

  return rankings;
}

export async function fetchRankingById(rankingId: string): Promise<Ranking> {
  const ranking = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankings/ranking`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rankingId })
  }).then(res => res.json());

  return ranking;
}

export async function createRanking(ranking: Omit<Ranking, "_id">): Promise<{ message: string, insertedId: string }> {
  const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankings/insert`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(ranking)
  }).then(res => res.json());

  return result;
}

export async function updateRanking(rankingId: string, updates: { collaborative: boolean, privateMode: boolean, title: string }) {
  const updatedRanking = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankings/update`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rankingId, updates })
  }).then(res => res.json());

  return updatedRanking;
}

export async function deleteRanking(rankingId: string) {
  try {
    const rankItems = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankingId }),
    }).then((res) => res.json());

    const rankItemImagesKeys = rankItems.map((item: RankItemType) => item.imageKey);

    await fetch(`${env.NEXT_PUBLIC_API_URL}/rankItems/deleteMany`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankingId }),
    });

    await fetch(`${env.NEXT_PUBLIC_API_URL}/votes/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankingId }),
    });

    const deletedRanking = await fetch(`${env.NEXT_PUBLIC_API_URL}/rankings/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankingId }),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to delete ranking");
      return res.json();
    });
    console.log(deletedRanking, 'DELETED REANKING')
    await utapi.deleteFiles([...rankItemImagesKeys, deletedRanking.deletedDoc.imageKey]);

    return deletedRanking;
  } catch (error) {
    console.error("Error deleting ranking:", error);
  }
}