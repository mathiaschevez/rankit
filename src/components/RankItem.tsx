'use client';

import { SelectRankItem, SelectVote } from '@/server/db/schema'
import { insertVote } from '@/server/queries';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { useEffect } from 'react';
import io from 'socket.io-client';

interface RankItemWithScore extends SelectRankItem {
  score: number,
  rankItemVotes: SelectVote[]
}

export default function RankItem({ rankItem, index, userId }: { rankItem: RankItemWithScore, index: number, userId: string | null }) {
  const router = useRouter();
  const currentVote = rankItem.rankItemVotes.find(v => v.userId === userId);

  const upvoteDisabled = !userId || (currentVote && currentVote.type === 'upvote');
  const downvoteDisabled = !userId || (currentVote && currentVote.type === 'downvote')

  function handleVote(type: 'upvote' | 'downvote') {
    if (!userId) return;
    insertVote({
      userId,
      rankItemId: rankItem.id,
      rankingId: rankItem.rankingId,
      type
    }).then(() => router.refresh());
  }

  useEffect(() => {
    const socket = io();
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='flex w-full h-20 items-center gap-4'>
      <div>{index}</div>
      <Image alt="rankItemImage" src={rankItem.imageUrl} width={50} height={50} />
      <div className='text-xl flex-1'>{rankItem.name}</div>
      <div className='flex gap-2 ml-auto'>
        {/* <div>{rankItem.score}</div> */}
        <button
          disabled={upvoteDisabled}
          className={`${!upvoteDisabled && 'hover:text-green-300'} text-green-500 font-bold text-xl flex items-center gap-2`}
          onClick={() => handleVote('upvote')}
        >
          <FaArrowUp /> {rankItem.rankItemVotes.filter(v => v.type === 'upvote').length}
        </button>
        <button
          disabled={downvoteDisabled}
          className={`${!downvoteDisabled && 'hover:text-orange-300'} text-orange-500 font-bold text-xl flex items-center gap-2`}
          onClick={() => handleVote('downvote')}
        >
          <FaArrowDown /> {rankItem.rankItemVotes.filter(v => v.type === 'downvote').length}
        </button>
      </div>
    </div>
  )
}