// src/components/nodes/OvalNode.jsx
import React, { useRef, useEffect } from 'react';
import { Ellipse, Transformer, Text } from 'react-konva';

const OvalNode = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Ellipse
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            radiusX: Math.max(30, node.radiusX() * scaleX),
            radiusY: Math.max(30, node.radiusY() * scaleY),
          });
        }}
      />
      <Text
        text={shapeProps.text}
        x={shapeProps.x - shapeProps.radiusX / 2}
        y={shapeProps.y - shapeProps.radiusY / 2}
        fontSize={16}
        fill="white"
        width={shapeProps.radiusX}
        align="center"
        verticalAlign="middle"
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 30 || Math.abs(newBox.height) < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default OvalNode;
