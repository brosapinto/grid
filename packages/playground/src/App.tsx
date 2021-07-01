import React, { useRef } from "react";
import "./App.css";
import Grid, { Cell, useSelection, GridRef } from "@rowsncolumns/grid";
import Scrollbars from "react-custom-scrollbars";
import useInnerElemSize from "./use-inner-element-size";

const Viewport = React.createContext<HTMLDivElement>(
  document.createElement("div")
);

// Padding at the bottom of the table to offset the horizontal scrollbar
const PADDING_BOTTOM = 15;

const OuterElem = React.forwardRef<HTMLDivElement, {}>(function OuterElem(
  props,
  ref
) {
  // completely disable react-window scroll, we're taking over
  return <div ref={ref} {...props} onScroll={() => void 0} />;
});

const GridContainer = () => {
  const rowCount = 200;
  const columnCount = 30;
  const gridRef = useRef<GridRef>(null);
  const { selections, ...selectionProps } = useSelection({
    getValue(): React.ReactText | undefined {
      return "";
    },
    gridRef: gridRef,
    rowCount,
    columnCount,
  });

  return (
    <Grid
      // outerElementType={OuterElem}
      ref={gridRef}
      width={600}
      rowCount={rowCount}
      columnCount={columnCount}
      itemRenderer={(props) => {
        return <Cell {...props} value={props.rowIndex.toString()} />;
      }}
      selections={selections}
      {...selectionProps}
    />
  );
};

export default function App() {
  const [viewportRef, setViewport] = React.useState<HTMLDivElement | null>(
    null
  );
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
          ref && setViewport(ref.view)
        }
      >
        <div className="content padding">
          {viewportRef && (
            <Viewport.Provider value={viewportRef}>
              <GridContainer />
            </Viewport.Provider>
          )}
        </div>
      </Scrollbars>
    </div>
  );
}
