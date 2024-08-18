// src/App.js
import React from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addNode, updateNode, deleteNode } from "./slices/nodesSlice";
import {
  addConnection,
  deleteConnection,
  updateConnection,
} from "./slices/connectionsSlice";
import { useRef } from "react";
import RoundedRectangleNode from "./RoundedRectangleNode";
import { getConnectionPoints } from "./utils";
import CustomModal from "./CustomModal";

const App = () => {
  const nodes = useSelector((state) => state.nodes);
  const connections = useSelector((state) => state.connections);
  const dispatch = useDispatch();
  const stageRef = useRef(null);

  const [selectedId, selectShape] = React.useState(null);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [nodeData, setNodeData] = React.useState({
    text: "",
    additionalText: "",
  });
  const [editingNodeId, setEditingNodeId] = React.useState(null);
  const [lineType, setLineType] = React.useState("Straight Line");
  const [labelModalIsOpen, setLabelModalIsOpen] = React.useState(false);
  const [selectedConnection, setSelectedConnection] = React.useState(null);
  const [connectionLabel, setConnectionLabel] = React.useState("");
  const [modalType, setModalType] = React.useState("add");
  const [parentNodeId, setParentNodeId] = React.useState(null);
  const [draggingNode, setDraggingNode] = React.useState(null);

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      setEditingNodeId(null);
      setSelectedConnection(null);
    }
  };

  const handleZoom = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(0.5, Math.min(2, newScale)); // Limit zoom scale between 0.5 and 2

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleAddNode = () => {
    const newNodeId = `node${nodes.length + 1}`;

    let newX, newY, nodeColor;

    if (parentNodeId) {
      const parentNode = nodes.find((n) => n.id === parentNodeId);
      newX = parentNode.x + (Math.random() - 0.5) * 200;
      newY = parentNode.y + parentNode.height + 50 + Math.random() * 50;

      const parentNodeIsRoot = nodes[0] && nodes[0].id === parentNodeId;
      nodeColor = parentNodeIsRoot ? "green" : "yellow";
    } else {
      newX = Math.random() * (window.innerWidth - 200) + 100;
      newY = Math.random() * (window.innerHeight - 200) + 100;
      nodeColor = "blue";
    }

    const newNode = {
      x: newX,
      y: newY,
      width: Math.max(100, nodeData.text.length * 10),
      height: 50,
      fill: nodeColor,
      id: newNodeId,
      text: nodeData.text,
      additionalText: nodeData.additionalText,
    };

    dispatch(addNode(newNode));

    if (parentNodeId) {
      dispatch(
        addConnection({
          from: parentNodeId,
          to: newNode.id,
          type: lineType,
          label: "",
        })
      );
    } else if (selectedId) {
      dispatch(
        addConnection({
          from: selectedId,
          to: newNode.id,
          type: lineType,
          label: "",
        })
      );
    }

    selectShape(newNodeId);
    setModalIsOpen(false);
    setNodeData({ text: "", additionalText: "" });
    setParentNodeId(null);
  };

  const handleEditNode = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    setNodeData({ text: node.text, additionalText: node.additionalText || "" });
    setEditingNodeId(nodeId);
    setModalType("edit");
    setModalIsOpen(true);
  };

  const handleUpdateNode = () => {
    dispatch(updateNode({ ...nodeData, id: editingNodeId }));
    setModalIsOpen(false);
    setNodeData({ text: "", additionalText: "" });
    setEditingNodeId(null);
  };

  const handleDeleteNode = () => {
    if (editingNodeId) {
      dispatch(deleteNode(editingNodeId));
      dispatch(deleteConnection(editingNodeId));
      setModalIsOpen(false);
      selectShape(null);
    }
  };

  const handleSaveLabel = () => {
    dispatch(
      updateConnection({
        ...selectedConnection,
        label: connectionLabel,
        type: lineType, // Update the connection type
      })
    );
    setLabelModalIsOpen(false);
    setConnectionLabel("");
  };
  

  const handleSelectNode = (nodeId) => {
    selectShape(nodeId);
  };

  const handleDeleteLabel = () => {
    dispatch(updateConnection({ ...selectedConnection, label: "" }));
    setLabelModalIsOpen(false);
    setConnectionLabel("");
  };

  const handleDragEnd = (draggedNodeId, newX, newY) => {
    const draggedNode = nodes.find((node) => node.id === draggedNodeId);

    const overlappingNode = nodes.find((node) => {
      if (node.id === draggedNodeId) return false;

      const isOverlapping =
        newX + draggedNode.width > node.x &&
        newX < node.x + node.width &&
        newY + draggedNode.height > node.y &&
        newY < node.y + node.height;

      return isOverlapping;
    });

    if (overlappingNode) {
      const offsetX =
        Math.random() > 0.5
          ? draggedNode.width + 20
          : -(draggedNode.width + 20);
      const offsetY =
        Math.random() > 0.5
          ? draggedNode.height + 20
          : -(draggedNode.height + 20);

      const adjustedX = overlappingNode.x + offsetX;
      const adjustedY = overlappingNode.y + offsetY;

      const updatedNode = {
        ...draggedNode,
        x: adjustedX,
        y: adjustedY,
      };

      dispatch(updateNode(updatedNode));

      dispatch(deleteConnection(draggedNode.id));
      dispatch(
        addConnection({
          from: overlappingNode.id,
          to: draggedNode.id,
          type: lineType,
          label: "",
        })
      );
    } else {
      dispatch(updateNode({ ...draggedNode, x: newX, y: newY }));
    }
  };

  const handleDotDragEnd = (connection, newX, newY) => {
    const childNode = nodes.find((node) => node.id === connection.to);

    const overlappingNode = nodes.find((node) => {
      if (node.id === childNode.id) return false;

      const isOverlapping =
        newX > node.x &&
        newX < node.x + node.width &&
        newY > node.y &&
        newY < node.y + node.height;

      return isOverlapping;
    });

    if (overlappingNode) {
      dispatch(deleteConnection(connection.to)); // Remove old connection

      // Update the connection to point to the new parent node
      dispatch(
        addConnection({
          from: overlappingNode.id,
          to: childNode.id,
          type: lineType,
          label: "",
        })
      );

      // Update the child node's position relative to the new parent
      const offsetX = Math.random() * 50 - 25;
      const offsetY = overlappingNode.height + 50 + Math.random() * 50;

      const updatedChildNode = {
        ...childNode,
        x: overlappingNode.x + offsetX,
        y: overlappingNode.y + offsetY,
      };
      dispatch(updateNode(updatedChildNode));
    }
  };

  const drawConnections = () => {
    return connections.map((connection, index) => {
      const fromNode = nodes.find((node) => node.id === connection.from);
      const toNode = nodes.find((node) => node.id === connection.to);
  
      if (!fromNode || !toNode) return null;
  
      const points = getConnectionPoints(fromNode, toNode, connection.type);
  
      return (
        <React.Fragment key={index}>
          <Line
            points={points}
            stroke="rgba(128, 128, 128, 0.5)" // Grey color with 50% transparency
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            tension={connection.type === "Curved Line" ? 0.5 : 0}
            onClick={() => setSelectedConnection(connection)}
            onDblClick={() => {
              setSelectedConnection(connection);
              setConnectionLabel(connection.label || "");
              setLineType(connection.type); // Set the current type in the modal
              setLabelModalIsOpen(true);
            }}
          />
          {connection.label && (
            <Text
              text={connection.label}
              x={(points[0] + points[points.length - 2]) / 2}
              y={(points[1] + points[points.length - 1]) / 2 - 10}
              fontSize={16}
              fill="black"
              align="center"
              fontFamily="Arial"
              fontStyle="bold"
            />
          )}
  
          {selectedConnection === connection && (
            <Circle
              x={points[0]} // x-coordinate of the start of the line
              y={points[1]} // y-coordinate of the start of the line
              radius={8}
              fill="black"
              draggable
              onDragEnd={(e) =>
                handleDotDragEnd(connection, e.target.x(), e.target.y())
              }
            />
          )}
        </React.Fragment>
      );
    });
  };
  

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        Mind Map Application
      </h1>

      <div className="flex space-x-4 justify-center my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          onClick={() => {
            setModalType("add");
            setModalIsOpen(true);
          }}
        >
          Add Node
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow"
          onClick={() => handleEditNode(selectedId)}
          disabled={!selectedId}
        >
          Edit Node
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
          onClick={() => {
            setModalType("delete");
            setModalIsOpen(true);
          }}
          disabled={!selectedId}
        >
          Delete Node
        </button>
      </div>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onWheel={handleZoom}
      >
        <Layer>
          {nodes.map((node, i) => (
            <RoundedRectangleNode
              key={i}
              shapeProps={node}
              isSelected={node.id === selectedId}
              onSelect={() => handleSelectNode(node.id)}
              onChange={(newAttrs) => dispatch(updateNode(newAttrs))}
              onAddChild={() => {
                setParentNodeId(node.id);
                setModalType("add");
                setModalIsOpen(true);
              }}
              onEdit={() => handleEditNode(node.id)}
              onDelete={() => {
                dispatch(deleteNode(node.id));
                dispatch(deleteConnection(node.id));
                selectShape(null);
              }}
              onDragEnd={(newX, newY) => handleDragEnd(node.id, newX, newY)}
            />
          ))}
          {drawConnections()}
        </Layer>
      </Stage>

      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        title={
          modalType === "add"
            ? "Add Node"
            : modalType === "edit"
            ? "Edit Node"
            : "Delete Node"
        }
        onSubmit={
          modalType === "add"
            ? handleAddNode
            : modalType === "edit"
            ? handleUpdateNode
            : handleDeleteNode
        }
        submitLabel={
          modalType === "add"
            ? "Add"
            : modalType === "edit"
            ? "Update"
            : "Delete"
        }
        showCancel={modalType !== "delete"}
      >
        {modalType !== "delete" && (
          <>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="text"
              >
                Node Text
              </label>
              <input
                id="text"
                type="text"
                value={nodeData.text}
                onChange={(e) =>
                  setNodeData({ ...nodeData, text: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter node text"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="additionalText"
              >
                Additional Text
              </label>
              <input
                id="additionalText"
                type="text"
                value={nodeData.additionalText}
                onChange={(e) =>
                  setNodeData({ ...nodeData, additionalText: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter additional text"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lineType"
              >
                Connection Line Type
              </label>
              <select
                id="lineType"
                value={lineType}
                onChange={(e) => setLineType(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Straight Line</option>
                <option>Curved Line</option>
                <option>Angled Line</option>
                <option>Rounded Line</option>
              </select>
            </div>
          </>
        )}
        {modalType === "delete" && (
          <p className="text-gray-700 text-center">
            Are you sure you want to delete this node?
          </p>
        )}
      </CustomModal>

      <CustomModal
  isOpen={labelModalIsOpen}
  onRequestClose={() => setLabelModalIsOpen(false)}
  title="Add/Update Label to Connection"
  onSubmit={handleSaveLabel}
  submitLabel="Save"
>
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="label"
    >
      Connection Label
    </label>
    <input
      id="label"
      type="text"
      value={connectionLabel}
      onChange={(e) => setConnectionLabel(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder="Enter connection label"
    />
  </div>
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="lineType"
    >
      Connection Line Type
    </label>
    <select
      id="lineType"
      value={lineType}
      onChange={(e) => setLineType(e.target.value)}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="Straight Line">Straight Line</option>
      <option value="Curved Line">Curved Line</option>
      <option value="Angled Line">Angled Line</option>
      <option value="Rounded Line">Rounded Line</option>
    </select>
  </div>
  <div className="flex justify-end">
    <button
      type="button"
      onClick={handleDeleteLabel}
      className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
    >
      Delete Label
    </button>
  </div>
</CustomModal>

    </div>
  );
};

export default App;
