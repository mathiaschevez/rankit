'use server';

import { env } from "@/env";
import { MongoUser } from "../../redux/user";

export async function fetchUser(externalId: string): Promise<MongoUser | undefined> {
  const user = await fetch(`${env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ userId: externalId })
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