'use client';

import RankItem from "./RankItem";
import { useEffect, useMemo } from "react";
import { useSelector } from "@/app/redux/store";
import socket from "@/app/socket";
import { useDispatch } from "react-redux";
import { addVote, initVotes, Vote } from "@/app/redux/votes";

type RankItem = {
  id: number;
  userId: string;
  fileName: string;
  rankingId: number;
  imageUrl: string;
  imageKey: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export default function RankItems({ initialVotes, rankItems, userId, rankingId }: { initialVotes: Vote[], rankItems: RankItem[], userId: string | null, rankingId: string }) {
  const dispatch = useDispatch();
  const votes = useSelector(state => state.votes.votes);

  useEffect(() => {
    dispatch(initVotes(initialVotes));
    // socket.emit('listenForVotes', rankingId);
    socket.on('vote', (vote) => dispatch(addVote(vote)));

    return () => {
      socket.off('vote', (vote) => dispatch(addVote(vote)))
    }
  }, [dispatch, initialVotes]);

  const rankItemsSortedByScore = useMemo(() => {
    const filteredVotes = votes.filter(v => v.rankingId.toString() === rankingId);

    return rankItems.map(ri => {
      const rankItemVotes = filteredVotes.filter(v => v.rankItemId === ri.id);
      const score = rankItemVotes.filter(v => v.type === 'upvote').length ?? 1 / rankItemVotes.filter(v => v.type === 'downvote').length ?? 1
      return { ...ri, rankItemVotes, score }
    }).sort((a, b) => {
      if (b.score === a.score) return b.rankItemVotes.length - a.rankItemVotes.length;
      return b.score - a.score;
    })
  }, [rankItems, votes, rankingId]);

  return (
    <div className='w-full'>
      <div className='flex flex-col w-full'>
        {rankItemsSortedByScore.map((rankItem, i) => <RankItem
          key={rankItem.id}
          rankItem={rankItem}
          index={i + 1}
          userId={userId}
        />)}
      </div>
    </div>
  );
}