'use client';

import { useSelector } from '@/redux/store';
import { Vote } from '@/redux/votes';
import { SelectRankItem } from '@/server/db/schema'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid';
import useSocket from '@/hooks/useSocket';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface RankItemWithScore extends SelectRankItem {
  score: number,
  rankItemVotes: Vote[]
}

export default function RankItem({ rankItem, index }: { rankItem: RankItemWithScore, index: number }) {
  const { socket } = useSocket()
  const user = useSelector(state => state.user.user);
  const currentVote = rankItem.rankItemVotes.find(v => v.userId === user?.userId);

  const voteColor = useMemo(() => {
    if (!currentVote) return { background: 'hover:bg-slate-900', upvote: 'hover:bg-green-700', downvote: 'hover:bg-orange-700' };
    else if (currentVote.type === 'downvote') return { background: 'bg-orange-500', upvote: 'hover:bg-orange-700', downvote: 'hover:bg-orange-700' };
    else if (currentVote.type === 'upvote') return { background: 'bg-green-500', upvote: 'hover:bg-green-700', downvote: 'hover:bg-green-700' };
    else return { background: '', upvote: '', downvote: '' };
  }, [currentVote]);

  function handleVote(type: 'upvote' | 'downvote') {
    if (!user?.userId) return;
    if (currentVote) {
      if (type === currentVote.type) {
        socket.emit('unvote', { ...currentVote });
      }
      else socket.emit('vote', { ...currentVote, type });
    }
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
      <Image className='rounded-full h-12 w-12' alt="rankItemImage" src={rankItem.imageUrl} width={50} height={50} />
      <div className='text-xl flex-1'>{rankItem.name}</div>
      <div className={`${voteColor?.background} flex ml-auto items-center rounded-full py-1 px-1 gap-3`}>
        <button
          className={`${voteColor.upvote} p-2 rounded-full font-bold text-xl items-center gap-2 flex`}
          onClick={() => handleVote('upvote')}
        >
          <ArrowUpIcon className={`size-4`} strokeWidth={6} />
        </button>
        <span className='text-lg font-bold'>{rankItem.rankItemVotes.filter(v => v.type === 'upvote').length}</span>
        <button
          className={`${voteColor.downvote} p-2 rounded-full font-bold flex items-center gap-2`}
          onClick={() => handleVote('downvote')}
        >
          <ArrowDownIcon className={`size-4`}  strokeWidth={6} />
        </button>
      </div>
    </div>
  )
}