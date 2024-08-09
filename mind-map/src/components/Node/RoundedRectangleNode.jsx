import  { useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Rect, Transformer, Text } from 'react-konva';

const RoundedRectangleNode = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        cornerRadius={10}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
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
        text={shapeProps.text}
        x={shapeProps.x + 10}
        y={shapeProps.y + 10}
        fontSize={16}
        fill="white"
        width={shapeProps.width - 20}
        align="center"
        verticalAlign="middle"
      />
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
    </>
  );
};

// Define PropTypes
RoundedRectangleNode.propTypes = {
  shapeProps: PropTypes.shape({
    id: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RoundedRectangleNode;
