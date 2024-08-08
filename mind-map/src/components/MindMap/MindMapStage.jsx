import { Stage, Layer } from 'react-konva';
import RoundedRectangleNode from '../Node/RoundedRectangleNode';
import { useDispatch, useSelector } from 'react-redux';
import { selectNodes } from '../../redux/nodesSlice';
import { selectConnections } from '../../redux/connections/connectionsSlice';
// import { Transformer } from 'react-konva';

const MindMapStage = ({ selectedId, setSelectedId }) => {
  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const connections = useSelector(selectConnections);

  const drawConnections = () => {
    return connections.map((connection, index) => {
      const fromNode = nodes.find(node => node.id === connection.from);
      const toNode = nodes.find(node => node.id === connection.to);

      if (!fromNode || !toNode) return null;

      const fromCenterX = fromNode.x + fromNode.width / 2;
      const fromCenterY = fromNode.y + fromNode.height / 2;
      const toCenterX = toNode.x + toNode.width / 2;
      const toCenterY = toNode.y + toNode.height / 2;

      switch (connection.type) {
        case 'Curved Line':
          return (
            <Line
              key={index}
              points={[fromCenterX, fromCenterY, (fromCenterX + toCenterX) / 2, fromCenterY, (fromCenterX + toCenterX) / 2, toCenterY, toCenterX, toCenterY]}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
            />
          );
        case 'Angled Line':
          return (
            <Line
              key={index}
              points={[fromCenterX, fromCenterY, fromCenterX, toCenterY, toCenterX, toCenterY]}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          );
        case 'Rounded Line':
          return (
            <Line
              key={index}
              points={[fromCenterX, fromCenterY, (fromCenterX + toCenterX) / 2, fromCenterY, (fromCenterX + toCenterX) / 2, toCenterY, toCenterX, toCenterY]}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              cornerRadius={10}
            />
          );
        case 'Straight Line':
        default:
          return (
            <Line
              key={index}
              points={[fromCenterX, fromCenterY, toCenterX, toCenterY]}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          );
      }
    });
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) {
          setSelectedId(null);
        }
      }}
      onTouchStart={(e) => {
        if (e.target === e.target.getStage()) {
          setSelectedId(null);
        }
      }}
    >
      <Layer>
        {drawConnections()}
        {nodes.map((node, i) => (
          <RoundedRectangleNode
            key={i}
            shapeProps={node}
            isSelected={node.id === selectedId}
            onSelect={() => setSelectedId(node.id)}
            onChange={(newAttrs) => {
              const updatedNodes = nodes.slice();
              updatedNodes[i] = newAttrs;
              dispatch(updateNode(newAttrs)); // Ensure this action is defined
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default MindMapStage;
