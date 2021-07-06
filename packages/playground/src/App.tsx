import React, { useRef, useState } from "react";
import "./App.css";
import Grid, { Cell, useSelection, GridRef } from "@rowsncolumns/grid";
import Scrollbars from "react-custom-scrollbars";
import { Sticky } from "./sticky";
import { Viewport, VISIBLE_WIDTH } from "./viewport";
import { ColumnHeaders, LAST_ROW_HEIGHT } from "./column-headers";
// import useInnerElemSize from "./use-inner-element-size";

const OuterElem = React.memo(
  React.forwardRef<HTMLDivElement, {}>(function OuterElem(props, ref) {
    // completely disable react-window scroll, we're taking over
    return <div {...props} className="outerElem stuckElem" ref={ref} />;
  })
);

const GridContainer = React.memo(({ name }: { name: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowCount = 200;
  const columnCount = 30;
  const totalHeight = 20 * rowCount;
  const gridRef = useRef<GridRef>(null);
  const stuckElem = useRef<HTMLDivElement | null>(null);
  const viewport = React.useContext(Viewport);

  // in css file we add marginLeft, marginRight of 10
  const SIDE_MARGINS = 20;

  const [, forceRerender] = useState(Date.now);

  const { selections, ...selectionProps } = useSelection({
    getValue(): React.ReactText | undefined {
      return "";
    },
    gridRef: gridRef,
    rowCount,
    columnCount,
  });

  React.useEffect(() => {
    // force rerender for now - temp hack to ensure column headers show
    forceRerender(Date.now());
  }, []);

  React.useEffect(() => {
    const grid = gridRef.current;
    const stuckDiv = stuckElem.current;
    const hasScroll = viewport.clientHeight < totalHeight;

    if (!grid || !hasScroll || !stuckDiv) return;

    const handleScroll = () =>
      grid!.scrollTo({
        scrollTop: stuckElem.current?.offsetTop ?? 0,
      });

    viewport.addEventListener("scroll", handleScroll);

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [totalHeight, viewport]);

  const STICKY_HEIGHT = 48;
  const onScrollToOrScrollByHandler = React.useCallback(
    ({ scrollTop }) => {
      if (!containerRef.current) return;

      const offsetTop = containerRef.current.offsetTop - SIDE_MARGINS / 2; //10

      viewport.scrollTop = offsetTop + scrollTop - STICKY_HEIGHT;
    },
    [viewport]
  );

  const showHeaders = gridRef.current !== null && stuckElem.current !== null;

  return (
    <div className="element">
      <Sticky
        className="stickyColHeader"
        height={STICKY_HEIGHT}
        marginBottom={LAST_ROW_HEIGHT}
        topOffset={0}
      >
        <h3>{name}</h3>
        {showHeaders && (
          <ColumnHeaders
            gridRef={gridRef}
            outerElement={stuckElem.current!}
            columnCount={columnCount}
            rowCount={rowCount}
            selections={selections}
            activeCell={selectionProps.activeCell}
          />
        )}
      </Sticky>
      <div
        ref={containerRef}
        className="gridContainer"
        style={{ height: totalHeight }}
      >
        <Grid
          onScrollToOrScrollBy={onScrollToOrScrollByHandler}
          outerElementType={OuterElem}
          outerRef={stuckElem}
          ref={gridRef}
          width={VISIBLE_WIDTH}
          height={Math.min(
            totalHeight,
            viewport.clientHeight - SIDE_MARGINS - STICKY_HEIGHT
          )}
          rowCount={rowCount}
          columnCount={columnCount}
          itemRenderer={(props) => {
            return <Cell {...props} value={props.rowIndex.toString()} />;
          }}
          selections={selections}
          {...selectionProps}
        />
      </div>
    </div>
  );
});

export default React.memo(function App() {
  const [viewportRef, setViewport] = React.useState<HTMLDivElement | null>(
    null
  );
  const elements = React.useMemo(
    () => [{ name: "Table 1" }, { name: "Table 2" }],
    []
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
              {elements.map(({ name }) => (
                <GridContainer key={name} name={name} />
              ))}
            </Viewport.Provider>
          )}
        </div>
      </Scrollbars>
    </div>
  );
});
