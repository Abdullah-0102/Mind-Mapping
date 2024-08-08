import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import connectionsReducer from './connectionsSlice';

const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    connections: connectionsReducer,
  },
});

export default store;
