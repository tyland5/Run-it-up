// this is for the redux object. that way we can refresh specific posts users liked or disliked across screens
import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'likedPosts',
    initialState: {
      value: {},
    },
    reducers: {
      unlikePost: (state, action) => {
        delete state.value[action.payload] // remove post id from set of likes posts
      },
      likePost: (state, action) => {
        state.value[action.payload[0]] = action.payload[1] // add post id to set of liked posts
      },
      clearLikes: (state) => {
        state.value = {}
      }
    },
  })
  
export const { unlikePost, likePost, clearLikes } = counterSlice.actions

const accountInfoSlice = createSlice({
  name: 'pfp',
  initialState:{
    value: {}
  },
  reducers:{
    setUserInfo: (state, action) =>{
      state.value = action.payload
    }
  }
})

export const { setUserInfo } = accountInfoSlice.actions

export default configureStore({
  reducer: {
    likedPosts: counterSlice.reducer,
    accountInfo: accountInfoSlice.reducer
  },
})