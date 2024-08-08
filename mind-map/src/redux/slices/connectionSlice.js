// src/redux/slices/connectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const connectionSlice = createSlice({
  name: 'connections',
  initialState: [],
  reducers: {
    addConnection: (state, action) => {
      state.push(action.payload);
    },
    deleteConnectionsByNode: (state, action) => {
      return state.filter(connection => connection.from !== action.payload && connection.to !== action.payload);
    },
  },
});

export const { addConnection, deleteConnectionsByNode } = connectionSlice.actions;
export default connectionSlice.reducer;
