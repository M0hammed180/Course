import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; 
import courseRducer from "./courseSlice"; 

const store = configureStore({
  reducer: {
    user: userReducer, 
    course:courseRducer
  },
});

export default store;