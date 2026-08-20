import { createSlice } from "@reduxjs/toolkit";

const CourseSlice = createSlice({
  name: "Course",
  initialState: { levelsLength: "" },
  reducers: {
    setLevelsLength: (state, action) => {
      state.levelsLength = action.payload._id;
    },
  },
});
export const { setLevelsLength } = CourseSlice.actions;
export default CourseSlice.reducer;
