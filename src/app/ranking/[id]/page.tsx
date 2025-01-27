import { fetchRankingById } from '@/server/queries';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];

  return (
    <div>
      {ranking.title}
    </div>
  )
}