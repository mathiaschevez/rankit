import RankItemForm from '@/components/RankItemForm';
import { getRankItems } from '@/server/queries';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const currentRankItems = await getRankItems(rankingId);

  return (
    <div>
      <RankItemForm currentRankItems={currentRankItems} rankingId={rankingId} />
    </div>
  )
}