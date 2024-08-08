import { createSlice } from '@reduxjs/toolkit';

const nodesSlice = createSlice({
  name: 'nodes',
  initialState: [],
  reducers: {
    addNode: (state, action) => {
      state.push(action.payload);
    },
    updateNode: (state, action) => {
      const index = state.findIndex(node => node.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteNode: (state, action) => {
      return state.filter(node => node.id !== action.payload);
    },
  },
});

export const { addNode, updateNode, deleteNode } = nodesSlice.actions;
export const selectNodes = state => state.nodes;
export default nodesSlice.reducer;
