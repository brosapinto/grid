import { MockedProvider } from "@apollo/client/testing";
import { render, cleanup } from "@testing-library/react";

import { WORKSPACE } from "../useWorkspace";
import Dashboard from "../Dashboard";
import { MemoryRouter, Route } from "react-router-dom";

jest.mock("../ToggleSort", () => () => <p>Toggle</p>);
jest.mock("../AppItem", () => (props: { app: App }) => (
  <tr>
    <td>{props.app.name}</td>
  </tr>
));

/*
**ATTENTION**

Even though GraphQL operations are mocked, they're asynchronous.
Therefore, it's necessary to wait for the next tick for assertions

The default state, when we don't wait, it's the _loading state_
*/

afterEach(() => cleanup());

it("starts by rendering a loading state", () => {
  const mocks = [{ request: { query: WORKSPACE }, result: { data: {} } }];
  const { container } = render(
    <MemoryRouter initialEntries={["/wId"]}>
      <MockedProvider mocks={mocks}>
        <Route path="/:wId" component={Dashboard} />
      </MockedProvider>
    </MemoryRouter>
  );

  expect(container).toMatchSnapshot();
});

it("renders an error when query fails", async () => {
  const mocks = [{ request: { query: WORKSPACE }, error: new Error("Ooop") }];

  const { findByTestId } = render(
    <MemoryRouter initialEntries={["/wId"]}>
      <MockedProvider mocks={mocks}>
        <Route path="/:wId" component={Dashboard} />
      </MockedProvider>
    </MemoryRouter>
  );

  const errorElem = await findByTestId("error");
  expect(errorElem).toMatchSnapshot();
});

it("renders a list of apps", async () => {
  const mocks = [
    {
      request: { query: WORKSPACE, variables: { id: "wId" } },
      result: {
        data: {
          workspace: {
            id: "wId",
            name: "wId",
            slug: "w-id",
            folders: [
              {
                id: "fId",
                apps: [
                  { workspaceId: "wId", id: 1, name: "app 1", modifiedAt: 0 },
                  { workspaceId: "wId", id: 2, name: "app 2", modifiedAt: 0 },
                ],
              },
            ],
          },
        },
      },
    },
  ];
  const { findByTestId } = render(
    <MemoryRouter initialEntries={["/wId"]}>
      <MockedProvider mocks={mocks}>
        <Route path="/:wId" component={Dashboard} />
      </MockedProvider>
    </MemoryRouter>
  );

  const appList = await findByTestId("apps");
  expect(appList).toMatchSnapshot();
});
