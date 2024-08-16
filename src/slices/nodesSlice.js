import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    addNode: (state, action) => {
      state.push(action.payload); // Adds a new node
    },
    updateNode: (state, action) => {
      const index = state.findIndex((node) => node.id === action.payload.id);
      if (index !== -1) {
        // Spread the existing node's properties and overwrite with the new ones
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteNode: (state, action) => {
      return state.filter((node) => node.id !== action.payload); // Removes a node
    },
  },
});

export const { addNode, updateNode, deleteNode } = nodesSlice.actions;
export default nodesSlice.reducer;
