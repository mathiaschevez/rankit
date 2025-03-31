import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type MongoUser = {
  displayName: string,
  userId: string,
  email: string,
  bio?: string,
  followers?: number,
  following?: number,
  location?: string,
  userName?: string,
}

export interface UserState {
  user: MongoUser | null
}

const initialState: UserState = {
  user: null,
}

export const votesSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: (state, action: PayloadAction<MongoUser | undefined>) => {
      const initialUser = action.payload;
      if (initialUser === undefined) return;
      state.user = initialUser;
    },
  },
})

export const { initUser } = votesSlice.actions

export default votesSlice.reducer