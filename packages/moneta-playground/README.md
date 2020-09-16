## Moneta Playground

This is a barebones Moneta App to explore the idea of using [Apollo Client v3][1] as both a Network Layer and State Management solution.

To try it out:

1. Clone the repo
1. `cd <Folder>` && `npm i`
1. `npm start`
1. Use QA-Rows credentials to login

The functionality is very limited, it:

- has user authentication (QA environment)
- displays the list of applications for a given Workspace
- allows to create new apps
- allows to delete apps
- allows to rename apps
- sorts apps by modified date
- displays any views of any given app

## Design

The Apollo Client is configured to use _WebSockets_ only for subscriptions and _HTTP_ for everything else. This might not be that relevant for our use-case.

It uses Apollo hooks for a _declarative data fetching_ approach, bringing the GraphQL queries closer to where they're used, which helps reason about the data we're consuming and at what point in the UI lifecycle is it needed.

The queries/mutations/etc are wrapped in hooks to help provide typings and for reusability purposes, such as:

- `useUser`: returns a User and his Workspaces
- `useWorkspace`: returns a Workspace and its Apps
- `useUpdateApp`: returns method to optimistically update an App
- `useCellsChanged`: subscribes to Cells changed

## About Apollo

Apollo allows one to use the same _query_ in multiple places without triggering multiple requests. That's because, by default, Apollo will use the Cache first and only request data from the BE on cache-miss.

It means, for example, we can ask for the _user_ (e.g. `useUser`) in multiple components throughout our tree. This is important because it raises the level of abstraction and allows for a better encapsulation.

This is basically the role of Apollo as state management, since its Cache is effectively the _app store_. It's a [normalized][2] object of all our _data graph_. This object can be inspected either by using the Apollo Dev Tools or by typing `__APOLLO_CLIENT__.cache.data.data` in the _console_.

Although in this PoC local state is handled by React, Apollo provides a [few mechanisms to handle that][6] as well:

- [local-only fields][3]
- [reactive variables][4]
- [client-side schema][5]

These options mostly create _data_ that's globally accessible, which IMO might break encapsulation (i.e. may create an implicit dependency between components), but can be a powerful tool to create a declarative way of managing data.

### Pros

- declarative data fetching closer to UI lifecycle (fits React nicely)
- powerful caching, which obviously reduces bandwidth usage
- can improve encapsulation and decoupling of components
- simplifies a few common tasks like:
  - doing _optimistic-ui_
  - refetching on user action or some event
  - subscribe only after getting the first data
  - [pagination][7]
- can replace a bunch of MobX stores (particularly the _entities_ stores)
- big community, lots of documentation

### Cons

- manipulating the cache can be cumbersome
- testing can become verbose because of mocked data
- doesn't seem to share subscriptions out of the box (i.e. one WebSocket subscription for multiple listeners)
- works best if we use GraphQL properly (issues on our data graph design will make our lifes harder, e.g. queries with deeply nested entities, entities without _\_\_typename_, etc)
- unclear how will it support React Concurrent Mode


## Some Questions

- How to have finer control on cache invalidation? (e.g. having a TTL)
- How can we have local-only state in a maintainable way?
- How can we read directly from cache without too much coupling (e.g. `readQuery`, `readFragment`)
- ...

[1]: https://www.apollographql.com/docs/react/
[2]: https://www.apollographql.com/docs/react/caching/cache-configuration/#data-normalization
[3]: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/
[4]: https://www.apollographql.com/docs/react/local-state/reactive-variables/
[5]: https://www.apollographql.com/docs/react/local-state/client-side-schema/
[6]: https://www.apollographql.com/docs/react/local-state/local-state-management/
[7]: https://www.apollographql.com/docs/react/pagination/overview/
