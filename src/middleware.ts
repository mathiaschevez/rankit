import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, fetchUser } from "./app/api/users";
import { v4 as uuidv4 } from "uuid";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);

  if (!userId && (url.pathname.includes("/create") || url.pathname.includes("/edit-ranking"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!userId) return NextResponse.next();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user.externalId) {
    console.log(`User ${userId} has no externalId, needs MongoDB creation.`);
  }

  const mongoUser = user.externalId ? await fetchUser(user.externalId) : undefined;
  if (mongoUser) return NextResponse.next();

  try {
    const externalId = user.externalId || uuidv4();

    const createdUser = await createUser(user, externalId);

    if (createdUser && !user.externalId) {
      await client.users.updateUser(userId, { externalId });
    }
  } catch (err) {
    console.error(`Error creating user in MongoDB: ${err}`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params 
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    "/(api|trpc)(.*)", // Ensure middleware runs on API routes
    "/create/:path*", // Include `/create` routes for redirection
  ],
};