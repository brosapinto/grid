import React, { RefObject } from "react";
import { GridRef, SelectionArea, CellInterface } from "@rowsncolumns/grid";
import { VISIBLE_WIDTH } from "./viewport";

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

const ColumnHeader = ({ left, width, columnIndex, isActive }: any) => {
  return (
    <div
      style={{
        top: 0,
        height: 24,
        color: isActive ? "#1A1A1A" : "#6F6F6F",
        position: "absolute",
        textAlign: "center",
        backgroundColor: isActive ? "#E1E1E1" : "#F7F7F7",
        borderRight: "1px solid black",
        left,
        width,
      }}
    >
      <span>{numToColumn(columnIndex)}</span>
    </div>
  );
};
interface Props {
  gridRef: RefObject<GridRef>;
  outerElement: HTMLDivElement;
  rowCount: number;
  columnCount: number;
  selections: SelectionArea[];
  activeCell: CellInterface | null;
}
export const ColumnHeaders: React.FC<Props> = React.memo(
  ({ gridRef, outerElement, columnCount, selections, activeCell }) => {
    const defaultWidth = 60;
    const [columnsHeaderRef, setColumnHeaderRef] =
      React.useState<HTMLDivElement | null>(null);

    const totalWidth = columnCount * defaultWidth;
    // need headers to rerender
    const [topLeftBottomRight, setViewPort] = React.useState(() =>
      gridRef.current!.getViewPort()
    );
    const numberOfVisibleHeaders =
      topLeftBottomRight.columnStopIndex -
      topLeftBottomRight.columnStartIndex +
      1;
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
          pointerEvents: "none",
          /* hide scrollbar */
          marginBottom: -50,
          paddingBottom: 50,
        }}
      >
        <div
          ref={setColumnHeaderRef}
          style={{
            overflowX: "scroll",
            width: "100%",
            height: 24,
          }}
        >
          <div style={{ width: totalWidth, position: "relative" }}>
            {headers.map((x, index) => (
              <ColumnHeader
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
        </div>
      </div>
    );
  }
);
