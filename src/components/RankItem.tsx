'use client';

import { Vote } from '@/redux/votes';
import Image from 'next/image'
import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid';
import useSocket from '@/hooks/useSocket';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { RankItemType } from '@/app/api/rankItems';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

interface RankItemWithScore extends RankItemType {
  score: number,
  rankItemVotes: Vote[]
}

export default function RankItem({ rankItem, index }: { rankItem: RankItemWithScore, index: number }) {
  const { socket } = useSocket()
  const { user } = useUser();
  const currentVote = rankItem.rankItemVotes.find(v => v.userId === user?.id);

  const voteColor = useMemo(() => {
    if (!currentVote) return { background: 'hover:bg-slate-900', upvote: 'hover:bg-green-700', downvote: 'hover:bg-orange-700' };
    else if (currentVote.type === 'downvote') return { background: 'bg-orange-500', upvote: 'hover:bg-orange-700', downvote: 'hover:bg-orange-700' };
    else if (currentVote.type === 'upvote') return { background: 'bg-green-500', upvote: 'hover:bg-green-700', downvote: 'hover:bg-green-700' };
    else return { background: '', upvote: '', downvote: '' };
  }, [currentVote]);

  function handleVote(type: 'upvote' | 'downvote') {
    if (!user?.id) return;
    if (currentVote) {
      if (type === currentVote.type) {
        socket.emit('unvote', { ...currentVote });
      }
      else socket.emit('vote', { ...currentVote, type }, true);
    }
    else {
      socket.emit('vote', {
        voteId: uuidv4(),
        userId: user?.id,
        userEmail: user.emailAddresses[0].emailAddress ?? '',
        rankItemId: rankItem._id,
        rankingId: rankItem.rankingId,
        type,
      }, false);
    }
  }

  return (
    <div
      key={rankItem._id}
      className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 transition-all hover:border-[#005CA3]/30"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#005CA3]/10 text-lg font-bold text-[#4a9ede]">
        {index}
      </div>
      <div className="hidden h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-800 sm:block">
        <Image src={rankItem.imageUrl} alt={rankItem.name} className="h-full w-full object-cover" height={100} width={100} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-medium">{rankItem.name}</h3>
        <p className="text-sm text-gray-400">{rankItem.rankItemVotes.length} votes</p>
      </div>
      <div className={`${voteColor?.background} flex ml-auto items-center rounded-full py-1 px-1 gap-3`}>
        <SignedIn>
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
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className={`${voteColor.upvote} p-2 rounded-full font-bold text-xl items-center gap-2 flex`}>
              <ArrowUpIcon className={`size-4`} strokeWidth={6} />
            </button>
          </SignInButton>
          <span className='text-lg font-bold'>{rankItem.rankItemVotes.filter(v => v.type === 'upvote').length}</span>
          <SignInButton>
            <button className={`${voteColor.downvote} p-2 rounded-full font-bold flex items-center gap-2`}>
              <ArrowDownIcon className={`size-4`}  strokeWidth={6} />
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  )
}