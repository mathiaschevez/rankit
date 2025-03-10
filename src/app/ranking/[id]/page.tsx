import { fetchUser } from '@/app/api/users';
import { fetchVotes } from '@/app/api/votes';
import PendingRankItem from '@/components/PendingRankItem';
import RankItems from '@/components/RankItems';
import { Button } from '@/components/ui/button';
import { fetchRankingById, getPendingRankItems, getRankItems } from '@/server/queries';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  const mongoUser = await fetchUser(user?.externalId ?? '');
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const rankItems = await getRankItems(Number(rankingId));
  const pendingRankItems = await getPendingRankItems(Number(rankingId));
  const initialVotes = await fetchVotes(rankingId);

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-4'>
          {ranking.coverImageUrl && <Image alt='cover img' src={ranking.coverImageUrl} width={900} height={900} />}
          <div className='font-bold text-2xl'>{ranking.title}</div>
          {ranking.collaborative && <i className='text-blue-500'>Collaborative</i>}
        </div>
        <div className='w-full'>
          <RankItems
            rankItems={rankItems}
            mongoUser={mongoUser}
            rankingId={rankingId}
            initialVotes={initialVotes}
          />
          {mongoUser?.userId && (mongoUser.userId === ranking.userId) && <Link href={`/ranking/${rankingId}/edit-ranking`}>
            <Button className='mt-4'>Edit Ranking</Button>
          </Link>}
          {mongoUser?.userId && ranking.collaborative && <Link href={`/ranking/${rankingId}/edit-ranking`}>
            <Button className='mt-4'>Add Rank Item</Button>
          </Link>}
        </div>
      </div>
      {ranking.collaborative && pendingRankItems.length > 0 && <div>
        <div>Pending Rank Items</div>
        {pendingRankItems.map((rankItem, i) => <PendingRankItem
          key={rankItem.id}
          index={i + 1}
          pendingRankItem={rankItem}
          rankingUserId={ranking.userId}
        />)}
      </div>}
    </div>
  )
}