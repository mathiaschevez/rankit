import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { isEqual } from 'lodash'

export type Vote = {
  voteId: string,
  userId: string,
  userEmail: string,
  rankingId: string,
  rankItemId: string,
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
    },
    removeVote: (state, action: PayloadAction<Vote>) => {
      const newVotes = state.votes.filter(v => v.voteId !== action.payload.voteId);
      state.votes = newVotes;
    }
  },
})

export const { initVotes, addVote, removeVote } = votesSlice.actions

export default votesSlice.reducer