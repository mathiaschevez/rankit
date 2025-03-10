'use server';

import { env } from "@/env";
import { User } from "@clerk/nextjs/server";
import { MongoUser } from "../redux/user";

export async function fetchUser(externalId: string): Promise<MongoUser | undefined> {
  const user = await fetch(`${env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ userId: externalId })
  }).then(res => res.json());

  return user.length > 0 ? user[0] : undefined;
}

export async function createUser(user: User, externalId: string): Promise<boolean> {
  try {
    const { firstName, lastName, emailAddresses } = user;
    
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/insert`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        firstName,
        lastName,
        userId: externalId,
        email: emailAddresses[0]?.emailAddress,
      }),
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