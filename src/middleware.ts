import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createUser, fetchUser } from './app/api/users';
import { v4 as uuidv4 } from 'uuid';

export default clerkMiddleware(async (auth) => {
  const { userId } = await auth();

  if (userId) {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const mongoUser = await fetchUser(user.externalId ?? '');

    // If the user is logged in and found in mongo continue
    if (user.externalId && mongoUser) return NextResponse.next();
    else {
    // Otherwise create a mongo user then continue
      try {
        const externalId = uuidv4();
        await createUser(user, externalId)
          .then(async () => {
            return await client.users.updateUser(userId, { externalId });
          })
          .catch(err => console.error(err));
        return NextResponse.next()
      } catch (err) {
        console.error(`Failed to create a user in mongo: ${err}`);
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params 
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};