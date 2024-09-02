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
    },
  })
  
export const { unlikePost, likePost } = counterSlice.actions
export default counterSlice.reducer