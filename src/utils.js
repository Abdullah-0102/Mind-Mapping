// src/utils.js
export const getConnectionPoints = (fromNode, toNode, type) => {
  const fromX = fromNode.x + fromNode.width / 2;
  const fromY = fromNode.y + fromNode.height / 2;
  const toX = toNode.x + toNode.width / 2;
  const toY = toNode.y + toNode.height / 2;

  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const offsetX = (deltaX / distance) * (fromNode.width / 2);
  const offsetY = (deltaY / distance) * (fromNode.height / 2);

  const adjustedFromX = fromX + offsetX;
  const adjustedFromY = fromY + offsetY;
  const adjustedToX = toX - offsetX;
  const adjustedToY = toY - offsetY;

  switch (type) {
    case "Curved Line":
      return [
        adjustedFromX,
        adjustedFromY,
        (adjustedFromX + adjustedToX) / 2,
        adjustedFromY, // Control point
        (adjustedFromX + adjustedToX) / 2,
        adjustedToY, // Control point
        adjustedToX,
        adjustedToY,
      ];
    case "Angled Line":
      return [
        adjustedFromX,
        adjustedFromY,
        adjustedFromX,
        adjustedToY,
        adjustedToX,
        adjustedToY,
      ];
    case "Rounded Line":
      return [
        adjustedFromX,
        adjustedFromY,
        adjustedFromX + (adjustedToX - adjustedFromX) / 2,
        adjustedFromY,
        adjustedToX - (adjustedToX - adjustedFromX) / 2,
        adjustedToY,
        adjustedToX,
        adjustedToY,
      ];
    default: // 'Straight Line'
      return [adjustedFromX, adjustedFromY, adjustedToX, adjustedToY];
  }
};
