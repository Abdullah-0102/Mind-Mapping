import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNodes, addNode, updateNode, deleteNode } from '../../redux/nodes/nodesSlice';
import { addConnection, deleteConnectionsForNode } from '../../redux/connections/connectionsSlice';

const MindMapControls = ({ selectedId }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nodeData, setNodeData] = useState({ text: '' });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [lineType, setLineType] = useState('Straight Line');

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      width: 120,
      height: 60,
      text: 'New Node',
    };
    dispatch(addNode(newNode));
    if (selectedId) {
      dispatch(addConnection({ from: selectedId, to: newNode.id, type: lineType }));
    }
    setModalIsOpen(false);
  };

  const handleEditNode = () => {
    if (selectedId) {
      const node = nodes.find(n => n.id === selectedId);
      setNodeData({ text: node.text });
      setEditingNodeId(selectedId);
      setModalIsOpen(true);
    }
  };

  const handleDeleteNode = () => {
    if (selectedId) {
      dispatch(deleteNode(selectedId));
      dispatch(deleteConnectionsForNode(selectedId));
      setEditingNodeId(null);
      setModalIsOpen(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (editingNodeId) {
      dispatch(updateNode({ ...nodeData, id: editingNodeId }));
      setEditingNodeId(null);
    } else {
      handleAddNode();
    }
    setModalIsOpen(false);
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <button onClick={() => setModalIsOpen(true)}>Create Node</button>
      {selectedId && (
        <>
          <button onClick={handleEditNode}>Edit</button>
          <button onClick={handleDeleteNode}>Delete</button>
        </>
      )}
      {modalIsOpen && (
        <div>
          <h2>{editingNodeId ? 'Edit Node Data' : 'Enter Node Data'}</h2>
          <form onSubmit={handleModalSubmit}>
            <label>
              Text:
              <input
                type="text"
                value={nodeData.text}
                onChange={(e) => setNodeData({ ...nodeData, text: e.target.value })}
                required
              />
            </label>
            <br />
            {!editingNodeId && (
              <>
                <label>
                  Line Type:
                  <select value={lineType} onChange={(e) => setLineType(e.target.value)}>
                    <option value="Straight Line">Straight Line</option>
                    <option value="Curved Line">Curved Line</option>
                    <option value="Angled Line">Angled Line</option>
                    <option value="Rounded Line">Rounded Line</option>
                  </select>
                </label>
                <br />
              </>
            )}
            <button type="submit">{editingNodeId ? 'Update Node' : 'Add Node'}</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MindMapControls;
