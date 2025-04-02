'use server';

import { env } from "@/env";
import { MongoUser } from "../../redux/user";

export async function fetchUser(id: string): Promise<MongoUser | undefined> {
  const user = await fetch(`${env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ userId: id })
  }).then(res => res.json());

  return user.length > 0 ? user[0] : undefined;
}

export async function createUser(user: { userId: string, email: string, displayName: string }): Promise<boolean> {
  const development = env.NEXT_PUBLIC_API_URL.includes('localhost');

  try {
    const { userId, displayName, email } = user;
    
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/insert`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ userId, email, displayName, development }),
    });

    if (!response.ok) {
      console.error(`Failed to create user: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();

    return data.success ?? true;
  } catch (err) {
    console.error("Error creating user:", err);
    return false;
  }
}

export async function saveRanking(userId: string, rankingId: string) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/save-ranking`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ userId, rankingId }),
    });

    if (!response.ok) {
      console.error(`Failed to save ranking to user: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();

    return data.success ?? true;
  } catch (err) {
    console.error("Error saving ranking to user:", err);
    return false;
  }
}

export async function removeSavedRanking(userId: string, rankingId: string) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/remove-saved-ranking`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ userId, rankingId }),
    });

    if (!response.ok) {
      console.error(`Failed to un save ranking from user: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();

    return data.success ?? true;
  } catch (err) {
    console.error("Error removing saved ranking from user:", err);
    return false;
  }
}