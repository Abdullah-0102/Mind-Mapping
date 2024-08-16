// src/slices/connectionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    addConnection: (state, action) => {
      state.push(action.payload); // Adds a new connection
    },
    updateConnection: (state, action) => {
      const index = state.findIndex(
        (conn) =>
          conn.from === action.payload.from && conn.to === action.payload.to
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload }; // Updates an existing connection
      }
    },
    deleteConnection: (state, action) => {
      return state.filter(
        (conn) => conn.from !== action.payload && conn.to !== action.payload
      ); // Removes connections related to the deleted node
    },
  },
});

export const { addConnection, updateConnection, deleteConnection } =
  connectionsSlice.actions;
export default connectionsSlice.reducer;
