import React, { useState, useEffect, useRef } from "react";
import { Group, Rect, Circle, Text, Transformer, Image } from "react-konva";
import useImage from 'use-image';

const RoundedRectangleNode = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onAddChild,
  onDragEnd,
  onEdit,
  onDelete
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [addImage] = useImage('/add.png'); 
  const [deleteImage] = useImage('/delete (1).png');
  const [editImage] = useImage('/write.png');
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
      setShowIcons(true); // Show icons when selected
    } else {
      setShowIcons(false); // Hide icons when not selected
    }
  }, [isSelected]);

  // Define bluish-grey color for text
  const textColor = "#0E2038"; // Bluish-grey text color

  // Define grey color for node
  const nodeColor = "#E8E8E8"; // Grey color for the node

  const radius = shapeProps.height / 2;
  const rectWidth = shapeProps.width - 2 * radius;

  return (
    <React.Fragment>
      <Group
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable
        x={shapeProps.x}
        y={shapeProps.y}
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
          const newWidth = Math.max(60, shapeProps.width * scaleX);
          const newHeight = Math.max(30, shapeProps.height * scaleY);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
          });
        }}
      >
        {/* Left Circle */}
        <Circle
          x={radius}
          y={radius}
          radius={radius}
          fill={nodeColor}
        />
        
        {/* Right Circle */}
        <Circle
          x={rectWidth + radius}
          y={radius}
          radius={radius}
          fill={nodeColor}
        />
        
        {/* Rectangle */}
        <Rect
          x={radius}
          y={0}
          width={rectWidth}
          height={shapeProps.height}
          fill={nodeColor}
        />
        
        {/* Main Text */}
        <Text
          text={shapeProps.text}
          x={10}
          y={10}
          fontSize={16}
          fill={textColor}
          width={shapeProps.width - 20}
          align="center"
          verticalAlign="middle"
          fontFamily="Arial"
          fontStyle="bold"
        />

        {/* Additional Text */}
        {shapeProps.additionalText && (
          <Text
            text={shapeProps.additionalText}
            x={10}
            y={30}
            fontSize={14}
            fill={textColor}
            width={shapeProps.width - 20}
            align="center"
            verticalAlign="middle"
            fontFamily="Arial"
            fontStyle="bold"
          />
        )}
      </Group>
      
      {/* "+" Icon for Adding Child Node - Top-Right Corner */}
      {showIcons && (
        <Image
          image={addImage}
          x={shapeProps.x + shapeProps.width - 28} // Position at the top-right corner
          y={shapeProps.y - 28} // Position above the node
          width={18} // Smaller size
          height={18} // Smaller size
          onClick={onAddChild}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* "Edit" Icon - Top-Left Corner */}
      {showIcons && (
        <Image
          image={editImage}
          x={shapeProps.x - 28} // Position at the top-left corner
          y={shapeProps.y - 28} // Position above the node
          width={18} // Smaller size
          height={18} // Smaller size
          onClick={onEdit}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* "Delete" Icon - Bottom-Left Corner */}
      {showIcons && (
        <Image
          image={deleteImage}
          x={shapeProps.x - 28} // Position at the bottom-left corner
          y={shapeProps.y + shapeProps.height - 28} // Position below the node
          width={18} // Smaller size
          height={18} // Smaller size
          onClick={onDelete}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* Transformer for Resizing */}
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
