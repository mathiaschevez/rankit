import Image from "next/image";
import Link from "next/link";
import { fetchRankings } from "./api/rankings";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { currentUser, User } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { timeSince } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rankings = await fetchRankings();
  const user = await currentUser();

  return (
    <main className="p-4">
      <div className="text-3xl font-semibold mb-4">Rankings</div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rankings.map((ranking) => (
          <Link
            href={`/ranking/${ranking._id}`}
            key={ranking._id}
            className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-[#005CA3]/50 hover:shadow-md hover:shadow-[#005CA3]/10"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
              <Image
                src={ranking.coverImageUrl}
                alt={ranking.title}
                fill
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-gray-100">{ranking.title}</h3>
                {ranking.collaborative && <Badge variant="blue">Collaborative</Badge>}
              </div>
              <p className="text-sm text-gray-400">{timeSince(ranking._id)}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <CreateRankingButton user={user} />
      </div>
    </main>
  );
}

function CreateRankingButton({ user }: { user: User | null }) {
  return <>
    {user ? (
      <Link href={'/'} className="flex h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900/50 p-6 text-gray-400 transition-colors hover:border-[#005CA3] hover:text-[#4a9ede]">
        <div className="mb-3 rounded-full bg-[#005CA3]/10 p-3">
          <Plus className="h-6 w-6 text-[#4a9ede]" />
        </div>
        <p className="font-medium">Create New Ranking</p>
      </Link>
    ) : (
      <SignInButton>
        <Link href={'/'} className="flex h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900/50 p-6 text-gray-400 transition-colors hover:border-[#005CA3] hover:text-[#4a9ede]">
          <div className="mb-3 rounded-full bg-[#005CA3]/10 p-3">
            <Plus className="h-6 w-6 text-[#4a9ede]" />
          </div>
          <p className="font-medium">Create New Ranking</p>
        </Link>
      </SignInButton>
    )}
  </>
}