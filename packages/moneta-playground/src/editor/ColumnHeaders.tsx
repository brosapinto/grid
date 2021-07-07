import React, { RefObject } from "react";
import { GridRef, SelectionArea, CellInterface } from "@rowsncolumns/grid";

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

interface ColumnHeadersProps {
  gridRef: RefObject<GridRef>;
  outerElement: HTMLDivElement;
  columnWidth: (index: number) => number;
  selections: SelectionArea[];
  activeCell: CellInterface | null;
}

export const ColumnHeaders: React.FC<ColumnHeadersProps> = React.memo(
  (props) => {
    const { gridRef, outerElement, columnWidth, selections, activeCell } =
      props;
    const [columnsHeaderRef, setColumnHeaderRef] =
      React.useState<HTMLDivElement | null>(null);

    // need headers to rerender
    const [viewPort, setViewPort] = React.useState(() =>
      gridRef.current!.getViewPort()
    );

    const { columnStartIndex, columnStopIndex } = viewPort;

    const isIntersecting = (index: number) =>
      selections.some(
        ({ bounds: { left, right } }: any) => index >= left && index <= right
      );
    const isActiveCell = (index: number) =>
      activeCell && index === activeCell.columnIndex;
    const isActive = (index: number) =>
      isActiveCell(index) || isIntersecting(index);

    let headers = [];

    for (
      let i = columnStartIndex, index = 0;
      i <= columnStopIndex;
      i++, index++
    ) {
      const width = columnWidth(i);
      const left = gridRef.current?.getColumnOffset(i);
      const selected = isActive(i);

      headers.push(
        <div
          key={i}
          draggable
          style={{
            position: "absolute",
            left,
            width,
            textAlign: "center",
            color: selected ? "#1A1A1A" : "#6F6F6F",
            backgroundColor: selected ? "#E1E1E1" : "#F7F7F7",
            borderRight: "1px solid black",
          }}
        >
          {numToColumn(i + 1)}
        </div>
      );
    }

    React.useEffect(() => {
      const handler = (e: any) => {
        if (!columnsHeaderRef) return;

        const { scrollLeft } = e.target;

        columnsHeaderRef.scrollTo(scrollLeft, 0);
        setViewPort(gridRef.current!.getViewPort());
      };

      outerElement.addEventListener("scroll", handler);

      return () => outerElement.removeEventListener("scroll", handler);
    }, [columnsHeaderRef, gridRef, outerElement, setViewPort]);

    const { containerWidth, estimatedTotalWidth } =
      gridRef.current?.getDimensions() ?? {
        containerWidth: 0,
        estimatedTotalWidth: 0,
      };

    return (
      <div
        data-test="outer-elem"
        ref={setColumnHeaderRef}
        style={{
          position: "relative",
          height: 24,
          width: containerWidth,
          overflow: "hidden",
        }}
      >
        <div
          data-test="inner-elem"
          style={{
            height: 24,
            width: estimatedTotalWidth,
          }}
        >
          {headers}
        </div>
      </div>
    );
  }
);
