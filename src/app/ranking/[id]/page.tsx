import { fetchRankingById } from '@/app/api/rankings';
import { fetchRankItems } from '@/app/api/rankItems';
import { fetchVotes } from '@/app/api/votes';
// import PendingRankItem from '@/components/PendingRankItem';
import RankItems from '@/components/RankItems';
import { Button } from '@/components/ui/button';
// import { getPendingRankItems } from '@/server/queries';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function RankingDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  const rankingId = (await params).id;
  const ranking = await fetchRankingById(rankingId);
  const rankItems = await fetchRankItems(rankingId);
  // const pendingRankItems = await getPendingRankItems(Number(rankingId));
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
            rankingId={rankingId}
            initialVotes={initialVotes}
          />
          <div className='flex gap-3'>
            {(user?.emailAddresses[0].emailAddress === ranking.userEmail) && <Link href={`/ranking/${rankingId}/edit-ranking`}>
              <Button className='mt-4'>Edit Ranking</Button>
            </Link>}
            {user?.id && ranking.collaborative && <Link href={`/ranking/${rankingId}/edit-ranking`}>
              <Button className='mt-4'>Add Rank Item</Button>
            </Link>}
          </div>
        </div>
      </div>
      {/* {ranking.collaborative && pendingRankItems.length > 0 && <div>
        <div>Pending Rank Items</div>
        {pendingRankItems.map((rankItem, i) => <PendingRankItem
          key={rankItem.id}
          index={i + 1}
          pendingRankItem={rankItem}
          rankingUserId={ranking.userId}
        />)}
      </div>} */}
    </div>
  )
}