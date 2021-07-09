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
    <div className="App">
      <Scrollbars
        autoHide
        onScroll={() => {}}
        tagName="section"
        className="scrollParent"
        // unset inline height, let CSS rule take precedence
        style={{ height: undefined }}
        renderView={(props) => <div {...props} className="viewClass" />}
        ref={(ref: (Scrollbars & { view: HTMLDivElement }) | null) =>
          ref && setRef(ref.view)
        }
      >
        <div className="content padding">
          {ref && (
            <ViewportCtx.Provider value={ref}>
              {props.children}
            </ViewportCtx.Provider>
          )}
        </div>
      </Scrollbars>
    </div>
  );
};

export default Viewport;
