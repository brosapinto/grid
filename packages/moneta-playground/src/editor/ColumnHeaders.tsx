import React, { memo, RefObject, useContext, useEffect, useState } from "react";
import { GridRef, SelectionArea, CellInterface } from "@rowsncolumns/grid";
import Sticky from "../shared/Sticky";
import { DndElementContext } from "./ElementDnDProvider";
import ScrollSentinel from "./ScrollSentinel";

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

interface HeaderProps {
  index: number;
  left?: number;
  width: number;
  selected?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { index: i, left = 0, width, selected = false } = props;
  const { startDrag, stopDrag } = useContext(DndElementContext);

  return (
    <div
      key={i}
      draggable
      onDragStart={startDrag}
      onDragEnd={stopDrag}
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
};

interface ColumnHeadersProps {
  gridRef: RefObject<GridRef>;
  outerElement: HTMLDivElement;
  columnWidth: (index: number) => number;
  selections: SelectionArea[];
  activeCell: CellInterface | null;
  frozenColumns?: number;
}

export const ColumnHeaders: React.FC<ColumnHeadersProps> = memo((props) => {
  const {
    gridRef,
    outerElement,
    columnWidth,
    selections,
    activeCell,
    frozenColumns = 0,
  } = props;
  const { isDragging } = useContext(DndElementContext);
  const [columnsHeaderRef, setColumnHeaderRef] =
    useState<HTMLDivElement | null>(null);

  // need headers to rerender
  const [viewPort, setViewPort] = useState(() =>
    gridRef.current!.getViewPort()
  );

  const { containerWidth, estimatedTotalWidth } =
    gridRef.current?.getDimensions() ?? {
      containerWidth: 0,
      estimatedTotalWidth: 0,
    };
  const { columnStartIndex, columnStopIndex } = viewPort;

  const isIntersecting = (index: number) =>
    selections.some(
      ({ bounds: { left, right } }: any) => index >= left && index <= right
    );
  const isActiveCell = (index: number) =>
    activeCell && index === activeCell.columnIndex;
  const isActive = (index: number) =>
    isActiveCell(index) || isIntersecting(index);

  let frozenColsWidth = 0;
  for (let i = 0; i < frozenColumns; i++) {
    frozenColsWidth += columnWidth(i);
  }

  const headers = [];
  const frozenColumnHeaders = [];

  for (let i = 0; i < frozenColumns; i++) {
    const width = columnWidth(i);
    const left = gridRef.current?.getColumnOffset(i);

    frozenColumnHeaders.push(
      <Header index={i} left={left} width={width} selected={isActive(i)} />
    );
  }

  // HACK to always renders every column header
  // check if rendered columns aren't enought to fullfill containerWidth
  let colStop = columnStopIndex;
  let renderedWidth = 0;
  for (let i = columnStartIndex; i <= columnStopIndex; i++) {
    renderedWidth += columnWidth(i);
  }

  if (renderedWidth < containerWidth) {
    // DEFAULT CELL WITH + BORDER (120 + 1 = 121)
    const estimatedColStop = Math.ceil(containerWidth / 121);
    if (colStop < estimatedColStop) colStop = estimatedColStop;
  }

  for (let i = columnStartIndex, index = 0; i <= colStop; i++, index++) {
    const width = columnWidth(i);
    const left = gridRef.current?.getColumnOffset(i);

    headers.push(
      <Header index={i} left={left} width={width} selected={isActive(i)} />
    );
  }

  const scrollRight = React.useCallback(
    () => (outerElement.scrollLeft += 10),
    [outerElement]
  );
  const scrollLeft = React.useCallback(
    () => (outerElement.scrollLeft -= 10),
    [outerElement]
  );

  useEffect(() => {
    const handler = (e: any) => {
      if (!columnsHeaderRef) return;

      const { scrollLeft } = e.target;

      columnsHeaderRef.scrollTo(scrollLeft, 0);
      setViewPort(gridRef.current!.getViewPort());
    };

    outerElement.addEventListener("scroll", handler);

    return () => outerElement.removeEventListener("scroll", handler);
  }, [columnsHeaderRef, gridRef, outerElement, setViewPort]);

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
      {isDragging && (
        <ScrollSentinel
          direction="LEFT"
          onDragOver={scrollLeft}
          width={frozenColumns > 0 ? frozenColsWidth : 20}
          left={columnsHeaderRef?.getBoundingClientRect().left}
        />
      )}
      <div
        data-test="inner-elem"
        style={{
          height: 24,
          width: estimatedTotalWidth,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Sticky style={{ height: 24, zIndex: 2 }}>{frozenColumnHeaders}</Sticky>
        {headers}
      </div>
      {isDragging && (
        <ScrollSentinel direction="RIGHT" onDragOver={scrollRight} width={40} />
      )}
    </div>
  );
});
