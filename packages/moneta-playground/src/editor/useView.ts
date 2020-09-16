import { gql, useQuery } from "@apollo/client";

type Input = { wId: string; appId: string; viewId: string };
type Output = { view: View };

const GET_VIEW = gql`
  query GetView($wId: ID!, $appId: String!, $viewId: String!) {
    view: getView(workspaceId: $wId, appId: $appId, viewId: $viewId) {
      workspaceId
      appId
      id
      name
      columns
      columnStyles {
        position
        size
        hidden
      }
      rows
      rowStyles {
        position
        size
        hidden
      }
    }
  }
`;

export default function useView(variables: Input) {
  return useQuery<Output, Input>(GET_VIEW, { variables });
}
