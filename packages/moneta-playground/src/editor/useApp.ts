import { gql, useQuery } from "@apollo/client";

type Output = { app: App & { hierarchy: Hierarchy[] } };
type Input = { workspaceId: string; appId: string };

const GET_APP = gql`
  query GetApp($workspaceId: ID!, $appId: String!) {
    app: getApp(workspaceId: $workspaceId, id: $appId) {
      id
      name
      hierarchy {
        id
        parentId
        name
        index
        ... on Group {
          expanded
        }
      }
    }
  }
`;

export default function useApp(wId: string, appId: string) {
  return useQuery<Output, Input>(GET_APP, {
    variables: { workspaceId: wId, appId },
  });
}
