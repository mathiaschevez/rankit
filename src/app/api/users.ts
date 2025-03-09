'use server';

import { env } from "@/env";
import { User } from "@clerk/nextjs/server";

export async function fetchUser(externalId: string) {
  const user = await fetch(`${env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ userId: externalId })
  }).then(res => res.json());

  return user.length > 0 ? user[0] : undefined;
}

export async function createUser(user: User, externalId: string) {
  const { firstName, lastName, emailAddresses } = user;
  await fetch(`${env.NEXT_PUBLIC_API_URL}/users/insert`, {
    method: "POST",
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      firstName, lastName,
      userId: externalId,
      email: emailAddresses[0].emailAddress,
    })
  }).then(res => res.json());
}