import { gql, useMutation } from "@apollo/client";

type Input = { app: Pick<App, "workspaceId" | "id" | "name"> };
type Output = { upsertApp: { app: App } };

const UPDATE_APP = gql`
  mutation UpdateApp($app: AppInput!) {
    upsertApp(input: $app) {
      app {
        workspaceId
        id
        name
        modifiedAt
      }
    }
  }
`;

export default function useUpdateApp() {
  return useMutation<Output, Input>(UPDATE_APP, {
    optimisticResponse({ app: { workspaceId, id, name } }) {
      return {
        upsertApp: {
          app: {
            workspaceId,
            id,
            name,
            modifiedAt: Date.now(),
          },
        },
      };
    },
  });
}
