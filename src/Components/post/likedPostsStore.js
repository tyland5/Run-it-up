// this is for the redux object. that way we can refresh specific posts users liked or disliked across screens
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './likedPostsSlice'

export default configureStore({
  reducer: {
    likedPosts: counterReducer
  },
})