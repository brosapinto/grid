interface WorkspaceFolder {
  id: string;
  apps: App[];
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  folders: WorkspaceFolder[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  workspaces: Workspace[];
}

interface Hierarchy {
  id: string;
  parentId: string | null;
  name: string;
  index: number;
  expanded?: boolean;
}

interface App {
  workspaceId: string;
  id: string;
  name: string;
  modifiedAt: number;
}

interface AppInput {
  meta: {
    id?: string;
    name: string;
  };
}

interface TableStyle {
  position: { x: number; y: number };
  size: number;
  hidden: boolean;
}

interface View {
  appId: string;
  workspaceId: string;
  id: string;
  name: string;
  columns: number;
  columnStyles: TableStyle;
  rows: number;
  rowStyles: TableStyle;
}

interface Cell {
  id: string;
  value: string;
  position: { row: number; column: number };
}
