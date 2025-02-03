'use client';

import { SelectRankItem, SelectVote } from '@/server/db/schema'
import Image from 'next/image'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

export default function RankItem({ rankItem, index, votes, userId }: { rankItem: SelectRankItem, index: number, votes: SelectVote[], userId: string | null }) {
  function handleVote(type: 'upvote' | 'downvote') {
    console.log(type)
  }

  return (
    <div className='flex w-full h-20 items-center gap-4'>
      <div>{index}</div>
      <Image alt="rankItemImage" src={rankItem.imageUrl} width={50} height={50} />
      <div className='text-xl flex-1'>{rankItem.name}</div>
      <div className='flex gap-2 ml-auto'>
        <button
          disabled={!userId}
          className='font-bold text-green-500 text-xl flex items-center gap-2'
          onClick={() => handleVote('upvote')}
        >
          <FaArrowUp /> {votes.filter(v => v.type === 'upvote').length}
        </button>
        <button
          disabled={!userId}
          className='font-bold text-xl text-orange-500 flex items-center gap-2'
          onClick={() => handleVote('downvote')}
        >
          <FaArrowDown /> {votes.filter(v => v.type === 'downvote').length}
        </button>
      </div>
    </div>
  )
}