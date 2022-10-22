import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IItem } from "hacker-news-api-types";

export const saveNews = createAsyncThunk('SAVE_NEWS',
    async () => {
        const response = await axios.get(
            `https://hacker-news.firebaseio.com/v0/newstories.json`
        );
        const newsIds: string[] = response.data;
        const news = await Promise.all(newsIds.slice(0, 20).map(async (id: string) => {
            const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const story: IItem = response.data;
            return story
        }));
        return { news, newsIds };
    });

export interface IInitState {
    data: IItem[];
    idsList: string[]
    loading: boolean;
    fetchError: string;
}

const initialState: IInitState = {
    data: [],
    idsList: [],
    loading: false,
    fetchError: ''
}

export const news = createSlice({
    name: 'news',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveNews.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveNews.rejected, (state, action) => {
                state.loading = false;
                state.fetchError = action.error.message!;
            })
            .addCase(saveNews.fulfilled, (state, action) => {
                state.idsList = action.payload.newsIds
                state.data = action.payload.news;
                state.loading = false;
            })
    }
})
