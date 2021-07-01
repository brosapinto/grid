import React, { createContext, useContext, useState } from "react";
import Scrollbars from "react-custom-scrollbars";

const ViewportCtx = createContext<HTMLElement | null>(null);

export const useViewport = () => {
  const elem = useContext(ViewportCtx);
  if (elem === null) throw new ReferenceError("Context is not defined");
  return elem;
};

const Viewport: React.FC = (props) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <Scrollbars
      autoHide
      onScroll={() => {}}
      tagName="section"
      style={{ height: "100vh" }}
      renderView={(props) => <div {...props} />}
      ref={(ref: (Scrollbars & { view: HTMLDivElement }) | null) =>
        ref && setRef(ref.view)
      }
    >
      {ref && (
        <ViewportCtx.Provider value={ref}>
          {props.children}
        </ViewportCtx.Provider>
      )}
    </Scrollbars>
  );
};

export default Viewport;
