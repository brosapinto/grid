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
      className="editor-viewport"
      renderView={(props) => <div {...props} className="editor-view" />}
      // @ts-ignore
      ref={(scrollbars) => scrollbars && setRef(scrollbars.view)}
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
