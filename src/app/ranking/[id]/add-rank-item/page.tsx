import RankItemForm from '@/components/RankItemForm';
import { RankItem } from '@/server/db/schema';
import { fetchRankingById } from '@/server/queries';
import React from 'react'

export default async function AddRankItem({ params }: { params: Promise<{id: string}> }) {
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const currentRankItems = ranking.rankItems as RankItem[];

  return (
    <div>
      <RankItemForm currentRankItems={currentRankItems} />
    </div>
  )
}