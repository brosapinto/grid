import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
  query User {
    user: getMyUser {
      id
      firstName
      lastName
      workspaces {
        id
        name
        slug
      }
    }
  }
`;

export default function useUser() {
  return useQuery<{ user: User }>(GET_USER);
}
