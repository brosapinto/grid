import React, { useState } from "react";

const ConfirmDelete: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const [showConfirm, toggleConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div>
        <button onClick={() => toggleConfirm(false)}>NO!</button>
        <button
          onClick={() => {
            toggleConfirm(false);
            onDelete();
          }}
        >
          Really?!
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => toggleConfirm(true)}>Delete</button>
    </div>
  );
};

export default ConfirmDelete;
