'use server'
import { env } from "@/env";

export async function fetchVotes(rankingId: string) {
  const votes = await fetch(`${env.NEXT_PUBLIC_API_URL}/votes`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rankingId })
  }).then(res => res.json());

  return votes;
}