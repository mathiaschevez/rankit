import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isEqual } from 'lodash'

export type Vote = {
  voteId: string,
  userId: string,
  rankingId: number,
  rankItemId: number,
  type: 'upvote' | 'downvote',
}

export interface VotesState {
  votes: Vote[]
}

const initialState: VotesState = {
  votes: []
}

export const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    initVotes: (state, action: PayloadAction<Vote[]>) => {
      state.votes = action.payload
    },
    addVote: (state, action: PayloadAction<Vote>) => {
      const existingVote = state.votes.find(v => v.voteId === action.payload.voteId);

      if (isEqual(existingVote, action.payload)) return;
      if (existingVote) {
        const filteredVotes = state.votes.filter(v => v.voteId !== action.payload.voteId);
        state.votes = [...filteredVotes, action.payload];
      } else {
        state.votes.push(action.payload);
      } 
    }
  },
})

export const { initVotes, addVote } = votesSlice.actions

export default votesSlice.reducer