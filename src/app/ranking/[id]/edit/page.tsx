import { fetchRankingById } from '@/app/api/rankings';
import { fetchRankItems } from '@/app/api/rankItems';
import EditRankingForm from '@/components/EditRankingForm';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const user = await currentUser();
  const rankingId = (await params).id;
  const ranking = await fetchRankingById(rankingId)
  const currentRankItems = await fetchRankItems(rankingId);

  return (
    <div>
      <EditRankingForm
        currentRankItems={currentRankItems}
        ranking={ranking}
        userId={user?.externalId ?? ''}
        userEmail={user?.emailAddresses[0].emailAddress ?? ''}
      />
    </div>
  )
}