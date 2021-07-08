import React, { RefObject } from "react";
import { GridRef, SelectionArea, CellInterface } from "@rowsncolumns/grid";
import { VISIBLE_WIDTH } from "./viewport";
import { DndElementContext } from "./element-dnd-provider";
import { Sticky } from "./sticky";

export const LAST_ROW_HEIGHT = 20;
function numToColumn(num: number) {
  let s = "",
    t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
}

const ColumnHeader = ({
  left,
  width,
  columnIndex,
  isActive,
  draggable,
}: any) => {
  const { startDrag, stopDrag } = React.useContext(DndElementContext);
  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? startDrag : undefined}
      onDragEnd={draggable ? stopDrag : undefined}
      style={{
        top: 0,
        height: 24,
        color: isActive ? "#1A1A1A" : "#6F6F6F",
        position: "absolute",
        textAlign: "center",
        backgroundColor: isActive ? "#E1E1E1" : "#F7F7F7",
        borderRight: "1px solid black",
        pointerEvents: "all",
        left,
        width,
      }}
    >
      <span>{numToColumn(columnIndex)}</span>
    </div>
  );
};

interface ScrollSentinelProps {
  direction: "LEFT" | "RIGHT";
  onDragOver: () => void;
  width?: number;
}

const ScrollSentinel: React.FC<ScrollSentinelProps> = ({
  direction,
  onDragOver,
  width = 20,
}) => {
  const positioning = direction === "LEFT" ? { left: 0 } : { right: 0 };
  return (
    <div
      onDragOver={onDragOver}
      style={{
        pointerEvents: "all",
        position: "absolute",
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

interface Props {
  gridRef: RefObject<GridRef>;
  outerElement: HTMLDivElement;
  rowCount: number;
  columnCount: number;
  selections: SelectionArea[];
  activeCell: CellInterface | null;
  frozenColumns?: number;
}

export const ColumnHeaders: React.FC<Props> = React.memo(
  ({
    gridRef,
    outerElement,
    columnCount,
    selections,
    activeCell,
    frozenColumns = 0,
  }) => {
    const { isDragging } = React.useContext(DndElementContext);
    const defaultWidth = 60;
    const [columnsHeaderRef, setColumnHeaderRef] =
      React.useState<HTMLDivElement | null>(null);
    const scrollRight = React.useCallback(() => {
      outerElement.scrollLeft += 10;
    }, [outerElement]);
    const scrollLeft = React.useCallback(() => {
      outerElement.scrollLeft -= 10;
    }, [outerElement]);

    const totalWidth = columnCount * defaultWidth;
    // need headers to rerender
    const [topLeftBottomRight, setViewPort] = React.useState(() =>
      gridRef.current!.getViewPort()
    );
    const numberOfVisibleHeaders =
      topLeftBottomRight.columnStopIndex -
      topLeftBottomRight.columnStartIndex +
      1;
    const frozenColumnHeaders = new Array(frozenColumns).fill(null);
    const headers = new Array(numberOfVisibleHeaders).fill(null);
    const isIntersecting = (index: number) =>
      selections.some(
        ({ bounds: { left, right } }: any) => index >= left && index <= right
      );

    const isActiveCell = (index: number) =>
      activeCell && index === activeCell.columnIndex;
    const isActive = (index: number) =>
      isActiveCell(index) || isIntersecting(index);

    React.useEffect(() => {
      const handler = (e: any) => {
        if (!columnsHeaderRef) return;
        const { scrollLeft } = e.target;
        columnsHeaderRef.scrollTo(scrollLeft, 0);
        setViewPort(gridRef.current!.getViewPort());
      };

      outerElement.addEventListener("scroll", handler);
    }, [columnsHeaderRef, setViewPort]);

    return (
      <div
        style={{
          width: VISIBLE_WIDTH,
          overflowX: "hidden",
          /* hide scrollbar */
          marginBottom: -50,
          paddingBottom: 50,
        }}
      >
        <div
          ref={setColumnHeaderRef}
          style={{
            overflowX: "hidden",
            width: "100%",
            height: 24,
          }}
        >
          {isDragging && (
            <ScrollSentinel
              direction="LEFT"
              onDragOver={scrollLeft}
              width={frozenColumns > 0 ? frozenColumns * defaultWidth : 20}
            />
          )}
          <div style={{ width: totalWidth, position: "relative" }}>
            <Sticky
              className="frozenColumnHeaders"
              height={24}
              width={frozenColumns * defaultWidth}
              leftOffset={0}
              topOffset={0}
            >
              {frozenColumnHeaders.map((n, index) => (
                <ColumnHeader
                  draggable={false}
                  key={index}
                  isSelected={false}
                  isActive={isActive(index)}
                  columnIndex={index + 1}
                  left={gridRef.current!.getColumnOffset(index)}
                  width={defaultWidth}
                />
              ))}
            </Sticky>
            {headers.map((x, index) => (
              <ColumnHeader
                draggable={true}
                key={index}
                isSelected={false}
                isActive={isActive(index + topLeftBottomRight.columnStartIndex)}
                columnIndex={index + topLeftBottomRight.columnStartIndex + 1}
                left={gridRef.current!.getColumnOffset(
                  topLeftBottomRight.columnStartIndex + index
                )}
                width={defaultWidth}
              />
            ))}
          </div>
          {isDragging && (
            <ScrollSentinel direction="RIGHT" onDragOver={scrollRight} />
          )}
        </div>
      </div>
    );
  }
);
