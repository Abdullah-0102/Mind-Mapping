// src/components/connections/ConnectionLines.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-konva';

const ConnectionLines = () => {
  const connections = useSelector(state => state.connections);
  const nodes = useSelector(state => state.nodes);

  return (
    <>
      {connections.map((connection, index) => {
        const fromNode = nodes.find(node => node.id === connection.from);
        const toNode = nodes.find(node => node.id === connection.to);

        if (!fromNode || !toNode) return null;

        const fromCenterX = fromNode.x;
        const fromCenterY = fromNode.y;
        const toCenterX = toNode.x;
        const toCenterY = toNode.y;

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
      })}
    </>
  );
};

export default ConnectionLines;
