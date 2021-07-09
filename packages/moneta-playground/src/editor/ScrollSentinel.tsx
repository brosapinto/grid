import React from "react";

interface ScrollSentinelProps {
  direction: "LEFT" | "RIGHT";
  onDragOver: () => void;
  width?: number;
  left?: number;
}

const ScrollSentinel: React.FC<ScrollSentinelProps> = ({
  direction,
  onDragOver,
  width = 20,
  left = 0,
}) => {
  const positioning = direction === "LEFT" ? { left } : { right: 0 };
  return (
    <div
      onDragOver={onDragOver}
      style={{
        pointerEvents: "all",
        position: "fixed",
        ...positioning,
        bottom: 0,
        top: 0,
        width,
        zIndex: 5,
        border: "1px solid yellow",
      }}
    />
  );
};

export default ScrollSentinel;
