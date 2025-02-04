import RankItem from '@/components/RankItem';
import { Button } from '@/components/ui/button';
import { fetchRankingById, getRankItems, getVotes } from '@/server/queries';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const rankItems = await getRankItems(Number(rankingId));
  const votes = await getVotes(Number(rankingId));

  return (
    <div className='flex px-4 h-screen py-4 gap-4'>
      <div className='flex flex-col gap-4'>
        {ranking.coverImageUrl && <Image alt='cover img' src={ranking.coverImageUrl} width={900} height={900} />}
        <div className='font-bold text-2xl'>{ranking.title}</div>
      </div>
      <div className='w-full'>
        <div className='flex flex-col w-full'>
          {rankItems.map((rankItem, i) => <RankItem
            key={rankItem.id}
            rankItem={rankItem}
            index={i + 1}
            votes={votes.filter(v => v.rankItemId === rankItem.id)}
            userId={userId}
          />
          )}
        </div>
        {userId === ranking.userId && <Link href={`/ranking/${rankingId}/edit-ranking`}>
          <Button>Edit Ranking</Button>
        </Link>}
      </div>
    </div>
  )
}