// src/App.js
import React from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addNode, updateNode, deleteNode } from "./slices/nodesSlice";
import {
  addConnection,
  updateConnection,
  deleteConnection,
} from "./slices/connectionsSlice";
import RoundedRectangleNode from "./RoundedRectangleNode";
import { getConnectionPoints } from "./utils";
import CustomModal from "./CustomModal"; // Import the CustomModal component

const App = () => {
  const nodes = useSelector((state) => state.nodes);
  const connections = useSelector((state) => state.connections);
  const dispatch = useDispatch();

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
  const [parentNodeId, setParentNodeId] = React.useState(null); // To track the parent node ID

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      setEditingNodeId(null);
      setSelectedConnection(null);
    }
  };

  const handleAddNode = () => {
    const newNodeId = `node${nodes.length + 1}`;

    let newX, newY;
    if (parentNodeId) {
      const parentNode = nodes.find((n) => n.id === parentNodeId);
      newX = parentNode.x;
      newY = parentNode.y + parentNode.height + 50;
    } else if (nodes.length === 0) {
      newX = window.innerWidth / 2 - 50;
      newY = window.innerHeight / 2 - 50;
    } else {
      const angle = (Math.PI * 2) / (nodes.length + 1);
      const distance = 150;
      const firstNode = nodes[0];
      newX = firstNode.x + distance * Math.cos(angle * nodes.length);
      newY = firstNode.y + distance * Math.sin(angle * nodes.length);
    }

    const newNode = {
      x: newX,
      y: newY,
      width: Math.max(100, nodeData.text.length * 10),
      height: 50,
      fill: "transparent", // Transparent fill for the node
      stroke: "yellow", // Yellow border color for the node
      // fill: "blue",
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
    setParentNodeId(null); // Reset the parent node ID after creation
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
    if (selectedId) {
      dispatch(deleteNode(selectedId));
      dispatch(deleteConnection(selectedId));
      setModalIsOpen(false);
      selectShape(null);
    }
  };

  const handleSaveLabel = () => {
    dispatch(
      updateConnection({ ...selectedConnection, label: connectionLabel })
    );
    setLabelModalIsOpen(false);
    setConnectionLabel("");
  };

  const handleDeleteLabel = () => {
    dispatch(updateConnection({ ...selectedConnection, label: "" }));
    setLabelModalIsOpen(false);
    setConnectionLabel("");
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
            stroke="lightgreen"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
            tension={connection.type === "Curved Line" ? 0.5 : 0}
            onClick={() => {
              setSelectedConnection(connection);
              setConnectionLabel(connection.label || "");
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
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {nodes.map((node, i) => (
            <RoundedRectangleNode
              key={i}
              shapeProps={node}
              isSelected={node.id === selectedId}
              onSelect={() => handleEditNode(node.id)} // Open modal to edit node on click
              onChange={(newAttrs) => {
                dispatch(updateNode(newAttrs));
              }}
              onAddChild={() => {
                setParentNodeId(node.id); // Set the parent node ID
                setModalType("add");
                setModalIsOpen(true); // Open the modal to create the child node
              }} // Handle adding child node and open modal
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
