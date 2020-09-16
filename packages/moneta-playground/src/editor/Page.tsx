import React, { useLayoutEffect, useMemo, useReducer, useRef } from "react";
import { RouteComponentProps } from "react-router";
import {
  Grid,
  Cell,
  useSelection,
  useEditable,
  GridRef,
  CellInterface,
} from "@rowsncolumns/grid";

import { useViewport } from "./Viewport";
import useApp from "./useApp";
import useCellsChanged, { TYPE } from "./useCellsChanged";
import useView from "./useView";
import useElemSize from "./use-elem-size";

interface TableProps {
  wId: string;
  appId: string;
  viewId: string;
}

const DEFAULT_NUM_COLUMNS = 5;
const DEFAULT_NUM_ROWS = 5;
const DEFAULT_CELL_HEIGHT = 32;
const DEFAULT_CELL_WIDTH = 120;

type CellsStoreState = Record<string, Cell>;
interface CellsStoreAction {
  type: TYPE;
  payload: { cells: Cell[] };
}

function genKey(cell: Cell) {
  return `${cell.position.row - 1}-${cell.position.column - 1}`;
}

function cellsStore(state: CellsStoreState, action: CellsStoreAction) {
  switch (action.type) {
    case TYPE.UPSERT: {
      const cells = action.payload.cells.reduce((acc, cell) => {
        return Object.defineProperty(acc, genKey(cell), {
          value: cell,
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }, {} as Record<string, Cell>);

      return { ...state, ...cells };
    }
    case TYPE.DELETE: {
      const nextState = { ...state };
      action.payload.cells.forEach((cell) => {
        delete nextState[genKey(cell)];
      });

      return nextState;
    }
    default:
      throw new ReferenceError(`Unknown Action ${action.type}`);
  }
}

function tableSize(state: CellsStoreState) {
  return Object.values(state).reduce(
    (acc, cell) => ({
      rowCount: Math.max(acc.rowCount, cell.position.row),
      columnCount: Math.max(acc.columnCount, cell.position.column),
    }),
    { rowCount: DEFAULT_NUM_ROWS, columnCount: DEFAULT_NUM_COLUMNS }
  );
}

const Table: React.FC<TableProps> = (props) => {
  const { wId, appId, viewId } = props;
  const gridRef = useRef<GridRef | null>(null);
  const { data, loading, error } = useView({ wId, appId, viewId });

  const [cells, dispatch] = useReducer(cellsStore, {});
  const { rowCount, columnCount } = useMemo(() => tableSize(cells), [cells]);
  const getValue = ({ columnIndex, rowIndex }: CellInterface) => {
    const key = `${rowIndex}-${columnIndex}`;
    const cell = cells[key];
    return cell?.value;
  };

  const viewport = useViewport();
  const totalWidth = columnCount * DEFAULT_CELL_WIDTH + 1;
  const totalHeight = rowCount * DEFAULT_CELL_HEIGHT + 1;
  const [elemRef, { width, height }] = useElemSize<HTMLElement>();
  useLayoutEffect(() => elemRef(viewport), [elemRef, viewport]);

  useCellsChanged({ workspaceId: wId, viewId }, (data) => {
    dispatch({ type: data.type, payload: { cells: data.cells } });
  });

  const { selections, activeCell, ...selectionProps } = useSelection({
    gridRef,
    rowCount,
    columnCount,
    getValue,
  });

  const { editorComponent, isEditInProgress, ...editableProps } = useEditable({
    gridRef,
    rowCount,
    columnCount,
    getValue,
    activeCell,
    selections,
    isHiddenRow: (index) => false,
    isHiddenColumn: (index) => false,
    onSubmit(value, { rowIndex, columnIndex }, nextActiveCell) {},
    onDelete(activeCell, selections) {},
  });

  if (error) return <h2>Oops, something went wrong!</h2>;
  if (loading || !data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.view.name}</h2>
      <div style={{ position: "relative" }}>
        <Grid
          ref={gridRef}
          activeCell={activeCell}
          selections={selections}
          rowCount={rowCount}
          columnCount={columnCount}
          height={Math.min(height, totalHeight)}
          width={Math.min(width, totalWidth)}
          rowHeight={(rowIndex) => DEFAULT_CELL_HEIGHT}
          estimatedRowHeight={totalHeight / rowCount}
          columnWidth={(columnIndex) => DEFAULT_CELL_WIDTH}
          estimatedColumnWidth={totalWidth / columnCount}
          itemRenderer={(props) => {
            const value = getValue(props);
            return <Cell {...props} value={value} />;
          }}
          showFillHandle={!isEditInProgress}
          onKeyDown={(...args) => {
            selectionProps.onKeyDown(...args);
            editableProps.onKeyDown(...args);
          }}
          onMouseDown={(...args) => {
            selectionProps.onMouseDown(...args);
            editableProps.onMouseDown(...args);
          }}
          onDoubleClick={(...args) => {
            editableProps.onDoubleClick(...args);
          }}
        />
        {editorComponent}
      </div>
    </div>
  );
};

type PageProps = RouteComponentProps<{
  wId: string;
  appId: string;
  groupId: string;
}>;

const Page: React.FC<PageProps> = ({ match }) => {
  const { wId, appId, groupId } = match.params;
  const { data } = useApp(wId, appId);
  const views = useMemo(() => {
    return (
      data?.app.hierarchy
        .filter((node) => node.parentId === groupId)
        .sort((a, b) => a.index - b.index) ?? []
    );
  }, [data?.app.hierarchy, groupId]);

  return (
    <div>
      {views.map((view) => (
        <Table key={view.id} wId={wId} appId={appId} viewId={view.id} />
      ))}
    </div>
  );
};

export default Page;
