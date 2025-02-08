import PendingRankItem from '@/components/PendingRankItem';
import RankItem from '@/components/RankItem';
import { Button } from '@/components/ui/button';
import { fetchRankingById, getPendingRankItems, getRankItems, getVotes } from '@/server/queries';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const rankItems = await getRankItems(Number(rankingId));
  const pendingRankItems = await getPendingRankItems(Number(rankingId));
  const votes = await getVotes(Number(rankingId));

  function rankItemsSortedByScore() {
    return rankItems.map(ri => {
      const rankItemVotes = votes.filter(v => v.rankItemId === ri.id);
      const score = rankItemVotes.filter(v => v.type === 'upvote').length ?? 1 / rankItemVotes.filter(v => v.type === 'downvote').length ?? 1
      return { ...ri, rankItemVotes, score }
    }).sort((a, b) => {
      if (b.score === a.score) return b.rankItemVotes.length - a.rankItemVotes.length;
      return b.score - a.score;
    })
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-4'>
          {ranking.coverImageUrl && <Image alt='cover img' src={ranking.coverImageUrl} width={900} height={900} />}
          <div className='font-bold text-2xl'>{ranking.title}</div>
          {ranking.collaborative && <i className='text-blue-500'>Collaborative</i>}
        </div>
        <div className='w-full'>
          <div className='flex flex-col w-full'>
            {rankItemsSortedByScore().map((rankItem, i) => <RankItem
              key={rankItem.id}
              rankItem={rankItem}
              index={i + 1}
              userId={userId}
            />)}
          </div>
          {userId && (userId === ranking.userId || ranking.collaborative) && <Link href={`/ranking/${rankingId}/edit-ranking`}>
            <Button className='mt-4'>Edit Ranking</Button>
          </Link>}
        </div>
      </div>
      {ranking.collaborative && pendingRankItems.length > 0 && <div>
        <div>Pending Rank Items</div>
        {pendingRankItems.map((rankItem, i) => <PendingRankItem
          key={rankItem.id}
          index={i + 1}
          pendingRankItem={rankItem}
          userId={userId ?? ''}
          rankingUserId={ranking.userId}
        />)}
      </div>}
    </div>
  )
}