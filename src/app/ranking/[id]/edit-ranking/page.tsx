import EditRankingForm from '@/components/EditRankingForm';
import { fetchRankingById, getRankItems, getVotes } from '@/server/queries';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))?.[0]
  const currentRankItems = await getRankItems(Number(rankingId));
  const votes = await getVotes(Number(rankingId));

  return (
    <div>
      <EditRankingForm
        currentRankItems={currentRankItems}
        ranking={ranking}
        votes={votes}
      />
    </div>
  )
}