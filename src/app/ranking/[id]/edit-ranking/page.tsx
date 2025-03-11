import EditRankingForm from '@/components/EditRankingForm';
import { fetchRankingById, getRankItems } from '@/server/queries';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const user = await currentUser();
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))?.[0]
  const currentRankItems = await getRankItems(Number(rankingId));

  return (
    <div>
      <EditRankingForm
        currentRankItems={currentRankItems}
        ranking={ranking}
        userId={user?.externalId ?? ''}
      />
    </div>
  )
}