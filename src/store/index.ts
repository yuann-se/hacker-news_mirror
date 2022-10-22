import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { comments } from './comments'
import { news } from './news'

export const reducer = combineReducers({
    comments: comments.reducer,
    news: news.reducer,
})

export const store = configureStore({ reducer: reducer })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch