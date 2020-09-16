import { gql, useQuery } from "@apollo/client";

export const WORKSPACE = gql`
  query Workspace($id: ID!) {
    workspace: getWorkspace(workspaceId: $id) {
      id
      name
      slug
      folders {
        id
        apps {
          workspaceId
          id
          name
          modifiedAt
        }
      }
    }
  }
`;

export default function useWorkspace(id: string) {
  return useQuery<{ workspace: Workspace }, { id: string }>(WORKSPACE, {
    variables: { id },
  });
}
