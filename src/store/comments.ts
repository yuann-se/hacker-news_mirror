import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface IResponse {
    data: {
        id: string;
        body: string;
        author: string;
        created: string;
        replies: {
            data: {
                children: IResponse[]
            }
        }
    }
}

interface IInitState {
    commentsData: {
        [id: string]: IResponse[]
    }
    loading: boolean;
    fetchError: string;
}

const initialState: IInitState = {
    commentsData: {},
    loading: false,
    fetchError: ''
}

export const saveComments = createAsyncThunk('SAVE_POST_COMMENTS',
    async (postID: string) => {
        const res = await axios.get(
            `https://api.reddit.com/comments/${postID}?sort=top`,
        );
        const initRes = res.data[1].data.children;
        // const comments = getRequiredData(initRes);
        return { postID, comments }
    })

export const comments = createSlice({
    name: 'comments',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveComments.pending, (state) => {
                state.loading = true;
                state.fetchError = '';
            })
            .addCase(saveComments.fulfilled, (state, action) => {
                // state.commentsData[action.payload.postID] = action.payload.comments;
                state.loading = false;
                state.fetchError = '';
            })
            .addCase(saveComments.rejected, (state, action) => {
                state.fetchError = action.error.message!;
                state.loading = false;
            })
    }
})