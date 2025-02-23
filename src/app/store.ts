import { configureStore } from '@reduxjs/toolkit'
import walletReducer from '../feature/basicData/BasicDataSlice';
import tokenNftSlice from '../feature/basicData/BasicDataSlice'

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        tokenNft: tokenNftSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch