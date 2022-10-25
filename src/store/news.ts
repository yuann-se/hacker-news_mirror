import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IItem } from "hacker-news-api-types";

const getStory = async (id: number) => {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    const story: IItem = response.data
    return story
}

export const saveStory = createAsyncThunk('SAVE_STORY', getStory)

export const saveNews = createAsyncThunk('SAVE_NEWS',
    async () => {
        const response = await axios.get(
            `https://hacker-news.firebaseio.com/v0/newstories.json`
        );
        const newsIds: number[] = response.data;
        const news = await Promise.all(newsIds.slice(0, 100).map((id) => getStory(id)));
        return { news }
    });

export interface IInitState {
    data: IItem[]
    loading: boolean
    fetchError: string
    storyLoading: boolean
    storyError: string
}

const initialState: IInitState = {
    data: [],
    loading: false,
    fetchError: '',
    storyLoading: false,
    storyError: ''
}

export const news = createSlice({
    name: 'news',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Подгрузка списка новостей
            .addCase(saveNews.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveNews.rejected, (state, action) => {
                state.loading = false;
                state.fetchError = action.error.message!;
            })
            .addCase(saveNews.fulfilled, (state, action) => {
                state.data = action.payload.news;
                state.loading = false;
            })

            // Подгрузка одной новости
            .addCase(saveStory.pending, (state) => {
                state.storyLoading = true;
            })
            .addCase(saveStory.rejected, (state, action) => {
                state.storyLoading = false;
                state.storyError = action.error.message!;
            })
            .addCase(saveStory.fulfilled, (state, action) => {
                state.data.forEach((item) => {
                    if (item.id === action.payload.id) item = action.payload
                    return
                })
                state.storyLoading = false;
            })
    }
})