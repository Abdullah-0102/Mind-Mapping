// src/components/nodes/NodeMenu.jsx
import React from 'react';

const NodeMenu = ({ selectedId, onEdit, onClose }) => (
  <div style={{ position: 'absolute', top: 10, right: 10 }}>
    <button onClick={onEdit}>Edit</button>
    <button onClick={() => onClose()}>Delete</button>
  </div>
);

export default NodeMenu;
