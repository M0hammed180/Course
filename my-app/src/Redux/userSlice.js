import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("userData")) || {
  userId: "",
  userName: "",
  role: "",
  email: "",
  phone: "",
  avatar: "",
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
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.avatar = action.payload.avatar || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png";
      state.isAuthenticated = true;
      localStorage.setItem("userData", JSON.stringify(state));
    },
    logout: (state) => {
      state.userId = "";
      state.userName = "";
      state.role = "";
      state.email = "";
      state.phone = "";
      state.avatar = "";
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    },
  },
});
export const { setUserData, logout } = UserSlice.actions;
export default UserSlice.reducer;
