import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("userData")) || {
  userId: "",
  userName: "",
  role: "",
  email: "",
  phone: "",
  isAuthenticated: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState: storedUser,
  reducers: {
    setUserData: (state, action) => {
      state.userId = action.payload._id;
      state.userName = action.payload.name;
      state.role = action.payload.role;
      state.academic_year = action.payload.academic_year;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.isAuthenticated = true;
      localStorage.setItem("userData", JSON.stringify(state));
    },
    logout: (state) => {
      state.userId = "";
      state.userName = "";
      state.role = "";
      state.academic_year = "";
      state.email = "";
      state.phone = "";
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
    },
  },
});
export const { setUserData, logout } = UserSlice.actions;
export default UserSlice.reducer;
