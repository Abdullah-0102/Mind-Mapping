// src/App.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import OvalNode from './components/nodes/OvalNode';
import ConnectionLines from './components/connections/ConnectionLines';
import ModalForm from './components/ModalForm';
import { selectShape, updateShape } from './redux/slices/nodeSlice';
import { deleteConnectionsByNode } from './redux/slices/connectionSlice';

const App = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const connections = useSelector(state => state.connections);
  const selectedId = useSelector(state => state.selectedId);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [nodeData, setNodeData] = React.useState({ text: '', radius: 100 });
  const [lineType, setLineType] = React.useState('Straight Line'); // Default line type

  const handleEditNode = () => {
    if (selectedId) {
      const node = nodes.find(n => n.id === selectedId);
      setNodeData({ text: node.text });
      setModalIsOpen(true);
    }
  };

  const handleDeleteNode = () => {
    if (selectedId) {
      dispatch(deleteNode(selectedId));
      dispatch(deleteConnectionsByNode(selectedId));
    }
  };

  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>Create Mind Map</button>
      {selectedId && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <button onClick={handleEditNode}>Edit</button>
          <button onClick={handleDeleteNode}>Delete</button>
        </div>
      )}
      <ModalForm
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        selectedId={selectedId}
        editingNodeId={selectedId}
        nodeData={nodeData}
        setNodeData={setNodeData}
        lineType={lineType}
        setLineType={setLineType}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            dispatch(selectShape(null));
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) {
            dispatch(selectShape(null));
          }
        }}
      >
        <Layer>
          <ConnectionLines />
          {nodes.map((node, i) => (
            <OvalNode
              key={i}
              shapeProps={node}
              isSelected={node.id === selectedId}
              onSelect={() => dispatch(selectShape(node.id))}
              onChange={(newAttrs) => {
                dispatch(updateShape(newAttrs));
              }}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default App;
