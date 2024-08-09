import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodes/nodesSlice';
import connectionsReducer from './connections/connectionsSlice';

const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    connections: connectionsReducer,
  },
});

export default store;
