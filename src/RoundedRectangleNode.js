// src/RoundedRectangleNode.js
import React from 'react';
import { Rect, Transformer, Text } from 'react-konva';

const RoundedRectangleNode = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onAddChild,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        cornerRadius={shapeProps.width / 2} // Fully rounded corners
        fill="transparent" // Transparent fill
        stroke="yellow" // Yellow border color
        strokeWidth={2} // Border width
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
            width: Math.max(60, node.width() * scaleX),
            height: Math.max(60, node.height() * scaleY), // Ensure height is consistent with rounded shape
          });
        }}
      />
      <Text
        text="+"
        fontSize={18}
        fill="black" // Black color for the plus icon
        x={shapeProps.x + shapeProps.width / 2 - 10}
        y={shapeProps.y - 20}
        onClick={onAddChild} // Trigger child node creation when the plus icon is clicked
        style={{ cursor: 'pointer' }}
      />
      <Text
        text={shapeProps.text}
        x={shapeProps.x + 10}
        y={shapeProps.y + shapeProps.height / 2 - 8} // Center text vertically
        fontSize={16}
        fill="grey" // Grey color for text
        width={shapeProps.width - 20}
        align="center"
        verticalAlign="middle"
      />
      {shapeProps.additionalText && (
        <Text
          text={shapeProps.additionalText}
          x={shapeProps.x + 10}
          y={shapeProps.y + shapeProps.height / 2 + 10} // Place additional text below the main text
          fontSize={14}
          fill="grey" // Grey color for additional text
          width={shapeProps.width - 20}
          align="center"
          verticalAlign="middle"
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 60 || Math.abs(newBox.height) < 60) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default RoundedRectangleNode;
