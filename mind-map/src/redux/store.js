// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import nodeReducer from './slices/nodeSlice';
import connectionReducer from './slices/connectionSlice';

const store = configureStore({
  reducer: {
    nodes: nodeReducer,
    connections: connectionReducer,
  },
});

export default store;
