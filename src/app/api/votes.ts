'use server'
import { env } from "@/env";

export async function fetchVotes() {
  const votes = await fetch(`${env.NEXT_PUBLIC_API_URL}/votes`, {
    method: "GET",
  }).then(res => res.json());

  return votes;
}