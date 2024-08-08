
const NodeControls = ({ onAddNode, onEditNode, onDeleteNode }) => {
  return (
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <button onClick={onAddNode}>Add Node</button>
      <button onClick={onEditNode}>Edit</button>
      <button onClick={onDeleteNode}>Delete</button>
    </div>
  );
};

export default NodeControls;
