import { Button } from '@/components/ui/button';
import { RankItem } from '@/server/db/schema';
import { fetchRankingById } from '@/server/queries';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const rankItems = ranking.rankItems as RankItem[] | null

  return (
    <div>
      {ranking.title}
      {rankItems?.map(rankItem => <div key={rankItem.name} className='flex'>
        <Image alt="rankItemImage" src={rankItem.image} width={50} height={50} />
        <div>{rankItem.name}</div>
        <div>{rankItem.upvotes}</div>
        <div>{rankItem.downvotes}</div>
      </div>)}
      <Link href={`/ranking/${rankingId}/add-rank-item`}>
        <Button>Add Rank Items</Button>
      </Link>
    </div>
  )
}