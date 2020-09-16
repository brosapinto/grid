import { gql, useMutation } from "@apollo/client";
import { WORKSPACE } from "./useWorkspace";

type Input = { wId: string; ids: string[] };
type Output = { deleteApp: { success: boolean } };

const DELETE_APP = gql`
  mutation DeleteApp($wId: ID!, $ids: [String!]!) {
    deleteApps(workspaceId: $wId, ids: $ids) {
      success
      errors
    }
  }
`;

export default function useDeleteApps(wId: string) {
  return useMutation<Output, Input>(DELETE_APP, {
    refetchQueries: [{ query: WORKSPACE, variables: { id: wId } }],
  });
}
