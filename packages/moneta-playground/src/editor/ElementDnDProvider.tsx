import React from "react";

interface DndElementApi {
  startDrag: () => void;
  stopDrag: () => void;
  dndContainer: HTMLDivElement;
  isDragging: boolean;
}
const DEFAULT_DND_ELEMENT_API: DndElementApi = {
  startDrag: () => void 0,
  stopDrag: () => void 0,
  dndContainer: document.createElement("div"),
  isDragging: false,
};

export const DndElementContext = React.createContext<DndElementApi>(
  DEFAULT_DND_ELEMENT_API
);

export const ElementDndProvider: React.FC = ({ children }) => {
  const [isDragging, setDragging] = React.useState(false);
  const [el, setEl] = React.useState<HTMLDivElement | null>(null);
  const api = React.useMemo(
    () => ({
      isDragging,
      startDrag: () => setDragging(true),
      stopDrag: () => setDragging(false),
      dndContainer: el || document.createElement("div"),
    }),
    [isDragging, el]
  );

  return (
    <DndElementContext.Provider value={api}>
      <div ref={setEl} className="element">
        {children}
      </div>
    </DndElementContext.Provider>
  );
};
