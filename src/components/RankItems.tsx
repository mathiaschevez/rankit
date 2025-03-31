'use client';

import RankItem from "./RankItem";
import { useEffect, useMemo } from "react";
import { useSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addVote, initVotes, removeVote, Vote } from "@/redux/votes";
import useSocket from "@/hooks/useSocket";
import { RankItemType } from "@/app/api/rankItems";

export default function RankItems({ initialVotes, rankItems, rankingId }: { initialVotes: Vote[], rankItems: RankItemType[], rankingId: string }) {
  const dispatch = useDispatch();
  const votes = useSelector(state => state.votes.votes);
  const { socket } = useSocket();

  useEffect(() => {
    dispatch(initVotes(initialVotes));
    socket.emit('listenForVotes', rankingId);
    
    const handleVote = (vote: Vote) => dispatch(addVote(vote));
    const handleUnvote = (vote: Vote) => dispatch(removeVote(vote));
    socket.on('vote', handleVote);
    socket.on('unvote', handleUnvote);
  
    return () => {
      socket.off('vote', handleVote);
      socket.emit('stopListeningForVotes', rankingId);
    };
  }, [socket, dispatch, initialVotes, rankingId]);

  const rankItemsSortedByScore = useMemo(() => {
    return rankItems
      .map(ri => ({
        ...ri,
        score: ri.upvotes - ri.downvotes,
        rankItemVotes: votes.filter(v => v.rankItemId === ri._id)
      }))
      .sort((a, b) => {
        if (b.score === a.score) return b.rankItemVotes.length - a.rankItemVotes.length;
        return b.score - a.score;
      })
  }, [rankItems, votes]);

  return (
    <div className='space-y-4'>
      {rankItemsSortedByScore.map((rankItem, i) => <RankItem
        key={rankItem._id}
        rankItem={rankItem}
        index={i + 1}
      />)}
    </div>
  );
}