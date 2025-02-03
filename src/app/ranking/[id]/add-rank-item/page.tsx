import RankItemForm from '@/components/RankItemForm';
import { getRankItems, getVotes } from '@/server/queries';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const currentRankItems = await getRankItems(rankingId);
  const votes = await getVotes(rankingId);

  console.log(votes)

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