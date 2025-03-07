import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useSelector as useUnsafeSelector, useDispatch as useUnsafeDispatch, useStore as useUnsafeStore } from "react-redux";
import votesReducer from './votes'

export const store = configureStore({
  reducer: {
    votes: votesReducer,
  }
})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useUnsafeSelector;
export const useDispatch: () => AppDispatch = useUnsafeDispatch;
export const useStore = useUnsafeStore.withTypes<AppStore>();