import { combineReducers } from 'redux';
import nodesReducer from './nodes/nodesSlice';
import connectionsReducer from './connections/connectionsSlice';

const rootReducer = combineReducers({
  nodes: nodesReducer,
  connections: connectionsReducer,
});

export default rootReducer;
