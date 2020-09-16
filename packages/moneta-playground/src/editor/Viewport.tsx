import React, { createContext, useContext, useState } from "react";

const ViewportCtx = createContext<HTMLElement | null>(null);

export const useViewport = () => {
  const elem = useContext(ViewportCtx);
  if (elem === null) throw new ReferenceError("Context is not defined");
  return elem;
};

const Viewport: React.FC = (props) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  return (
    <section ref={setRef}>
      {ref && (
        <ViewportCtx.Provider value={ref}>
          {props.children}
        </ViewportCtx.Provider>
      )}
    </section>
  );
};

export default Viewport;
