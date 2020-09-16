import { gql, useSubscription } from "@apollo/client";

export enum TYPE {
  UPSERT = "UPSERT",
  DELETE = "DELETE",
}
type Input = { workspaceId: string; viewId: string };
type Output = { cellsChanged: { type: TYPE; cells: Cell[] } };

const CELLS = gql`
  subscription CellsChanged($workspaceId: ID!, $viewId: String!) {
    cellsChanged(workspaceId: $workspaceId, viewId: $viewId) {
      type
      cells {
        id
        value
      }
    }
  }
`;

export default function useCellsChanged(
  variables: Input,
  onNext: (data: { type: TYPE; cells: Cell[] }) => void = () => void 0
) {
  const { workspaceId, viewId } = variables;

  return useSubscription<Output, Input>(CELLS, {
    variables: { workspaceId, viewId },
    onSubscriptionData({ subscriptionData }) {
      const { type = TYPE.UPSERT, cells } =
        subscriptionData.data?.cellsChanged ?? {};

      if (cells) onNext({ type, cells });
    },
  });
}
