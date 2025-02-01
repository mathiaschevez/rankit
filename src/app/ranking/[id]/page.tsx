import { Button } from '@/components/ui/button';
import { fetchRankingById, getRankItems } from '@/server/queries';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
// import { FaArrowUp } from "react-icons/fa";
// import { FaArrowDown } from "react-icons/fa";

export default async function RankingDetail({ params }: { params: Promise<{id: string}> }) {
  const { userId } = await auth();
  const rankingId = (await params).id;
  const ranking = (await fetchRankingById(Number(rankingId)))[0];
  const rankItems = await getRankItems(rankingId);

  return (
    <div className='flex px-4 h-screen py-4 gap-4'>
      <div className='flex flex-col gap-4'>
        {ranking.coverImageUrl && <Image alt='cover img' src={ranking.coverImageUrl} width={900} height={900} />}
        <div className='font-bold text-2xl'>{ranking.title}</div>
      </div>
      <div className='w-full'>
        <div className='flex flex-col w-full'>
          {rankItems.map((rankItem, i) => (
            <div key={rankItem.name} className='flex w-full h-20 items-center gap-4'>
              <div>{i + 1}</div>
              <Image alt="rankItemImage" src={rankItem.imageUrl} width={50} height={50} />
              <div className='text-xl flex-1'>{rankItem.name}</div>
              <div className='flex gap-2 ml-auto'>
                {/* <div className='font-bold text-green-500 text-xl flex items-center gap-2'><FaArrowUp /> {rankItem.upvotes}</div>
                <div className='font-bold text-xl text-orange-500 flex items-center gap-2'><FaArrowDown /> {rankItem.downvotes}</div> */}
              </div>
            </div>
          ))}
        </div>
        {userId === ranking.userId && <Link href={`/ranking/${rankingId}/add-rank-item`}>
          <Button>Add Rank Items</Button>
        </Link>}
      </div>
    </div>
  )
}