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
    <div className="">
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
    <div>
      <SignedIn><UserButton /></SignedIn>
      <SignedOut><SignInButton /></SignedOut>
    </div>
  )
}