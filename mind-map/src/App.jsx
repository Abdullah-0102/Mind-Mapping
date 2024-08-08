import React, { useState } from 'react';
import MindMapStage from './components/MindMap/MindMapStage';
import MindMapControls from './components/MindMap/MindMapControls';

const App = () => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div>
      <MindMapControls selectedId={selectedId} />
      <MindMapStage selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  );
};

export default App;
