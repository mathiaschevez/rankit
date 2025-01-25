import { getRankings } from "@/server/queries";

export const dynamic = "force-dynamic";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export default async function Home() {
  const rankings = await getRankings();

  return (
    <div className="px-4">
      <NavBar />
      {rankings.map((ranking) =>
        <div
          key={ranking.id}
          className='border border-white'
        >
          {ranking.name}
        </div>)
      }
    </div>
  );
}

function NavBar() {
  return (
    <div className="flex justify-between h-16 items-center">
      Rankit
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9"
            }}
          }
        />
      </SignedIn>
      <SignedOut><SignInButton /></SignedOut>
    </div>
  )
}