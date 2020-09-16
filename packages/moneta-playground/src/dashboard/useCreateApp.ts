import { gql, StoreObject, useMutation } from "@apollo/client";
import { WORKSPACE } from "./useWorkspace";

type AppField = App & StoreObject;
type Input = { app: Partial<AppField> };
type Output = { upsertApp: { app: AppField } };

const CREATE_APP = gql`
  mutation CreateApp($app: AppInput!) {
    upsertApp(input: $app) {
      app {
        id
        name
        modifiedAt
        workspaceId
      }
    }
  }
`;

export default function useCreateApp(wId: string) {
  return useMutation<Output, Input>(CREATE_APP, {
    refetchQueries: [{ query: WORKSPACE, variables: { id: wId } }],
  });
}
