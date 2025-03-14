'use client';

import { useSelector } from '@/redux/store';
import { Vote } from '@/redux/votes';
import socket from '@/socket';
import { SelectRankItem } from '@/server/db/schema'
import Image from 'next/image'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid';

interface RankItemWithScore extends SelectRankItem {
  score: number,
  rankItemVotes: Vote[]
}

export default function RankItem({ rankItem, index }: { rankItem: RankItemWithScore, index: number }) {
  const user = useSelector(state => state.user.user)
  const currentVote = rankItem.rankItemVotes.find(v => v.userId === user?.userId);

  const upvoteDisabled = !user?.userId || (currentVote && currentVote.type === 'upvote');
  const downvoteDisabled = !user?.userId || (currentVote && currentVote.type === 'downvote')

  function handleVote(type: 'upvote' | 'downvote') {
    if (!user?.userId) return;
    if (currentVote) socket.emit('vote', { ...currentVote, type });
    else {
      socket.emit('vote', {
        voteId: uuidv4(),
        userId: user?.userId,
        rankItemId: rankItem.id,
        rankingId: rankItem.rankingId,
        type,
      });
    }
  }

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