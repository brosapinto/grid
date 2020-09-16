type MappingFn<T, R = T> = (n: TreeNode<T>) => R;
type NodeById<T> = Record<string, TreeNode<T>>;

interface IData {
  id: string | number;
  parentId: string | number | null;
}

/**
 * Basic implementation of a Tree data structure,
 * with depth-first-search and recursive sorting
 */
export default class TreeNode<T> {
  parentId: string | number | null;
  data: T;
  children: TreeNode<T>[];

  constructor(data: T) {
    this.data = data;
    this.parentId = null;
    this.children = [];
  }

  /**
   * Map over node children
   * @param fn Mapper function
   */
  map<R>(fn: MappingFn<T, R>): R[] {
    return this.children.map(fn);
  }
}

const isValidId = (val: unknown): val is string | number =>
  (typeof val === "string" && val !== "") ||
  (typeof val === "number" && val !== 0);

export function createTree<T extends IData>(data: T[]): TreeNode<T> {
  const root = (new TreeNode(null) as unknown) as TreeNode<T>;
  const nodeById: NodeById<T> = {};

  // create TreeNodes for each data item
  data.forEach((item) => {
    nodeById[item.id] = new TreeNode<T>(item);
  });

  data
    // ignore orphaned nodes (points to a parent which doesn't exist)
    .filter(
      ({ parentId }) =>
        !isValidId(parentId) || nodeById.hasOwnProperty(parentId)
    )
    // link all TreeNodes (create children and parent relationship)
    .forEach(({ id, parentId }) => {
      const node = nodeById[id];
      const parent = !parentId ? root : nodeById[parentId] || root;

      node.parentId = parentId;
      parent.children.push(node);
    });

  return root;
}
