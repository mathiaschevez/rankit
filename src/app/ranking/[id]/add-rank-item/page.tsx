import RankItemForm from '@/components/RankItemForm';
import { getRankItems, getVotes } from '@/server/queries';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const currentRankItems = await getRankItems(Number(rankingId));
  const votes = await getVotes(Number(rankingId));

  return (
    <div>
      <RankItemForm
        currentRankItems={currentRankItems}
        rankingId={rankingId}
        votes={votes}
      />
    </div>
  )
}