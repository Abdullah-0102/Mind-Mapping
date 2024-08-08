// src/components/ModalForm.jsx
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addNode, updateNode } from '../redux/slices/nodeSlice';
import { addConnection } from '../redux/slices/connectionSlice';

const ModalForm = ({ isOpen, onRequestClose, selectedId, editingNodeId, nodeData, setNodeData, lineType, setLineType }) => {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingNodeId) {
      dispatch(updateNode({ ...nodeData, id: editingNodeId }));
    } else {
      const newNode = {
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight / 2 - 50,
        radiusX: Math.max(60, nodeData.text.length * 10),
        radiusY: Math.max(30, nodeData.text.length * 5),
        fill: 'blue',
        id: `node${Date.now()}`, // unique ID
        text: nodeData.text,
      };

      dispatch(addNode(newNode));

      if (selectedId) {
        dispatch(addConnection({ from: selectedId, to: newNode.id, type: lineType }));
      }

      setNodeData({ text: '', radius: 100 });
    }

    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Node Data Input"
    >
      <h2>{editingNodeId ? 'Edit Node Data' : 'Enter Node Data'}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default ModalForm;
