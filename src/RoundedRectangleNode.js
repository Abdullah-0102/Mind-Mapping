// src/RoundedRectangleNode.js
import React from "react";
import { Rect, Transformer, Text } from "react-konva";

const RoundedRectangleNode = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onAddChild,
  onDragEnd,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Determine the text color based on the node's fill color
  const textColor = shapeProps.fill === "yellow" ? "black" : "white";

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        cornerRadius={10}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          onDragEnd(newX, newY); // Call the onDragEnd handler with new coordinates
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
            height: Math.max(30, node.height() * scaleY),
          });
        }}
      />
      <Text
        text="+"
        fontSize={18}
        fill="black"
        x={shapeProps.x + shapeProps.width / 2 - 10}
        y={shapeProps.y - 20}
        onClick={onAddChild}
        style={{ cursor: "pointer" }}
      />
      <Text
        text={shapeProps.text}
        x={shapeProps.x + 10}
        y={shapeProps.y + 10}
        fontSize={16}
        fill={textColor}
        width={shapeProps.width - 20}
        align="center"
        verticalAlign="middle"
      />
      {shapeProps.additionalText && (
        <Text
          text={shapeProps.additionalText}
          x={shapeProps.x + 10}
          y={shapeProps.y + 30}
          fontSize={14}
          fill={textColor}
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
            if (Math.abs(newBox.width) < 60 || Math.abs(newBox.height) < 30) {
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
