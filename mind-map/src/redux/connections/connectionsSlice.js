import { createSlice } from '@reduxjs/toolkit';

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: [],
  reducers: {
    addConnection: (state, action) => {
      state.push(action.payload);
    },
    deleteConnectionsForNode: (state, action) => {
      return state.filter(connection => connection.from !== action.payload && connection.to !== action.payload);
    },
  },
});

export const { addConnection, deleteConnectionsForNode } = connectionsSlice.actions;
export const selectConnections = state => state.connections;
export default connectionsSlice.reducer;
