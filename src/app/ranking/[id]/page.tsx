import { Button } from '@/components/ui/button';
import { fetchRankingById } from '@/server/queries';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];

  return (
    <div>
      {ranking.title}
      <Link href={`/ranking/${rankingId}/add-rank-item`}>
        <Button>Add Rank Items</Button>
      </Link>
    </div>
  )
}