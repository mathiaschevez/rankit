import { fetchRankingById } from '@/app/api/rankings';
import { fetchRankItems } from '@/app/api/rankItems';
import { fetchVotes } from '@/app/api/votes';
// import PendingRankItem from '@/components/PendingRankItem';
import RankItems from '@/components/RankItems';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { timeSince } from '@/lib/utils';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { ArrowLeft, Share, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{ id: string }> }) {
  const rankingId = (await params).id;
  const ranking = await fetchRankingById(rankingId);
  const rankItems = await fetchRankItems(rankingId);
  const initialVotes = await fetchVotes(rankingId);

  const user = await currentUser();
  const creator = (await getCreator(ranking.userId)) ?? user;
  const isCreator = user?.id === ranking.userId;

  return (
    <div className="dark min-h-screen bg-gray-950 text-gray-100">
    <div className="mx-auto max-w-7xl px-4 py-4">
      <Link href='/'>
        <Button variant="ghost" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rankings
        </Button>
      </Link>
    </div>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950"></div>
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="aspect-[3/1] w-full overflow-hidden rounded-lg bg-gray-800">
          <Image src={ranking.coverImageUrl} alt={ranking.title} className="h-full w-full object-cover" fill />
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{ranking.title}</h1>
          <p className="mt-2 text-gray-400">{ranking.description ?? ''}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-700">
                <AvatarImage src={creator?.imageUrl} alt={creator?.fullName ?? ''} />
                <AvatarFallback className="bg-[#003b69] text-white">
                  {creator?.fullName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-300">
                Created by <span className="font-medium text-white">{creator?.fullName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {ranking.collaborative ? (
                <Badge variant="blue" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Collaborative
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
            <span className="text-sm text-gray-400">{timeSince(ranking._id)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#005CA3] hover:bg-[#004a82]">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          {isCreator && <Link href={`/ranking/${rankingId}/edit`}>
            <Button className="bg-[#005CA3] hover:bg-[#004a82]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </Button>
          </Link>}
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="mb-6 text-xl font-semibold">Rankings</h2>
      <RankItems initialVotes={initialVotes} rankingId={rankingId} rankItems={rankItems} />
    </div>
    </div>
  )
}

async function getCreator(userId: string) {
  try {
    const creator = await (await clerkClient()).users.getUser(userId);
    return creator;
  } catch (err) {
    return undefined
    console.error(err)
  }
}


{/* {ranking.collaborative && pendingRankItems.length > 0 && <div>
  <div>Pending Rank Items</div>
  {pendingRankItems.map((rankItem, i) => <PendingRankItem
    key={rankItem.id}
    index={i + 1}
    pendingRankItem={rankItem}
    rankingUserId={ranking.userId}
  />)}
</div>} */}