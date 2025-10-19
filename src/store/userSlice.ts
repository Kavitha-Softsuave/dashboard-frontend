import { createSlice } from "@reduxjs/toolkit";

interface IUserState {
  fileId: string;
}

const initialState: IUserState = {
  fileId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateFileId: (state, action) => {
      state.fileId = action.payload;
    },
  },
});

export const { updateFileId } = userSlice.actions;
export default userSlice.reducer;
